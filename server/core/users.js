const { hashPassword, isHashedPassword, generateJWT, verifyJWT } = require('./auth')
const { State } = require('./state')
const logger = require('./logger')

// Variables
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
const _State = new State('users', DEFAULT_STATE)

// Helper Functions
function log(message, obj = {}) {
    logger.log("users.js", message, obj)
}
function validUsermame(username) {
    return username &&
        username.length >= 4;
}
function validPassword(password) {
    return password &&
        password.length >= 4;
}

function isUser(username) {
    return _State.get("users").some(user => user.username === username)
}
function getUserAndPassword(username) {
    const user = _State.get("users").find(user => user.username === username)
    return user
}
function getUser(username) {
    if (!isUser(username)) return "username doesn't exists"
    const user = getUserAndPassword(username)
    return { username: user.username, groups: user.groups }
}
function getUsers() {
    const array = []
    _State.get("users").forEach(user => array.push(getUser(user.username)))
    return array
}
function getUsersAndPasswords() {
    return _State.get("users")
}

function getGroups() {
    return _State.get("groups")
}
function isGroup(groupName) {
    return getGroups().some(group => group === groupName)
}
function areGroups(groupsArray) {
    if (!Array.isArray(groupsArray)) return false
    if (groupsArray.length < 1) return false
    return groupsArray.every(group => isGroup(group))
}
async function addGroup(groupToAdd) {
    if (isGroup(groupToAdd)) return false
    const newGroups = getGroups()
    newGroups.push(groupToAdd)
    await _State.set("groups", newGroups)
    log(`addGroup("${groupToAdd}")`)
}
async function removeGroup(groupToRemove) {
    if (groupToRemove === "admins") {
        log(`removeGroup("${groupToRemove}")`, "error can not delete admins group")
        return "error can not delete admins group"
    }
    const newGroups = getGroups().filter(group => group !== groupToRemove)
    await _State.set("groups", newGroups)
    const newUsers = []
    getUsersAndPasswords().forEach(user => {
        user.groups = user.groups.filter(group => group !== groupToRemove)
        newUsers.push(user)
    })
    await _State.set("users", newUsers)
    log(`removeGroup("${groupToRemove}")`, "ok")
}

// Functions
function getToken(username, password) {
    let result = ""
    const user = getUserAndPassword(username)

    if (!isUser(username)) result = "error username doesn't exists"
    else if (!isHashedPassword(password, user.password.hash, user.password.salt)) result = "error password incorrect"
    else result = generateJWT({ username: user.username })

    // log(`getToken("${username}", "${password}")`, result)
    log(`getToken("${username}", "********")`, "********")
    return result
}
function verifyToken(token, cb) {
    let result = ""

    verifyJWT(token, (error, jwtJson) => {
        if (error) result = "error bad token"
        else result = jwtJson

        // log(`verifyToken("${token}")`, result)
        log(`verifyToken("********")`, result)
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
        let newUsers = _State.get("users")
        newUsers.push(user)
        await _State.set("users", newUsers)
        result = "ok"
    }

    // log(`addUser("${username}", "${password}", "${passwordConfirm}", "${groups}")`, result)
    log(`addUser("${username}", "********", "********", "${groups}")`, result)
    return result
}
async function addGroupToUser(username, groupToAdd) {
    let result = ""
    const user = getUser(username)
    const isUserInGroup = user.groups?.some(group => group === groupToAdd)

    if (!isUser(username)) result = "error username doesn't exists"
    else if (!isGroup(groupToAdd)) result = "error groupToAdd does not exist"
    else if (isUserInGroup) result = "error user already in groupToAdd"
    else {
        const newUsers = _State.get("users")
        const newUser = newUsers.find(u => u.username === user.username)
        newUser.groups.push(groupToAdd)
        await _State.set("users", newUsers)
        result = "ok"
    }

    log(`addGroupToUser("${username}", "${groupToAdd}")`, result)
    return result
}
async function removeGroupFromUser(username, groupToRemove) {
    let result = ""
    const user = getUser(username)
    const isUserInGroup = user.groups.some(group => group === groupToRemove)

    if (!isUser(username)) result = "error username doesn't exists"
    else if (!isGroup(groupToRemove)) result = "error groupToRemove does not exist"
    else if (!isUserInGroup) result = "error user is not in groupToRemove"
    else {
        const newUsers = _State.get("users")
        const newUser = newUsers.find(u => u.username === user.username)
        newUser.groups = newUser.groups.filter(group => group !== groupToRemove)
        await _State.set("users", newUsers)
        result = "ok"
    }

    log(`removeGroupFromUser("${username}", "${groupToRemove}")`, result)
    return result
}
async function changeUserPassword(username, newPassword, newPasswordConfirm) {
    let result = ""

    if (!isUser(username)) result = "error username doesn't exists"
    else if (!validPassword(newPassword)) result = "error newPassword invailed"
    else if (newPassword !== newPasswordConfirm) result = "error newPasswordConfirm does not match newPassword"
    else {
        const user = getUser(username)
        const newUsers = _State.get("users")
        const newUser = newUsers.find(u => u.username === user.username)
        newUser.password = hashPassword(newPassword)
        await _State.set("users", newUsers)
        result = "ok"
    }

    // log(`changeUserPassword("${username}", "${newPassword}", "${newPasswordConfirm}")`, result)
    log(`changeUserPassword("${username}", "********", "********")`, result)
    return result
}
async function removeUser(username) {
    let result = ""

    if (!isUser(username)) result = "error username doesn't exists"
    else {
        let newUsers = _State.get("users")
        newUsers = newUsers.filter(user => user.username !== username)
        await _State.set("users", newUsers)
        result = "ok"
    }

    log(`removeUser("${username}")`, result)
    return result
}

async function resetUsersToDefault() {
    await _State.set("users", DEFAULT_USER)
    await _State.set("groups", DEFAULT_GROUPS)
}

// Testing
setTimeout(async () => {
    if (process.env.TEST) runTests("users.js")
}, 1000)
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
    const token2 = getToken("user4", "password")
    if (token2.startsWith("error")) pass = false

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

// Export
exports.validUsermame = validUsermame
exports.validPassword = validPassword

exports.isUser = isUser
exports.getUserAndPassword = getUserAndPassword
exports.getUser = getUser
exports.getUsers = getUsers
exports.resetUsersToDefault = resetUsersToDefault

exports.getGroups = getGroups
exports.isGroup = isGroup
exports.areGroups = areGroups
exports.addGroup = addGroup
exports.removeGroup = removeGroup

exports.getToken = getToken
exports.verifyToken = verifyToken

exports.addUser = addUser
exports.removeUser = removeUser
exports.addGroupToUser = addGroupToUser
exports.removeGroupFromUser = removeGroupFromUser
exports.changeUserPassword = changeUserPassword
