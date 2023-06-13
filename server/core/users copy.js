const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const file_system = require('./files')
const logger = require('./logger')
const { State } = require('./state')

// Variables
const CRYPTO_KEYSIZE = 64
const CRYPTO_ITERATIONS = 9999
// const JWT_KEY = crypto.randomBytes(CRYPTO_KEYSIZE).toString('base64')
const JWT_KEY = "DELETE_ME_8UrIDqNu3GhKV8DUqYM2W7SYZ1RmBniygRvIb6gGRZ48"
const DEFAULT_USERS = [
    {
        username: 'admin',
        password: hashPassword("admin"),
        groups: ["admins"],
    }
]
const DEFAULT_GROUPS = [ "admins", "users", "guests" ]
const STATE = {
    groups: DEFAULT_GROUPS,
    users: []
}

// Helper Functions
function log(message, obj = {}) {
    logger.log("users", message, obj)
}
function hashPassword(password) {
    const salt = crypto.randomBytes(CRYPTO_KEYSIZE).toString('base64')
    const hash = crypto.pbkdf2Sync(password, salt, CRYPTO_ITERATIONS, CRYPTO_KEYSIZE, 'sha256').toString('base64')
    return { salt: salt, hash: hash }
}
function isHashedPassword(password, hash, salt) {
    const hashTesting = crypto.pbkdf2Sync(password, salt, CRYPTO_ITERATIONS, CRYPTO_KEYSIZE, 'sha256').toString('base64')
    return hash === hashTesting
}
function generateJWT(json) {
    return jwt.sign(json, JWT_KEY)
}
function verifyJWT(token, cb) {
    jwt.verify(token, JWT_KEY, (error, json) => cb(error, json))
}
function clearUsersArray() {
    STATE.users = []
    return STATE.users
}
async function getStateFile() {
    return await file_system.readJSON("../private/configs/users.json")
}
async function saveStateFile() {
    return await file_system.writeJSON("../private/configs/users.json", STATE)
}
async function defaultStateFile() {
    STATE.users = DEFAULT_USERS
    STATE.groups = DEFAULT_GROUPS
    await saveStateFile()
    log("set to default users state file")
    return STATE
}

// Functions
function validUsermame(username) {
    return username
}
function validPassword(password) {
    return password
}
function getUser(username) {
    username = username || ""
    const user = STATE.users.find(user => user.username === username)
    if (!user) return "username doesn't exists"
    return { username: user.username, groups: user.groups }
}
function getUsers() {
    const array = []
    STATE.users.forEach(user => array.push(getUser(user.username)))
    return array
}
function getUserAndPassword(username) {
    username = username || ""
    const user = STATE.users.find(user => user.username === username)
    return user
}
function isUser(username) {
    username = username || ""
    return STATE.users.some(user => user.username === username)
}
function isGroup(groupName) {
    groupName = groupName || ""
    return STATE.groups.some(group => group === groupName)
}
function areGroups(groupsArray) {
    return groupsArray.every(group => isGroup(group))
}
function getGroups() {
    return STATE.groups
}
function addGroup(groupToAdd) {
    if (isGroup(groupToAdd)) return
    STATE.groups.push(groupToAdd)
}
function removeGroup(groupToRemove) {
    STATE.groups = STATE.groups.filter(group => group !== groupToRemove)
}
function getToken(username, password) {
    username = username || ""
    password = password || ""
    const user = getUserAndPassword(username)

    let result = ""
    if (!user) result = "username doesn't exists"
    else if (!isHashedPassword(password, user.password.hash, user.password.salt)) result = "error password incorrect"
    else result = generateJWT({ username: user.username })

    log(`getToken("${username}", "${password}")`, result)
    return result
}
function verifyToken(token) {
    verifyJWT(token, (error, jwtJson) => {
        if (error) return "bad token"
        else return jwtJson.username
    })
}
async function createUser(username, password, passwordConfirm, groups = []) {
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
        STATE.users.push(user)
        await saveStateFile()
        result = "ok"
    }

    log(`createUser("${username}", "${password}", "${passwordConfirm}", "${groups}")`, result)
    return result
}
async function deleteUser(username) {
    username = username || ""

    let result = ""
    if (!isUser(username)) result = "error username doesn't exists"
    else {
        STATE.users = STATE.users.filter(user => user.username !== username)
        await saveStateFile()
        result = "ok"
    }

    log(`deleteUser("${username}")`, result)
    return result
}
async function updateGroups(username, newGroups) {
    username = username || ""
    
    let result = ""
    if (!isUser(username)) result = "error username doesn't exists"
    else if (!areGroups(newGroups)) result = "error group in newGroups does not exist"
    else {
        const user = getUser(username)
        user.groups = newGroups
        console.log(user);
        await saveStateFile()
        result = "ok"
    }
    
    log(`updateGroups("${username}", "${newGroups}")`, result)
    return result
}
async function updatePassword(username, newPassword, newPasswordConfirm) {
    username = username || ""
    newPassword = newPassword || ""
    newPasswordConfirm = newPasswordConfirm || ""
    
    let result = ""
    const user = getUser(username)
    if (!user) result = "error username doesn't exists"
    else if (!validUsermame(username)) result = "error username invailed"
    else if (!validPassword(newPassword)) result = "error password invailed"
    else if (newPassword !== newPasswordConfirm) result = "error newPasswordConfirm does not match newPassword"
    else {
        user.password = hashPassword(newPassword)
        await saveStateFile()
        result = "ok"
    }

    log(`updatePassword("${username}", "${newPassword}", "${newPasswordConfirm}")`, result)
    return result
}

// Startup
getStateFile().then(async file => {
    // console.log(file)
    if (file) {
        STATE.users = file.users
        STATE.groups = file.groups
    }
    else {
        await defaultStateFile()
        log("no users.json file found. set to default users file")
    }
})

// Export
exports.hashPassword = hashPassword
exports.isHashedPassword = isHashedPassword
exports.generateJWT = generateJWT
exports.verifyJWT = verifyJWT
exports.getStateFile = getStateFile
exports.saveStateFile = saveStateFile
exports.defaultStateFile = defaultStateFile

exports.getToken = getToken
exports.verifyToken = verifyToken
exports.isUser = isUser
exports.getUser = getUser
exports.getUsers = getUsers
exports.getGroups = getGroups
exports.addGroup = addGroup
exports.removeGroup = removeGroup
exports.createUser = createUser
exports.deleteUser = deleteUser
exports.updateGroups = updateGroups
exports.updatePassword = updatePassword

// Testing

// const testPass1 = "password"
// const testPass2 = "password"
// const hashTestPass1 = hashPassword(testPass1)
// console.log(hashTestPass1)
// const isTestPass1 = isHashedPassword(testPass2, hashTestPass1.hash, hashTestPass1.salt)
// console.log(isTestPass1)

// const testData = { boom: "pow" }
// const testToken = generateJWT(testData)
// console.log(testToken)
// const testToken2 = testToken
// console.log(testToken2)
// verifyJWT(testToken2, (error, json) => {
//   if (error) console.log("wrong token")
//   else console.log("correct token", json)
// })

// setTimeout(async () => {
//     console.log('createUser("user", "password", "password", 50)', await createUser("user", "password", "password", 50))
//     console.log('getUser("user")', getUser("user"))
//     console.log('isUser("user")', isUser("user"))
//     console.log('getToken("user", "password")', getToken("user", "password"))
//     console.log('updateGroups("user", "password", 69)', await updateGroups("user", "password", 69))
//     console.log('updateGroups("user", "password", 42)', await updateGroups("user", "password", 42))
//     console.log('getUser("user")', getUser("user"))
//     console.log('updatePassword("user", "password", "password2", "password2")', await updatePassword("user", "password", "password2", "password2"))
//     console.log('getToken("user", "password2")', getToken("user", "password2"))
//     console.log('deleteUser("user", "password")', await deleteUser("user", "password"))
//     console.log('deleteUser("user", "password2")', await deleteUser("user", "password2"))
//     console.log('defaultStateFile()', await defaultStateFile())
// }, 1000)