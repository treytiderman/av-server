import { writable } from 'svelte/store'

// Debug
let debug = false
function log(text) {
  if (debug) console.log(text)
}

// Global variables
let websocket = { readyState: 3 }

// Functions
function isJSON(text) {
  try { JSON.parse(text) }
  catch (error) { return false }
  return true
}
function setDebug(bool) { debug = bool }
function start(options = {}) {

  // Options
  const ip = options.ip || document.location.hostname
  const port = options.port || document.location.port
  const path = options.path || ''
  const protocol = options.protocol || document.location.protocol === 'http:' ? 'ws' : 'wss'
  const host = options.protocol === 'wss' ? `${ip}` : `${ip}:${port}`
  const url = `${protocol}://${host}/${path}`
  // const reconnectTimeout_ms = options.reconnectTimeout_ms || 5000

  // Connection request
  websocket = new WebSocket(url)
  log(`WebSocket: REQUESTED ${url}`)

  // Events
  websocket.addEventListener('open', (event) => {
    localStorage.setItem("server_offline", "false")
    log(`WebSocket: OPENED ${url}`)
  })
  websocket.addEventListener('error', (event) => {
    log(`WebSocket: ERROR ${url}`)
  })
  websocket.addEventListener('message', (event) => {
    // log(`WebSocket: MESSGAGE ${event.data}`)
  })
  websocket.addEventListener('close', (event) => {
    if (localStorage.getItem("server_offline") === "false") {
      const date = new Date()
      log(`WebSocket: CLOSED ${url} on ${date}`)
      localStorage.setItem("server_offline", date)
    }
    else {
      log(`WebSocket: STILL CLOSED ${url} on ${localStorage.getItem("server_offline")}`)
    }
    // log(`WebSocket: RECONNECTING in 5 sec... ${url}`)
    // setTimeout(() => {
    //   log(`WebSocket: TRY TO CONNECT ${url}`)
    //   start(options)
    // }, reconnectTimeout_ms)
  })

}
function send(obj) {
  if (websocket.readyState === 1) websocket.send(JSON.stringify(obj))
  else console.log("didn't send")
}
function sendGet(name) {
  send({ "name": name, "event": "get" })
}
function sendSubscribe(name) {
  send({ "name": name, "event": "subscribe" })
}
function sendUnsubscribe(name) {
  send({ "name": name, "event": "unsubscribe" })
}
function sendEvent(name, event, body = null) {
  send({ "name": name, "event": event, "body": body })
}
function sendPublish(name, body) {
  event(name, "publish", body)
}
function sendSubscribed() {
  send({ "event": "subscribed" })
}
function sendUnsubscribeAll() {
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
function receivePublish(callback) {
  receiveJSON(obj => {
    if (obj.event === "publish") {
      callback(obj.name, obj.body)
    }
  })
}
function receiveEvent(name, callback) {
  receiveJSON(obj => {
    if (obj.name === name) {
      callback(obj.event, obj.body)
    }
  })
}

// Svelte Store
function createStore() {

  // Create Store
	const { subscribe, set, update } = writable({
    "status": "",
    "time": "2022-12-23T21:32:03.004Z"
  })

  // Return WebSocket functions with a svelte store
  return {

    // Svelte Functions
		subscribe,

    // Main Functions
    setDebug,
    connect: (options) => {

      // Connect to Websocket
      start(options)

      // Events
      websocket.addEventListener('open', event => {
        update(store => {
          store["status"] = "open"
          return store
        })
      })
      websocket.addEventListener('error', event => {
        update(store => {
          store["status"] = "error"
          return store
        })
      })
      websocket.addEventListener('close', event => {
        update(store => {
          store["status"] = "close"
          return store
        })
      })
      
      // Save published and get values to the Svelte store
      receiveJSON(obj => {
        if (obj.event === "publish" || obj.event === "get") {
          update(store => {
            store[obj.name] = obj.body
            return store
          })
        }
      })

    },

    // Send Functions
    send: {
      raw: send,
      get: sendGet,
      subscribe: sendSubscribe,
      unsubscribe: sendUnsubscribe,
      unsubscribeAll: sendUnsubscribeAll,
      subscribed: sendSubscribed,
      publish: sendPublish,
      event: sendEvent,
    },

    // Receive Functions
    receive: {
      raw: receive,
      json: receiveJSON,
      publish: receivePublish,
      event: receiveEvent,
    },

  }

}

// Exports
export const ws = createStore()
