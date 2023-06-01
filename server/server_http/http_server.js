// express - Web server
const express = require('express')
const cors = require('cors')

// Require
const { router } = require('./http_routes')
const { getSystemInfo } = require("../modules/system")

// Functions
function create() {
    const app = express()
    app.set('json spaces', 2)

    // Allow requests that didn't originate from this server
    app.use(cors({ origin: true }))

    // Process request body (req.body) for urlencoded, json, and plain text bodys
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(express.text())

    // API
    app.use(router)

    return app
}
function startupConsoleLog(port) {
    const systemInfo = getSystemInfo()
    console.log(`The user interface is available at:`)
    console.log(`- http://localhost:${port}`)
    systemInfo.nics.forEach(nic => {
        console.log(`- http://${nic.ip}:${port}`)
    })
    console.log(`- http://${systemInfo.hostname}:${port}`)
    console.log("")
}

// Export
exports.create = create
exports.startupConsoleLog = startupConsoleLog

/* Examples

// HTTP Server
const http = require('./server_http/http_server')
const http_server = http.create()

// WebSocket Server
const ws = require('./_websocket/_ws_server')
const server = ws.start(http_server)

// Start web server
const port = process.env.port || 3000
server.listen(port, () => {
  http.startupConsoleLog(port)
})

*/