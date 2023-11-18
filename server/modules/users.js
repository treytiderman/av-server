// Overview: user managment

// Imports
import { Logger } from './logger.js'
import { EventEmitter } from 'events'
import { createDatabase, resetDatabase } from './database.js'
import { hashPassword, isHashedPassword, generateToken, verifyToken } from './auth.js'

// Exports
export {
    emitter, // groups, user, users
    ADMIN_GROUP,
    DEFAULT_GROUPS,
    DEFAULT_USER,
    DEFAULT_STATE,

    // Login
    login,
    loginWithToken,
    logout,

    // Groups
    isGroup,
    areGroups,
    getGroups,
    validGroup,
    createGroup,
    deleteGroup,

    // Users
    isUsername,
    isUserInGroup,
    getUser,
    getUsers,
    getUserAndPassword,
    getUsersAndPasswords,
    validUsermame,
    validPassword,
    createUser,
    deleteUser,
    addGroupToUser,
    removeGroupFromUser,
    changeUserPassword,

    // Reset
    resetToDefault,
}

// Constants
const ADMIN_GROUP = "admin"
const DEFAULT_GROUPS = [ADMIN_GROUP, "user", "guest"]
const DEFAULT_USER = {
    username: 'admin',
    password: hashPassword("admin"),
    groups: [ADMIN_GROUP],
}
const DEFAULT_STATE = {
    groups: DEFAULT_GROUPS,
    users: [DEFAULT_USER]
}

// Variables
const log = new Logger("modules/users.js")
const emitter = new EventEmitter()
let db = await createDatabase("users", DEFAULT_STATE)

// Startup
emitter.setMaxListeners(100)

// Functions
function login(username, password) {
    const user = getUserAndPassword(username)
    let error = ""
    if (!isUsername(username)) error = `error username "${username}" does NOT exists`
    else if (!isHashedPassword(password, user.password.hash, user.password.salt)) error = "error password incorrect"
    if (error !== "") {
        // Sending "password incorrect" or "username does NOT exists" is bad for security
        error = "error username or password incorrect"
        const passwordToLog = process.env.DEV_MODE ? password : "********"
        log.error(`getToken("${username}", "${passwordToLog}") -> "${error}"`)
        return error
    }

    const token = generateToken({ username: user.username })
    const passwordToLog = process.env.DEV_MODE ? password : "********"
    const resultToLog = token.startsWith("error") || process.env.DEV_MODE ? token : "********"
    log.debug(`getToken("${username}", "${passwordToLog}") -> "${resultToLog}"`)
    return token
}
function loginWithToken(token, cb) {
    verifyToken(token, (error, jwtJson) => {
        if (error) {
            const tokenToLog = process.env.DEV_MODE ? token : "********"
            log.error(`verifyToken("${tokenToLog}") -> "error bad token"`)
            cb(jwtJson, "error bad token")
        }
        else {
            const tokenToLog = process.env.DEV_MODE ? token : "********"
            log.debug(`verifyToken("${tokenToLog}") -> "ok"`, jwtJson)
            cb(jwtJson, error)
        }
    })
}
function logout(username) {}

function isGroup(group) {
    return db.data.groups.some(groupName => group === groupName)
}
function areGroups(groups) {
    if (!Array.isArray(groups)) return false
    if (groups.length < 1) return false
    return groups.every(group => isGroup(group))
}
function getGroups() {
    return db.data.groups
}
function validGroup(group) {
    // check if empty, 0, "", NaN, null, false, undefined
    if (!group) return false
    // contains only alphanumaric, whitespace, special charactors _ ! @ # $ % ^ & -
    const regex = /^[a-zA-Z0-9 _!@#$%^&-]+$/
    group = group.toString()
    if (group.length < 2) return false
    else if (group.length > 20) return false
    else if (regex.test(group) === false) return false
    return true
}
async function createGroup(group) {

    // Errors
    if (!validGroup(group)) {
        const error = `error group "${group}" is not valid, only: alphanumaric, whitespace, special charactors _ ! @ # $ % ^ & -`
        log.error(`createGroup("${group}") -> ${error}`)
        return error
    } else if (isGroup(group)) {
        const error = `error group "${group}" arlready exists`
        log.error(`createGroup("${group}") -> ${error}`)
        return error
    }

    // Create group
    db.data.groups.push(group)
    emitter.emit('groups', getGroups())
    log.debug(`createGroup("${group}") -> "ok"`)
    await db.write()
    return "ok"
}
async function deleteGroup(group) {

    // Errors
    if (group === ADMIN_GROUP) {
        const error = `error can not delete "admin" group`
        log.error(`deleteGroup("${group}") -> ${error}`)
        return error
    } else if (!isGroup(group)) {
        const error = `error group "${group}" does NOT exist`
        log.error(`createGroup("${group}") -> ${error}`)
        return error
    }

    // Delete group
    db.data.groups = db.data.groups.filter(groupName => groupName !== group)
    emitter.emit('groups', getGroups())

    // Remove group from all user's group lists
    const newUsers = []
    getUsersAndPasswords().forEach(user => {
        user.groups = user.groups.filter(groupName => groupName !== group)
        emitter.emit('user', user)
        newUsers.push(user)
    })
    db.data.users = newUsers
    emitter.emit('users', getUsers())

    log.debug(`deleteGroup("${group}") -> "ok"`)
    await db.write()
    return "ok"
}

function isUsername(username) {
    return db.data.users.some(user => user.username === username)
}
function isUserInGroup(username, group) {
    if (!isUsername(username)) return false
    const user = getUser(username)
    const result = user.groups?.some(groupName => groupName === group)
    return result
}
function getUserAndPassword(username) {
    return db.data.users.find(user => user.username === username)
}
function getUser(username) {
    if (!isUsername(username)) return undefined
    const user = getUserAndPassword(username)
    return { username: user.username, groups: user.groups }
}
function getUsersAndPasswords() {
    return db.data.users
}
function getUsers() {
    const array = []
    db.data.users.forEach(user => {
        const userWithoutPassword = getUser(user.username)
        array.push(userWithoutPassword)
    })
    return array
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
async function createUser(username, password, passwordConfirm, groups = []) {

    // Errors
    let error = ""
    if (!validUsermame(username)) error = `error username "${username}" is NOT valid`
    else if (!validPassword(password)) error = `error password "${password}" is NOT valid`
    else if (password !== passwordConfirm) error = "error passwordConfirm does NOT match password"
    else if (isUsername(username)) error = `error username "${username}" exists already`
    else if (!areGroups(groups)) {
        const badGroups = []
        groups.forEach(group => {
            if (!isGroup(group)) badGroups.push(group)
        })
        if (badGroups.length === 1) error = `error group ${badGroups[0]} does NOT exist`
        else error = `error groups ${badGroups} do not exist`
    }
    if (error !== "") {
        const passwordToLog = process.env.DEV_MODE ? password : "********"
        const passwordConfirmToLog = process.env.DEV_MODE ? passwordConfirm : "********"
        log.error(`createUser("${username}", "${passwordToLog}", "${passwordConfirmToLog}", "${groups}") -> ${error}`)
        return error
    }

    // Create
    const user = {
        username: username,
        password: hashPassword(password),
        groups: groups,
    }
    db.data.users.push(user)
    emitter.emit('users', getUsers())
    emitter.emit('user', user)
    const passwordToLog = process.env.DEV_MODE ? password : "********"
    const passwordConfirmToLog = process.env.DEV_MODE ? passwordConfirm : "********"
    log.debug(`createUser("${username}", "${passwordToLog}", "${passwordConfirmToLog}", "${groups}") -> "ok"`)
    await db.write()
    return "ok"
}
async function deleteUser(username) {

    // Errors
    if (!isUsername(username)) {
        const error = `error username "${username}" does NOT exist`
        log.error(`deleteUser("${username}") -> ${error}`)
        return error
    }

    // Delete
    db.data.users = db.data.users.filter(user => user.username !== username)
    emitter.emit('user', {})
    emitter.emit('users', getUsers())
    log.debug(`deleteUser("${username}") -> "ok"`)
    await db.write()
    return "ok"
}
async function addGroupToUser(username, group) {

    // Errors
    let error = ""
    if (!isUsername(username)) error = `error username "${username}" does NOT exists`
    else if (!isGroup(group)) error = `error group "${group}" does NOT exist`
    else if (isUserInGroup(username, group)) error = `error user already in group "${group}"`
    if (error !== "") {
        log.error(`addGroupToUser("${username}", "${group}") -> ${error}`)
        return error
    }

    // Update
    const user = getUserAndPassword(username)
    user.groups.push(group)
    emitter.emit('user', getUser(username))
    emitter.emit('users', getUsers())
    log.debug(`addGroupToUser("${username}", "${group}") -> "ok"`)
    await db.write()
    return "ok"
}
async function removeGroupFromUser(username, group) {
    
    // Errors
    let error = ""
    if (!isUsername(username)) error = `error username "${username}" does NOT exists`
    else if (!isGroup(group)) error = `error group "${group}" does NOT exist`
    else if (!isUserInGroup(username, group)) error = `error user is NOT in group "${group}"`
    if (error !== "") {
        log.error(`removeGroupFromUser("${username}", "${group}") -> ${error}`)
        return error
    }

    // Update
    const user = getUserAndPassword(username)
    user.groups = user.groups.filter(groupName => groupName !== group)
    emitter.emit('user', getUser(username))
    emitter.emit('users', getUsers())
    log.debug(`removeGroupFromUser("${username}", "${group}") -> "ok"`)
    await db.write()
    return "ok"
}
async function changeUserPassword(username, newPassword, newPasswordConfirm) {

    // Errors
    let error = ""
    if (!isUsername(username)) error = `error username "${username}" does NOT exists`
    else if (!validPassword(newPassword)) error = `error newPassword "${newPassword}" is NOT valid`
    else if (newPassword !== newPasswordConfirm) error = "error newPasswordConfirm does NOT match newPassword"
    if (error !== "") {
        const passwordToLog = process.env.DEV_MODE ? newPassword : "********"
        const passwordConfirmToLog = process.env.DEV_MODE ? newPasswordConfirm : "********"
        log.error(`changeUserPassword("${username}", "${passwordToLog}", "${passwordConfirmToLog}") -> ${error}`)
        return error
    }

    // Update
    const user = getUserAndPassword(username)
    user.password = hashPassword(newPassword)
    await db.write()
    const passwordToLog = process.env.DEV_MODE ? newPassword : "********"
    const passwordConfirmToLog = process.env.DEV_MODE ? newPasswordConfirm : "********"
    log.debug(`changeUserPassword("${username}", "${passwordToLog}", "${passwordConfirmToLog}") -> "ok"`)
    return "ok"
}

async function resetToDefault() {
    db = await resetDatabase("users")
    emitter.emit('users', getUsers())
    emitter.emit('groups', getGroups())
}