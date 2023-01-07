// Create Express router
const express = require('express')
const router = express.Router()

// Middleware
const { mw_renderMarkdown } = require("./markdown")
const { mw_auth, mw_isSelf, ROLES } = require("./user")
const { mw_log } = require("./logger")

// Render Markdown Files
router.use(mw_renderMarkdown)

// Public folder, everything in this folder is available to anyone
router.use(express.static("../public"))

// Public folder - Mac OS + Electron
// router.use(express.static(require('path').resolve(__dirname + "/../../../../../../public"))) 

// Log requests (exclude public routes)
// Check if localhost (req.localhost)
router.use(mw_log)

// General
router.use('/', require('./pages').router)
router.use('/', require('./user').router)
router.use('/api', require('./api').router)
router.use('/api', require('./files').router)

// Tools
router.use('/api/network/v1', mw_auth(ROLES.USER), require('./network').router)
router.use('/api/serial/v1', mw_auth(ROLES.USER), require('./serial').router)
router.use('/api/rtsp2ws/v1', mw_auth(ROLES.USER), require('./rtsp2ws').router)
router.use('/api/dhcp/server/v1', mw_auth(ROLES.USER), require('./dhcp_server').router)

// Catch All
router.use('/', require('./else').router)

// Export
exports.router = router