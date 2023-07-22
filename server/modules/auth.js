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
    generateJWT,
    verifyJWT,
}

// Constants
const CRYPTO_KEYSIZE = 64
const CRYPTO_ITERATIONS = 9999
const JWT_KEY = process.env.DEV_MODE ? "test" : randomBytes(CRYPTO_KEYSIZE).toString('base64')

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
function generateJWT(json) {
    return jwt.sign(json, JWT_KEY)
}
function verifyJWT(token, cb) {
    jwt.verify(token, JWT_KEY, (error, json) => cb(error, json))
}

// Tests
if (process.env.DEV_MODE) await runTests("auth.js")
async function runTests(testName) {
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
