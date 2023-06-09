const WebSocket = require('ws')
const events = require('events')
let wsServer

// Variables
const emitter = new events.EventEmitter()

// Helper Functions
const logInConsole = false
const logger = require('./logger')
function log(text, obj = {}) {
    logger.log("websocket", text, obj)
    if (logInConsole) { console.log("websocket", text, obj) }
}
function isJSON(text) {
    try { JSON.parse(text) }
    catch (error) { return false }
    return true
}

// Functions
function create(app) {
    const server = require('http').createServer(app)
    wsServer = new WebSocket.Server({ server: server })

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

    // API Routes
    require('./websocket-routes')

    // Return
    return server
}
function newConnection(ws, req) {

    // New connection
    ws.ip = req.socket.remoteAddress.split('f:')[1]
    ws.subs = []
    log(`new connection ${ws.ip}`, { "clients": wsServer.clients.size })

    // Listen for pong
    ws.isAlive = true
    ws.on('pong', () => ws.isAlive = true)
    ws.on('ping', () => ws.pong())

    // Received message from client
    ws.on('message', (data) => receive(ws, data))

    // Client is no longer connected
    ws.on('close', () => {
        log(`closed connection ${ws.ip}`, { "clients": wsServer.clients.size })
    })

}
function receive(ws, data) {
    if (isJSON(data)) {
        receiveJSON(ws, JSON.parse(data))
    }
    else {
        const response = "invalid JSON"
        log(`receive ${ws.ip}`, response)
        sendJSON(ws, response)
    }
}
function receiveJSON(ws, rx) {
    // rx-example = {
    //   "topic": "time",
    //   "event": "get",
    //   "body": "if needed"
    // }

    if (rx.event === "subscribe") subscribe(ws, rx.topic)
    else if (rx.event === "subscribed") subscribed(ws)
    else if (rx.event === "unsubscribe") unsubscribe(ws, topic)
    else {
        emitter.emit(rx.topic, ws, rx.event, rx.body)
        log(`receive ${ws.ip}`, rx)
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
        // log(`send ${ws.ip}`, payload)
    }
}
function sendJSON(ws, obj) {
    ws.send(JSON.stringify(obj))
    log(`sendJSON ${ws.ip}`, JSON.stringify(obj))
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
    const payload = { "topic": "client", "event": "subscriptions", "body": ws.subs }
    sendJSON(ws, payload)
    // log(`subscriptions ${ws.ip}`, ws.subs)
}
function subscribe(ws, topic) {
    if (ws.subs.indexOf(topic) !== -1) return "already subscribed"
    ws.subs.push(topic)
    subscriptions(ws)
    log(`subscribe ${ws.ip}`, topic)
}
function unsubscribe(ws, topic) {
    if (topic === "*") ws.subs = []
    else ws.subs = ws.subs.filter(sub => sub !== topic)
    subscriptions(ws)
    log(`unsubscribe ${ws.ip}`, topic)
}

// Export
exports.emitter = emitter
exports.create = create
exports.send = send
exports.sendJSON = sendJSON
exports.sendEvent = sendEvent
exports.sendEventAll = sendEventAll
exports.receiveTopic = receiveTopic
exports.receiveEvent = receiveEvent
exports.subscribe = subscribe
exports.subscriptions = subscriptions
exports.unsubscribe = unsubscribe

/* Examples

// HTTP Server
const http = require('./core/http-server')
const http_server = http.create()

// WebSocket Server
const ws = require('./core/websocket-server')
const server = ws.create(http_server)

// Start Server
const port = process.env.port || 4620
server.listen(port, () => {
    console.log(`AV-Tools server is up and running`)
    http.startupConsoleLog(port)
})

*/