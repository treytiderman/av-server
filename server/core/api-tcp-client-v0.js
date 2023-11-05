// Overview: api wrapper for system.js module

// Imports
import * as api from '../modules/api.js'
import * as tcpClient from '../modules/tcp-client.js'

// Functions
api.receive("tcp-client/v0/func/open", async (client, path, body) => {
    if (api.isAdmin(client, path)) {
        client.subscribe(path)
        tcpClient.open(body.address, body.encoding)
    }
})
api.receive("tcp-client/v0/func/send", async (client, path, body) => {
    if (api.isAdmin(client, path)) {
        const response = send(body.address, body.data, body.encoding)
        client.send(path, response)
    }
})

// Topics
api.receive("system/v0/topic/time", async (client, path, body) => {
    if (body === "unsub") client.unsubscribe(path)
    else if (body === "sub") client.subscribe(path)
    client.send(path, tcpClient.getTime())
})

// Events
tcpClient.emitter.on("getTime", (data) => {
    api.send("system/v0/topic/time", data)
})
