// Overview: http routes for the system.js module

// Imports
import express from 'express'
import {
    // isAdmin,
    getTime,
    getTimeAsISO,
    getUptime,
    // getNICs,
    // getOS,
    getSystemInfo
} from './system.js'

// Export
export { router }

// Create Express router
const router = express.Router()

// Routes
router.get('/time', async (req, res) => {
    const response = getTime()
    res.json(response)
})
router.get('/time-as-iso', async (req, res) => {
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
