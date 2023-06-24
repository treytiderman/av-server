// Overview: http routes for the programs.js module
const {
    // getAvailable,
    // getDataHistory,
    // getProgram,
    // getPrograms,
    // kill,
    // killAll,
    // restart,
    // start,
    // startAvailable
} = require('./programs')

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
