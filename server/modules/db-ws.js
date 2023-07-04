// Overview: websocket routes for the state.js module
const { State } = require('./state')

// wss = websocket server
// ws  = websocket client
const wss = require('../tools/websocket-server')

// Events
// wss.receiveEvent("system/time", "get", async (ws, body) => {
//     wss.subscribe(ws, "system/time")
//     wss.sendEvent(ws, "system/time", "update", getTimeAsISO())
//     wss.unsubscribe(ws, "system/time")
// })
