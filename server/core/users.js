const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const file_system = require('./files')
const logger = require('./logger')

// Variables
const CRYPTO_KEYSIZE = 64
const CRYPTO_ITERATIONS = 9999
// const JWT_KEY = crypto.randomBytes(CRYPTO_KEYSIZE).toString('base64')
const JWT_KEY = "DELETE_ME_8UrIDqNu3GhKV8DUqYM2W7SYZ1RmBniygRvIb6gGRZ48"
const ROLES = {
    ADMIN: 99,
    USER: 50,
    ANY: 0,
}
const DEFAULT_USERS = [
    {
        username: 'admin',
        password: hashPassword("admin"),
        role: ROLES.ADMIN,
    }
]
const state = { users: [] }

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
    state.users = []
    return state.users
}
async function getUsersFile() {
    return await file_system.readJSON("../private/configs/users.json")
}
async function saveUsersFile() {
    return await file_system.writeJSON("../private/configs/users.json", state.users)
}
async function defaultUsersFile() {
    state.users = DEFAULT_USERS
    await saveUsersFile()
    log("set to default users file")
    return state.users
}

// Functions
function validUsermame(username) {
    return username || ""
}
function validPassword(password) {
    return password || ""
}
function validRole(role) {
    if (role < 0 || role > 100) return false
    return true
}
function getUser(username) {
    username = username || ""
    const user = state.users.find(user => user.username === username)
    if (!user) return "username doesn't exists"
    return { username: user.username, role: user.role }
}
function getUsers() {
    const array = []
    state.users.forEach(user => array.push(getUser(user.username)))
    return array
}
function getUserAndPassword(username) {
    username = username || ""
    const user = state.users.find(user => user.username === username)
    return user
}
function isUser(username) {
    username = username || ""
    return state.users.some(user => user.username === username)
}
function getToken(username, password) {
    username = username || ""
    password = password || ""
    const user = getUserAndPassword(username)

    let result = ""
    if (!user) result = "username doesn't exists"
    else if (!isHashedPassword(password, user.password.hash, user.password.salt)) result = "password incorrect"
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
async function createUser(username, password, passwordConfirm, role = 0) {
    username = username || ""
    password = password || ""
    passwordConfirm = passwordConfirm || ""

    // TODO validate username and password (length, special chars, etc...)
    let result = ""
    if (password === "") result = "password is empty"
    else if (password !== passwordConfirm) result = "password does not match passwordConfirm"
    else if (isUser(username)) result = "username exists"
    else if (role < 0 || role > 100) result = "role not between 0 and 100"
    else {
        const user = {
            username: username,
            password: hashPassword(password),
            role: role,
        }
        state.users.push(user)
        await saveUsersFile()
        result = "user created"
    }

    log(`createUser("${username}", "${password}", "${passwordConfirm}", "${role}")`, result)
    return result
}
async function deleteUser(username) {
    username = username || ""

    let result = ""
    if (isUser(username)) result = "username doesn't exists"
    else {
        state.users = state.users.filter(user => user.username !== username)
        await saveUsersFile()
        result = "success"
    }

    log(`deleteUser("${username}")`, result)
    return result
}
async function updateUserRole(username, password, role = 0) {
    username = username || ""
    password = password || ""
    const user = getUserAndPassword(username)

    let result = ""
    if (!user) result = "username doesn't exists"
    // else if (user.role < role) result = "user's role is less than the requested role"
    else if (!isHashedPassword(password, user.password.hash, user.password.salt)) result = "password incorrect"
    else {
        user.role = role
        await saveUsersFile()
        result = "user updated"
    }
    
    log(`updateUserRole("${username}", "${password}", "${role}")`, result)
    return result
}
async function updateUserPassword(username, password, newPassword, newPasswordConfirm) {
    username = username || ""
    password = password || ""
    newPassword = newPassword || ""
    newPasswordConfirm = newPasswordConfirm || ""
    const user = getUserAndPassword(username)

    let result = ""
    if (newPassword === "") result = "newPassword is empty"
    else if (newPassword !== newPasswordConfirm) result = "newPassword does not match newPasswordConfirm"
    else if (!user) result = "username doesn't exists"
    else if (!isHashedPassword(password, user.password.hash, user.password.salt)) result = "password incorrect"
    else {
        user.password = hashPassword(newPassword)
        await saveUsersFile()
        result = "user updated"
    }

    log(`updateUserPassword("${username}", "${password}", "${newPassword}", "${newPasswordConfirm}")`, result)
    return result
}

// Startup
getUsersFile().then(async file => {
    if (file) {
        clearUsersArray()
        state.users.push(...file)
        // log("users.json file found")
    }
    else {
        await defaultUsersFile()
        log("no users.json file found. set to default users file")
    }
})

// Export
exports.ROLES = ROLES
exports.hashPassword = hashPassword
exports.isHashedPassword = isHashedPassword
exports.generateJWT = generateJWT
exports.verifyJWT = verifyJWT
exports.getUsersFile = getUsersFile
exports.saveUsersFile = saveUsersFile
exports.defaultUsersFile = defaultUsersFile

exports.getToken = getToken
exports.verifyToken = verifyToken
exports.isUser = isUser
exports.getUser = getUser
exports.getUsers = getUsers
exports.createUser = createUser
exports.deleteUser = deleteUser
exports.updateUserRole = updateUserRole
exports.updateUserPassword = updateUserPassword

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
//     console.log('updateUserRole("user", "password", 69)', await updateUserRole("user", "password", 69))
//     console.log('updateUserRole("user", "password", 42)', await updateUserRole("user", "password", 42))
//     console.log('getUser("user")', getUser("user"))
//     console.log('updateUserPassword("user", "password", "password2", "password2")', await updateUserPassword("user", "password", "password2", "password2"))
//     console.log('getToken("user", "password2")', getToken("user", "password2"))
//     console.log('deleteUser("user", "password")', await deleteUser("user", "password"))
//     console.log('deleteUser("user", "password2")', await deleteUser("user", "password2"))
//     console.log('defaultUsersFile()', await defaultUsersFile())
// }, 1000)