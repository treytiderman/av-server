// Overview: use COM ports to send serial commands

// Imports
import { SerialPort } from 'serialport'
import { DelimiterParser } from '@serialport/parser-delimiter'

import { Logger } from '../modules/logger-v0.js'
import { Database } from '../modules/database-v1.js'

// Exports
export {
    available, // get, sub, unsub, read
    port, // get, sub, unsub, open, send, close, remove, 
          // set, setBaudrate, setEncoding, setDelimiter
    data, // get, sub, unsub
    history, // get, sub, unsub
    ports, // get, sub, unsub, close, remove
    logger as log, // port, ports
    // settings,
}

// Constants
const LINE_FEED = { hex: "0A", ascii: "\n" }
const CARRIAGE_RETURN = { hex: "0D", ascii: "\r" }
const HEX_SEPERATORS = ["\\x", "0x", " "]

// State
const log = new Logger("serial-v1.js")
const db = {
    status: new Database('serial-status-v1'),
    history: new Database('serial-history-v1'),
    settings: new Database('serial-settings-v1'),
    available: new Database('serial-available-v1'),
}
const coms = {}

// Startup
await db.settings.create({
    UPDATE_AVAILABLE_MS: 1_000,
    MAX_HISTORY_LENGTH: 1_000,
    RECONNECT_TIMER: 5_000,
})
await db.status.create()
await db.status.set({})
await db.history.create()
await db.available.create({ available: {} })

// Functions
const available = {
    get: () => db.available.getKey("available"),
    sub: (callback) => db.available.subKey("available", callback),
    unsub: (callback) => db.available.unsubKey("available", callback),
    update: async () => {
        let available = []

        try {
            available = await SerialPort.list()
        } catch (err) {
            available = `error could NOT get available serial ports (${err.message})`
        }

        const availableAsJSON = JSON.stringify(available)
        const availableAsJSON_prev = JSON.stringify(db.available.getKey("available"))
        if (availableAsJSON !== availableAsJSON_prev) {
            db.available.setKey("available", available)
            await db.available.write()
        }

        return "ok"
        /* Example response = [
            {
                path: 'COM1',
                manufacturer: '(Standard port types)',
                serialNumber: undefined,
                pnpId: 'ACPI\\PNP0501\\0',
                locationId: undefined,
                friendlyName: 'Communications Port (COM1)',
                vendorId: undefined,
                productId: undefined
            },
            {
                path: 'COM3',
                manufacturer: 'FTDI',
                serialNumber: 'FTCK2VXE',
                pnpId: 'FTDIBUS\\VID_0403+PID_6001+FTCK2VXEA\\0000',
                locationId: undefined,
                friendlyName: 'USB Serial Port (COM3)',
                vendorId: '0403',
                productId: '6001'
            },
            {
                path: 'COM4',
                manufacturer: 'FTDI',
                serialNumber: 'AB0OJ5M6',
                pnpId: 'FTDIBUS\\VID_0403+PID_6001+AB0OJ5M6A\\0000',
                locationId: undefined,
                friendlyName: 'USB Serial Port (COM4)',
                vendorId: '0403',
                productId: '6001'
            }
        ] */
    },
    pollStart: async () => {
        await available.update()
        setInterval(async () => await available.update(), db.settings.getKey("UPDATE_AVAILABLE_MS"))
        return "ok"
    }
}
const port = {
    get: (path) => db.status.getKey(path),
    sub: (path, callback) => db.status.subKey(path, callback),
    unsub: (path, callback) => db.status.unsubKey(path, callback),
    open: async (path, baudrate = 9600, encoding = "ascii", delimiter = "none") => {

        // Errors
        if (db.status.getKey(path)?.isOpen === true) return `error port '${path}' already open`

        // Unescape the delimiter if needed
        delimiter = delimiter.replace(/\\r/g, CARRIAGE_RETURN.ascii)
        delimiter = delimiter.replace(/\\n/g, LINE_FEED.ascii)

        // Force encoding
        if (encoding !== "ascii" && encoding !== "hex") encoding = "ascii"
        else if (encoding === "hex") delimiter = removeAllSeperatorsFromHex(delimiter)
        // console.log("delimiter:", addEscapeCharsToAscii(delimiter));

        // New serial port
        try {
            coms[path] = new SerialPort({ path: path, baudRate: Number(baudrate) })
        } catch (error) {
            return `error port '${path}' failed to start ${error.message}`
        }
        db.history.setKey(path, [])
        db.status.setKey(path, {
            path: path,
            isOpen: false,
            baudrate: baudrate,
            encoding: encoding,
            delimiter: delimiter,
        })

        // Event Functions
        async function onOpen(path) {
            const status = db.status.getKey(path)
            status.isOpen = true
            db.status.setKey(path, status)
            await db.status.write()
        }
        async function onClose(path) {
            const status = db.status.getKey(path)
            if (status?.isOpen !== false) {
                status.isOpen = false
                db.status.setKey(path, status)
                await db.status.write()
            }
            return "ok"
        }
        async function onError(path, error) {
            console.log("serial-v1:", error.message);
        }
        async function onData(path, data, encoding) {
            const dataObj = {
                wasReceived: true,
                timestamp: new Date(Date.now()).toISOString(),
                encoding: encoding,
                data: data,
            }

            const history = db.history.getKey(path)
            history.push(dataObj)
            if (history.length > db.settings.getKey("MAX_HISTORY_LENGTH")) history.shift()
            db.history.setKey(path, history)
            return "ok"
        }
        async function onBuffer(path, buffer) {
            const status = db.status.getKey(path)
            log.call(onData, "port.onData")(path, buffer.toString(status.encoding), status.encoding)
        }

        // Events
        coms[path].on('open', () => log.call(onOpen, "port.onOpen")(path))
        coms[path].on('close', () => log.call(onClose, "port.onClose")(path))
        coms[path].on('error', (error) => log.call(onError, "port.onError")(path, error))
        if (delimiter === "none" || delimiter === "") { // Raw received data
            coms[path].on('data', (buffer) => onBuffer(path, buffer))
        } else { // Gather by delimiter
            coms[path].parser = coms[path].pipe(new DelimiterParser({ delimiter: delimiter }))
            coms[path].parser.on('data', (buffer) => onBuffer(path, buffer))
        }

        await db.status.write()
        return 'ok'
    },
    set: async (path, key, value) => {
        const status = db.status.getKey(path)
        const validKeys = ["baudrate", "encoding", "delimiter"]

        // Errors
        if (!status) return `error port '${path}' does NOT exist`
        else if (status.isOpen) return `error port '${path}' is open`
        else if (!validKeys.some(validKey => key === validKey)) return `error key '${key}' is NOT valid`

        // Set
        status[key] = value
        db.status.setKey(path, status)
        await db.status.write()

        return "ok"
    },
    setBaudrate: async (path, baudrate) => port.set(path, "baudrate", baudrate),
    setEncoding: async (path, encoding) => port.set(path, "encoding", encoding),
    setDelimiter: async (path, delimiter) => port.set(path, "delimiter", delimiter),
    send: (path, data, encoding = "ascii") => {
        const status = db.status.getKey(path)

        // Errors
        if (!status || !status.isOpen) return `error p '${path}' is NOT open`

        // Prepare data
        if (status.delimiter !== "none" && status.delimiter !== "") {
            data += status.delimiter
        }
        if (encoding === "hex") {
            data = removeAllSeperatorsFromHex(data)
        } else {
            encoding = "ascii"
            data = removeEscapeCharsFromAscii(data)
        }

        // Send
        try { coms[path].write(Buffer.from(data, encoding)) }
        catch (err) { return `error port '${path}' could NOT send "${data}"` }
        // console.log("send:\t", addEscapeCharsToAscii(data))

        // History
        const dataObj = {
            wasReceived: false,
            timestamp: new Date(Date.now()).toISOString(),
            encoding: encoding,
            data: data,
        }
        const history = db.history.getKey(path)
        history.push(dataObj)
        if (history.length > db.settings.getKey("MAX_HISTORY_LENGTH")) history.shift()
        db.history.setKey(path, history)

        return "ok"
    },
    close: (path) => {
        const status = db.status.getKey(path)

        // Errors
        if (!status || !status.isOpen) return `error port '${path}' is NOT open`

        // Close
        coms[path].close(async error => {
            console.log("serial-v1:", error);
        })

        return "ok"
    },
    remove: async (path) => {
        const status = db.status.getKey(path)

        // Errors
        if (!status) return `error port '${path}' does NOT exist`

        // Remove
        try {
            port.close(path)
            await db.status.removeKey(path)
            await db.history.removeKey(path)
        } catch (err) {
            return `error port '${path}' could NOT be closed "${err.message}"`
        }

        return "ok"
    },
}
const ports = {
    get: () => db.status.get(),
    sub: (callback) => db.status.sub(callback),
    unsub: (callback) => db.status.unsub(callback),
    send: async (data) => {
        db.status.keys().forEach(path => port.send(path, data))
        return 'ok'
    },
    close: async () => {
        db.status.keys().forEach(path => port.close(path))
        return 'ok'
    },
    remove: async () => {
        db.status.keys().forEach(path => port.remove(path))
        log.warn(db.status.keys(), db.status.keys());
        return 'ok'
    },
}
const data = {
    get: (path) => {
        const history = db.history.getKey(path)
        return history[history.length-1]
    },
    sub: (path, callback) => db.history.subKey(path, history => {
        callback(history[history.length-1])
    }),
    unsub: (path, callback) => db.history.unsubKey(path, history => {
        callback(history[history.length-1])
    }),
}
const history = {
    get: (path) => db.history.getKey(path),
    sub: (path, callback) => db.history.subKey(path, callback),
    unsub: (path, callback) => db.history.unsubKey(path, callback),
}
const logger = {
    port: {
        open: (path, baudrate = 9600, encoding = "ascii", delimiter = "none") => log.call(port.open, "port.open")(path, baudrate, encoding, delimiter),
        set: (path, key, value) => log.call(port.set, "port.set")(path, key, value),
        setBaudrate: (path, baudrate) => log.call(port.setBaudrate, "port.setBaudrate")(path, baudrate),
        setEncoding: (path, encoding) => log.call(port.setEncoding, "port.setEncoding")(path, encoding),
        setDelimiter: (path, delimiter) => log.call(port.setDelimiter, "port.setDelimiter")(path, delimiter),
        send: (path, data, encoding = "ascii") => log.call(port.send, "port.send")(path, data, encoding),
        close: (path) => log.call(port.close, "port.close")(path),
        remove: (path) => log.call(port.remove, "port.remove")(path),
    },
    ports: {
        send: (data) => log.call(ports.send, "ports.send")(data),
        close: () => log.call(ports.close, "ports.close")(),
        remove: () => log.call(ports.remove, "ports.remove")(),
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

// Startup
await log.call(available.pollStart, "available.pollStart")()
