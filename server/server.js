// HTTP Server
import { create as createExpressServer, startupConsoleLog } from './core/http-server.js'
const expressServer = createExpressServer()

// WebSocket Server
import { create as createWsServer } from './core/websocket-server.js'
import { createServer as createHttpServer } from 'http'
const server = createWsServer(createHttpServer(expressServer))

// API
import "./routes.js"

// Run Tests
import "./test.js"

// Start Server
const port = process.env.PORT || 4620
server.listen(port, () => {
    console.log(`av-server is up and running`)
    startupConsoleLog(port)
})
