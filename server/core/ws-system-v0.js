// Overview: websocket routes for the system.js module

// Imports
import {
    receivePath,
    sendPath,
    sendPathIfSub,
    sendAllPath,
    sendAllPathIfSub,
    subscribe,
    unsubscribe,
} from './websocket-server.js'
import { getSystemInfo, getTime, getTimeAsISO, getUptime, emitter } from '../modules/system.js'
import { isAdmin } from './ws-users-v0.js'

// system/v0/topic
receivePath("system/v0/topic/time", async (ws, path, body) => {
    if (body === "unsub") {
        unsubscribe(ws, path)
    } else if (body === "sub") {
        subscribe(ws, path)
    }

    sendPath(ws, path, getTime())
})
receivePath("system/v0/topic/time-as-iso", async (ws, path, body) => {
    if (body === "unsub") {
        unsubscribe(ws, path)
    } else if (body === "sub") {
        subscribe(ws, path)
    }

    sendPath(ws, path, getTimeAsISO())
})
receivePath("system/v0/topic/uptime", async (ws, path, body) => {
    if (body === "unsub") {
        unsubscribe(ws, path)
    } else if (body === "sub") {
        subscribe(ws, path)
    }

    sendPath(ws, path, getUptime())
})
receivePath("system/v0/topic/info", async (ws, path, body) => {
    if (body === "unsub") {
        unsubscribe(ws, path)
    } else if (body === "sub") {
        subscribe(ws, path)
    }

    if (isAdmin(ws, path)) {
        sendPath(ws, path, getSystemInfo())
    }
})

// Updates
emitter.on("getTime", (data) => {
    sendAllPathIfSub("system/v0/topic/time", data)
})
emitter.on("getTimeAsISO", (data) => {
    sendAllPathIfSub("system/v0/topic/time-as-iso", data)
})
emitter.on("getUptime", (data) => {
    sendAllPathIfSub("system/v0/topic/uptime", data)
})
emitter.on("getSystemInfo", (data) => {
    sendAllPathIfSub("system/v0/topic/info", data)
})
