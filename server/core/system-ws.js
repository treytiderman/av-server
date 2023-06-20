// wss = websocket server
// ws  = websocket client
const wss = require('./websocket-server')
const {
    // isAdmin,
    // getTime,
    getTimeAsISO,
    getUptime,
    // getNICs,
    // getOS,
    getSystemInfo
} = require('./system')

// Events
wss.receiveEvent("system/time", "get", async (ws, body) => {
    console.log(getTimeAsISO())
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
    wss.sendEvent(ws, "system/uptime", "update", getUptime())
})
wss.receiveEvent("system/uptime", "subscribe", async (ws, body) => {
    wss.subscribe(ws, "system/uptime")
    wss.sendEvent(ws, "system/uptime", "update", getUptime())
})
setInterval(() => {
    wss.sendEventAll("system/uptime", "update", getUptime())
}, 1000);

wss.receiveEvent("system/info", "get", async (ws, body) => {
    wss.sendEvent(ws, "system/info", "update", getSystemInfo())
})
wss.receiveEvent("system/info", "subscribe", async (ws, body) => {
    wss.subscribe(ws, "system/info")
    wss.sendEvent(ws, "system/info", "update", getSystemInfo())
})
setInterval(() => {
    wss.sendEventAll("system/info", "update", getSystemInfo())
}, 1000);
