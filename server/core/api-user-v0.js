// Overview: api wrapper for system.js module

// Imports
import * as api from '../modules/api.js'
import * as user from '../modules/user.js'

// Functions
// api.receive("user/v0/func/login", async (client, path, body, params) => {
//     const token = user.getToken(body.username, body.password)
//     client.sendPath(path, "ok")
//     client.sendPath("user/v0/topic/token", token)
//     const user = user.getUser(body.username)
//     client.sendPath("user/v0/topic/who-am-i", user)
// })

// Topics
// api.receive("topic/time", async (client, path, body, params) => {
//     if (body === "unsub") client.unsubscribe(path)
//     else if (body === "sub") client.subscribe(path)
//     // client.sendPath(path, tcpClient.getClient(params.address))
// })

// Events
// tcpClient.emitter.on("open", (address, data) => {
//     api.send(`tcp-client/v0/topic/client/${address}`, tcpClient.getClient(address))
// })
