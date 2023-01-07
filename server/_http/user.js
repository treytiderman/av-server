// Create Express router
const express = require('express')
const router = express.Router()

// Module
const fs = require('fs').promises
const auth = require('../modules/auth')
const file_system = require('../modules/file_system')

// Variables
const ROLES = {
  ADMIN: 99,
  USER: 50,
  ANY: 0,
}
let users = [
  {
    username: 'admin',
    role: ROLES.ADMIN,
    password: auth.hashPassword("1qaz!QAZ")
  },
  {
    username: 'user',
    role: ROLES.USER,
    password: auth.hashPassword("password")
  },
  {
    username: 'guest',
    role: ROLES.ANY,
    password: auth.hashPassword("password")
  }
]

// Functions
async function getUsersFile() {
  return await file_system.readJSON("../public/configs/users.json")
}
async function saveUsersFile() {
  return await file_system.writeJSON("../public/configs/users.json", users)
}
function mw_auth(role) {
  return (req, res, next) => {

    // Grab Token from authorization header "Authorization: Bearer <TOKEN>"
    const authHeader = req.headers['authorization']
    console.log(authHeader)
    const token = authHeader && authHeader.split(' ')[1]
    console.log(token)

    // No Token
    if (token === undefined) {
      return res.status(401).json("no token, login first")
      // return res.redirect('/login')
    }

    // Verify Token
    auth.verifyJWT(token, (error, jwtJson) => {

      // Bad Token
      if (error) {
        return res.status(401).json("bad token, login first")
        // return res.redirect('/login')
      }

      // Good token
      else {

        // Get user and add to request <- TODO couldn't the jwt username be changed?
        const user = users.find(user => user.username === jwtJson.username)
        if (user) req.user = user

        // User doesn't exist
        else return res.status(401).json("jwt username doesn't exist")

        // jwt username is the same as the request body username
        req.isSelf = req.user.username === req.body.username

        // User role level is greater than or equal to the role required
        if (req.user.role >= role) next()

        // User role not high enough
        else return res.status(401).json("user role not high enough")

      }

    })

  }
}
function mw_isSelf(req, res, next) {
  // jwt username is the same as the request body username OR
  // the user is an ROLES.ADMIN
  if (req.isSelf || req.user.role === ROLES.ADMIN) next()
  else return res.status(400).json("jwt username is the same as the request body username")
}

// Script startup
getUsersFile().then(async file => {
  if (file) users = file // File has data
  else await saveUsersFile() // Make file
})

// Login Page
router.get('/login', async (req, res) => {
  const file = await fs.readFile('./_http/login.html','utf8')
  res.send(file)
})

// Login to receive Token
router.post('/login', async (req, res) => {

  // Get User
  const user = users.find(user => user.username === req.body.username)

  // Username exists
  if (user) {
    
    // Correct | Send Token
    if (auth.isHashedPassword(req.body.password, user.password.hash, user.password.salt)) {
      const token = auth.generateJWT({
        username: user.username
      })
      res.json(token)
    }

    // Password incorrect
    else { 
      res.status(403).json("password incorrect")
      // res.redirect('/login')
    }

  }

  // Else
  else { res.status(404).json("username doesn't exists") }

})

// Get User
router.get('/user', mw_auth(ROLES.ANY), async (req, res) => {
  const { password, ...body } = req.user
  res.json(body)
})

// Create User
router.post('/user', mw_auth(ROLES.USER), async (req, res) => {

  // Passwords don't match
  if (req.body.password !== req.body.confirm_password) {
    res.status(400).json("password does not match confirm_password")
  }

  // Username exists
  else if (users.some(user => user.username === req.body.username)) {
    res.status(400).json("username exists")
  }

  // User's role is less than the requested role
  else if (req.user.role < req.body.role) {
    res.status(403).json("user's role is less than the requested role")
  }

  // Add user
  else if (req.body.username && req.body.password && req.body.confirm_password) {
    users.push({
      username: req.body.username,
      role: req.body.role ?? 0,
      password: auth.hashPassword(req.body.password)
    })
    await saveUsersFile()
    res.json("user created")
  }

  // Else
  else { res.status(400).json("failed") }

})

// Delete User
router.delete('/user', mw_auth(ROLES.USER), mw_isSelf, async (req, res) => {

  // Get User
  const user = users.find(user => user.username === req.body.username)

  // Username exists
  if (user) {
    
    // Delete user
    if (auth.isHashedPassword(req.body.password, user.password.hash, user.password.salt)) {
      users = users.filter(user => user.username !== req.body.username)
      await saveUsersFile()
      res.json("user deleted")
    }

    // Password incorrect
    else { res.status(403).json("password incorrect") }

  }

  // Else
  else { res.status(404).json("username doesn't exists") }

})

// Update User Password
router.put('/user', mw_auth(ROLES.USER), mw_isSelf, async (req, res) => {

  // Get User
  const user = users.find(user => user.username === req.body.username)

  // Username exists
  if (user) {

    // New passwords don't match
    if (req.body.new_password !== req.body.confirm_new_password) {
      res.status(400).json("new_password does not match confirm_new_password")
    }

    // User's role is less than the requested role
    else if (req.user.role < req.body.role) {
      res.status(403).json("user's role is less than the requested role")
    }

    // Correct | Update user password
    else if (auth.isHashedPassword(req.body.old_password, user.password.hash, user.password.salt)) {
      if (req.body.new_password) user.password = auth.hashPassword(req.body.new_password)
      if (req.body.role) user.role = req.body.role
      await saveUsersFile()
      res.json(user)
    }

    // Password incorrect
    else { res.status(403).json("password incorrect") }

  }

  // Else
  else { res.status(404).json("username doesn't exists") }

})

// User roles
router.get('/user/roles', async (req, res) => {
  res.json(ROLES)
})

// User's role
router.get('/user/role', mw_auth(ROLES.ANY), async (req, res) => {
  res.json(req.user.role)
})

// Export
exports.router = router
exports.ROLES = ROLES
exports.mw_auth = mw_auth
exports.mw_isSelf = mw_isSelf