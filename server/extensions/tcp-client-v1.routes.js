// Overview: api wrapper for the database-v1.js module

// Imports
import * as api from '../modules/api-v1.js'
import * as tm from '../extensions/tcp-client-v1.js'

// Exports
export { routes }

// Help
const routes = [

    // Client
    { path: "v1/tcp/client/get/:address/" },
    { path: "v1/tcp/client/sub/:address/" },
    { path: "v1/tcp/client/unsub/:address/" },
    { path: "v1/tcp/client/open/:address/", body: { encoding: "ascii", reconnect: false } },
    { path: "v1/tcp/client/send/:address/", body: { data: "data", encoding: "ascii" } },
    { path: "v1/tcp/client/reconnect/:address/", body: { encoding: "ascii", reconnect: false } },
    { path: "v1/tcp/client/close/:address/" },
    { path: "v1/tcp/client/remove/:address/" },
    { path: "v1/tcp/client/set-encoding/:address/", body: { encoding: "ascii" } },

    // Data
    { path: "v1/tcp/client/data/get/:address/" },
    { path: "v1/tcp/client/data/sub/:address/" },
    { path: "v1/tcp/client/data/unsub/:address/" },

    // History
    { path: "v1/tcp/client/history/get/:address/" },
    { path: "v1/tcp/client/history/sub/:address/" },
    { path: "v1/tcp/client/history/unsub/:address/" },

    // All Clients
    { path: "v1/tcp/client/all/get/" },
    { path: "v1/tcp/client/all/sub/" },
    { path: "v1/tcp/client/all/unsub/" },
    { path: "v1/tcp/client/all/close/" },
    { path: "v1/tcp/client/all/remove/" },

]

// Client
api.receive("v1/tcp/client/get/:address/", async (client, path, body, params) => {
    client.send(path, tm.client.get(params.address))
})
api.receive("v1/tcp/client/sub/:address/", async (client, path, body, params) => {
    client.send(path, tm.client.get(params.address))
    client.sub(`v1/tcp/client/pub/${params.address}/`)
    const callback = (user) => api.send(`v1/tcp/client/pub/${params.address}/`, user)
    tm.client.unsub(params.address, callback)
    tm.client.sub(params.address, callback)
})
api.receive("v1/tcp/client/unsub/:address/", async (client, path, body, params) => {
    client.unsub(`v1/tcp/client/pub/${params.address}/`)
})
api.receiveAdmin("v1/tcp/client/open/:address/", async (client, path, body, params) => {
    client.send(path, await tm.log.client.open(params.address, body.encoding, body.reconnect))
})
api.receiveAdmin("v1/tcp/client/set-encoding/:address/", async (client, path, body, params) => {
    client.send(path, await tm.log.client.setEncoding(params.address, body.encoding))
})
api.receiveAdmin("v1/tcp/client/send/:address/", async (client, path, body, params) => {
    client.send(path, await tm.log.client.send(params.address, body.data, body.encoding))
})
api.receiveAdmin("v1/tcp/client/reconnect/:address/", async (client, path, body, params) => {
    client.send(path, await tm.log.client.reconnect(params.address, body.encoding, body.reconnect))
})
api.receiveAdmin("v1/tcp/client/close/:address/", async (client, path, body, params) => {
    client.send(path, await tm.log.client.close(params.address))
})
api.receiveAdmin("v1/tcp/client/remove/:address/", async (client, path, body, params) => {
    client.send(path, await tm.log.client.remove(params.address))
})

// Data
api.receive("v1/tcp/client/data/get/:address/", async (client, path, body, params) => {
    client.send(path, tm.data.get(params.address))
})
api.receive("v1/tcp/client/data/sub/:address/", async (client, path, body, params) => {
    // client.send(path, tm.data.get(params.address))
    client.sub(`v1/tcp/client/data/pub/${params.address}/`)
    const callback = (data) => api.send(`v1/tcp/client/data/pub/${params.address}/`, data)
    tm.data.unsub(params.address, callback)
    tm.data.sub(params.address, callback)
})
api.receive("v1/tcp/client/data/unsub/:address/", async (client, path, body, params) => {
    client.unsub(`v1/tcp/client/data/pub/${params.address}/`)
})

// History
api.receive("v1/tcp/client/history/get/:address/", async (client, path, body, params) => {
    client.send(path, tm.history.get(params.address))
})
api.receive("v1/tcp/client/history/sub/:address/", async (client, path, body, params) => {
    client.send(path, tm.history.get(params.address))
    client.sub(`v1/tcp/client/history/pub/${params.address}/`)
    const callback = (history) => api.send(`v1/tcp/client/history/pub/${params.address}/`, history)
    tm.history.unsub(params.address, callback)
    tm.history.sub(params.address, callback)
})
api.receive("v1/tcp/client/history/unsub/:address/", async (client, path, body, params) => {
    client.unsub(`v1/tcp/client/history/pub/${params.address}/`)
})

// All Clients
api.receive("v1/tcp/client/all/get/", async (client, path, body, params) => {
    client.send(path, tm.clients.get())
})
api.receive("v1/tcp/client/all/sub/", async (client, path, body, params) => {
    client.send(path, tm.clients.get())
    client.sub(`v1/tcp/client/all/pub/`)
    const callback = (user) => api.send(`v1/tcp/client/all/pub/`, user)
    tm.clients.unsub(callback)
    tm.clients.sub(callback)
})
api.receive("v1/tcp/client/all/unsub/", async (client, path, body, params) => {
    client.unsub(`v1/tcp/client/all/pub/`)
})
api.receiveAdmin("v1/tcp/client/all/close/", async (client, path, body, params) => {
    client.send(path, await tm.log.clients.close())
})
api.receiveAdmin("v1/tcp/client/all/remove/", async (client, path, body, params) => {
    client.send(path, await tm.log.clients.remove())
})
