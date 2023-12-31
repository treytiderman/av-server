// Overview: api wrapper for the database-v1.js module

// Imports
import * as api from './api-v1.js'
import * as logger from './logger-v0.js'

// Exports
export { routes }

// Help
const routes = [

    // Logs
    { path: "v0/log/get/" },
    { path: "v0/log/sub/" },
    { path: "v0/log/unsub/" },
    { path: "v0/log/clear/" },
    { path: "v0/log/debug/", body: { group: "group", message: "message", obj: {} } },
    { path: "v0/log/info/", body: { group: "group", message: "message", obj: {} } },
    { path: "v0/log/warn/", body: { group: "group", message: "message", obj: {} } },
    { path: "v0/log/error/", body: { group: "group", message: "message", obj: {} } },

    // History
    { path: "v0/log/history/get/" },
    { path: "v0/log/history/sub/" },
    { path: "v0/log/history/unsub/" },

    // Group
    // { path: "v0/log/group/get/:group/" },
    // { path: "v0/log/group/sub/:group/" },
    // { path: "v0/log/group/unsub/:group/" },

    // Group History
    // { path: "v0/log/group/history/get/" },
    // { path: "v0/log/group/history/sub/" },
    // { path: "v0/log/group/history/unsub/" },

]

// Events
logger.emitter.on("log", (data) => {
    api.send("v0/log/pub/", data)
    api.send("v0/log/history/pub/", logger.getHistory())
})

// Log
api.receiveAdmin("v0/log/get/", async (client, path, body, params) => {
    client.send(path, logger.getHistory(1)[0])
})
api.receiveAdmin("v0/log/sub/", async (client, path, body, params) => {
    client.sub("v0/log/pub/")    
})
api.receiveAdmin("v0/log/unsub/", async (client, path, body, params) => {
    client.unsub("v0/log/pub/")    
    client.send(path, "ok")
})
api.receiveAdmin("v0/log/clear/", async (client, path, body, params) => {
    await logger.deleteLogs()
    client.send(path, "ok")
})
api.receiveAdmin("v0/log/debug/", async (client, path, body, params) => {
    await logger.debug(body.group, body.message, body.obj)
    client.send(path, "ok")
})
api.receiveAdmin("v0/log/info/", async (client, path, body, params) => {
    await logger.info(body.group, body.message, body.obj)
    client.send(path, "ok")
})
api.receiveAdmin("v0/log/warn/", async (client, path, body, params) => {
    await logger.warn(body.group, body.message, body.obj)
    client.send(path, "ok")
})
api.receiveAdmin("v0/log/error/", async (client, path, body, params) => {
    await logger.error(body.group, body.message, body.obj)
    client.send(path, "ok")
})

// History
api.receiveAdmin("v0/log/history/get/", async (client, path, body, params) => {
    client.send(path, logger.getHistory())
})
api.receiveAdmin("v0/log/history/sub/", async (client, path, body, params) => {
    client.send(path, logger.getHistory())
    client.sub("v0/log/history/pub/")
})
api.receiveAdmin("v0/log/history/unsub/", async (client, path, body, params) => {
    client.send(path, logger.getHistory())
})
