// Create Express router
const express = require('express')
const router = express.Router()

// Module
const fs = require('fs').promises
const auth = require('../modules/auth')
const file_system = require('../modules/file_system')

// Variables
const ROLES = {
  ADMIN: 0,
  USER: 50,
  GUEST: 99,
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
    role: ROLES.GUEST,
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
    const token = authHeader && authHeader.split(' ')[1]

    // No Token
    if (token === undefined) {
      return res.status(400).send("no token, login first")
      // return res.redirect('/login')
    }

    // Verify Token
    auth.verifyJWT(token, (error, jwtJson) => {

      // Bad Token
      if (error) {
        return res.status(400).send("bad token, login first")
        // return res.redirect('/login')
      }

      // Good token
      else {

        // Get user and add to request <- TODO couldn't the jwt username be changed?
        const user = users.find(user => user.username === jwtJson.username)
        if (user) req.user = user

        // User doesn't exist
        else return res.status(400).send("jwt username doesn't exist")

        // jwt username is the same as the request body username
        req.isSelf = req.user.username === req.body.username

        console.log({
          user: req.user,
          isSelf: req.isSelf,
        })

        // User role level is less than or equal to the role required
        if (req.user.role <= role) next()

        // This user role doesn't have 
        else return res.status(400).send("user role to high")

      }

    })

  }
}
function mw_isSelf(req, res, next) {
  // jwt username is the same as the request body username OR
  // the user is an ROLES.ADMIN
  if (req.isSelf || req.user.role === ROLES.ADMIN) next()
  else return res.status(400).send("user is not self")
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
      res.status(200).send(token)
    }

    // Password incorrect
    else { 
      res.status(400).send("password incorrect")
      // res.redirect('/login')
    }

  }

  // Else
  else { res.status(400).send("username doesn't exists") }

})

// Create User
router.post('/user', mw_auth(ROLES.USER), async (req, res) => {

  // Passwords don't match
  if (req.body.password !== req.body.confirm_password) {
    res.status(400).send("password does not match confirm_password")
  }

  // Username exists
  else if (users.some(user => user.username === req.body.username)) {
    res.status(400).send("username exists")
  }

  // User's role is not as high as the role of the user they want to create
  else if (req.user.role < req.body.role) {
    res.status(400).send("role of new user is higher than user requesting")
  }

  // Add user
  else if (req.body.username && req.body.password && req.body.confirm_password) {
    users.push({
      username: req.body.username,
      role: req.body.role,
      password: auth.hashPassword(req.body.password)
    })
    await saveUsersFile()
    res.status(200).send("user created")
  }

  // Else
  else { res.status(400).send("failed") }

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
      res.status(200).send("user deleted")
    }

    // Password incorrect
    else { res.status(400).send("password incorrect") }

  }

  // Else
  else { res.status(400).send("username doesn't exists") }

})

// Update User Password
router.put('/user', mw_auth(ROLES.USER), mw_isSelf, async (req, res) => {

  // Get User
  const user = users.find(user => user.username === req.body.username)

  // Username exists
  if (user) {

    // New passwords don't match
    if (req.body.new_password !== req.body.confirm_new_password) {
      res.status(400).send("new_password does not match confirm_new_password")
    }
    
    // Correct | Update user password
    else if (auth.isHashedPassword(req.body.old_password, user.password.hash, user.password.salt)) {
      user.password = auth.hashPassword(req.body.new_password)
      await saveUsersFile()
      res.status(200).send("user updated")
    }

    // Password incorrect
    else { res.status(400).send("password incorrect") }

  }

  // Else
  else { res.status(400).send("username doesn't exists") }

})

// User roles
router.get('/user/roles', async (req, res) => {
  res.status(200).json(ROLES)
})

// Export
exports.router = router
exports.ROLES = ROLES
exports.mw_auth = mw_auth
exports.mw_isSelf = mw_isSelf