// Overview: user managment

// Imports
import events from 'events'
import { hashPassword, isHashedPassword, generateJWT, verifyJWT } from './auth.js'
import { createDatabase, resetDatabase } from './database.js'
import { Logger } from './logger.js'

// Exports
export {
    validUsermame,
    validPassword,

    isUser,
    getUserAndPassword,
    getUser,
    getUsers,

    getGroups,
    isGroup,
    areGroups,
    createGroup,
    deleteGroup,

    getToken,
    verifyToken,

    createUser,
    isUserInGroup,
    addGroupToUser,
    removeGroupFromUser,
    changeUserPassword,
    deleteUser,
    resetUsersToDefault,

    emitter,
}

// Constants
const DEFAULT_GROUPS = ["admin", "user", "guest"]
const DEFAULT_USER = {
    username: 'admin',
    password: hashPassword("admin"),
    groups: ["admin"],
}
const DEFAULT_STATE = {
    groups: DEFAULT_GROUPS,
    users: [DEFAULT_USER]
}

// Variables
const log = new Logger("user.js")
const emitter = new events.EventEmitter()
const db = await createDatabase("user", DEFAULT_STATE)

// Functions
function validUsermame(username) {
    return username && username.length >= 2
}
function validPassword(password) {
    return password && password.length >= 1
}
function isUser(username) {
    return db.data.users.some(user => user.username === username)
}
function getUserAndPassword(username) {
    return db.data.users.find(user => user.username === username)
}
function getUser(username) {
    if (!isUser(username)) throw new Error(`error ${username} is not a user`)
    const user = getUserAndPassword(username)
    return { username: user.username, groups: user.groups }
}
function getUsers() {
    const array = []
    db.data.users.forEach(user => {
        const userWithoutPassword = getUser(user.username)
        array.push(userWithoutPassword)
    })
    return array
}
function getUsersAndPasswords() {
    return db.data.users
}

function getGroups() {
    return db.data.groups
}
function isGroup(groupName) {
    return db.data.groups.some(group => group === groupName)
}
function areGroups(groupsArray) {
    if (!Array.isArray(groupsArray)) return false
    if (groupsArray.length < 1) return false
    return groupsArray.every(group => isGroup(group))
}
async function createGroup(groupToAdd) {
    if (isGroup(groupToAdd)) return false
    db.data.groups.push(groupToAdd)
    emitter.emit('groups', getGroups())
    log.debug(`createGroup("${groupToAdd}") -> "ok"`)
    await db.write()
}
async function deleteGroup(groupToRemove) {
    if (groupToRemove === "admin") {
        log.error(`deleteGroup("${groupToRemove}") -> "error can not delete admin group"`)
        throw new Error("error can not delete admin group")
    }

    // Remove group from list of groups
    db.data.groups = db.data.groups.filter(group => group !== groupToRemove)

    // Remove group from all users group lists
    const newUsers = []
    getUsersAndPasswords().forEach(user => {
        user.groups = user.groups.filter(group => group !== groupToRemove)
        newUsers.push(user)
    })
    db.data.users = newUsers

    emitter.emit('users', getUsers())
    emitter.emit('groups', getGroups())
    log.debug(`deleteGroup("${groupToRemove}") -> "ok"`)
    await db.write()
}

function getToken(username, password) {
    const user = getUserAndPassword(username)
    let error = ""
    if (!isUser(username)) error = `error username "${username}" doesn't exists`
    else if (!isHashedPassword(password, user.password.hash, user.password.salt)) error = "error password incorrect"
    if (error !== "") {
        // Sending "password incorrect" or "username doesn't exists" is bad for security
        error = "error username or password incorrect"
        const passwordToLog = process.env.DEV_MODE ? password : "********"
        log.error(`getToken("${username}", "${passwordToLog}") -> "${error}"`)
        throw new Error(error)
    }

    const token = generateJWT({ username: user.username })
    const passwordToLog = process.env.DEV_MODE ? password : "********"
    const resultToLog = token.startsWith("error") || process.env.DEV_MODE ? token : "********"
    log.debug(`getToken("${username}", "${passwordToLog}") -> "${resultToLog}"`)
    return token
}
function verifyToken(token, cb) {
    verifyJWT(token, (error, jwtJson) => {
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

async function createUser(username, password, passwordConfirm, groups = []) {
    let error = ""
    if (!validUsermame(username)) error = "error username invailed"
    else if (!validPassword(password)) error = "error password invailed"
    else if (password !== passwordConfirm) error = "error passwordConfirm does not match password"
    else if (isUser(username)) error = "error username exists"
    else if (!areGroups(groups)) {
        const badGroups = []
        groups.forEach(group => {
            if (!isGroup(group)) badGroups.push(group)
        });
        if (badGroups.length === 1) {
            error = `error group ${badGroups[0]} does not exist`
        } else {
            error = `error groups ${badGroups} do not exist`
        }
    }
    if (error !== "") {
        const passwordToLog = process.env.DEV_MODE ? password : "********"
        const passwordConfirmToLog = process.env.DEV_MODE ? passwordConfirm : "********"
        log.error(`createUser("${username}", "${passwordToLog}", "${passwordConfirmToLog}", "${groups}") -> ${error}`)
        throw new Error(error)
    }

    const user = {
        username: username,
        password: hashPassword(password),
        groups: groups,
    }
    db.data.users.push(user)
    await db.write()

    emitter.emit('users', getUsers())
    const passwordToLog = process.env.DEV_MODE ? password : "********"
    const passwordConfirmToLog = process.env.DEV_MODE ? passwordConfirm : "********"
    log.debug(`createUser("${username}", "${passwordToLog}", "${passwordConfirmToLog}", "${groups}") -> "ok"`)
    return user
}
function isUserInGroup(username, groupToCheck) {
    if (!isUser(username)) return false
    const user = getUser(username)
    const result = user.groups?.some(group => group === groupToCheck)
    return result
}
async function addGroupToUser(username, groupToAdd) {
    let error = ""
    if (!isUser(username)) error = `error username "${username}" doesn't exists`
    else if (!isGroup(groupToAdd)) error = `error group "${groupToAdd}" does not exist`
    else if (isUserInGroup(username, groupToAdd)) error = `error user already in group "${groupToAdd}"`
    if (error !== "") {
        log.error(`addGroupToUser("${username}", "${groupToAdd}") -> ${error}`)
        throw new Error(error)
    }

    const user = getUser(username)
    user.groups.push(groupToAdd)
    await db.write()

    emitter.emit('users', getUsers())
    log.debug(`addGroupToUser("${username}", "${groupToAdd}") -> "ok"`)
    return user
}
async function removeGroupFromUser(username, groupToRemove) {
    let error = ""
    if (!isUser(username)) error = `error username "${username}" doesn't exists`
    else if (!isGroup(groupToRemove)) error = `error group "${groupToRemove}" does not exist`
    else if (!isUserInGroup(username, groupToRemove)) error = `error user is not in group "${groupToRemove}"`
    if (error !== "") {
        log.error(`removeGroupFromUser("${username}", "${groupToRemove}") -> ${error}`)
        throw new Error(error)
    }

    const user = getUser(username)
    user.groups = user.groups.filter(group => group !== groupToRemove)
    await db.write()

    emitter.emit('users', getUsers())
    log.debug(`removeGroupFromUser("${username}", "${groupToRemove}") -> "ok"`)
    return user
}
async function changeUserPassword(username, newPassword, newPasswordConfirm) {
    let error = ""
    if (!isUser(username)) error = `error username "${username}" doesn't exists`
    else if (!validPassword(newPassword)) error = "error newPassword invailed"
    else if (newPassword !== newPasswordConfirm) error = "error newPasswordConfirm does not match newPassword"
    if (error !== "") {
        const passwordToLog = process.env.DEV_MODE ? newPassword : "********"
        const passwordConfirmToLog = process.env.DEV_MODE ? newPasswordConfirm : "********"
        log.error(`changeUserPassword("${username}", "${passwordToLog}", "${passwordConfirmToLog}") -> ${error}`)
        throw new Error(error)
    }

    const user = getUserAndPassword(username)
    user.password = hashPassword(newPassword)
    await db.write()
    const passwordToLog = process.env.DEV_MODE ? newPassword : "********"
    const passwordConfirmToLog = process.env.DEV_MODE ? newPasswordConfirm : "********"
    log.debug(`changeUserPassword("${username}", "${passwordToLog}", "${passwordConfirmToLog}") -> "ok"`)
    return user
}
async function deleteUser(username) {
    db.data.users = db.data.users.filter(user => user.username !== username)
    await db.write()

    emitter.emit('users', getUsers())
    log.debug(`deleteUser("${username}") -> "ok"`)
    return "ok"
}

async function resetUsersToDefault() {
    db = await resetDatabase("user")
    emitter.emit('users', getUsers())
    emitter.emit('groups', getGroups())
}

// Tests
if (process.env.DEV_MODE) await runTests("users.js")
async function runTests(testName) {
    let pass = true
    log.info("...Running Tests")

    if (validUsermame()) pass = false
    if (validUsermame("")) pass = false
    if (validUsermame(null)) pass = false
    if (validUsermame(undefined)) pass = false
    if (validUsermame("h")) pass = false
    if (validUsermame(32400)) pass = false
    if (!validUsermame("username")) pass = false

    if (isUser()) pass = false
    if (isUser("")) pass = false
    if (isUser(null)) pass = false
    if (isUser(undefined)) pass = false
    if (isUser("fakeUser")) pass = false
    if (!isUser("admin")) pass = false

    const adminUserWithPassword = getUserAndPassword("admin") || {}
    const adminUser = getUser("admin") || {}
    if (adminUserWithPassword.username !== DEFAULT_USER.username) pass = false
    if (adminUser.username !== DEFAULT_USER.username) pass = false

    if (isGroup()) pass = false
    if (isGroup("")) pass = false
    if (isGroup(null)) pass = false
    if (isGroup(undefined)) pass = false
    if (isGroup("fakeGroup")) pass = false
    if (!isGroup("admin")) pass = false

    if (areGroups([])) pass = false
    if (areGroups()) pass = false
    if (areGroups("")) pass = false
    if (areGroups(null)) pass = false
    if (areGroups(undefined)) pass = false
    if (areGroups("admin")) pass = false
    if (areGroups(["admin", "fakeGroup"])) pass = false
    if (!areGroups(["admin", "user"])) pass = false

    const groups = getGroups()
    if (!groups.some(group => group === "admin")) pass = false

    await createGroup("testGroup")
    await createGroup("testGroup")
    if (!isGroup("testGroup")) pass = false
    await deleteGroup("testGroup")
    if (isGroup("testGroup")) pass = false

    try {
        await deleteGroup("admin")
        pass = false
    } catch (error) {
        if (error.message !== "error can not delete admin group") pass = false
    }
    if (!isGroup("admin")) pass = false

    const token = getToken("admin", "admin")
    if (token.startsWith("error")) pass = false
    verifyToken("BAD_TOKEN", (response, error) => {
        if (error !== "error bad token") pass = false
    })
    verifyToken(token, (response, error) => {
        if (error === "error bad token") pass = false
        if (response.username !== "admin") pass = false
    })

    await deleteUser("user4")
    const createUserResponse = await createUser("user4", "password", "password", ["admin", "guest"])
    if (createUserResponse.username !== "user4") pass = false
    if (!isUser("user4")) pass = false
    const token2 = getToken("user4", "password")
    if (token2.startsWith("error")) pass = false

    if (isUserInGroup("user4", "admin") === false) pass = false
    if (isUserInGroup("user4", "user") === true) pass = false
    if (isUserInGroup("user4", "hop") === true) pass = false

    const addGroupToUserResponse = await addGroupToUser("user4", "user")
    if (!addGroupToUserResponse.groups.some(group => group === "user")) pass = false
    const removeGroupFromUserResponse = await removeGroupFromUser("user4", "user")
    if (removeGroupFromUserResponse.groups.some(group => group === "user")) pass = false

    const changeUserPasswordResponse = await changeUserPassword("user4", "password2", "password2")
    if (changeUserPasswordResponse.username !== "user4") pass = false
    const token3 = getToken("user4", "password2")
    if (token3.startsWith("error")) pass = false

    const deleteUserResponse2 = await deleteUser("user4")
    if (deleteUserResponse2 !== "ok") pass = false

    log.info(`...Tests pass: ${pass}`)
    if (pass !== true) console.log(testName, '\x1b[31mTESTS FAILED\x1b[0m')
}
