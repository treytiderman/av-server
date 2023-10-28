// Overview: websocket routes for the tcp-client.js module

// Imports
import {
    receiveJson,
    receivePath,
    sendPath,
    sendPathIfSub,
    sendAllPath,
    sendAllPathIfSub,
    subscribe,
    unsubscribe,
} from './websocket-server.js'
import {
    emitter, // "open", "error", "close", "receive", "send", "reconnect"
    open,
    reconnect,
    send,
    setEncoding,
    close,
    remove,
    openAll,
    // sendAll,
    closeAll,
    removeAll,
    getClient,
    getClients,
    getHistory,
    getClientWithHistory,
    getClientsWithHistory,
} from '../modules/tcp-client.js'
import { isAdmin } from './ws-users-v0.js'

// tcp-client/v0/topic/
function handleTopics(ws, path, topic, address) {

    // tcp-client/v0/topic/client/${address}
    if (topic === "client") {
        sendPath(ws, path, getClient(address))
    }

    // tcp-client/v0/topic/clients
    if (topic === "clients") {
        sendPath(ws, path, getClients(address))
    }

    // tcp-client/v0/topic/data/${address}
    else if (topic === "data") {
        // const history = getHistory(address)
        // sendPath(ws, path, history[history.length - 1])
    }

    // tcp-client/v0/topic/history/${address}
    else if (topic === "history") {
        sendPath(ws, path, getHistory(address))
    }
}
receiveJson((ws, obj) => {
    const path = obj.path
    const body = obj.body
    if (path.includes("tcp-client/v0/topic")) {
        const split = path.split("tcp-client/v0/topic/")[1].split("/")
        const topic = split[0]
        const address = split[1]
        if (body === "unsub") {
            unsubscribe(ws, path)
        } else if (body === "sub") {
            subscribe(ws, path)
        }

        if (isAdmin(ws, path)) {
            handleTopics(ws, path, topic, address)
        }
    }

})

// Updates
emitter.on("open", (address, res) => {
    sendAllPathIfSub(`tcp-client/v0/topic/client/${address}`, getClient(address))
    sendAllPathIfSub(`tcp-client/v0/topic/clients`, getClients())
    sendAllPathIfSub(`tcp-client/v0/func/open`, res)
})
emitter.on("close", (address) => {
    sendAllPathIfSub(`tcp-client/v0/topic/client/${address}`, getClient(address))
    sendAllPathIfSub(`tcp-client/v0/topic/clients`, getClients())
})
emitter.on("send", (address, data) => {
    sendAllPathIfSub(`tcp-client/v0/topic/data/${address}`, data)
    sendAllPathIfSub(`tcp-client/v0/topic/history`, getHistory(address))
})
emitter.on("receive", (address, data) => {
    sendAllPathIfSub(`tcp-client/v0/topic/data/${address}`, data)
    sendAllPathIfSub(`tcp-client/v0/topic/history`, getHistory(address))
})

// tcp-client/v0/func
receivePath("tcp-client/v0/func/open", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        subscribe(ws, path)
        open(body.address, body.encoding)
    }
})
receivePath("tcp-client/v0/func/send", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        const res = send(body.address, body.data, body.encoding)
        sendPath(ws, path, res)
    }
})
receivePath("tcp-client/v0/func/set-encoding", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        const res = setEncoding(body.address, body.encoding)
        sendPath(ws, path, res)
    }
})
receivePath("tcp-client/v0/func/close", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        const res = close(body.address)
        sendPath(ws, path, res)
    }
})
receivePath("tcp-client/v0/func/remove", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        const res = remove(body.address)
        sendPath(ws, path, res)
        sendAllPathIfSub(`tcp-client/v0/topic/client/${body.address}`, getClient(body.address))
        sendAllPathIfSub(`tcp-client/v0/topic/clients`, getClients())
    }
})

receivePath("tcp-client/v0/func/open-all", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        const res = openAll()
        sendPath(ws, path, res)
    }
})
receivePath("tcp-client/v0/func/close-all", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        const res = closeAll()
        sendPath(ws, path, res)
    }
})
receivePath("tcp-client/v0/func/remove-all", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        const res = removeAll()
        sendPath(ws, path, res)
        const clients = getClients()
        sendAllPathIfSub(`tcp-client/v0/topic/clients`, clients)
        clients.forEach(client => {
            sendAllPathIfSub(`tcp-client/v0/topic/client/${client.address}`, getClient(client.address))
        })
    }
})
