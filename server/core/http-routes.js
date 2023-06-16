// const auth = require("../modules/users")
// const mw = require("./middleware")
const { logRequests } = require("./http-logger")
const { renderMarkdown } = require("./http-markdown")
const { checkRequest } = require("./users-http")

// Create Express router
const express = require('express')
const router = express.Router()

// Render Markdown Files
router.use(renderMarkdown)

// Public folder, everything in this folder is available to anyone
router.use("/", express.static("../public"))
router.use("/", express.static("../server/core/public"))
router.use("/ui", express.static("../server/frontend"))

// Log requests (exclude public routes)
router.use(logRequests)

// Request checking middleware
// Is localhost? req.isLocalhost = true || false
// Has Token? req.token = token || "no token" || "bad token"
// What User? req.user { username, groups }
// Admin? req.isAdmin = in group "admins"
// Is self? req.isSelf = true || false
router.use(checkRequest)

// Core
router.get('/', (req, res) => res.redirect(302, '/ui'))
router.use('/api', require('./users-http').router)
// router.use('/api', require('./files').router)

// Tools
// router.use('/api/network/v1', require('./network').router)
// router.use('/api/serial/v1', require('./serial').router)
// router.use('/api/rtsp2ws/v1', require('./rtsp2ws').router)
// router.use('/api/dhcp/server/v1', require('./dhcp_server').router)

// Try Test Routes
router.get('/try/time', async (req, res) => {
    const time = new Date(Date.now()).toISOString()
    res.json(time)
})
router.get('/try/headers', async (req, res) => {
    res.status(200).json(req.headers)
})
router.get('/try/query', async (req, res) => {
    res.status(200).json(req.query)
})
router.get('/try/json', async (req, res) => {
    const json = { "number": 42, "string": "Hello World", "bool": true }
    res.status(200).json(json)
})
router.post('/try/json', async (req, res) => {
    res.status(200).json(req.body)
})
// router.get('/try/download', async (req, res) => {
//   res.status(200).download('../private/logs/example.log')
// })
router.get('/try/:path', async (req, res) => {
    res.status(200).send(req.params.path)
})

// 404 / Catch All
const fs = require('fs').promises
router.get('*', async (req, res) => {
    const file = await fs.readFile('./core/public/404/index.html', 'utf8')
    res.send(file)
})
router.all('*', function (req, res) {
    res.status(404).send("not found")
})

// Export
exports.router = router