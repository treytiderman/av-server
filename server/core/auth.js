const crypto = require('crypto')
const jwt = require('jsonwebtoken')

// Variables
const CRYPTO_KEYSIZE = 64
const CRYPTO_ITERATIONS = 9999
const JWT_KEY = process.env.RUN_TESTS ? "test" : crypto.randomBytes(CRYPTO_KEYSIZE).toString('base64')

// Functions
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

// Testing
setTimeout(() => {
    if (process.env.RUN_TESTS) runTests("auth.js")
}, 1000)
function runTests(testName) {
    let pass = true

    const testPassword = "password"
    const hashTestPassword = hashPassword(testPassword)
    if (isHashedPassword(testPassword, hashTestPassword.hash, hashTestPassword.salt) === false) pass = false

    const testData = { boom: "pow" }
    const testToken = generateJWT(testData)
    let verifyJWT_error = ""
    let verifyJWT_json = ""
    verifyJWT(testToken, (error, json) => {
        verifyJWT_error = error
        verifyJWT_json = json
    })
    if (verifyJWT_error || verifyJWT_json.boom !== testData.boom) pass = false

    if (pass !== true) console.log(testName, '\x1b[31mTESTS FAILED\x1b[0m')
}

// Export
exports.hashPassword = hashPassword
exports.isHashedPassword = isHashedPassword
exports.generateJWT = generateJWT
exports.verifyJWT = verifyJWT
