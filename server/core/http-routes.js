// Create Express router
const express = require('express')
const router = express.Router()

// Render Markdown Files
const { renderMarkdown } = require("../core/http-markdown")
router.use(renderMarkdown)

// Public folder, everything in this folder is available to anyone
router.use("/", express.static("../server/core/public"))
router.use("/web", express.static("../web"))
router.use("/docs", express.static("../docs"))
router.use("/ui", express.static("../server/frontend"))

// Log HTTP requests (exclude public routes)
const logger = require('../modules/logger')
function logRequests(req, res, next) {
    const url = `${req.method} ${req.protocol}://${req.headers.host}${req.url}`
    logger.log("server_http", url, req.body)
    next()
}
router.use(logRequests)

// Request checking middleware
// Is localhost? req.isLocalhost = true || false
// Has Token? req.token = token || "no token" || "bad token"
// What User? req.user { username, groups }
// Admin? req.isAdmin = in group "admins"
// Is self? req.isSelf = true || false
const { checkRequest } = require("../modules/users-http")
router.use(checkRequest)

// Modules
router.get('/', (req, res) => res.redirect(302, '/ui'))
// router.use('/api/files', require('../modules/files-http').router)
// router.use('/api/logger', require('../modules/logger-http').router)
// router.use('/api/programs', require('../modules/programs-http').router)
// router.use('/api/state', require('../modules/state-http').router)
router.use('/api/system', require('../modules/system-http').router)
router.use('/api/user', require('../modules/users-http').router)

// Tools
// router.use('/api/http-client', require('../tools/http-client-http').router)
// router.use('/api/http-server', require('../tools/http-server-http').router)
// router.use('/api/serial', require('../tools/serial').router)
// router.use('/api/tcp-client', require('../tools/tcp-client-http').router)
// router.use('/api/tcp-server', require('../tools/tcp-server-http').router)
// router.use('/api/udp-client', require('../tools/udp-client-http').router)
// router.use('/api/udp-server', require('../tools/udp-server-http').router)
// router.use('/api/websocket-client', require('../tools/websocket-client-http').router)
// router.use('/api/websocket-server', require('../tools/websocket-server-http').router)

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
//   res.status(200).download('../logs/example.log')
// })
router.get('/try/:path', async (req, res) => {
    res.status(200).send(req.params.path)
})

// 404 / Catch All
const fs = require('fs').promises
router.get('*', async (req, res) => {
    const file = await fs.readFile('../server/core/public/404/index.html', 'utf8')
    res.send(file)
})
router.all('*', function (req, res) {
    res.status(404).send("not found")
})

// Export
exports.router = router