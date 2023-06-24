// Overview: websocket routes for the logger.js module
// TODO: add emmiter so you can subscribe to every log() call
const { log } = require('./logger')
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
        wss.sendEvent(ws, "logger/files-available", "update", response)
        wss.unsubscribe(ws, "logger/files-available")
    }
})
wss.receiveEvent("logger/file", "get", async (ws, body) => {
    if (!ws.auth) wss.sendEvent(ws, "logger/file", "get", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) wss.sendEvent(ws, "logger/file", "get", "error not in group admins")
    else {
        const response = await readText("../private/logs/" + body.file)
        wss.subscribe(ws, "logger/file")
        wss.sendEvent(ws, "logger/file", "update", response)
        wss.unsubscribe(ws, "logger/file")
    }
})
wss.receiveEvent("logger", "log", async (ws, body) => {
    if (!ws.auth) wss.sendEvent(ws, "logger", "log", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) wss.sendEvent(ws, "logger", "log", "error not in group admins")
    else {
        const response = await log(body.group, body.message, body.obj)
        wss.subscribe(ws, "logger")
        wss.sendEvent(ws, "logger", "log", response)
    }
})
