// Overview: Create Express router

// Imports
import express from 'express'
import fs from 'fs/promises'
import { Logger } from '../modules/logger.js'
import { renderMarkdown } from './http-markdown.js'

// Imports - Modules
import { router as dbRouter} from '../modules/database-http.js'
import { router as filesRouter} from '../modules/files-http.js'
import { router as loggerRouter} from '../modules/logger-http.js'
import { router as programsRouter} from '../modules/programs-http.js'
import { router as systemRouter} from '../modules/system-http.js'
import { router as usersRouter, checkRequest} from '../modules/users-http.js'

// Imports - Tools
// import { router as httpClientRouter} from '../tools/http-client-http.js'
// import { router as httpServerRouter} from '../tools/http-server-http.js'
// import { router as serialRouter} from '../tools/serial-http.js'
// import { router as tcpClientRouter} from '../tools/tcp-client-http.js'
// import { router as tcpServerRouter} from '../tools/tcp-server-http.js'
// import { router as udpClientRouter} from '../tools/udp-client-http.js'
// import { router as udpServerRouter} from '../tools/udp-server-http.js'
// import { router as websocketClientRouter} from '../tools/websocket-client-http.js'
// import { router as websocketServerRouter} from '../tools/websocket-server-http.js'

// Exports
export { router }

// Variables
const router = express.Router()
const log = new Logger("http-routes.js")

// Render Markdown Files
router.use(renderMarkdown)
router.use("/docs", express.static("../docs"))
router.get('/docs', (req, res) => res.redirect(302, '/README.md'))
router.get('/README.md', async (req, res) => {
    console.log("boom")
    const file = await fs.readFile('../../README.md', 'utf8')
    console.log(file)
    res.send(file)
})

// Public folder, everything in this folder is available to anyone
router.use("/", express.static("../server/core/public"))
router.use("/web", express.static("../web"))
router.use("/ui", express.static("../server/frontend"))

// Log HTTP requests (exclude public routes)
function logRequests(req, res, next) {
    const url = `${req.method} ${req.protocol}://${req.headers.host}${req.url}`
    const reqCopy = JSON.parse(JSON.stringify({
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers,
    }))
    if (reqCopy.body.password) reqCopy.body.password = "********"
    if (reqCopy.body.token) reqCopy.body.token = "********"
    if (reqCopy.headers.authorization) reqCopy.headers.authorization = "********"
    log.debug(url, reqCopy)
    next()
}
router.use(logRequests)

// Request checking middleware
// Is localhost? req.isLocalhost = true || false
// Has Token? req.token = token || "no token" || "bad token"
// What User? req.user { username, groups }
// Admin? req.isAdmin = in group "admins"
// Is self? req.isSelf = true || false
router.use(checkRequest)

// Default routes
router.get('/', (req, res) => res.redirect(302, '/ui'))

// Modules
router.use('/api/database', dbRouter)
router.use('/api/files', filesRouter)
router.use('/api/logger', loggerRouter)
router.use('/api/programs', programsRouter)
router.use('/api/system', systemRouter)
router.use('/api/user', usersRouter)

// Tools
// router.use('/api/http-client', httpClientRouter)
// router.use('/api/http-server', httpServerRouter)
// router.use('/api/serial', serialRouter)
// router.use('/api/tcp-client', tcpClientRouter)
// router.use('/api/tcp-server', tcpServerRouter)
// router.use('/api/udp-client', udpClientRouter)
// router.use('/api/udp-server', udpServerRouter)
// router.use('/api/websocket-client', websocketClientRouter)
// router.use('/api/websocket-server', websocketServerRouter)

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
router.get('*', async (req, res) => {
    const file = await fs.readFile('../server/core/public/404/index.html', 'utf8')
    res.send(file)
})
router.all('*', function (req, res) {
    res.status(404).send("not found")
})
