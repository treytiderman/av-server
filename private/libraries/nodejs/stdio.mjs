// Overview: wrapper for stdin / stdout
import { EventEmitter } from "events";

// Export
export const stdio = {
    receive: {
        text: receive,
        json: receiveJson,
        path: receivePath,
    },
    receiveOnce: {
        text: receiveOnce,
        json: receiveJsonOnce,
        path: receivePathOnce,
    },
    send: {
        text: send,
        json: sendJSON,
        path: sendPath,
    }
}

// Startup
const emitter = new EventEmitter()
emitter.setMaxListeners(100)
process.stdin.on("data", buffer => {
    const data = buffer.toString()
    // console.log("receive", data)
    emitter.emit("receive", data)
})

// Functions
function isJSON(text) {
    try { JSON.parse(text) }
    catch (error) { return false }
    return true
}

function send(text) {
    process.stdout.write(Buffer.from(text) + '\r\n')
}
function sendJSON(obj) {
    send(JSON.stringify(obj))
}

function receive(callback) {
    emitter.on("receive", buffer => {
        const data = buffer.toString()
        callback(data)
    })
}
function receiveJson(callback) {
    emitter.on("receive", buffer => {
        const data = buffer.toString()
        if (isJSON(data)) callback(JSON.parse(data))
    })
}
function receiveOnce(callback) {
    function eventListenerFunction(buffer) {
        emitter.removeListener('receive', eventListenerFunction)
        const data = buffer.toString()
        callback(data)
    }
    emitter.on("receive", eventListenerFunction)
}
function receiveJsonOnce(callback) {
    function eventListenerFunction(buffer) {
        const data = buffer.toString()
        if (isJSON(data)) {
            const obj = JSON.parse(data)
            emitter.removeListener('receive', eventListenerFunction)
            callback(obj)
        }
    }
    emitter.on("receive", eventListenerFunction)
}

// API
function sendPath(path, body = {}) {
    sendJSON({
        "path": path,
        "body": body,
    })
}
function receivePath(path, callback) {
    emitter.on("receive", buffer => {
        const data = buffer.toString()
        if (isJSON(data)) {
            const obj = JSON.parse(data)
            if (obj.path === path) {
                callback(obj.body)
            }
        }
    })
}
function receivePathOnce(path, callback) {
    function eventListenerFunction(buffer) {
        const data = buffer.toString()
        if (isJSON(data)) {
            const obj = JSON.parse(data)
            if (obj.path === path) {
                emitter.removeListener('receive', eventListenerFunction)
                callback(obj.body)
            }
        }
    }
    emitter.on("receive", eventListenerFunction)
}
