// HTTP Server
import { create as createHttpServer, startupConsoleLog } from './http-server.js'
const httpServer = createHttpServer()

// WebSocket Server
import { create as createWsServer } from './websocket-server.js'
const server = createWsServer(httpServer)

// API
import "./api-routes.js"
import "./websocket-routes.js"

// Start Server
const port = process.env.PORT || 4620
server.listen(port, () => {
    console.log(`av-server is up and running`)
    startupConsoleLog(port)
})
