// Overview: websocket routes for the logger.js module
const { log, emitter } = require('./logger')
const { getStats, readText } = require('./files')

// wss = websocket server
// ws  = websocket client
const wss = require('../tools/websocket-server')

// Events
wss.receiveEvent("logger/files-available", "get", async (ws, body) => {
    if (!ws.auth) wss.sendEvent(ws, "logger/files-available", "get", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) wss.sendEvent(ws, "logger/files-available", "get", "error not in group admins")
    else {
        const response = await getStats("../private/logs")
        wss.subscribe(ws, "logger/files-available")
        wss.sendEvent(ws, "logger/files-available", "get", response)
        wss.unsubscribe(ws, "logger/files-available")
    }
})
wss.receiveEvent("logger/file", "get", async (ws, body) => {
    if (!ws.auth) wss.sendEvent(ws, "logger/file", "get", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) wss.sendEvent(ws, "logger/file", "get", "error not in group admins")
    else {
        const response = await readText("../private/logs/" + body.file)
        wss.subscribe(ws, "logger/file")
        wss.sendEvent(ws, "logger/file", "get", response)
        wss.unsubscribe(ws, "logger/file")
    }
})

wss.receiveEvent("logger", "new", async (ws, body) => {
    if (!ws.auth) wss.sendEvent(ws, "logger", "new", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) wss.sendEvent(ws, "logger", "new", "error not in group admins")
    else {
        await log(body.group, body.message, body.obj)
        wss.subscribe(ws, "logger")
        wss.sendEvent(ws, "logger", "new", "ok")
    }
})
wss.receiveEvent("logger", "sub", async (ws, body) => {
    if (!ws.auth) wss.sendEvent(ws, "logger", "sub", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) wss.sendEvent(ws, "logger", "sub", "error not in group admins")
    else {
        wss.subscribe(ws, "logger")
        wss.sendEvent(ws, "logger", "sub", "ok")
    }
})
emitter.on("log", (logObj) => {
    wss.sendEventAll("logger", "pub", logObj)
})