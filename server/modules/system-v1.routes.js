// Overview: api wrapper for the database-v1.js module

// Imports
import * as api from '../modules/api-v1.js'
import * as sys from './system-v1.js'

// Exports
export { routes }

// Help
const routes = [

    // Time
    { path: "v1/system/time/get/:name/" },
    { path: "v1/system/time/sub/:name/" },
    { path: "v1/system/time/unsub/:name/" },

    // Uptime
    { path: "v1/system/uptime/get/:name/" },
    { path: "v1/system/uptime/sub/:name/" },
    { path: "v1/system/uptime/unsub/:name/" },

    // Info
    { path: "v1/system/info/get/" },
    { path: "v1/system/info/sub/" },
    { path: "v1/system/info/unsub/" },

]

// Time
api.receive("v1/system/time/get/", async (client, path, body, params) => {
    client.send(path, sys.time.get())
})
api.receive("v1/system/time/sub/", async (client, path, body, params) => {
    client.send(path, sys.time.get())
    client.sub("v1/system/time/pub/")
    const callback = (user) => api.send("v1/system/time/pub/", user)
    sys.time.unsub(callback)
    sys.time.sub(callback)
})
api.receive("v1/system/time/unsub/", async (client, path, body, params) => {
    client.unsub("v1/system/time/pub/")
})

// Uptime
api.receive("v1/system/uptime/get/", async (client, path, body, params) => {
    client.send(path, sys.uptime.get())
})
api.receive("v1/system/uptime/sub/", async (client, path, body, params) => {
    client.send(path, sys.uptime.get())
    client.sub("v1/system/uptime/pub/")
    const callback = (user) => api.send("v1/system/uptime/pub/", user)
    sys.uptime.unsub(callback)
    sys.uptime.sub(callback)
})
api.receive("v1/system/uptime/unsub/", async (client, path, body, params) => {
    client.unsub("v1/system/uptime/pub/")
})

// Info
api.receive("v1/system/info/get/", async (client, path, body, params) => {
    client.send(path, sys.info.get())
})
api.receive("v1/system/info/sub/", async (client, path, body, params) => {
    client.send(path, sys.info.get())
    client.sub("v1/system/info/pub/")
    const callback = (user) => api.send("v1/system/info/pub/", user)
    sys.info.unsub(callback)
    sys.info.sub(callback)
})
api.receive("v1/system/info/unsub/", async (client, path, body, params) => {
    client.unsub("v1/system/info/pub/")
})
