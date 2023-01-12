// Module
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const file_system = require('../modules/file_system')

// Variables
// const jwtKey = crypto.randomBytes(32).toString('base64')
const jwtKey = "DELETE_ME_8UrIDqNu3GhKV8DUqYM2W7SYZ1RmBniygRvIb6gGRZ48"
const ROLES = {
  ADMIN: 99,
  USER: 50,
  ANY: 1,
}
const users = [
  {
    username: 'admin',
    role: ROLES.ADMIN,
    password: hashPassword("1qaz!QAZ")
  },
  {
    username: 'user',
    role: ROLES.USER,
    password: hashPassword("password")
  },
  {
    username: 'guest',
    role: ROLES.ANY,
    password: hashPassword("password")
  }
]

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
async function getUsersFile() {
  return await file_system.readJSON("../public/configs/users.json")
}
async function saveUsersFile(users) {
  return await file_system.writeJSON("../public/configs/users.json", users)
}

// Script startup
getUsersFile().then(async file => {

  // File has data
  if (file) {
    users.length = 0
    users.push(...file)
  }

  // Make file
  else await saveUsersFile(users)

})

// Export
exports.ROLES = ROLES
exports.users = users
exports.hashPassword = hashPassword
exports.isHashedPassword = isHashedPassword
exports.generateJWT = generateJWT
exports.verifyJWT = verifyJWT
exports.getUsersFile = getUsersFile
exports.saveUsersFile = saveUsersFile

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