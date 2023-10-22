// Overview: websocket routes for the tcp-client.js module

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
import {
    emitter,
    open,
    send,
    close,
    getClient,
    getClients,
    getClientWithHistory,
    getClientsWithHistory
} from '../modules/tcp-client.js'
import { isAdmin } from './ws-users-v0.js'

// logger/v0/topic
// receivePath("logger/v0/topic/logs", async (ws, path, body) => {
//     if (body === "unsub") {
//         unsubscribe(ws, path)
//     } else if (body === "sub") {
//         subscribe(ws, path)
//     }

//     sendPath(ws, path, getHistory(1)[0])
// })

// logger/v0/func
// receivePath("logger/v0/func/debug", async (ws, path, body) => {
//     if (isAdmin(ws, path)) {
//         try {
//             await debug(body.group, body.message, body.obj)
//             sendPath(ws, path, "ok")
//         } catch (error) {
//             sendPath(ws, path, error.message)
//         }
//     }
// })

// Updates
// emitter.on("log", (data) => {
//     sendAllPathIfSub("logger/v0/topic/logs", data)
//     sendAllPathIfSub("logger/v0/topic/logs/history", getHistory())
// })
