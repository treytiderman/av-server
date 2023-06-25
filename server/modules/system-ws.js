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
    wss.sendEvent(ws, "system/time", "get", getTimeAsISO())
    wss.unsubscribe(ws, "system/time")
})
wss.receiveEvent("system/time", "sub", async (ws, body) => {
    wss.subscribe(ws, "system/time")
    wss.sendEvent(ws, "system/time", "sub", getTimeAsISO())
})
setInterval(() => {
    wss.sendEventAll("system/time", "pub", getTimeAsISO())
}, 1000);

wss.receiveEvent("system/uptime", "get", async (ws, body) => {
    wss.subscribe(ws, "system/uptime")
    wss.sendEvent(ws, "system/uptime", "get", getUptime())
    wss.unsubscribe(ws, "system/uptime")
})
wss.receiveEvent("system/uptime", "sub", async (ws, body) => {
    wss.subscribe(ws, "system/uptime")
    wss.sendEvent(ws, "system/uptime", "sub", getUptime())
})
setInterval(() => {
    wss.sendEventAll("system/uptime", "pub", getUptime())
}, 1000);

wss.receiveEvent("system/info", "get", async (ws, body) => {
    wss.subscribe(ws, "system/info")
    wss.sendEvent(ws, "system/info", "get", getSystemInfo())
    wss.unsubscribe(ws, "system/info")
})
wss.receiveEvent("system/info", "sub", async (ws, body) => {
    wss.subscribe(ws, "system/info")
    wss.sendEvent(ws, "system/info", "sub", getSystemInfo())
})
setInterval(() => {
    wss.sendEventAll("system/info", "pub", getSystemInfo())
}, 1000);
