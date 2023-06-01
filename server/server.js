// HTTP Server
const http = require('./server_http/http_server')
const http_server = http.create()

// WebSocket Server
const ws = require('./server_websocket/ws_server')
const server = ws.start(http_server)

// Start Server
const port = process.env.port || 4620
server.listen(port, () => {
    console.log(`AV-Tools server is up and running`)
    http.startupConsoleLog(port)
})

require("./modules/logger")