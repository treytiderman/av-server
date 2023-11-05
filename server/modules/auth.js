// Overview: create and verify hashed passwords and jsonwebtokens

// Todos
// Change to async hashing and jwt generation

// Imports
import { randomBytes, pbkdf2Sync } from 'crypto'
import jwt from 'jsonwebtoken'

// Exports
export {
    hashPassword,
    isHashedPassword,
    generateToken,
    verifyToken,
}

// Constants
const CRYPTO_KEYSIZE = 64
const CRYPTO_ITERATIONS = 9999
const CRYPTO_KEY = process.env.DEV_MODE ? "test" : randomBytes(CRYPTO_KEYSIZE).toString('base64')

// Functions
function hashPassword(password) {
    const salt = randomBytes(CRYPTO_KEYSIZE).toString('base64')
    const hash = pbkdf2Sync(password, salt, CRYPTO_ITERATIONS, CRYPTO_KEYSIZE, 'sha256').toString('base64')
    return { salt: salt, hash: hash }
}
function isHashedPassword(password, hash, salt) {
    if (!password) return false
    const hashTesting = pbkdf2Sync(password, salt, CRYPTO_ITERATIONS, CRYPTO_KEYSIZE, 'sha256').toString('base64')
    return hash === hashTesting
}
function generateToken(json) {
    return jwt.sign(json, CRYPTO_KEY)
}
function verifyToken(token, callback) {
    jwt.verify(token, CRYPTO_KEY, (error, json) => callback(error, json))
}

// Tests
if (process.env.DEV_MODE) await runTests("auth.js")
async function runTests(testName) {
    let pass = true

    const testPassword = "password"
    const hashTestPassword = hashPassword(testPassword)
    if (isHashedPassword(testPassword, hashTestPassword.hash, hashTestPassword.salt) === false) pass = false

    const testData = { boom: "pow" }
    const testToken = generateToken(testData)
    let verifyToken_error = ""
    let verifyToken_json = ""
    verifyToken(testToken, (error, json) => {
        verifyToken_error = error
        verifyToken_json = json
    })
    if (verifyToken_error || verifyToken_json.boom !== testData.boom) pass = false

    if (pass !== true) console.log(testName, '\x1b[31mTESTS FAILED\x1b[0m')
}
