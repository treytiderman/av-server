// Create Express router
const express = require('express')
const router = express.Router()

// Module
const file_system = require('../modules/file_system')
const fs = require('fs').promises
const jwt = require('jsonwebtoken')

function middlware_auth(req, res, next) {
  const hashKey = 'monkeybread'
  const password = 'password'
  // Header looks like "authorization: Bearer <TOKEN>"
  const authHeader = req.headers['authorization']
  // If authHeader true
  const token = authHeader && authHeader.split(' ')[1]
  if (token === null) { return res.redirect('/api/v1/login') }
  // Verify the jwt
  jwt.verify(token, hashKey, (err, wasDecoded) => {
    if (err) { return res.redirect('/api/v1/login') }
    next()
  })
}

// Routes
router.get('/login', async (req, res) => {
  const file = await fs.readFile('./_http/login.html','utf8')
  res.send(file)
})
router.post('/user', async (req, res) => {

  // Request body looks like
  const body = {
    username: req.body.username,
    password: req.body.password,
    confirm_password: req.body.confirm_password
  }

  // If the passwords don't match
  if (req.body.password !== req.body.confirm_password) {
    res.status(400).send("passwords don't match")
  }

  // Check that the user doesn't exist


  res.status(200).json(req.body)
})
router.post('/login', async (req, res) => {
  const body = {
    username: "",
    password: ""
  }
  res.status(200).json(req.body)
})
router.delete('/user', async (req, res) => {
  const body = {
    username: "",
    password: "",
    confirm_password: ""
  }
  res.status(200).json(req.body)
})
router.put('/user', async (req, res) => {
  const body = {
    username: "",
    password: "",
    confirm_password: ""
  }
  res.status(200).json(req.body)
})

// Export
exports.router = router