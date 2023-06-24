// Overview: http routes for the logger.js module
const { log } = require('./logger')
const { getStats, readText } = require('./files')
const { gate } = require('./users-http')

// Create Express router
const express = require('express')
const router = express.Router()

// Routes
router.get('/files-available', gate({isAdmin: true}), async (req, res) => {
    const response = await getStats("../private/logs")
    res.json(response)
})
router.get('/file', gate({isAdmin: true}), async (req, res) => {
    const response = await readText("../private/logs/" + req.body.file)
    res.json(response)
})
router.post('/', gate({isAdmin: true}), async (req, res) => {
    const response = await log(req.body.group, req.body.message, req.body.obj)
    res.json(response)
})

// Export
exports.router = router
