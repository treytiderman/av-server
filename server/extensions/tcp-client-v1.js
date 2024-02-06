// Overview: connect to TCP servers

// Imports
import { Socket } from 'net'
import { Logger } from '../modules/logger-v0.js'
import { Database } from '../modules/database-v1.js'

// Exports
export {
    client, // get, sub, unsub, open, send, close, reconnect, remove, set, setEncoding,
    data, // get, sub, unsub
    history, // get, sub, unsub
    clients, // get, sub, unsub, close, remove
    logger as log, // client, clients
}

// Constants
const LINE_FEED = { hex: "0A", ascii: "\n" }
const CARRIAGE_RETURN = { hex: "0D", ascii: "\r" }
const HEX_SEPERATORS = ["\\x", "0x", " "]

// State
const log = new Logger("tcp-client-v1.js")
const db = {
    status: new Database('tcp-client-status-v1'),
    history: new Database('tcp-client-history-v1'),
    settings: new Database('tcp-client-settings-v1'),
}
const sockets = {}
const timeouts = {}

// Startup
await db.settings.create({
    CONNECT_TIMEOUT_MS: 2_000,
    RECONNECT_TIMER_MS: 5_000,
    MAX_HISTORY_LENGTH: 1_000,
})
await db.status.create()
await db.status.set({})
await db.history.create()

// Functions
const client = {
    get: (address) => db.status.getKey(address),
    sub: (address, callback) => db.status.subKey(address, callback),
    unsub: (address, callback) => db.status.unsubKey(address, callback),
    open: async (address, encoding = "ascii", reconnect = false) => {
        const status = db.status.getKey(address)

        // Errors
        if (address.includes(":") === false) return `error address must contain a ':' followed by a port number, for example '192.168.1.9:23'`
        else if (status?.isOpen === true) return `error client '${address}' already open`

        // Force
        if (encoding !== "ascii" && encoding !== "hex") encoding = "ascii"
        if (reconnect !== "true" || reconnect !== true) reconnect = false

        // New socket
        sockets[address] = new Socket()
        db.history.setKey(address, [])
        db.status.setKey(address, {
            isOpen: false,
            reconnect: reconnect,
            address: address,
            encoding: encoding,
        })

        // Event Functions
        async function onTimeout(address) {
            sockets[address].destroy()
            return `error could not connect to server in ${db.settings.getKey("CONNECT_TIMEOUT_MS")} ms`
        }
        async function onOpen(address) {
            clearTimeout(timeouts[address])
            const status = db.status.getKey(address)
            status.isOpen = true
            db.status.setKey(address, status)
            await db.status.write()
            return "ok"
        }
        async function onClose(address) {
            const status = db.status.getKey(address)
            // if (status?.reconnect) await logger.client.reconnect(address, encoding, reconnect)
            if (status?.isOpen !== false) {
                status.isOpen = false
                db.status.setKey(address, status)
                await db.status.write()
            }
            return "ok"
        }
        async function onError(address, error) {
            clearTimeout(timeouts[address])
            console.log("tcp-client-v1:", error.message);
        }
        async function onData(address, data, encoding) {
            const dataObj = {
                wasReceived: true,
                timestamp: new Date(Date.now()).toISOString(),
                encoding: encoding,
                data: data,
            }

            const history = db.history.getKey(address)
            history.push(dataObj)
            if (history.length > db.settings.getKey("MAX_HISTORY_LENGTH")) history.shift()
            db.history.setKey(address, history)
            return "ok"
        }
        async function onBuffer(address, buffer) {
            const status = db.status.getKey(address)
            log.call(onData, "client.onData")(address, buffer.toString(status.encoding), status.encoding)
        }

        // Events
        const split = address.split(":")
        const ip = split[0]
        const port = split[1]
        timeouts[address] = setTimeout(() => log.call(onTimeout, "client.onTimeout")(address), db.settings.getKey("CONNECT_TIMEOUT_MS"))
        sockets[address].connect(port, ip, () => log.call(onOpen, "client.onOpen")(address))
        sockets[address].on('close', () => log.call(onClose, "client.onClose")(address))
        sockets[address].on('error', (error) => log.call(onError, "client.onError")(address, error))
        sockets[address].on('data', (buffer) => onBuffer(address, buffer))

        await db.status.write()
        return 'ok'
    },
    set: async (address, key, value) => {
        const status = db.status.getKey(address)
        const validKeys = ["encoding"]

        // Errors
        if (!status) return `error client '${address}' does NOT exist`
        // else if (status.isOpen) return `error client '${address}' is open`
        else if (!validKeys.some(validKey => key === validKey)) return `error key '${key}' is NOT valid`

        // Set
        status[key] = value
        db.status.setKey(address, status)
        await db.status.write()

        return "ok"
    },
    setEncoding: async (address, encoding) => client.set(address, "encoding", encoding),
    reconnect: (address, encoding = "ascii", reconnect = false) => {
        const port = db.status.getKey(address)
        if (port && port.isOpen === true) client.close(address)
        setTimeout(() => client.open(address, encoding, reconnect), db.settings.getKey("RECONNECT_TIMER_MS"));
        return "reconnecting in " + db.settings.getKey("RECONNECT_TIMER_MS") + " ms"
    },
    send: (address, data, encoding = "ascii") => {
        const port = db.status.getKey(address)

        // Errors
        if (!port || !port.isOpen) return `error client '${address}' is NOT open`

        // Prepare data
        if (encoding === "hex") {
            data = removeAllSeperatorsFromHex(data)
        } else {
            encoding = "ascii"
            data = removeEscapeCharsFromAscii(data)
        }

        // Send
        try { sockets[address].write(Buffer.from(data, encoding)) }
        catch (err) { return `error client '${address}' could NOT send "${data}"` }
        // console.log("send:\t", addEscapeCharsToAscii(data))

        // History
        const dataObj = {
            wasReceived: false,
            timestamp: new Date(Date.now()).toISOString(),
            encoding: encoding,
            data: data,
        }
        const history = db.history.getKey(address)
        history.push(dataObj)
        if (history.length > db.settings.getKey("MAX_HISTORY_LENGTH")) history.shift()
        db.history.setKey(address, history)

        return "ok"
    },
    close: (address) => {
        const port = db.status.getKey(address)

        // Errors
        if (!port || !port.isOpen) return `error client '${address}' is NOT open`

        // Close
        try {
            sockets[address].end()
        } catch (err) {
            return `error client '${address}' could NOT be closed "${err.message}"`
        }

        return "ok"
    },
    remove: async (address) => {
        const port = db.status.getKey(address)

        // Errors
        if (!port) return `error client '${address}' does NOT exist`

        // Remove
        try {
            client.close(address)
            await db.status.removeKey(address)
            await db.history.removeKey(address)
        } catch (err) {
            return `error client '${address}' could NOT be closed "${err.message}"`
        }

        return "ok"
    },
}
const clients = {
    get: () => db.status.get(),
    sub: (callback) => db.status.sub(callback),
    unsub: (callback) => db.status.unsub(callback),
    send: async (data) => {
        db.status.keys().forEach(address => client.send(address, data))
        return 'ok'
    },
    close: async () => {
        db.status.keys().forEach(address => client.close(address))
        return 'ok'
    },
    remove: async () => {
        db.status.keys().forEach(address => client.remove(address))
        return 'ok'
    },
}
const data = {
    get: (address) => {
        const history = db.history.getKey(address)
        return history[history.length-1]
    },
    sub: (address, callback) => db.history.subKey(address, history => {
        callback(history[history.length-1])
    }),
    unsub: (address, callback) => db.history.unsubKey(address, history => {
        callback(history[history.length-1])
    }),
}
const history = {
    get: (address) => db.history.getKey(address),
    sub: (address, callback) => db.history.subKey(address, callback),
    unsub: (address, callback) => db.history.unsubKey(address, callback),
}
const logger = {
    client: {
        open: (address, encoding = "ascii", reconnect = false) => log.call(client.open, "client.open")(address, encoding, reconnect),
        set: (address, key, value) => log.call(client.set, "client.set")(address, key, value),
        setEncoding: (address, encoding) => log.call(client.setEncoding, "client.setEncoding")(address, encoding),
        send: (address, data, encoding = "ascii") => log.call(client.send, "client.send")(address, data, encoding),
        reconnect: (address, encoding = "ascii", reconnect = false) => log.call(client.reconnect, "client.reconnect")(address, encoding, reconnect),
        close: (address) => log.call(client.close, "client.close")(address),
        remove: (address) => log.call(client.remove, "client.remove")(address),
    },
    clients: {
        send: (data) => log.call(clients.send, "clients.send")(data),
        close: () => log.call(clients.close, "clients.close")(),
        remove: () => log.call(clients.remove, "clients.remove")(),
    },
}

// Helper Functions
function addEscapeCharsToAscii(text) {
    text = text.replace(/\r/g, "\\r")
    text = text.replace(/\n/g, "\\n")
    return text
}
function removeEscapeCharsFromAscii(text) {
    if (typeof text !== "string") return text
    text = text.replace(/\\r/g, CARRIAGE_RETURN.ascii)
    text = text.replace(/\\n/g, LINE_FEED.ascii)
    return text
}
function removeAllSeperatorsFromHex(text) {
    if (typeof text !== "string") return text
    text = text.replace(/\\x/g, "")
    text = text.replace(/0x/g, "")
    text = text.replace(/ /g, "")
    return text
}
