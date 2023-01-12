// Create Express router
const { response } = require('express')
const express = require('express')
const router = express.Router()

// Module
const fs = require('fs').promises
const auth = require('../modules/auth')
const mw = require('./middleware')

// Login Page
router.get('/login', async (req, res) => {
  const file = await fs.readFile('./_http/assets/login.html','utf8')
  res.send(file)
})

// Login to receive Token
router.post('/api/login/v1', async (req, res) => {

  // Get User
  const user = auth.users.find(user => user.username === req.body.username)

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
    else res.status(403).json("password incorrect")

  }

  // Else
  else res.status(404).json("username doesn't exists")

})

// Get User
router.get('/api/user/v1', mw.gate({role_min: auth.ROLES.ANY}), async (req, res) => {
  const body = {
    username: req.user.username,
    role: req.user.role,
  }
  res.json(body)
})

// Create User
router.post('/api/user/v1', mw.gate({role_min: auth.ROLES.USER}), async (req, res) => {

  // Passwords don't match
  if (req.body.password !== req.body.confirm_password) {
    res.status(400).json("password does not match confirm_password")
  }

  // Username exists
  else if (auth.users.some(user => user.username === req.body.username)) {
    res.status(400).json("username exists")
  }

  // User's role is less than the requested role
  else if (req.user.role < req.body.role) {
    res.status(403).json("not autherized, user's role is less than the requested role")
  }

  // TODO validate username and password (length, special chars, etc...)

  // Add user
  else if (req.body.username && req.body.password && req.body.confirm_password) {
    auth.users.push({
      username: req.body.username,
      role: req.body.role ?? 0,
      password: auth.hashPassword(req.body.password)
    })
    await auth.saveUsersFile(auth.users)
    res.json("user created")
  }

  // Else
  else res.status(400).json("failed")

})

// Delete User
router.delete('/api/user/v1', mw.gate({role_min: auth.ROLES.USER, self: true}), async (req, res) => {

  // Get User
  const user = auth.users.find(user => user.username === req.body.username)

  // Username exists
  if (user) {
    
    // Delete user
    if (auth.isHashedPassword(req.body.password, user.password.hash, user.password.salt)) {
      auth.users.length = 0
      auth.users.push(...auth.users.filter(user => user.username !== req.body.username))
      await auth.saveUsersFile(auth.users)
      res.json("user deleted")
    }

    // Password incorrect
    else { res.status(403).json("password incorrect") }

  }

  // Else
  else { res.status(404).json("username doesn't exists") }

})

// Update User
router.put('/api/user/v1', mw.gate({role_min: auth.ROLES.USER, self: true}), async (req, res) => {

  // Get User
  const user = auth.users.find(user => user.username === req.body.username)

  // Username exists
  if (user) {

    // New passwords don't match
    if (req.body.new_password !== req.body.confirm_new_password) {
      res.status(400).json("new_password does not match confirm_new_password")
    }

    // User's role is less than the requested role
    else if (req.user.role < req.body.role) {
      res.status(403).json("not autherized, user's role is less than the requested role")
    }

    // TODO validate username and password (length, special chars, etc...)

    // Correct | Update user password
    else if (auth.isHashedPassword(req.body.old_password, user.password.hash, user.password.salt)) {
      if (req.body.new_password) user.password = auth.hashPassword(req.body.new_password)
      if (req.body.role) user.role = req.body.role
      await auth.saveUsersFile(auth.users)
      const response = {
        username: user.username,
        role: user.role
      }
      res.json(response)
    }

    // Password incorrect
    else { res.status(403).json("password incorrect") }

  }

  // Else
  else { res.status(404).json("username doesn't exists") }

})

// All Users
router.get('/api/users/v1', mw.gate({role_min: auth.ROLES.ADMIN}), async (req, res) => {
  const response = []
  auth.users.forEach(user => {
    response.push({
      username: user.username,
      role: user.role,
    })
  })
  res.json(response)
})

// User roles
router.get('/api/user/roles/v1', async (req, res) => {
  res.json(auth.ROLES)
})

// Export
exports.router = router