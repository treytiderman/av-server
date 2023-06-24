// Overview: websocket routes for the system.js module
const {
    // isAdmin,
    // getTime,
    getTimeAsISO,
    getUptime,
    // getNICs,
    // getOS,
    getSystemInfo
} = require('./system')

// wss = websocket server
// ws  = websocket client
const wss = require('../tools/websocket-server')

// Events
wss.receiveEvent("system/time", "get", async (ws, body) => {
    wss.subscribe(ws, "system/time")
    wss.sendEvent(ws, "system/time", "update", getTimeAsISO())
    wss.unsubscribe(ws, "system/time")
})
wss.receiveEvent("system/time", "subscribe", async (ws, body) => {
    wss.subscribe(ws, "system/time")
    wss.sendEvent(ws, "system/time", "update", getTimeAsISO())
})
setInterval(() => {
    wss.sendEventAll("system/time", "update", getTimeAsISO())
}, 1000);

wss.receiveEvent("system/uptime", "get", async (ws, body) => {
    wss.subscribe(ws, "system/uptime")
    wss.sendEvent(ws, "system/uptime", "update", getUptime())
    wss.unsubscribe(ws, "system/uptime")
})
wss.receiveEvent("system/uptime", "subscribe", async (ws, body) => {
    wss.subscribe(ws, "system/uptime")
    wss.sendEvent(ws, "system/uptime", "update", getUptime())
})
setInterval(() => {
    wss.sendEventAll("system/uptime", "update", getUptime())
}, 1000);

wss.receiveEvent("system/info", "get", async (ws, body) => {
    wss.subscribe(ws, "system/info")
    wss.sendEvent(ws, "system/info", "update", getSystemInfo())
    wss.unsubscribe(ws, "system/info")
})
wss.receiveEvent("system/info", "subscribe", async (ws, body) => {
    wss.subscribe(ws, "system/info")
    wss.sendEvent(ws, "system/info", "update", getSystemInfo())
})
setInterval(() => {
    wss.sendEventAll("system/info", "update", getSystemInfo())
}, 1000);
