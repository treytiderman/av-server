// Overview: api wrapper for tcp-client.js module

// Imports
import * as api from '../modules/api.js'
import * as tcpClient from '../modules/tcp-client.js'

// Functions
api.receive("/tcp-client/v0/func/open/", async (client, path, body, params) => {
    if (api.isAdmin(client, path)) {
        client.subscribe(path)
        tcpClient.open(body.address, body.encoding)
    }
})
api.receive("/tcp-client/v0/func/send/", async (client, path, body, params) => {
    if (api.isAdmin(client, path)) {
        const response = tcpClient.send(body.address, body.data, body.encoding)
        client.send(path, response)
    }
})
api.receive("/tcp-client/v0/func/set-encoding/", async (client, path, body, params) => {
    if (api.isAdmin(client, path)) {
        const response = tcpClient.setEncoding(body.address, body.encoding)
        client.send(path, response)
    }
})
api.receive("/tcp-client/v0/func/close/", async (client, path, body, params) => {
    if (api.isAdmin(client, path)) {
        const response = tcpClient.close(body.address)
        client.send(path, response)
    }
})
api.receive("/tcp-client/v0/func/remove/", async (client, path, body, params) => {
    if (api.isAdmin(client, path)) {
        const response = tcpClient.remove(body.address)
        client.send(path, response)
    }
})
api.receive("/tcp-client/v0/func/open-all/", async (client, path, body, params) => {
    if (api.isAdmin(client, path)) {
        const response = tcpClient.openAll()
        client.send(path, response)
    }
})
api.receive("/tcp-client/v0/func/remove/", async (client, path, body, params) => {
    if (api.isAdmin(client, path)) {
        const response = tcpClient.closeAll()
        client.send(path, response)
    }
})
api.receive("/tcp-client/v0/func/remove-all/", async (client, path, body, params) => {
    if (api.isAdmin(client, path)) {
        const response = tcpClient.removeAll()
        client.send(path, response)

        // Update clients
        const tcpClients = tcpClient.getClients()
        client.send(`/tcp-client/v0/topic/clients`, tcpClients)
        tcpClients.forEach(tcpc => {
            client.send(`/tcp-client/v0/topic/client/${tcpc.address}/`, tcpClient.getClient(tcpc.address))
        })
    }
})

// Topics
api.receive("/tcp-client/v0/topic/client/:address/", async (client, path, body, params) => {
    if (body === "unsub") client.unsubscribe(path)
    else if (body === "sub") client.subscribe(path)
    client.send(path, tcpClient.getClient(params.address))
})
api.receive("/tcp-client/v0/topic/clients/", async (client, path, body, params) => {
    if (body === "unsub") client.unsubscribe(path)
    else if (body === "sub") client.subscribe(path)
    client.send(path, tcpClient.getClients())
})
api.receive("/tcp-client/v0/topic/data/:address/", async (client, path, body, params) => {
    if (body === "unsub") client.unsubscribe(path)
    else if (body === "sub") client.subscribe(path)
})
api.receive("/tcp-client/v0/topic/history/:address/", async (client, path, body, params) => {
    if (body === "unsub") client.unsubscribe(path)
    else if (body === "sub") client.subscribe(path)
    client.send(path, tcpClient.getHistory(params.address))
})

// Events
tcpClient.emitter.on("open", (address, data) => {
    api.send(`/tcp-client/v0/topic/client/${address}/`, tcpClient.getClient(address))
    api.send(`/tcp-client/v0/topic/clients/`, tcpClient.getClients())
    api.send(`/tcp-client/v0/func/open`, data)
})
tcpClient.emitter.on("close", (address) => {
    api.send(`/tcp-client/v0/topic/client/${address}/`, tcpClient.getClient(address))
    api.send(`/tcp-client/v0/topic/clients/`, tcpClient.getClients())
})
tcpClient.emitter.on("send", (address, data) => {
    api.send(`/tcp-client/v0/topic/data/${address}/`, data)
    api.send(`/tcp-client/v0/topic/history/`, tcpClient.getHistory(address))
})
tcpClient.emitter.on("receive", (address, data) => {
    api.send(`/tcp-client/v0/topic/data/${address}/`, data)
    api.send(`/tcp-client/v0/topic/history/`, tcpClient.getHistory(address))
})
