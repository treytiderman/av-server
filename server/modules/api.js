// Overview: api wrapper

// Imports
import { Logger } from '../modules/logger.js'
import { EventEmitter } from 'events'
import { createDatabase, resetDatabase } from './database.js'

// Protocals
import * as ws from '../core/websocket-server.js'
import * as tcp from './tcp-server.js'
import * as udp from './udp-server.js'
import * as ipc from './programs.js'

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
const DEFAULT_STATE = { clients: {} }
const db = await createDatabase('api', DEFAULT_STATE)

// Startup
emitter.setMaxListeners(100)
db.data.clients = {}
await db.write()

// Api accessed via the WebSocket
ws.emitter.on("connect", (client, req) => {
    const sendFn = (path, body) => { return client.send(JSON.stringify({path: path, body: body})) }
    emitter.emit("connect", client.id, protocals.ws, sendFn)
})
ws.emitter.on("disconnect", (client) => {
    emitter.emit("disconnect", client.id)
})
ws.emitter.on("receive", (client, data) => {
    emitter.emit("receive", db.data.clients[client.id], data)
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

// Api accessed via the Interprocess Communication
ipc.emitter.on("create", (id) => {
    const sendFn = (path, body) => { return ipc.send(id, JSON.stringify({path: path, body: body})) }
    emitter.emit("connect", id, protocals.ipc, sendFn)
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
        emitter.emit("receive", db.data.clients[id], text)
    })
})

// Recieve from any protocal
emitter.on("connect", (id, protocal, sendFn) => {
    db.data.clients[id] = {
        id: id,
        auth: false,
        user: {},
        subs: [],
        token: undefined,
        protocal: protocal,
        send: (path, body) => { return sendFn(path, body) },
        subscribe: (template) => { return subscribe(id, template) },
        unsubscribe: (template) => { return unsubscribe(id, template) },
        subscriptions: () => { return subscriptions(id) },
    }
    emitter.emit("client", db.data.clients[id])
    db.write()
})
emitter.on("pause", (id) => {
    db.data.clients[id].subscriptions().forEach(sub => {
        db.data.clients[id].unsubscribe(sub)
    })
    db.data.clients[id].auth = false
    db.data.clients[id].token = ""
    emitter.emit("client", db.data.clients[id])
    db.write()
})
emitter.on("disconnect", (id) => {
    delete db.data.clients[id]
    emitter.emit("client", db.data.clients[id])
    db.write()
})
emitter.on("receive", (client, data) => {
    
    // Is JSON
    if (isJSON(data)) {
        const json = JSON.parse(data)
        emitter.emit("receive-json", client, json)
        
        // Is API
        if (json.path) {
            // log.debug(`receive (${client.protocal}) -> ${json.path}`, json.body)
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
    Object.keys(db.data.clients).forEach(id => {
        if (db.data.clients[id].subs.includes(path)) {
            // if (db.data.clients[id].protocal !== "ws") console.log("send", path, body)
            db.data.clients[id].send(path, body)
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
function receiveAuth(pathTemplate, callback) {
    emitter.on("receive-api", (client, path, body) => {
        const template = parsePathTemplate(pathTemplate)
        if (path.startsWith(template.base)) {
            const params = parseParams(template, path)
            if (isAuth(client, path)) {
                if (body === "sub") client.subscribe(path)
                else if (body === "unsub") client.unsubscribe(path)
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
                if (body === "sub") client.subscribe(path)
                else if (body === "unsub") client.unsubscribe(path)
                callback(client, path, body, params)
            }
        }
    })
}

function subscriptions(id) {
    return db.data.clients[id].subs
}
function subscribe(id, path) {
    if (db.data.clients[id].subs.indexOf(path) !== -1) return "error already subscribed"
    db.data.clients[id].subs.push(path)
    db.write()
    return "ok"
}
function unsubscribe(id, path) {
    if (path === "*") db.data.clients[id].subs = []
    else db.data.clients[id].subs = db.data.clients[id].subs.filter(sub => sub !== path)
    db.write()
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
