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
const CLIENT_GET_OBJ = {
  "method": "get",
  "data": "server_uptime"
}
const CLIENT_SUBSCRIBE_OBJ = {
  "method": "subscribe",
  "data": "server_uptime"
}
const CLIENT_SUBSCRIBED_OBJ = {
  "method": "subscribed",
  "data": ""
}
const CLIENT_UNSUBSCRIBE_OBJ = {
  "method": "unsubscribe",
  "data": "server_uptime"
}
const CLIENT_UNSUBSCRIBE_ALL_OBJ = {
  "method": "unsubscribeAll",
  "data": ""
}
const CLIENT_API_CALL_OBJ = {
  "method": "/api/v1/time",
  "data": "whatever data goes with the function"
}
const SERVER_PUBLISH_OBJ = {
  "server_uptime": "value"
}

// Helper Functions
function log(text) {
  console.log(text)
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
      receiveData(ws, JSON.parse(data))
    }
    else {
      log(`${ws.ip} sent invalid JSON`)
    }
  })

  // Client is no longer connected
  ws.on('close', () => {
    log(`closed connection ${ws.ip} | ${wsServer.clients.size} client(s)`)
  })

}
function receiveData(ws, req) {
  
  // Get a value in the store
  if (req.method === "get") {
    log(`get ${ws.ip} ${req.data}`)
    send(ws, req)
    publish(ws, req.data)
  }

  // Subscribe to a value in the store
  else if (req.method === "subscribe") {
    log(`subscribe ${ws.ip} ${req.data}`)
    ws.subs.push(req.data)
    send(ws, req)
    publish(ws, req.data)
  }

  // Get all subscriptions
  else if (req.method === "subscribed") {
    req.data = ws.subs
    send(ws, req)
  }

  // Unsubscribe from a value in the store
  else if (req.method === "unsubscribe") {
    log(`unsubscribe ${ws.ip} ${req.data}`)
    ws.subs = ws.subs.filter(sub => sub !== req.data)
    send(ws, req)
  }

  // Unsubscribe from everything
  else if (req.method === "unsubscribeAll") {
    log(`unsubscribeAll ${ws.ip} ${JSON.stringify(ws.subs)}`)
    req.data = ws.subs
    send(ws, req)
    ws.subs = []
  }

  // Emit event for external module
  else if (req?.method) {
    log(`emit event ${ws.ip} ${req.method} data ${req.data}`)
    emitter.emit(req.method, ws, req)
  }

}
function send(ws, obj) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(obj))
    log(`send ${ws.ip} ${JSON.stringify(obj)}`)
  }
}
function publish(ws, sub) {
  const obj = {[sub]: store[sub] || null}
  send(ws, obj)
}
function set(sub, value) {
  // Update and publish to all subscribed clients
  store[sub] = value
  wsServer.clients.forEach(ws => {
    if (ws.subs.includes(sub)) publish(ws, sub)
  })
  // log(`store update ${sub}, ${value}`)
}

// Global uptime
let globalCount = 0
setInterval(() => {
  globalCount++
  set("uptime", globalCount)
  set("time", new Date(Date.now()).toISOString())
}, 1000)

// Export
exports.start = start
exports.set = set
exports.emitter = emitter

/* Examples

// express - Web server
const http = require('./modules/http')
const app = http.start()
app.use(http.middlware)

// ws - WebSockets
const ws = require('./modules/ws')
const server = ws.start(app)

*/