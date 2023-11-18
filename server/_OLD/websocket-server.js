// Overview: websocket server for events

// Todos
// Change for multiple servers
// Use db.js

// Imports
import { WebSocketServer, WebSocket } from 'ws'
import { EventEmitter } from 'events'
import { createServer as createHttpServer } from 'http'
import { Logger } from '../modules/logger.js'

// Export
export {
    emitter,
    create,

    send,
    sendAll,
    receive,

    subscribe,
    subscriptions,
    unsubscribe,

    sendJson,
    sendPath,
    sendPathIfSub,
    sendAllJson,
    sendAllPath,
    sendAllPathIfSub,
    receiveJson,
    receivePath,
}

// Variables
const log = new Logger("websocket-server.js")
const emitter = new EventEmitter()
let wsServer = { clients: [] }

// Startup
emitter.setMaxListeners(100) // number of receive uses

// Helper Functions
function isJSON(text) {
    try { JSON.parse(text) }
    catch (error) { return false }
    return true
}

// Functions
function create(server) {
    // const server = createHttpServer(app)
    wsServer = new WebSocketServer({ server: server })

    // Events
    wsServer.on('connection', onConnection)
    wsServer.on('close', () => clearInterval(interval))

    // Send out a ping to all clients every 30 sec
    const interval = setInterval(() => {
        wsServer.clients.forEach(ws => {
            // Terminate if client didn't pong to the last ping
            if (ws.isAlive === false) return ws.terminate()
            ws.isAlive = false
            // Ping client to see if they are still here
            ws.ping()
        })
    }, 30 * 1000)

    // Return
    return server
}
function onConnection(ws, req) {

    // New connection
    ws.ip = req.socket.remoteAddress.split('f:')[1]
    ws.subs = []
    ws.auth = false
    log.debug(`new connection ${ws.ip}`, { "clients": wsServer.clients.size })

    // Listen for pong
    ws.isAlive = true
    ws.on('pong', () => ws.isAlive = true)
    ws.on('ping', () => ws.pong())

    // Received message from client
    ws.on('message', (data) => onReceive(ws, data))

    // Client is no longer connected
    ws.on('close', () => {
        ws.auth = false
        log.debug(`closed connection ${ws.ip}`, { "clients": wsServer.clients.size })
    })

}
function onReceive(ws, data) {
    emitter.emit("recieve", ws, data)
}

function receive(callback) {
    emitter.on("recieve", (ws, data) => {
        callback(ws, data)
    })
}

function send(ws, data) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(data)
    }
}
function sendAll(data) {
    wsServer.clients.forEach(ws => {
        send(ws, data)
    })
}

function subscriptions(ws) {
    sendPath(ws, "subscriptions", ws.subs)
    // log.debug(`subscriptions ${ws.ip}`, ws.subs)
}
function subscribe(ws, path) {
    if (ws.subs.indexOf(path) !== -1) return "already subscribed"
    ws.subs.push(path)
    subscriptions(ws)
    // log.debug(`subscribe ${ws.ip}`, path)
}
function unsubscribe(ws, path) {
    if (path === "*") ws.subs = []
    else ws.subs = ws.subs.filter(sub => sub !== path)
    subscriptions(ws)
    // log.debug(`unsubscribe ${ws.ip}`, path)
}


function receiveJson(callback) {
    receive((ws, data) => {
        if (isJSON(data)) {
            callback(ws, JSON.parse(data))
        }
    })
}

function sendJson(ws, obj) {
    send(ws, JSON.stringify(obj))
}
function sendPath(ws, path, body) {
    sendJson(ws, { "path": path, "body": body })
}
function sendPathIfSub(ws, path, body) {
    if (ws.subs.includes(path)) sendPath(ws, path, body)
}
function sendAllJson(obj) {
    wsServer.clients.forEach(ws => {
        sendJson(ws, obj)
    })
}

// Api
// {
//   "path": "string",
//   "body": "string" or [] or {}
// }
function receivePath(path, callback) {
    receiveJson((ws, obj) => {
        if (obj.path === path) {
            callback(ws, obj.path, obj.body)
        }
    })
}
function sendAllPath(path, body) {
    wsServer.clients.forEach(ws => {
        sendPath(ws, path, body)
    })
}
function sendAllPathIfSub(path, body) {
    wsServer.clients.forEach(ws => {
        sendPathIfSub(ws, path, body)
    })
}