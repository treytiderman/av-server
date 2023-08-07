// Overview: websocket routes for the logger.js module
// wss = websocket server
// ws  = websocket client

// Imports
import { receiveEvent, sendEvent, subscribe, unsubscribe, sendEventAll } from '../tools/websocket-server.js'
import { log, emitter } from '../modules/logger.js'
import { getStats, readText } from '../modules/files.js'
import { isAdmin } from "../modules/users-ws.js";

// Events
receiveEvent("logger/files-available", "get", async (ws, body) => {
    if (isAdmin(ws, "logger/files-available", "get")) {
        const response = await getStats("../private/logs")
        subscribe(ws, "logger/files-available")
        sendEvent(ws, "logger/files-available", "get", response)
        unsubscribe(ws, "logger/files-available")
    }
})
receiveEvent("logger/file", "get", async (ws, body) => {
    if (isAdmin(ws, "logger/file", "get")) {
        const response = await readText("../private/logs/" + body.file)
        subscribe(ws, "logger/file")
        sendEvent(ws, "logger/file", "get", response)
        unsubscribe(ws, "logger/file")
    }
})

receiveEvent("logger", "new", async (ws, body) => {
    if (isAdmin(ws, "logger", "new")) {
        await log(body.group, body.message, body.obj)
        subscribe(ws, "logger")
        sendEvent(ws, "logger", "new", "ok")
    }
})
receiveEvent("logger", "sub", async (ws, body) => {
    if (isAdmin(ws, "logger", "sub")) {
        subscribe(ws, "logger")
        sendEvent(ws, "logger", "sub", "ok")
    }
})
// emitter.on("log", (logObj) => {
//     sendEventAll("logger", "pub", logObj)
// })
