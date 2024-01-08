// Overview: user managment

// Imports
import { Logger } from '../modules/logger-v0.js'
import { Database } from '../modules/database-v1.js'
import {
    hashPassword,
    isHashedPassword,
    generateToken as generateTokenAuth,
    verifyToken as verifyTokenAuth
} from '../modules/auth-v0.js'

// Exports
export {
    ADMIN_GROUP,
    DEFAULT_GROUPS,
    DEFAULT_USERS,

    // Function Groups
    token, // get, verify
    user, // get, sub, unsub, create, delete, addGroup, removeGroup, changePassword
    users, // get, sub, unsub, reset
    groups, // get, sub, unsub, reset, create, delete

    // Validation
    validGroup,
    validUsermame,
    validPassword,

    // Error Checking
    isGroup,
    areGroups,
    isUsername,
    isUserInGroup,
}

// Constants
const ADMIN_GROUP = 'admin'
const DEFAULT_USERS = {
    admin: {
        username: 'admin',
        password: hashPassword('admin'),
        groups: [ADMIN_GROUP],
    }
}
const DEFAULT_GROUPS = {
    groups: [ADMIN_GROUP, 'user', 'guest']
}

// State
const log = new Logger('user-v1.js')
const dbUsers = new Database('user-v1')
const dbGroups = new Database('user-groups-v1')

// Startup
await dbUsers.create(DEFAULT_USERS)
await dbGroups.create(DEFAULT_GROUPS)

// Functions Groups
const token = {
    get: log.call((username, password) => {
        const user = dbUsers.getKey(username)
    
        // Errors
        if (!isUsername(username)) return `error username '${username}' does NOT exists`
        else if (!isHashedPassword(password, user.password.hash, user.password.salt)) return 'error password incorrect'
    
        return generateTokenAuth({ username: user.username })
    }, 'token.get'),
    verify: log.call((token, cb) => {
        verifyTokenAuth(token, (error, jwtJson) => {
            if (error) cb(jwtJson, 'error bad token')
            else cb(jwtJson, error)
        })
    }, 'token.verify'),
}
const user = {
    get: (username) => {
        const user = dbUsers.getKey(username)
        return { username: user.username, groups: user.groups }
    },
    sub: (username, callback) => dbUsers.subKey(username, callback),
    unsub: (username, callback) => dbUsers.unsubKey(username, callback),
    create: log.call(async (username, password, passwordConfirm, groups = []) => {
        // Errors
        if (isUsername(username)) return `error username '${username}' exists already`
        else if (!validUsermame(username)) return `error username '${username}' is NOT valid`
        else if (!validPassword(password)) return `error password '${password}' is NOT valid`
        else if (password !== passwordConfirm) return 'error passwordConfirm does NOT match password'
        else if (!areGroups(groups)) {
            const badGroups = groups.filter(group => !isGroup(group))
            return `error group(s) '${badGroups.join(',')}' does NOT exist`
        }

        // Create
        await dbUsers.setKey(username, {
            username: username,
            password: hashPassword(password),
            groups: groups,
        })
        await dbUsers.write()
        return 'ok'
    }, 'user.create'),
    delete: log.call(async (username) => {
        // Errors
        if (!isUsername(username)) return `error username '${username}' does NOT exist`

        // Delete
        await dbUsers.removeKey(username)
        await dbUsers.write()
        return 'ok'
    }, 'user.delete'),
    addGroup: log.call(async (username, group) => {
        // Errors
        if (!isUsername(username)) return `error username '${username}' does NOT exists`
        else if (!isGroup(group)) return `error group '${group}' does NOT exist`
        else if (isUserInGroup(username, group)) return `error user '${username}' already in group '${group}'`

        // Update
        const user = dbUsers.getKey(username)
        user.groups.push(group)
        await dbUsers.setKey(username, user)
        await dbUsers.write()
        return 'ok'
    }, 'user.addGroup'),
    removeGroup: log.call(async (username, group) => {
        // Errors
        if (!isUsername(username)) return `error username '${username}' does NOT exists`
        else if (!isGroup(group)) return `error group '${group}' does NOT exist`
        else if (!isUserInGroup(username, group)) return `error user is NOT in group '${group}'`

        // Update
        const user = dbUsers.getKey(username)
        user.groups = user.groups.filter(groupName => groupName !== group)
        await dbUsers.setKey(username, user)
        await dbUsers.write()
        return 'ok'
    }, 'user.removeGroup'),
    changePassword: log.call(async (username, password, passwordConfirm) => {
        // Errors
        if (!isUsername(username)) return `error username '${username}' does NOT exists`
        else if (!validPassword(password)) return `error password '${password}' is NOT valid`
        else if (password !== passwordConfirm) return 'error passwordConfirm does NOT match password'

        // Update
        const user = dbUsers.getKey(username)
        user.password = hashPassword(password)
        await dbUsers.setKey(username, user)
        await dbUsers.write()
        return 'ok'
    }, 'user.changePassword'),
}
const users = {
    get: () => dbUsers.keys().map(name => user.get(name)),
    names: () => dbUsers.keys(),
    sub: (callback) => dbUsers.sub(data => {
        return callback(Object.keys(data).map(name => user.get(name)))
    }),
    unsub: (callback) => dbUsers.unsub(data => {
        return callback(Object.keys(data).map(name => user.get(name)))
    }),
    reset: log.call(async () => {
        await dbUsers.reset()
        await dbGroups.reset()
        return 'ok'
    }, 'users.reset'),
}
const groups = {
    get: () => dbGroups.getKey('groups'),
    sub: (callback) => dbGroups.subKey('groups', callback),
    unsub: (callback) => dbGroups.unsubKey('groups', callback),
    create: log.call(async (group) => {
        // Errors
        if (!validGroup(group)) {
            return `error group '${group}' is not valid, only: alphanumaric, whitespace, special charactors _ ! @ # $ % ^ & -`
        } else if (isGroup(group)) {
            return `error group '${group}' arlready exists`
        }
        
        // Create group
        const groups = dbGroups.getKey('groups')
        groups.push(group)
        await dbGroups.setKey('groups', groups)
        await dbGroups.write()
        return 'ok'
    }, 'groups.create'),
    delete: log.call(async (group) => {
        // Errors
        if (group === ADMIN_GROUP) {
            return `error can not delete 'admin' group`
        } else if (!isGroup(group)) {
            return `error group '${group}' does NOT exist`
        }
    
        // Remove group from all user's group lists
        const usernames = dbUsers.keys()
        await Promise.all(usernames.map(async (username) => {
            await user.removeGroup(username, group)
        }))
    
        // Delete group
        const groups = dbGroups.getKey('groups').filter(groupName => groupName !== group)
        dbGroups.setKey('groups', groups)
        await dbGroups.write()
        return 'ok'
    }, 'groups.delete'),
}

// Helper Functions
function validGroup(group) {
    // check if empty, 0, '', NaN, null, false, undefined
    if (!group) return false
    // contains only alphanumaric, whitespace, special charactors _ ! @ # $ % ^ & -
    const regex = /^[a-zA-Z0-9 _!@#$%^&-]+$/
    group = group.toString()
    if (group.length < 2) return false
    else if (group.length > 20) return false
    else if (regex.test(group) === false) return false
    return true
}
function validUsermame(username) {
    if (!username) return false
    const regex = /^[a-zA-Z0-9 _!@#$%^&-]+$/
    username = username.toString()
    if (username.length < 2) return false
    else if (username.length > 20) return false
    else if (regex.test(username) === false) return false
    return true
}
function validPassword(password) {
    if (!password) return false
    const regex = /^[a-zA-Z0-9 _!@#$%^&-]+$/
    password = password.toString()
    if (password.length < 2) return false
    else if (password.length > 20) return false
    else if (regex.test(password) === false) return false
    return true
}

function isGroup(group) {
    return dbGroups.getKey('groups').some(groupName => group === groupName)
}
function areGroups(groups) {
    if (!Array.isArray(groups)) return false
    if (groups.length < 1) return false
    return groups.every(group => isGroup(group))
}
function isUsername(username) {
    return dbUsers.keys().some(un => un === username)
}
function isUserInGroup(username, group) {
    if (!isUsername(username)) return false
    return dbUsers.getKey(username).groups?.some(groupName => groupName === group)
}
