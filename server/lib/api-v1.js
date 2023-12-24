// Overview: api wrapper

// Imports
import { Logger } from './logger-v0.js'
import { EventEmitter } from 'events'
import { Database } from './database-v1.js'

// Protocals
import * as ws from '../core/websocket-server.js'
import * as tcp from '../modules/tcp-server.js'
import * as udp from '../modules/udp-server.js'
import * as ipc from '../modules/programs.js'
// import * as http from '../modules/http-server.js'

// Exports
export {
    emitter, // send, receive, client, clients

    send,
    receive,
    receiveAuth,
    receiveAdmin,
    
    subscribe,
    unsubscribe,
    subscriptions,

    isAuth,
    isAdmin,

    parsePathTemplate,
    parseParams,
}

// State
const log = new Logger("api-v1.js")
const emitter = new EventEmitter()
const protocals = {
    ws: "ws",
    tcp: "tcp",
    udp: "udp",
    ipc: "ipc",
    stdio: "stdio",
}
const sendFunctions = {}
const db = new Database('api-v2')

// Startup
emitter.setMaxListeners(1000)
await db.create()
await db.set({})

// Api accessed via the WebSocket
ws.emitter.on("connect", (wsClient, req) => {
    sendFunctions[wsClient.id] = (path, body) => wsClient.send(JSON.stringify({path: path, body: body}))
    emitter.emit("connect", wsClient.id, protocals.ws)
})
ws.emitter.on("disconnect", (wsClient) => {
    emitter.emit("disconnect", wsClient.id)
})
ws.emitter.on("receive", (wsClient, data) => {
    const apiClient = db.getKey(wsClient.id)
    emitter.emit("receive-raw", apiClient, data)
})

// Api accessed via the TCP
// tcp.emitter.on("connect", (client) => {
//     const sendFn = (text) => { return client.send(text) }
//     emitter.emit("connect", id, protocals.tcp, sendFn)
// })
// tcp.emitter.on("disconnect", (client) => {
//     emitter.emit("disconnect", client.id)
// })
// tcp.emitter.on("receive", (client, data) => {
//     emitter.emit("receive", clients[client.id], data)
// })

// Api accessed via the UDP
// udp.emitter.on("connect", (client) => {
//     const sendFn = (text) => { return client.send(text) }
//     emitter.emit("connect", id, protocals.udp, sendFn)
// })
// udp.emitter.on("disconnect", (client) => {
//     emitter.emit("disconnect", client.id)
// })
// udp.emitter.on("receive", (client, data) => {
//     emitter.emit("receive", clients[client.id], data)
// })

// Api accessed via the Interprocess Communication
ipc.emitter.on("create", (id) => {
    sendFunctions[id] = (path, body) => ipc.send(id, JSON.stringify({path: path, body: body}))
    emitter.emit("connect", id, protocals.ipc)
})
ipc.emitter.on("kill", (id) => {
    emitter.emit("pause", id)
})
ipc.emitter.on("delete", (id) => {
    emitter.emit("disconnect", id)
})
ipc.emitter.on("receive", (id, data) => {
    const split = data.split("\r\n")
    split.forEach(text => {
        const apiClient = db.getKey(id)
        emitter.emit("receive-raw", apiClient, text)
    })
})

// Recieve from any protocal
emitter.on("connect", async (id, protocal) => {
    const client = {
        id: id,
        auth: false,
        user: {},
        subs: [],
        token: undefined,
        protocal: protocal,
    }
    if (protocal === protocals.ipc) {
        client.auth = true
        client.user = { "username": "ipc", "groups": ["admin"] }
    }
    db.setKey(id, client)
    await db.write()
})
emitter.on("pause", async (id) => {
    const client = db.getKey(id)
    client.subs.forEach(sub => unsubscribe(id, sub))
    client.auth = false
    client.token = ""
    db.setKey(id, client)
    await db.write()
})
emitter.on("disconnect", async (id) => {
    db.removeKey(id)
    await db.write()
})
emitter.on("receive-raw", (client, data) => {
    client.send = (path, body) => {
        log.debug(`send (${client.protocal}) -> ${path}`, body)
        sendFunctions[client.id](path, body)
    }
    client.sub = (template) => subscribe(client.id, template)
    client.unsub = (template) => unsubscribe(client.id, template)
    client.subscriptions = () => subscriptions(client.id)

    // Is JSON
    if (isJSON(data)) {
        const json = JSON.parse(data)
        emitter.emit("receive-json", client, json)

        // Is API
        if (json.path) {
            log.debug(`receive (${client.protocal}) -> ${json.path}`, json.body)
            emitter.emit("receive-api", client, json.path, json.body)
        }
    }
})

// Functions
function isJSON(text) {
    try { JSON.parse(text) }
    catch (error) { return false }
    return true
}
function parsePathTemplate(string) {
    const template = { string: string, base: string, params: [] }
    if (string.includes("/:")) {
        const split = string.split("/:")
        template.base = split[0] + "/"
        split.forEach((text, i) => {
            if (i === 0) { }
            else template.params.push(text.replace("/", ""))
        })
    }
    // log.debug(`parsePathTemplate("${string}") -> ${JSON.stringify(template)}`)
    return template
}
function parseParams(template, path) {
    const params = {}
    if (template.params.length === 0) return params
    
    const pathNoBase = path.replace(template.base, "")
    const split = pathNoBase.split("/")
    split.forEach((text, i) => {
        params[template.params[i]] = text
    })
    // log.debug(`parseParams("${JSON.stringify(template)}", "${path}") -> ${JSON.stringify(params)}`)
    return params
}

function send(path, body) {
    const clients = db.keys()
    clients.forEach(id => {
        const client = db.getKey(id)
        if (sendFunctions[id] && client.subs.includes(path)) sendFunctions[id](path, body)
    })
}
function receive(pathTemplate, callback) {
    emitter.on("receive-api", (client, path, body) => {
        const template = parsePathTemplate(pathTemplate)
        if (path.startsWith(template.base)) {
            const params = parseParams(template, path)
            callback(client, path, body, params)
        }
    })
}
function receiveAuth(pathTemplate, callback) {
    emitter.on("receive-api", (client, path, body) => {
        const template = parsePathTemplate(pathTemplate)
        if (path.startsWith(template.base)) {
            const params = parseParams(template, path)
            if (isAuth(client, path)) {
                callback(client, path, body, params)
            }
        }
    })
}
function receiveAdmin(pathTemplate, callback) {
    emitter.on("receive-api", (client, path, body) => {
        const template = parsePathTemplate(pathTemplate)
        if (path.startsWith(template.base)) {
            const params = parseParams(template, path)
            if (isAdmin(client, path)) {
                callback(client, path, body, params)
            }
        }
    })
}

function subscriptions(id) {
    return db.getKey(id).subs
}
function subscribe(id, path) {
    const client = db.getKey(id)
    if (client.subs.indexOf(path) !== -1) return "error already subscribed"
    client.subs.push(path)
    db.setKey(id, client)
    db.write()
    return "ok"
}
function unsubscribe(id, path) {
    const client = db.getKey(id)
    if (path === "*") client.subs = []
    else client.subs = client.subs.filter(sub => sub !== path)
    db.setKey(id, client)
    db.write()
    return "ok"
}

function isAuth(client, path) {
    if (!client.send) return false
    else if (client.auth === false) {
        client.send(path, "error login first")
        return false
    }
    else return true
}
function isAdmin(client, path) {
    if (isAuth(client, path) === false) return false
    else if (!client.user || !client.user.groups) return false
    else if (client.user.groups.some(group => group === "admin") === false) {
        client.send(path, "error not in group admin")
        return false
    } 
    else return true
}
