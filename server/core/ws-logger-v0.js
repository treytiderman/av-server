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
import { emitter, debug, info, error, getHistory, deleteLogs } from '../modules/logger.js'
import { isAdmin } from './ws-users-v0.js'

// logger/v0/topic
receivePath("logger/v0/topic/logs", async (ws, path, body) => {
    if (body === "unsub") {
        unsubscribe(ws, path)
    } else if (body === "sub") {
        subscribe(ws, path)
    }

    sendPath(ws, path, getHistory(1)[0])
})
receivePath("logger/v0/topic/logs/history", async (ws, path, body) => {
    if (body === "unsub") {
        unsubscribe(ws, path)
    } else if (body === "sub") {
        subscribe(ws, path)
    }

    sendPath(ws, path, getHistory())
})

// logger/v0/func
receivePath("logger/v0/func/debug", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        try {
            await debug(body.group, body.message, body.obj)
            sendPath(ws, path, "ok")
        } catch (error) {
            sendPath(ws, path, error.message)
        }
    }
})
receivePath("logger/v0/func/info", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        try {
            await info(body.group, body.message, body.obj)
            sendPath(ws, path, "ok")
        } catch (error) {
            sendPath(ws, path, error.message)
        }
    }
})
receivePath("logger/v0/func/error", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        try {
            await error(body.group, body.message, body.obj)
            sendPath(ws, path, "ok")
        } catch (error) {
            sendPath(ws, path, error.message)
        }
    }
})
receivePath("logger/v0/func/delete-logs", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        try {
            await deleteLogs()
            sendPath(ws, path, "ok")
        } catch (error) {
            sendPath(ws, path, error.message)
        }
    }
})

// Updates
emitter.on("log", (data) => {
    sendAllPathIfSub("logger/v0/topic/logs", data)
    sendAllPathIfSub("logger/v0/topic/logs/history", getHistory())
})
