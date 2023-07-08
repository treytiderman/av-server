// Overview: user managment

// Import
import { hashPassword, isHashedPassword, generateJWT, verifyJWT } from './auth.js'
import { getDatabase, resetDatabase } from './db.js'
import { Logger } from './logger.js'

// Export
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
    addGroup,
    removeGroup,
    
    getToken,
    verifyToken,
    
    addUser,
    isUserInGroup,
    addGroupToUser,
    removeGroupFromUser,
    changeUserPassword,
    removeUser,
    resetUsersToDefault,
}

// Constants
const DEFAULT_GROUPS = ["admins", "users", "guests"]
const DEFAULT_USER = {
    username: 'admin',
    password: hashPassword("admin"),
    groups: ["admins"],
}
const DEFAULT_STATE = {
    groups: DEFAULT_GROUPS,
    users: [DEFAULT_USER]
}

// Variables
const log = new Logger("users.js")
let db = await getDatabase('users', DEFAULT_STATE)

// Helper Functions
function validUsermame(username) {
    return username && username.length >= 4
}
function validPassword(password) {
    return password && password.length >= 4
}

// Functions
function isUser(username) {
    return db.data.users.some(user => user.username === username)
}
function getUserAndPassword(username) {
    return db.data.users.find(user => user.username === username)
}
function getUser(username) {
    if (!isUser(username)) return "username doesn't exists"
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
async function addGroup(groupToAdd) {
    if (isGroup(groupToAdd)) return false
    db.data.groups.push(groupToAdd)
    log.info(`addGroup("${groupToAdd}")`)
    await db.write()
}
async function removeGroup(groupToRemove) {
    if (groupToRemove === "admins") {
        const error = "error can not delete admins group"
        log.error(`removeGroup("${groupToRemove}")`, error)
        return error
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

    log.info(`removeGroup("${groupToRemove}")`, "ok")
    await db.write()
}

function getToken(username, password) {
    let result = ""
    const user = getUserAndPassword(username)

    if (!isUser(username)) result = "error username doesn't exists"
    else if (!isHashedPassword(password, user.password.hash, user.password.salt)) result = "error password incorrect"
    else result = generateJWT({ username: user.username })

    // log.debug(`getToken("${username}", "${password}")`, result)
    log.debug(`getToken("${username}", "********")`, "********")
    return result
}
function verifyToken(token, cb) {
    let result = ""

    verifyJWT(token, (error, jwtJson) => {
        if (error) result = "error bad token"
        else result = jwtJson

        // log.debug(`verifyToken("${token}")`, result)
        log.debug(`verifyToken("********")`, result)
        cb(result)
    })
}

async function addUser(username, password, passwordConfirm, groups = []) {
    let result = ""

    if (!validUsermame(username)) result = "error username invailed"
    else if (!validPassword(password)) result = "error password invailed"
    else if (password !== passwordConfirm) result = "error passwordConfirm does not match password"
    else if (isUser(username)) result = "error username exists"
    else if (!areGroups(groups)) result = "error group in groups does not exist"
    else {
        const user = {
            username: username,
            password: hashPassword(password),
            groups: groups,
        }
        db.data.users.push(user)
        result = "ok"
        await db.write()
    }

    // log.info(`addUser("${username}", "${password}", "${passwordConfirm}", "${groups}")`, result)
    log.info(`addUser("${username}", "********", "********", "${groups}")`, result)
    return result
}
function isUserInGroup(username, groupToCheck) {
    if (!isUser(username)) return false
    const user = getUser(username)
    const result = user.groups?.some(group => group === groupToCheck)
    return result
}
async function addGroupToUser(username, groupToAdd) {
    let result = ""

    if (!isUser(username)) result = "error username doesn't exists"
    else if (!isGroup(groupToAdd)) result = "error groupToAdd does not exist"
    else if (isUserInGroup(username, groupToAdd)) result = "error user already in groupToAdd"
    else {
        const user = getUserAndPassword(username)
        user.groups.push(groupToAdd)
        await db.write()
        result = "ok"
    }
    
    log.info(`addGroupToUser("${username}", "${groupToAdd}")`, result)
    return result
}
async function removeGroupFromUser(username, groupToRemove) {
    let result = ""

    if (!isUser(username)) result = "error username doesn't exists"
    else if (!isGroup(groupToRemove)) result = "error groupToRemove does not exist"
    else if (!isUserInGroup(username, groupToRemove)) result = "error user is not in groupToRemove"
    else {
        const user = getUserAndPassword(username)
        user.groups = user.groups.filter(group => group !== groupToRemove)
        await db.write()
        result = "ok"
    }
    
    log.info(`removeGroupFromUser("${username}", "${groupToRemove}")`, result)
    return result
}
async function changeUserPassword(username, newPassword, newPasswordConfirm) {
    let result = ""

    if (!isUser(username)) result = "error username doesn't exists"
    else if (!validPassword(newPassword)) result = "error newPassword invailed"
    else if (newPassword !== newPasswordConfirm) result = "error newPasswordConfirm does not match newPassword"
    else {
        const user = getUserAndPassword(username)
        user.password = hashPassword(newPassword)
        await db.write()
        result = "ok"
    }

    // log.debug(`changeUserPassword("${username}", "${newPassword}", "${newPasswordConfirm}")`, result)
    log.debug(`changeUserPassword("${username}", "********", "********")`, result)
    return result
}
async function removeUser(username) {
    let result = ""

    if (!isUser(username)) result = "error username doesn't exists"
    else {
        db.data.users = db.data.users.filter(user => user.username !== username)
        await db.write()
        result = "ok"
    }

    log.info(`removeUser("${username}")`, result)
    return result
}

async function resetUsersToDefault() {
    db = await resetDatabase("users")
}

// Tests
await runTests("users.js")
if (process.env.RUN_TESTS) await runTests("users.js")
async function runTests(testName) {
    let pass = true

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
    if (!isGroup("admins")) pass = false

    if (areGroups([])) pass = false
    if (areGroups()) pass = false
    if (areGroups("")) pass = false
    if (areGroups(null)) pass = false
    if (areGroups(undefined)) pass = false
    if (areGroups("admins")) pass = false
    if (areGroups(["admins", "fakeGroup"])) pass = false
    if (!areGroups(["admins", "users"])) pass = false

    const groups = getGroups()
    if (!groups.some(group => group === "admins")) pass = false

    await addGroup("testGroup")
    await addGroup("testGroup")
    if (!isGroup("testGroup")) pass = false
    await removeGroup("testGroup")
    if (isGroup("testGroup")) pass = false

    const removeGroupResponse = await removeGroup("admins")
    if (removeGroupResponse !== "error can not delete admins group") pass = false
    if (!isGroup("admins")) pass = false

    const token = getToken("admin", "admin")
    if (token.startsWith("error")) pass = false
    verifyToken("BAD_TOKEN", (response) => {
        if (response !== "error bad token") pass = false
    })
    verifyToken(token, (response) => {
        if (response === "error bad token") pass = false
        if (response.username !== "admin") pass = false
    })

    const addUserResponse = await addUser("user4", "password", "password", ["admins"])
    if (addUserResponse !== "ok") pass = false
    if (!isUser("user4")) pass = false
    const token2 = getToken("user4", "password")
    if (token2.startsWith("error")) pass = false
    
    if (isUserInGroup("user4", "admins") === false) pass = false
    if (isUserInGroup("user4", "user") === true) pass = false
    if (isUserInGroup("user4", "hop") === true) pass = false

    const addGroupToUserResponse = await addGroupToUser("user4", "users")
    if (addGroupToUserResponse !== "ok") pass = false
    const removeGroupFromUserResponse = await removeGroupFromUser("user4", "users")
    if (removeGroupFromUserResponse !== "ok") pass = false

    const changeUserPasswordResponse = await changeUserPassword("user4", "password2", "password2")
    if (changeUserPasswordResponse !== "ok") pass = false
    const token3 = getToken("user4", "password2")
    if (token3.startsWith("error")) pass = false

    const removeUserResponse2 = await removeUser("user4")
    if (removeUserResponse2 !== "ok") pass = false

    if (pass !== true) console.log(testName, '\x1b[31mTESTS FAILED\x1b[0m')
}
