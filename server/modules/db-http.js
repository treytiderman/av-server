// Overview: http routes for the state.js module
const { State } = require('./state')

// Create Express router
const express = require('express')
const router = express.Router()

// Routes
// router.get('/groups', async (req, res) => {
//     const response = await getGroups()
//     res.json(response)
// })

// Export
exports.router = router
