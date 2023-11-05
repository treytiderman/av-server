// Overview: wrapper for stdin / stdout

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

// Functions
function isJSON(text) {
    try { JSON.parse(text) }
    catch (error) { return false }
    return true
}

function send(text) {
    process.stdout.write(Buffer.from(text))
}
function sendJSON(obj) {
    send(JSON.stringify(obj))
}

function receive(callback) {
    process.stdin.on("data", buffer => {
        const data = buffer.toString()
        callback(data)
    })
}
function receiveJson(callback) {
    receive(data => {
        if (isJSON(data)) callback(JSON.parse(data))
    })
}
function receiveOnce(callback) {
    function eventListenerFunction(buffer) {
        process.stdin.removeListener('message', eventListenerFunction)
        const data = buffer.toString()
        callback(data)
    }
    process.stdin.on("data", eventListenerFunction)
}
function receiveJsonOnce(callback) {
    function eventListenerFunction(buffer) {
        const data = buffer.toString()
        if (isJSON(data)) {
            const obj = JSON.parse(data)
            process.stdin.removeListener('message', eventListenerFunction)
            callback(obj)
        }
    }
    process.stdin.on("data", eventListenerFunction)
}

// API
function sendPath(path, body = {}) {
    sendJSON({
        "path": path,
        "body": body,
    })
}
function receivePath(path, callback) {
    receiveJson(obj => {
        if (obj.path === path) {
            callback(obj.body)
        }
    })
}
function receivePathOnce(path, callback) {
    function eventListenerFunction(buffer) {
        const data = buffer.toString()
        if (isJSON(data)) {
            const obj = JSON.parse(data)
            if (obj.path === path) {
                process.stdin.removeListener('message', eventListenerFunction)
                callback(obj)
            }
        }
    }
    process.stdin.on("data", eventListenerFunction)
}
