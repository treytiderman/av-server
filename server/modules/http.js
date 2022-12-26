// express - Web server
const express = require('express')

// Variables
let adminOnly = false
let localhostOnly = false

// Functions
function start() {
  const app = express()
  app.set('json spaces', 2)

  // Allow requests that didn't originate from this server
  const cors = require('cors')
  app.use(cors({origin: true}))

  // Process request body (req.body) for urlencoded, json, and plain text bodys
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(express.text())

  // Public folder, everything in this folder is available to anyone
  app.use(express.static("../public"))

  // API Routes
  const routes = require('../routes/routes')
  app.use(routes.router)

  return app
}
function httpLog(req) {
  const { log } = require('./log')
  // Path
  const path = "../public/logs/"
  // URL
  log(`${req.method} ${req.protocol}://${req.headers.host}${req.url}`, path, 'http')
  // Query Params
  if (JSON.stringify(req.query) !== '{}') log(`PARAMS ${JSON.stringify(req.query)}`, path, 'http')
  // Body
  if (JSON.stringify(req.body) !== '{}') log(`BODY ${JSON.stringify(req.body)}`, path, 'http')
}
function checkIfServerIsAdmin() {
  const exec = require('child_process').exec
  exec('NET SESSION', function(err,so,se) {
    if (se.length === 0) return true
    else return false
  })
  return false
}
function checkIfLocalhost(req) {
  const ip = req.headers.host.split(':')[0]
  // If localhost
  if (ip === `localhost`) return true
  // External connection
  else return false
}
function middlware(req, res, next) {
  let validRequest = true
  // Run before handling the request
  httpLog(req)
  if (adminOnly && checkIfServerIsAdmin() === false) validRequest = false
  if (localhostOnly && checkIfLocalhost(req) === false) validRequest = false
  // Handle requests
  if (validRequest) next()
  else res.send(`App requires being run as admin: ${adminOnly}, Page is only available from localhost: ${localhostOnly}`)
  // Run after handling the request
}

// Export
exports.start = start
exports.middlware = middlware
exports.adminOnly = adminOnly
exports.localhostOnly = localhostOnly

/* Examples

// Web (HTTP) server
const http = require('./modules/http')
const app = http.start()
app.use(http.middlware)

// WebSocket server
const ws = require('./modules/ws')
const server = ws.start(app)

// Start web server
const port = 3000
server.listen(port, () => {
  console.log(`\nServer available at: http://localhost:${port}`)
})

*/