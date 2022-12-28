const WebSocket = require('ws')
const events = require('events')
let wsServer

// Constants
const emitter = new events.EventEmitter()
const store = {
  time: new Date(Date.now()).toISOString(),
  uptime: 0,
  test: 'success',
}

// Helper Functions
const logInConsole = false
function log(text) {
  const logger = require('./log')
  logger.log(text, "../public/logs/", 'ws server', logInConsole)
}
function isJSON(text) {
  try { JSON.parse(text) }
  catch (error) { return false }
  return true
}

// Functions
function start(app) {
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
  require('../routes-ws/routes')

  // Return
  return server
}
function newConnection(ws, req) {

  // New connection
  ws.ip = req.socket.remoteAddress.split('f:')[1]
  ws.subs = []
  log(`new connection ${ws.ip} | ${wsServer.clients.size} client(s)`)

  // Listen for pong
  ws.isAlive = true
  ws.on('pong', () => ws.isAlive = true)
  ws.on('ping', () => ws.pong())

  // Received message from client
  ws.on('message', data => {
    if (isJSON(data)) {
      receive(ws, JSON.parse(data))
    }
    else {
      log(`Invalid JSON from ${ws.ip}`)
      const response = {
        "error": "invalid JSON",
        "try this": {
          "name": "time",
          "event": "get"
        }
      }
      send(ws, response)
    }
  })

  // Client is no longer connected
  ws.on('close', () => {
    log(`closed connection ${ws.ip} | ${wsServer.clients.size} client(s)`)
  })

}
function receive(ws, rx) {

  // Expected structure
  const example_rx = {
    "name": "time",
    "event": "get",
    "body": "if needed"
  }
  
  // Get a value in the store
  if (rx.event === "get") {
    log(`get ${ws.ip} ${rx.name}`)
    if (rx.name === "*") send(ws, {
      "name": "*",
      "event": "get",
      "body": store
    })
    else get(ws, rx.name)
  }

  // Subscribe to a value in the store
  else if (rx.event === "subscribe") {
    log(`subscribe ${ws.ip} to ${rx.name}`)
    if (ws.subs.indexOf(rx.name) === -1) ws.subs.push(rx.name)
  }

  // Get all subscriptions
  else if (rx.event === "subscribed") {
    rx.body = ws.subs
    send(ws, rx)
  }
  // Unsubscribe from a value in the store
  else if (rx.event === "unsubscribe") {
    log(`unsubscribe ${ws.ip} from ${rx.name}`)
    if (rx.name === "*") ws.subs = []
    else ws.subs = ws.subs.filter(sub => sub !== rx.name)
  }

  // Client publishes a value
  else if (rx.event === "publish") {
    log(`publish ${ws.ip} ${rx.name} = ${rx.body}`)
    store[ws.ip] = {
      [rx.name]: rx.body
    }
  }

  // Event for external module
  else {
    log(`${ws.ip} emit event ${rx.event} name ${rx.name}`)
    emitter.emit(rx.name, ws, rx)
  }

}
function send(ws, payload) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload))
    log(`send ${ws.ip} ${JSON.stringify(payload)}`)
  }
}
function get(ws, name) {
  const tx = {
    "name": name,
    "event": "get",
    "body": store[name] ?? null
  }
  send(ws, tx)
}
function publish(name, body) {
  store[name] = body
  wsServer.clients.forEach(ws => {
    if (ws.subs.includes(name)) {
      const tx = {
        "name": name,
        "event": "publish",
        "body": body ?? null
      }
      send(ws, tx)
    }
  })
}
function event(name, event, body) {
  wsServer.clients.forEach(ws => {
    if (ws.subs.includes(name)) {
      const tx = {
        "name": name,
        "event": event,
        "body": body ?? null
      }
      send(ws, tx)
    }
  })
}
function subscribe(ws, name) {
  if (ws.subs.indexOf(name) === -1) ws.subs.push(name)
}

// Global uptime
let globalCount = 0
setInterval(() => {
  globalCount++
  publish("uptime", globalCount)
  publish("time", new Date(Date.now()).toISOString())
}, 1000)

// Export
exports.emitter = emitter
exports.start = start
exports.send = send
exports.get = get
exports.event = event
exports.publish = publish
exports.subscribe = subscribe

/* Examples

// express - Web server
const http = require('./modules/http')
const app = http.start()
app.use(http.middlware)

// ws - WebSockets
const ws = require('./modules/ws')
const server = ws.start(app)

*/