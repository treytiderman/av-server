// HTTP Server
import { create as createHttpServer, startupConsoleLog } from './http-server.js'
const httpServer = createHttpServer()
// import { router } from './http-routes.js'
// httpServer.use(router)

// WebSocket Server
import { create as createWsServer } from './websocket-server.js'
const server = createWsServer(httpServer)
import "./websocket-routes.js"

// Start Server
const port = process.env.PORT || 4620
server.listen(port, () => {
    console.log(`av-server is up and running`)
    startupConsoleLog(port)
})
