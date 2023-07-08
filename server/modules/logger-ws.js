// Overview: websocket routes for the logger.js module
// wss = websocket server
// ws  = websocket client

// Imports
import { receiveEvent, sendEvent, subscribe, unsubscribe, sendEventAll } from '../tools/websocket-server.js'
import { log, emitter } from '../modules/logger.js'
import { getStats, readText } from '../modules/files.js'

// Events
receiveEvent("logger/files-available", "get", async (ws, body) => {
    if (!ws.auth) sendEvent(ws, "logger/files-available", "get", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) sendEvent(ws, "logger/files-available", "get", "error not in group admins")
    else {
        const response = await getStats("../private/logs")
        subscribe(ws, "logger/files-available")
        sendEvent(ws, "logger/files-available", "get", response)
        unsubscribe(ws, "logger/files-available")
    }
})
receiveEvent("logger/file", "get", async (ws, body) => {
    if (!ws.auth) sendEvent(ws, "logger/file", "get", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) sendEvent(ws, "logger/file", "get", "error not in group admins")
    else {
        const response = await readText("../private/logs/" + body.file)
        subscribe(ws, "logger/file")
        sendEvent(ws, "logger/file", "get", response)
        unsubscribe(ws, "logger/file")
    }
})

receiveEvent("logger", "new", async (ws, body) => {
    if (!ws.auth) sendEvent(ws, "logger", "new", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) sendEvent(ws, "logger", "new", "error not in group admins")
    else {
        await log(body.group, body.message, body.obj)
        subscribe(ws, "logger")
        sendEvent(ws, "logger", "new", "ok")
    }
})
receiveEvent("logger", "sub", async (ws, body) => {
    if (!ws.auth) sendEvent(ws, "logger", "sub", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) sendEvent(ws, "logger", "sub", "error not in group admins")
    else {
        subscribe(ws, "logger")
        sendEvent(ws, "logger", "sub", "ok")
    }
})
emitter.on("log", (logObj) => {
    sendEventAll("logger", "pub", logObj)
})
