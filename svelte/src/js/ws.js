import { writable } from 'svelte/store'

// Debug
let debug = false;
function log(text) {
  if (debug) console.log(text)
}

// Global variables
let websocket = { readyState: 3 }
let reconnectInterval

// Functions
function isJSON(text) {
  try { JSON.parse(text) }
  catch (error) { return false }
  return true
}
function setDebug(bool) { debug = bool }
function connect(options, restart = false) {

  // Options
  const path = options.path || '';
  const port = options.port || 4620;
  const ip = options.ip || document.location.hostname;
  const reconnectTimeout_ms = options.reconnectTimeout_ms || 5000;
  const protocol = options.protocol || document.location.protocol === 'http:' ? 'ws' : 'wss';
  const host = options.protocol === 'wss' ? `${ip}` : `${ip}:${port}`
  const url = `${protocol}://${host}/${path}`

  // Failed to Connect, Start reconnect Timer
  reconnectInterval = setTimeout(() => {
    log(`WebSocket ${url}: FAILED TO CONNECT`)
    log(`WebSocket ${url}: PLEASE REFRESH`)
  }, reconnectTimeout_ms)

  // Connection request
  websocket = new WebSocket(url)
  log(`WebSocket: REQUESTED at ${url}`)

  // Events
  websocket.addEventListener('open', (event) => {
    log(`WebSocket: OPEN ${url}`)
    // Connection active, Clear reconnect timer
    clearTimeout(reconnectInterval)
    if (restart) location.reload(true)
  })
  websocket.addEventListener('error', (event) => {
    log(`WebSocket: ERROR ${url}`)
  })
  websocket.addEventListener('message', (event) => {
    // log(`WebSocket: MESSGAGE ${event.data}`)
  })
  websocket.addEventListener('close', (event) => {
    log(`WebSocket: CLOSE ${url}`)
  })
}
function send(obj) {
  if (websocket.readyState === 1) websocket.send(JSON.stringify(obj))
  else console.log("didn't send");
}
function get(name) {
  send({ "name": name, "event": "get" })
}
function subscribe(name) {
  send({ "name": name, "event": "subscribe" })
}
function unsubscribe(name) {
  send({ "name": name, "event": "unsubscribe" })
}
function event(name, event, body = null) {
  send({ "name": name, "event": event, "body": body })
}
function publish(name, body) {
  event(name, "publish", body)
}
function subscribed() {
  send({ "event": "subscribed" })
}
function unsubscribeAll() {
  send({ "name": "*", "event": "unsubscribe" })
}
function receive(callback) {
  websocket.addEventListener('message', (event) => {
    callback(event.data)
  })
}
function receiveJSON(callback) {
  receive(data => {
    if (isJSON(data)) callback(JSON.parse(data))
  })
}
function receiveEvent(name, callback) {
  receiveJSON(obj => {
    if (obj.name === name) {
      callback(obj.event, obj.body)
    }
  })
}

// Exports
export const ws = {
  // Main Functions
  setDebug,
  connect,
  send,
  receive,
  // Receive Functions
  receiveJSON,
  receiveEvent,
  // Send Functions
  get,
  subscribe,
  unsubscribe,
  event,
  publish,
  subscribed,
  unsubscribeAll,
}


// -------------------------------------------------------------------


// ws.get("time")

// ws.subscribe("time")

// ws.subscribed()

// ws.unsubscribe("time")

// ws.publish("name", "body")

// ws.event("name", "event", "body")

// ws.event("/tcp/client/v1", "open", {
//   "ip": "192.168.1.246",
//   "port": 23,
//   "expectedDelimiter": "\r"
// })

// $ws["/tcp/client/v1/192.168.1.246:23"]

// ws.on("/tcp/client/v1/192.168.1.246:23", (event, body) => {
//   if (event === "open") {
    
//   }
//   else if (event === "receive") {
//     data.lines.push(body)
//   }
// })



// const sliderChange = throttle(volume => {
//   ws.debug(`Audio id ${volume.id} "${volume.label}" set to ${volume.slider.value}${volume.slider.units}`)
//   ws.analog(wsSub, volume.id, volume.slider.value)
// }, 100)

// // Websocket - SIMPL Feedback
// let wsSub = config.simplSubscriptionID ?? config.file
// ws.addSubscription(wsSub, rx => {
//   volumes.forEach(volume => {
//     volume.mute.state = rx.digital[volume.id]
//     volume.slider.value = rx.analog[volume.id]
//   })
//   volumes = volumes
// })


