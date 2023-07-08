// Overview: websocket routes for the state.js module
// wss = websocket server
// ws  = websocket client

// Imports
import { receiveEvent, subscribe, sendEvent, unsubscribe } from '../tools/websocket-server.js'
import { db } from '../modules/db.js'

// Events
// receiveEvent("system/time", "get", async (ws, body) => {
//     subscribe(ws, "system/time")
//     sendEvent(ws, "system/time", "update", getTimeAsISO())
//     unsubscribe(ws, "system/time")
// })
