// HTTP Server
const http = require('./core/http-server')
const http_server = http.create()

// WebSocket Server
const ws = require('./core/websocket-server')
const server = ws.create(http_server)

// Start Server
const port = process.env.PORT || 4620
server.listen(port, () => {
    console.log(`av-server is up and running`)
    http.startupConsoleLog(port)
})
