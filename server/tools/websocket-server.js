// Overview: websocket server for events

// Todos
// Change for multiple servers
// Use db.js

// Structure
// {
//   "topic": "string",
//   "event": "string",
//   "body": "string" or [] or {}
//   "error": "string" // only sent on errors
// }

// Imports
import { WebSocketServer } from 'ws'
import { EventEmitter } from 'events'
import { createServer as createHttpServer } from 'http'

// import { getDatabase, saveDatabase, resetDatabase } from '../modules/db.js'
import { Logger } from '../modules/logger.js'

// Export
export {
    emitter,
    create,
    send,
    sendJSON,
    sendEvent,
    sendEventAll,
    receiveTopic,
    receiveEvent,
    subscribe,
    subscriptions,
    unsubscribe,
}

// Variables
const log = new Logger("websocket-server.js")
const emitter = new EventEmitter()
emitter.setMaxListeners(100) // number of receiveTopic() and receiveEvent() uses
let wsServer
// const DEFAULT_STATE = { wsServers: {} }
// const db = await getDatabase('websocket-server', DEFAULT_STATE)

// Helper Functions
function isJSON(text) {
    try { JSON.parse(text) }
    catch (error) { return false }
    return true
}

// Functions
function create(app) {
    const server = createHttpServer(app)
    wsServer = new WebSocketServer({ server: server })

    // Events
    wsServer.on('connection', newConnection)
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
function newConnection(ws, req) {

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
    ws.on('message', (data) => receive(ws, data))

    // Client is no longer connected
    ws.on('close', () => {
        ws.auth = false
        log.debug(`closed connection ${ws.ip}`, { "clients": wsServer.clients.size })
    })

}
function receive(ws, data) {
    if (isJSON(data)) {
        receiveJSON(ws, JSON.parse(data))
    }
    else {
        const response = "invalid JSON"
        log.debug(`receive ${ws.ip}`, response)
        sendJSON(ws, response)
    }
}
function receiveJSON(ws, rx) {
    if (rx.event === "subscribe") subscribe(ws, rx.topic)
    else if (rx.event === "subscriptions") subscriptions(ws)
    else if (rx.event === "unsubscribe") unsubscribe(ws, topic)
    else {
        emitter.emit(rx.topic, ws, rx.event, rx.body)
        log.debug(`receive ${ws.ip}`, rx)
    }
}
function receiveTopic(topic, cb) {
    emitter.on(topic, async (ws, event, body) => {
        cb(ws, event, body)
    })
}
function receiveEvent(topic, event, cb) {
    emitter.on(topic, async (ws, eventEmitted, body) => {
        if (event === eventEmitted) cb(ws, body)
    })
}
function send(ws, payload) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(payload)
        // log.debug(`send ${ws.ip}`, payload)
    }
}
function sendJSON(ws, obj) {
    ws.send(JSON.stringify(obj))
    log.debug(`sendJSON ${ws.ip}`, JSON.stringify(obj))
}
function sendEvent(ws, topic, event, body) {
    if (ws.subs.includes(topic)) {
        const tx = {
            "topic": topic,
            "event": event,
            "body": body ?? null
        }
        sendJSON(ws, tx)
    }
}
function sendEventAll(topic, event, body) {
    wsServer.clients.forEach(ws => {
        if (ws.subs.includes(topic)) {
            const tx = {
                "topic": topic,
                "event": event,
                "body": body ?? null
            }
            sendJSON(ws, tx)
        }
    })
}
function subscriptions(ws) {
    sendEvent(ws, "client", "subscriptions", ws.subs)
    // log.debug(`subscriptions ${ws.ip}`, ws.subs)
}
function subscribe(ws, topic) {
    if (ws.subs.indexOf(topic) !== -1) return "already subscribed"
    ws.subs.push(topic)
    subscriptions(ws)
    log.debug(`subscribe ${ws.ip}`, topic)
}
function unsubscribe(ws, topic) {
    if (topic === "*") ws.subs = []
    else ws.subs = ws.subs.filter(sub => sub !== topic)
    subscriptions(ws)
    log.debug(`unsubscribe ${ws.ip}`, topic)
}
