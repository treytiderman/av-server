// Overview: api wrapper for system.js module

// Imports
import * as api from '../modules/api.js'
import * as logger from '../modules/logger.js'

// Functions
api.receiveAdmin("/logger/v0/func/debug/", async (client, path, body, params) => {
    try {
        await logger.debug(body.group, body.message, body.obj)
        client.send(path, "ok")
    } catch (error) {
        client.send(path, error.message)
    }
})
api.receiveAdmin("/logger/v0/func/info/", async (client, path, body, params) => {
    try {
        await logger.info(body.group, body.message, body.obj)
        client.send(path, "ok")
    } catch (error) {
        client.send(path, error.message)
    }
})
api.receiveAdmin("/logger/v0/func/error/", async (client, path, body, params) => {
    try {
        await logger.error(body.group, body.message, body.obj)
        client.send(path, "ok")
    } catch (error) {
        client.send(path, error.message)
    }
})
api.receiveAdmin("/logger/v0/func/delete-logs/", async (client, path, body, params) => {
    try {
        await logger.deleteLogs()
        client.send(path, "ok")
    } catch (error) {
        client.send(path, error.message)
    }
})

// Topics
api.receiveAdmin("/logger/v0/topic/data/", async (client, path, body, params) => {
    client.send(path, logger.getHistory(1)[0])
})
api.receiveAdmin("/logger/v0/topic/history/", async (client, path, body, params) => {
    client.send(path, logger.getHistory())
})

// Events
logger.emitter.on("log", (data) => {
    api.send("/logger/v0/topic/data/", data)
    api.send("/logger/v0/topic/history/", logger.getHistory())
})
