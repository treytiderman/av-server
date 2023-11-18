// Overview: api wrapper

// Imports
import { Logger } from '../modules/logger.js'
import { EventEmitter } from 'events'
import { createDatabase, resetDatabase } from './database.js'

// Protocals
import * as ws from '../core/websocket-server-v1.js'
import * as tcp from './tcp-server.js'
import * as udp from './udp-server.js'
import * as ipc from './programs.js'

// Exports
export {
    emitter, // send, receive, client, clients

    send,
    receive,
    
    subscribe,
    unsubscribe,
    subscriptions,

    isAuth,
    isAdmin,

    parsePathTemplate,
    parseParams,
}

// Variables
const log = new Logger("modules/api.js")
const emitter = new EventEmitter()
const protocals = {
    ws: "ws",
    tcp: "tcp",
    udp: "udp",
    ipc: "ipc",
    stdio: "stdio",
}
const clients = { }
const DEFAULT_CLIENT = { 
    auth: false,
    user: {},
    subs: [],
    token: undefined,
    protocal: undefined,
}
// const DEFAULT_STATE = { clients: {} }
// let db = await createDatabase('api', DEFAULT_STATE)

// Startup
emitter.setMaxListeners(100)

// Api accessed via the WebSocket
ws.emitter.on("connect", (client, req) => {
    const sendFn = (text) => { return client.send(text) }
    emitter.emit("connect", client.id, protocals.ws, sendFn)
})
ws.emitter.on("disconnect", (client) => {
    emitter.emit("disconnect", client.id)
})
ws.emitter.on("receive", (client, data) => {
    emitter.emit("receive", clients[client.id], data)
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

// // Api accessed via the UDP
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

// // Api accessed via the Interprocess Communication
// ipc.emitter.on("create", (id) => {
//     const sendFn = (text) => { return ipc.send(id, text) }
//     emitter.emit("connect", id, protocals.ipc, sendFn)
// })
// ipc.emitter.on("delete", (id) => {
//     emitter.emit("disconnect", id)
// })
// ipc.emitter.on("receive", (id, data) => {
//     emitter.emit("receive", clients[id], data)
// })

// Recieve from any protocal
emitter.on("connect", (id, protocal, sendFn) => {
    clients[id] = {
        id: id,
        auth: false,
        user: {},
        subs: [],
        token: undefined,
        protocal: protocal,
        send: (text) => { return sendFn(text) },
        subscribe: (template) => { return subscribe(id, template) },
        unsubscribe: (template) => { return unsubscribe(id, template) },
        subscriptions: () => { return subscriptions(id) },
    }
    emitter.emit("client", clients[id])
})
emitter.on("disconnect", (id) => {
    delete clients[id]
    emitter.emit("client", clients[id])
})
emitter.on("receive", (client, data) => {
    
    // Is JSON
    if (isJSON(data)) {
        const json = JSON.parse(data)
        emitter.emit("receive-json", client, json)
        
        // Is API
        if (json.path) {
            log.debug(`data (${client.protocal}) -> ${json.path}`, json.body)
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
            else template.params.push(text)
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
    const obj = { path: path, body: body }
    const json = JSON.stringify(obj)
    Object.keys(clients).forEach(id => {
        if (clients[id].subs.includes(path)) {
            clients[id].send(json)
        }
    })
}
function receive(pathTemplate, callback) {
    emitter.on("receive-api", (client, path, body) => {
        const template = parsePathTemplate(pathTemplate)
        if (path.startsWith(template.base)) {
            const params = parseParams(template, path)
            if (body === "sub") client.subscribe(path)
            else if (body === "unsub") client.unsubscribe(path)
            callback(client, path, body, params)
        }
    })
}

function subscriptions(id) {
    return clients[id].subs
}
function subscribe(id, path) {
    if (clients[id].subs.indexOf(path) !== -1) return "error already subscribed"
    clients[id].subs.push(path)
    return "ok"
}
function unsubscribe(id, path) {
    if (path === "*") clients[id].subs = []
    else clients[id].subs = clients[id].subs.filter(sub => sub !== path)
}

function isAuth(id, path) {
    if (!clients[id].send) return false
    else if (clients[id].auth === false) {
        clients[id].send(path, "error login first")
        return false
    }
    else return true
}
function isAdmin(id, path) {
    if (isAuth(id, path) === false) return false
    else if (!clients[id].user || !clients[id].user.groups) return false
    else if (clients[id].user.groups.some(group => group === "admin") === false) {
        clients[id].send(path, "error not in group admin")
        return false
    } 
    else return true
}