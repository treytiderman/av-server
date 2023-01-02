// express - Web server
const express = require('express')
const cors = require('cors')
const logger = require('./logger')

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
function checkIfLocalhost(req) {
  const ip = req.headers.host.split(':')[0]
  if (ip === `localhost`) return true
  else return false
}
function middlwareLog(req, res, next) {
  req.localhost = checkIfLocalhost(req)
  log(req)
  next()
}
function middlwareAuth(req, res, next) {
  // // Looks like "Bearer TOKEN"
  // const authHeader = req.headers['authorization'];
  // // If authHeader true
  // const token = authHeader && authHeader.split(' ')[1];
  // if (token == null) { return res.redirect('/api/v1/login') }
  // // Verify the jwt
  // jwt.verify(token, hashKey, (err, wasDecoded) => {
  //   if (err) { return res.redirect('/api/v1/login') }
  //   next();
  // });
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
  // - Check localhost (req.localhost)
  app.use(middlwareLog)

  // API Routes
  const routes = require('../routes/routes')
  app.use(routes.router)

  return app
}

// Export
exports.start = start

/* Examples

// HTTP server
const http = require('./modules/http')
const http_server = http.start()

// WebSocket server
const ws = require('./modules/ws_server')
const server = ws.start(http_server)

// Start web server
const port = 3000
server.listen(port, () => {
  console.log(`\nServer available at: http://localhost:${port}`)
})

*/