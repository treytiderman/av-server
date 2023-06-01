// const auth = require("../modules/users")
// const mw = require("./middleware")
const { logRequests } = require("./middleware_logger")
const { renderMarkdown } = require("./middleware_markdown")

// Create Express router
const express = require('express')
const router = express.Router()

// Render Markdown Files
router.use(renderMarkdown)

// Public folder, everything in this folder is available to anyone
router.use(express.static("../public"))
router.use(express.static("../server/server_http/public"))

// Log requests (exclude public routes)
router.use(logRequests)

/* Request Checking
1. Is localhost? req.isLocalhost = true || false
2. Has Token? req.token = token || "no token" || "bad token"
3. What User? req.user { username, role }
4. Auth level? req.user.role = 0 though 99
5. Is self or ADMIN? req.isSelf = true || false */
// router.use(mw.checkRequest)

// Core
router.get('/', async (req, res) => {
    res.redirect(302, '/av-server-ui')
})
// router.use('/', require('./user').router) // auth used
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
    const json = {
        "number": 42,
        "string": "Hello World",
        "bool": true
    }
    res.status(200).json(json)
})
// router.get('/try/download', async (req, res) => {
//   res.status(200).download('../private/logs/example.log')
// })
router.get('/try/:path', async (req, res) => {
    res.status(200).send(req.params.path)
})
router.post('/try/json', async (req, res) => {
    res.status(200).json(req.body)
})

// Catch All
const fs = require('fs').promises
router.get('*', async (req, res) => {
    const file = await fs.readFile('./server_http/public/404/index.html', 'utf8')
    res.send(file)
})
router.all('*', function (req, res) {
    res.status(404).send("not found")
})


// Export
exports.router = router