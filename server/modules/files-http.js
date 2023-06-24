// Overview: http routes for the files.js module
const {
    // appendText,
    // deleteFile,
    // deleteFolder,
    // exists,
    // getStats,
    // getStatsRaw,
    // getStatsRecursive,
    // makeDir,
    // readJSON,
    // readText,
    // rename,
    // writeJSON,
    // writeText
} = require('./files')

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
