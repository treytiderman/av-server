// Overview: api wrapper

// Imports
import { Logger } from '../modules/logger.js'
import * as ws from '../core/websocket-server.js'
// import * as tcp from './tcp-server.js'
// import * as udp from './udp-server.js'
// import * as stdio from './stdio.js'

// Exports
export {
    send,
    receive,

    parseTemplate,
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
    stdio: "stdio",
}

// Functions
function send(path, body) {
    // log.debug(`send("${path}", "${body}")`)
    ws.sendAllPathIfSub(path, body)
}
function receive(template, callback) {
    // log.debug(`receive("${template}", "${callback}")`)
    const templateObj = parseTemplate(template)
    ws.receiveJson((client, obj) => {
        const path = obj.path
        const body = obj.body
        client.protocal = protocals.ws
        client.sendPath = (path, body) => ws.sendPath(client, path, body)
        client.subscribe = (path) => ws.subscribe(client, path)
        client.unsubscribe = (path) => ws.unsubscribe(client, path)
        if (path.startsWith(templateObj.base)) {
            const params = parseParams(templateObj, path)
            callback(client, path, body, params)
        }
    })
}

function parseTemplate(template) {
    const obj = { template: template, base: template, params: [] }
    if (template.includes("/:")) {
        const split = template.split("/:")
        obj.base = split[0] + "/"
        split.forEach((text, i) => {
            if (i === 0) { }
            else obj.params.push(text)
        })
    }
    // log.debug(`parseTemplate("${template}") -> ${JSON.stringify(obj)}`)
    return obj
}
function parseParams(templateObj, path) {
    const params = {}
    if (templateObj.params.length === 0) return params
    
    const pathNoBase = path.replace(templateObj.base, "")
    const split = pathNoBase.split("/")
    split.forEach((text, i) => {
        params[templateObj.params[i]] = text
    })
    // log.debug(`parseParams("${JSON.stringify(templateObj)}", "${path}") -> ${JSON.stringify(params)}`)
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
