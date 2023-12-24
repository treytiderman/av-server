// HTTP Server
import { create as createExpressServer, startupConsoleLog } from './http-server.js'
const expressServer = createExpressServer()

// WebSocket Server
import { create as createWsServer } from './websocket-server.js'
import { createServer as createHttpServer } from 'http'
const server = createWsServer(createHttpServer(expressServer))

// API
import "../lib/api-v1.routes.js"

// Start Server
const port = process.env.PORT || 4620
server.listen(port, () => {
    console.log(`av-server is up and running`)
    startupConsoleLog(port)
})
