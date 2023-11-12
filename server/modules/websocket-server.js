// Overview: websocket server

// Imports
import { Logger } from '../modules/logger.js'
import { EventEmitter } from 'events'
import { createDatabase, resetDatabase } from './database.js'
import { WebSocketServer, WebSocket } from 'ws'
import { createServer as createHttpServer } from 'http'

// Export
export {
    emitter,
    create,
}

// Constants
const DEFAULT_STATE = { servers: {} }

// Variables
const log = new Logger("modules/websocket-server.js")
const emitter = new EventEmitter()
const wss = {}
const db = DEFAULT_STATE
// let db = await createDatabase('websocket-server', DEFAULT_STATE)

// Functions
function create(port, path, callback = () => {}) {
    log.info(`trying create("${port}", "${path}")`);

    // Create
    db.servers[port + path] = { port: port, path: path, listening: false, clients: 0 }
    wss[port + path] = new WebSocketServer({ port: port, path: path })

    // Events
    wss[port + path].on('listening', () => {
        db.servers[port + path].listening = true
        log.info(`create("${port}", "${path}") -> "ok"`);
        callback(port, path)
    })
    wss[port + path].on('connection', (client, req) => {
        client.ip = req.socket.remoteAddress.split('f:')[1]
        db.servers[port + path].clients = wss[port + path].clients.size
        emitter.emit("client", port, path, client)
        log.debug(`client ${client.ip} connected to ${port + path}`)
        clientEvents(port, path, client)
    })
    wss[port + path].on('error', (error) => {
        log.info(`create("${port}", "${path}") -> ${error.message}`, error);
    })

    return "ok"
}
function clientEvents(port, path, client) {
    client.on('message', (data) => {
        emitter.emit("recieve", port, path, client, data)
    })
    client.on('error', (error) => {
        log.debug(`client ${client.ip} error ${port + path}`)
        emitter.emit("error", port, path, client, error)
    })
    client.on('close', () => {
        log.debug(`client ${client.ip} closed connection to ${port + path}`)
        emitter.emit("close", port, path, client)
    })
}
