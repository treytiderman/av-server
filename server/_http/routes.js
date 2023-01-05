// Create Express router
const express = require('express')
const router = express.Router()

// General
router.use('/', require('./pages').router)
router.use('/', require('./user').router)
router.use('/api', require('./api').router)
router.use('/api', require('./files').router)

// Tools
router.use('/api/network/v1', require('./network').router)
router.use('/api/serial/v1', require('./serial').router)
router.use('/api/rtsp2ws/v1', require('./rtsp2ws').router)
router.use('/api/dhcp/server/v1', require('./dhcp_server').router)

// Catch All
router.use('/', require('./else').router)

// Export
exports.router = router