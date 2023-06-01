// Create Express router
const express = require('express')
const router = express.Router()

// Modules
const auth = require("../core/modules/auth")

// Middleware
const mw = require("./middleware")

// Render Markdown Files
router.use(mw.renderMarkdown)

// Public folder, everything in this folder is available to anyone
router.use(express.static("../public"))

// Log requests (exclude public routes)
router.use(mw.logRequests)

/* Request Checking
1. Is localhost? req.isLocalhost = true || false
2. Has Token? req.token = token || "no token" || "bad token"
3. What User? req.user { username, role }
4. Auth level? req.user.role = 0 though 99
5. Is self or ADMIN? req.isSelf = true || false */
router.use(mw.checkRequest)

// General
router.use('/', require('./pages').router)
router.use('/', require('./user').router) // auth used
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