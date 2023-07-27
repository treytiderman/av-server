// Overview: websocket routes for the system.js module
// wss = websocket server
// ws  = websocket client

// Imports
import { receiveEvent, subscribe, sendEvent, sendEventAll, unsubscribe, send, sendAll } from '../tools/websocket-server.js'
import {
    // isAdmin,
    getTime,
    getTimeAsISO,
    getUptime,
    // getNICs,
    // getOS,
    getSystemInfo
} from '../modules/system.js'

// Events
receiveEvent("system/time", "get", async (ws, body) => {
    subscribe(ws, "system/time")
    sendEvent(ws, "system/time", "get", getTime())
    unsubscribe(ws, "system/time")
})
receiveEvent("system/time", "sub", async (ws, body) => {
    subscribe(ws, "system/time")
    sendEvent(ws, "system/time", "sub", getTime())
})
setInterval(() => {
    sendEventAll("system/time", "pub", getTime())
}, 1000);

receiveEvent("system/time-as-iso", "get", async (ws, body) => {
    subscribe(ws, "system/time-as-iso")
    sendEvent(ws, "system/time-as-iso", "get", getTimeAsISO())
    unsubscribe(ws, "system/time-as-iso")
})
receiveEvent("system/time-as-iso", "sub", async (ws, body) => {
    subscribe(ws, "system/time-as-iso")
    sendEvent(ws, "system/time-as-iso", "sub", getTimeAsISO())
})
setInterval(() => {
    sendEventAll("system/time-as-iso", "pub", getTimeAsISO())
}, 1000);

receiveEvent("system/uptime", "get", async (ws, body) => {
    subscribe(ws, "system/uptime")
    sendEvent(ws, "system/uptime", "get", getUptime())
    unsubscribe(ws, "system/uptime")
})
receiveEvent("system/uptime", "sub", async (ws, body) => {
    subscribe(ws, "system/uptime")
    sendEvent(ws, "system/uptime", "sub", getUptime())
})
setInterval(() => {
    sendEventAll("system/uptime", "pub", getUptime())
}, 1000);

receiveEvent("system/info", "get", async (ws, body) => {
    subscribe(ws, "system/info")
    sendEvent(ws, "system/info", "get", getSystemInfo())
    unsubscribe(ws, "system/info")
})
receiveEvent("system/info", "sub", async (ws, body) => {
    subscribe(ws, "system/info")
    sendEvent(ws, "system/info", "sub", getSystemInfo())
})
setInterval(() => {
    sendEventAll("system/info", "pub", getSystemInfo())
}, 1000);
