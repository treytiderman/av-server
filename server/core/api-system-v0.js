// Overview: api wrapper for system.js module

// Imports
import * as api from '../modules/api.js'
import * as system from '../modules/system.js'

// Topics
api.receive("/system/v0/topic/time/", async (client, path, body) => {
    client.send(path, system.getTime())
})
api.receive("/system/v0/topic/time-as-iso/", async (client, path, body) => {
    client.send(path, system.getTimeAsISO())
})
api.receive("/system/v0/topic/uptime/", async (client, path, body) => {
    client.send(path, system.getUptime())
})
api.receiveAdmin("/system/v0/topic/info/", async (client, path, body) => {
    client.send(path, system.getSystemInfo())
})

// Events
system.emitter.on("getTime", (data) => {
    api.send("/system/v0/topic/time/", data)
})
system.emitter.on("getTimeAsISO", (data) => {
    api.send("/system/v0/topic/time-as-iso/", data)
})
system.emitter.on("getUptime", (data) => {
    api.send("/system/v0/topic/uptime/", data)
})
system.emitter.on("getSystemInfo", (data) => {
    api.send("/system/v0/topic/info/", data)
})
