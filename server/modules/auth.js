// Overview: create and verify hashed passwords and jsonwebtokens

// Todos
// Change to async hashing?

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
