// express - Web server
const express = require('express')
const cors = require('cors')

// Functions
function start() {
  const app = express()
  app.set('json spaces', 2)

  // Allow requests that didn't originate from this server
  app.use(cors({origin: true}))

  // Process request body (req.body) for urlencoded, json, and plain text bodys
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(express.text())

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