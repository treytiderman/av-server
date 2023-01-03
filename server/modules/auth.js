// Module
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

// Variables
const jwtKey = "sweetpotato"

// Functions
function hashPassword(password) {
  const keysize = 128
  const iterations = 9999
  const salt = crypto.randomBytes(128).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keysize, 'sha256').toString('hex')
  return { salt: salt, hash: hash }
}
function isHashedPassword(password, hash, salt) {
  const keysize = 128
  const iterations = 9999
  const hashTesting = crypto.pbkdf2Sync(password, salt, iterations, keysize, 'sha256').toString('hex')
  return hash === hashTesting
}
function generateJWT(json) {
  return jwt.sign(json, jwtKey)
}
function verifyJWT(token, cb) {
  jwt.verify(token, jwtKey, (error, json) => cb(error, json) )
}

// Export
exports.hashPassword = hashPassword
exports.isHashedPassword = isHashedPassword
exports.generateJWT = generateJWT
exports.verifyJWT = verifyJWT

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

