// express - Web server
const express = require('express')
const cors = require('cors')
const logger = require('../modules/logger')

// Functions
function log(req) {
  const path = "../public/logs/"

  // URL
  logger.log(`${req.method} ${req.protocol}://${req.headers.host}${req.url}`, path, 'http')

  // Query Params
  if (JSON.stringify(req.query) !== '{}') {
    logger.log(`PARAMS ${JSON.stringify(req.query)}`, path, 'http')
  }

  // Body
  if (JSON.stringify(req.body) !== '{}') {
    logger.log(`BODY ${JSON.stringify(req.body)}`, path, 'http')
  }

}
function isLocalhost(req) {
  const ip = req.headers.host.split(':')[0]
  if (ip === `localhost`) return true
  else return false
}
function middlware_log(req, res, next) {
  req.localhost = isLocalhost(req)
  log(req)
  next()
}
function start() {
  const app = express()
  app.set('json spaces', 2)

  // Allow requests that didn't originate from this server
  app.use(cors({origin: true}))

  // Process request body (req.body) for urlencoded, json, and plain text bodys
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(express.text())

  // Public folder, everything in this folder is available to anyone
  app.use(express.static("../public"))

  // Public folder - Mac OS + Electron
  // app.use(express.static(require('path').resolve(__dirname + "/../../../../../../public"))) 

  // Middleware
  // - Log requests (exclude public routes)
  // - Check if localhost (req.localhost)
  app.use(middlware_log)
  // - Check auth / permissions (req.auth)
  // app.use(middlware_auth)

  // API
  app.use(require('./routes').router)

  return app
}

// Export
exports.start = start

/* Examples

// HTTP Server
const http = require('./_http/_http_server')
const http_server = http.start()

// WebSocket Server
const ws = require('./_websocket/_ws_server')
const server = ws.start(http_server)

// Start web server
const port = 3000
server.listen(port, () => {
  console.log(`\nServer available at: http://localhost:${port}`)
})

*/