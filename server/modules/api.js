// Overview: api wrapper

// Imports
import { Logger } from '../modules/logger.js'
import * as ws from '../core/websocket-server.js'
import * as pg from './programs.js'
// import * as tcp from './tcp-server.js'
// import * as udp from './udp-server.js'

// Exports
export {
    send,
    receive,

    parseTemplateString,
    parseParams,

    isAuth,
    isAdmin,
}

// Variables
const log = new Logger("modules/api.js")
const protocals = {
    ws: "ws",
    tcp: "tcp",
    udp: "udp",
    programs: "pg",
    stdio: "stdio",
}

// Functions
function isJSON(text) {
    try { JSON.parse(text) }
    catch (error) { return false }
    return true
}

function send(path, body) {
    const obj = { path: path, body: body }
    const json = JSON.stringify(obj)
    ws.sendAllPathIfSub(path, body)
    // pg.sendAll(json)
}
function receive(template, callback) {
    // log.debug(`receive("${template}", "${callback}")`)
    const templateObj = parseTemplateString(template)
    ws.receiveJson((client, obj) => {
        const path = obj.path
        if (path.startsWith(templateObj.base)) {
            const body = obj.body
            client.protocal = protocals.ws
            client.sendPath = (path, body) => ws.sendPath(client, path, body)
            client.subscribe = (path) => ws.subscribe(client, path)
            client.unsubscribe = (path) => ws.unsubscribe(client, path)
            const params = parseParams(templateObj, path)
            callback(client, path, body, params)
        }
    })
    // pg.emitter.on("data", (name, obj) => {
    //     if (isJSON(obj.data)) {
    //         const json = JSON.parse(obj.data)
    //         const path = json.path
    //         if (path.startsWith(templateObj.base)) {
    //             const body = json.body
    //             const client = {}
    //             client.protocal = protocals.programs
    //             client.sendPath = (path, body) => pg.send(name, JSON.stringify({path: path, body: body}))
    //             client.subscribe = (path) => {}
    //             client.unsubscribe = (path) => {}
    //             const params = parseParams(templateObj, path)
    //             console.log(client, path, body, params);
    //             // callback(client, path, body, params)
    //             // pg.send(name, "yes")
    //         }
    //     }
    // })
}

function parseTemplateString(string) {
    const template = { string: string, base: string, params: [] }
    if (string.includes("/:")) {
        const split = string.split("/:")
        template.base = split[0] + "/"
        split.forEach((text, i) => {
            if (i === 0) { }
            else template.params.push(text)
        })
    }
    // log.debug(`parseTemplateString("${string}") -> ${JSON.stringify(template)}`)
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

function isAuth(client, path) {
    if (!client.send) return false
    else if (client.auth === false) {
        client.send(path, "error login first")
        return false
    } else {
        return true
    }
}
function isAdmin(client, path) {
    if (isAuth(client, path) === false) {
        return false
    } else if (!client.user || !client.user.groups) {
        return false
    } else if (client.user.groups.some(group => group === "admin") === false) {
        client.send(path, "error not in group admin")
        return false
    } else {
        return true
    }
}
