// Overview: api wrapper for system.js module

// Imports
import * as api from '../modules/api.js'
// import * as tcpClient from '../modules/tcp-client.js'

// Functions
api.receive("func/json", async (client, path, body, params) => {
    if (api.isAdmin(client, path)) {
        client.subscribe(path)
        // tcpClient.open(body.address, body.encoding)
    }
})

// Topics
api.receive("topic/time", async (client, path, body, params) => {
    if (body === "unsub") client.unsubscribe(path)
    else if (body === "sub") client.subscribe(path)
    // client.sendPath(path, tcpClient.getClient(params.address))
})

// Events
// tcpClient.emitter.on("open", (address, data) => {
//     api.send(`tcp-client/v0/topic/client/${address}`, tcpClient.getClient(address))
// })
