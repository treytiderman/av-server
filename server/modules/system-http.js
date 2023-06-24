// Overview: http routes for the system.js module
const {
    // isAdmin,
    // getTime,
    getTimeAsISO,
    getUptime,
    // getNICs,
    // getOS,
    getSystemInfo
} = require('./system')

// Create Express router
const express = require('express')
const router = express.Router()

// Routes
router.get('/time', async (req, res) => {
    const response = getTimeAsISO()
    res.json(response)
})
router.get('/uptime', async (req, res) => {
    const response = getUptime()
    res.json(response)
})
router.get('/info', async (req, res) => {
    const response = getSystemInfo()
    res.json(response)
})

// Export
exports.router = router
