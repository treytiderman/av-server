// Overview: websocket server

// Imports
import { Logger } from '../modules/logger.js'
import { EventEmitter } from 'events'
import { WebSocketServer } from 'ws'

// Export
export {
    emitter, // open, close, error, data
    create,
    send,
    sendAll,
}

// Variables
const log = new Logger("core/websocket-server.js")
const emitter = new EventEmitter()
let wss

// Functions
function create(httpServer, callback = () => {}) {
    log.info(`trying create(httpServer)`);

    // Create
    wss = new WebSocketServer({ server, httpServer })

    // Events
    wss.on('listening', () => {
        log.info(`create(httpServer) -> "ok"`);
        callback(wss)
    })
    wss.on('connection', (client, req) => {
        client.ip = req.socket.remoteAddress.split('f:')[1]
        client.id = new Date.now()
        log.debug(`client ${client.ip} connected`)
        clientEvents(client, req)
    })
    wss.on('error', (error) => {
        log.info(`create(httpServer) -> ${error.message}`, error);
    })

    return wss
}
function clientEvents(client, req) {
    emitter.emit("open", client, req)

    client.on('message', (data) => {
        emitter.emit("data", client, data)
    })
    client.on('error', (error) => {
        log.debug(`client ${client.ip} error`)
        emitter.emit("error", client, error)
    })
    client.on('close', () => {
        log.debug(`client ${client.ip} closed connection`)
        emitter.emit("close", client)
    })
}
function send(client, data) {
    if (client.readyState === WebSocket.OPEN) {
        client.send(data)
    }
}
function sendAll(data) {
    wss.clients.forEach(client => {
        client.send(data)
    })
}
