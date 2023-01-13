import { writable } from 'svelte/store'

// Global variables
let debug = false
let offline = false
let websocket = { readyState: 3 }

// Functions
function log(...params) { if (debug) console.log("ws.js |", ...params) }
function isJSON(text) {
  try { JSON.parse(text) }
  catch (error) { return false }
  return true
}
function setDebug(bool) { debug = bool }
function setOffline(bool) { offline = bool }
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
  log(`REQUESTED ${url}`)

  // Events
  websocket.addEventListener('open', (event) => {
    localStorage.setItem("server_offline", "false")
    log(`OPENED ${url}`)
  })
  websocket.addEventListener('error', (event) => {
    log(`ERROR ${url}`)
  })
  websocket.addEventListener('message', (event) => {
    if (isJSON(event.data)) log("RECEIVE", JSON.parse(event.data))
    else log("RECEIVE", event.data)
  })
  websocket.addEventListener('close', (event) => {
    if (localStorage.getItem("server_offline") === "false") {
      const date = new Date()
      log(`CLOSED ${url} on ${date}`)
      localStorage.setItem("server_offline", date)
    }
    else {
      log(`STILL CLOSED ${url} on ${localStorage.getItem("server_offline")}`)
    }
    // log(`RECONNECTING in 5 sec... ${url}`)
    // setTimeout(() => {
    //   log(`TRY TO CONNECT ${url}`)
    //   start(options)
    // }, reconnectTimeout_ms)
  })

}
function send(obj) {
  if (websocket.readyState === 1) {
    log("SEND", obj)
    websocket.send(JSON.stringify(obj))
  }
  else log("didn't send", obj)
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
  send({ "name": name, "event": "publish", "body": body })
}
function sendSubscribed() {
  send({ "event": "subscribed" })
}
function sendUnsubscribeAll() {
  send({ "name": "*", "event": "unsubscribe" })
}
function receive(callback) {
  if (websocket.readyState === 1) websocket.addEventListener('message', (event) => {
    // log("RECEIVE LISTENING", event.data`)
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
function receiveEvent(name, event, callback) {
  receiveJSON(obj => {
    if (obj.name === name && obj.event === event) {
      callback(obj.body)
    }
  })
}

// Svelte Store
function createStore() {
  let OPENED = false

  // Create Store
	const { subscribe, set, update } = writable({
    "status": "not started",
    "time": "2022-04-20T21:20:00.000Z",
    "auth": false,
    "user": {
      "username": null,
      "role": null,
    },
    "server": {}
  })

  // Return WebSocket functions with a svelte store
  return {

    // Svelte Functions
		set,
		subscribe,

    // Main Functions
    setDebug,
    setOffline,
    connect: (options) => {
      if (offline) {
        update(store => {
          store.status = "offline"
          return store
        })
        return
      }

      // Connect to Websocket
      start(options)

      // Events
      websocket.addEventListener('open', event => {
        update(store => {
          store["status"] = "open"
          return store
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
