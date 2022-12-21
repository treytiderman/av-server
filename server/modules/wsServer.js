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
function log(text) {
  // console.log(text)
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
      log(`${ws.ip} sent ${data}`)
      receive(ws, JSON.parse(data))
    }
    else {
      log(`${ws.ip} sent invalid JSON`)
      const response = {
        "error": "invalid JSON",
        "try this": {
          "request": "get",
          "name": "time"
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
    "request": "get",
    "name": "time",
    "body": "if needed"
  }
  
  // Get a value in the store
  if (rx.request === "get") {
    log(`get ${ws.ip} ${rx.name}`)
    if (rx.name === "*") send(ws, store)
    else publish(ws, rx.name)
  }

  // Subscribe to a value in the store
  else if (rx.request === "subscribe") {
    log(`subscribe ${ws.ip} to ${rx.name}`)
    if (ws.subs.indexOf(rx.name) === -1) ws.subs.push(rx.name)
    publish(ws, rx.name)
  }

  // Get all subscriptions
  else if (rx.request === "subscribed") {
    rx.body = ws.subs
    send(ws, rx)
  }

  // Unsubscribe from a value in the store
  else if (rx.request === "unsubscribe") {
    log(`unsubscribe ${ws.ip} from ${rx.name}`)
    if (rx.name === "*") ws.subs = []
    else ws.subs = ws.subs.filter(sub => sub !== rx.name)
  }

  // Emit event for external module
  else if (rx.request === "call") {
    log(`emit event ${ws.ip} ${rx.request} data ${rx.name}`)
    emitter.emit(rx.name, ws, rx)
  }

  // Client publishes a value
  else if (rx.request === "publish") {
    log(`publish ${ws.ip} ${rx.name} = ${rx.body}`)
    store[ws.ip] = {
      [rx.name]: rx.body
    }
  }

  else {
    log(`request unknown ${ws.ip}`)
    rx.error = "request unknown"
    rx.try_this = {
      "request": "get",
      "name": "time"
    }
    send(ws, rx)
  }

}
function send(ws, obj) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(obj))
    log(`send ${ws.ip} ${JSON.stringify(obj)}`)
  }
}
function publish(ws, sub) {
  const tx = {
    "name": sub,
    "body": store[sub] || null
  }
  send(ws, tx)
}
function set(sub, value) {
  // Update and publish to all subscribed clients
  store[sub] = value
  wsServer.clients.forEach(ws => {
    if (ws.subs.includes(sub)) publish(ws, sub)
  })
  // log(`store update ${sub}, ${value}`)
}
function subscribe(ws, name) {
  if (ws.subs.indexOf(name) === -1) ws.subs.push(name)
}

// Global uptime
let globalCount = 0
setInterval(() => {
  globalCount++
  set("uptime", globalCount)
  set("time", new Date(Date.now()).toISOString())
}, 1000)

// Export
exports.emitter = emitter
exports.start = start
exports.send = send
exports.set = set
exports.subscribe = subscribe
exports.publish = publish

/* Examples

// express - Web server
const http = require('./modules/http')
const app = http.start()
app.use(http.middlware)

// ws - WebSockets
const ws = require('./modules/ws')
const server = ws.start(app)

*/