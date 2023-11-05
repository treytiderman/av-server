// Overview: api wrapper for system.js module

// Imports
import * as api from '../modules/api.js'
import * as logger from '../modules/logger.js'

// Functions
api.receive("logger/v0/func/debug", async (client, path, body, params) => {
    if (api.isAdmin(client, path)) {
        try {
            await logger.debug(body.group, body.message, body.obj)
            client.sendPath(path, "ok")
        } catch (error) {
            client.sendPath(path, error.message)
        }
    }
})
api.receive("logger/v0/func/info", async (client, path, body, params) => {
    if (api.isAdmin(client, path)) {
        try {
            await logger.info(body.group, body.message, body.obj)
            client.sendPath(path, "ok")
        } catch (error) {
            client.sendPath(path, error.message)
        }
    }
})
api.receive("logger/v0/func/error", async (client, path, body, params) => {
    if (api.isAdmin(client, path)) {
        try {
            await logger.error(body.group, body.message, body.obj)
            client.sendPath(path, "ok")
        } catch (error) {
            client.sendPath(path, error.message)
        }
    }
})
api.receive("logger/v0/func/delete-logs", async (client, path, body, params) => {
    if (api.isAdmin(client, path)) {
        try {
            await logger.deleteLogs()
            client.sendPath(path, "ok")
        } catch (error) {
            client.sendPath(path, error.message)
        }
    }
})

// Topics
api.receive("logger/v0/topic/data", async (client, path, body, params) => {
    if (body === "unsub") client.unsubscribe(path)
    else if (body === "sub") client.subscribe(path)
    client.sendPath(path, logger.getHistory(1)[0])
})
api.receive("logger/v0/topic/history", async (client, path, body, params) => {
    if (body === "unsub") client.unsubscribe(path)
    else if (body === "sub") client.subscribe(path)
    client.sendPath(path, logger.getHistory())
})

// Events
logger.emitter.on("log", (data) => {
    api.send("logger/v0/topic/data", data)
    api.send("logger/v0/topic/history", logger.getHistory())
})
