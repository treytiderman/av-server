// Overview: Create Express router

// Imports
import express from 'express'
import fs from 'fs/promises'
import { Logger } from '../modules/logger.js'
import { renderMarkdown } from '../modules/markdown.js'

// Exports
export { router }

// Variables
const router = express.Router()
const log = new Logger("http-routes.js")

// Render Markdown Files
router.use(renderMarkdown)
router.get('/help', (req, res) => res.redirect(302, '/docs/README.md'))
router.get('/docs', (req, res) => res.redirect(302, '/docs/README.md'))
router.get('/api', (req, res) => res.redirect(302, '/docs/README.md'))

// Public folder, everything in this folder is available to anyone
router.use("/", express.static("../public"))

// Default routes
router.get('/', (req, res) => res.redirect(302, '/ui'))

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

// Test Routes
router.get('/try/time', async (req, res) => {
    const time = new Date(Date.now()).toISOString()
    res.json(time)
})
router.get('/try/json', async (req, res) => {
    const json = { "number": 42, "string": "Hello World", "bool": true }
    res.status(200).json(json)
})
router.post('/try/json', async (req, res) => {
    res.status(200).json(req.body)
})

// 404 / Catch All
router.get('*', async (req, res) => {
    try {
        const file = await fs.readFile('../public/404/index.html', 'utf8')
        res.send(file)
    } catch (error) {
        res.json(error)
    }
})
router.all('*', function (req, res) {
    res.status(404).json("not found")
})
