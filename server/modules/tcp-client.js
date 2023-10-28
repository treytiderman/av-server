// Overview: connect to TCP servers

// Imports
import { Socket } from 'net'
import { Logger } from './logger.js'
import { EventEmitter } from 'events'
import { createDatabase } from './database.js'

// Exports
export {
    emitter, // "open", "error", "close", "receive", "send", "reconnect"

    open,
    reconnect,
    send,
    setEncoding,
    close,
    remove,

    openAll,
    // sendAll,
    closeAll,
    removeAll,

    getClient,
    getClients,
    getHistory,

    getClientWithHistory,
    getClientsWithHistory,
}

// Constants
const hexSeperators = ["\\x", "0x", " "]
const CR = { hex: "0D", ascii: "\r" }
const LF = { hex: "0A", ascii: "\n" }
const CONNECT_TIMEOUT = 2000
const RECONNECT_TIMER = 5000
const MAX_HISTORY_LENGTH = 1000
const DEFAULT_STATE = {
    clients: {},
}

// Variables
const log = new Logger("tcp-client.js")
const emitter = new EventEmitter()
const db = await createDatabase("tcp-client", DEFAULT_STATE)
const sockets = {}
const timeouts = {}

// Startup
dbResetClientsIsOpen()

// Helper Functions
function dbResetClientsIsOpen() {
    Object.keys(db.data.clients).forEach(address => {
        db.data.clients[address].isOpen = false
    })
}
function addEscapeCharsToAscii(text) {
    text = text.replace(/\r/g, "\\r")
    text = text.replace(/\n/g, "\\n")
    return text
}
function removeEscapeCharsFromAscii(text) {
    if (typeof text !== "string") return text
    text = text.replace(/\\r/g, CR.ascii)
    text = text.replace(/\\n/g, LF.ascii)
    return text
}
function removeAlleperatorsFromHex(text) {
    if (typeof text !== "string") return text
    text = text.replace(/\\x/g, "")
    text = text.replace(/0x/g, "")
    text = text.replace(/ /g, "")
    return text
}

// Functions
function open(address, encoding = "ascii", callback = () => { }) {
    
    // Return bad address
    if (address.includes(":") === false) {
        const error = "error address must contain a ':' followed by a port number, for example '192.168.1.9:23'"
        log.error(`open("${address}") -> "${error}"`)
        emitter.emit('open', address, error)
        return error
    }

    log.debug(`trying open("${address}")`)
    const split = address.split(":")
    const ip = split[0]
    const port = split[1]

    // Return if the connection is already open
    if (db.data.clients[address]?.isOpen === true) {
        const error = "error connection already open"
        log.error(`open("${address}") -> "${error}"`)
        emitter.emit('open', address, error)
        return error
    }

    // Create socket and client object
    db.data.clients[address] = {
        isOpen: false,
        isReconnect: false,
        address: address,
        encoding: encoding,
        history: db.data.clients[address]?.history ?? [],
    }
    sockets[address] = new Socket()
    timeouts[address] = setTimeout(() => {
        log.error(`open("${address}") -> error could not connect to server in ${CONNECT_TIMEOUT}ms`)
        emitter.emit('open', address, `error could not connect to server in ${CONNECT_TIMEOUT}ms`)
        sockets[address].destroy()
    }, CONNECT_TIMEOUT)
    db.write()

    // Open event
    sockets[address].connect(port, ip, () => {
        clearTimeout(timeouts[address])
        db.data.clients[address].isOpen = true
        log.debug(`open("${address}") event: "open"`)
        emitter.emit('open', address, "ok")
        db.write()
        callback(address)
    })

    // Error event
    sockets[address].on('error', (error) => {
        clearTimeout(timeouts[address])
        emitter.emit('open', address, error)
    })

    // Close event
    sockets[address].on('close', () => {
        if (db.data.clients[address]?.isOpen) {
            db.data.clients[address].isOpen = false
        }
        log.debug(`open("${address}") event: "close"`)
        emitter.emit('close', address, "ok")
        db.write()
        if (db.data.clients[address]?.isReconnect) {
            reconnect(address, encoding, callback)
        }
    })

    // Data event
    sockets[address].on('data', (data) => {

        // Create receive object
        const hex = data.toString('hex')
        const ascii = data.toString('ascii')
        const rxObj = {
            wasReceived: true,
            timestampISO: new Date(Date.now()).toISOString(),
            encoding: "buffer",
            data: data,
        }

        // Add to history
        db.data.clients[address].history.push(rxObj)
        // If the history length is greater than MAX_HISTORY_LENGTH
        if (db.data.clients[address].history.length > MAX_HISTORY_LENGTH) {
            // Then remove the first/oldest element
            db.data.clients[address].history.shift()
        }

        // Encoding
        if (encoding === "ascii") {
            rxObj.data = ascii
            rxObj.encoding = encoding
            log.debug(`open("${address}") event: "data (ascii)" -> "${ascii}"`)
            emitter.emit('receive', address, rxObj)
        } else if (encoding === "hex") {
            rxObj.data = hex
            rxObj.encoding = encoding
            log.debug(`open("${address}") event: "data (hex)" -> "${hex}"`)
            emitter.emit('receive', address, rxObj)
        } else {
            log.debug(`open("${address}") event: "data (${encoding})" -> "${data}"`)
            emitter.emit('receive', address, rxObj)
        }
        db.write()
    })
}
function reconnect(address, encoding = "ascii", callback = () => { }) {
    if (db.data.clients[address]?.isOpen === true) close(address)
    log.debug(`trying reconnect("${address}")" in ${RECONNECT_TIMER}ms`)
    setTimeout(() => {
        emitter.emit('reconnect', address, encoding)
        open(address, encoding, callback)
    }, RECONNECT_TIMER);
}
function send(address, data, encoding = "ascii") {

    // Return if client is not defined
    if (db.data.clients[address] === undefined) {
        const error = "error client is not defined, open the connection first"
        log.error(`send("${address}") -> "${error}"`)
        // emitter.emit('send', address, error)
        return error
    }

    // Return if the client is closed
    else if (db.data.clients[address]?.isOpen === false) {
        const error = "error connection closed, open the connection first"
        log.error(`send("${address}") -> "${error}"`)
        // emitter.emit('send', address, error)
        return error
    }

    // Create send object
    const txObj = {
        wasReceived: false,
        timestampISO: new Date(Date.now()).toISOString(),
        encoding: encoding,
        data: data,
    }

    // Prepare buffer
    // let hex = ""
    // let ascii = ""
    let buffer = ""
    if (encoding === "hex") {
        buffer = removeAlleperatorsFromHex(data)
        buffer = Buffer.from(buffer, encoding)
        // hex = data
        // ascii = buffer.toString('ascii')
    } else if (encoding === "ascii") {
        buffer = removeEscapeCharsFromAscii(data)
        buffer = Buffer.from(buffer, encoding)
        // hex = buffer.toString('hex')
        // ascii = data
    } else {
        buffer = removeEscapeCharsFromAscii(data)
        buffer = Buffer.from(data, 'utf8')
    }

    // Send buffer
    sockets[address].write(buffer)

    // Add to history
    db.data.clients[address].history.push(txObj)
    // If the history length is greater than MAX_HISTORY_LENGTH
    if (db.data.clients[address].history.length > MAX_HISTORY_LENGTH) {
        // Then remove the first/oldest element
        db.data.clients[address].history.shift()
    }

    // Emit event
    log.debug(`send("${address}", "${data}", "${encoding}") -> "ok"`, txObj)
    emitter.emit('send', address, txObj)
    db.write()
    return "ok"
}
function setEncoding(address, encoding) {

    // Return if client is not defined
    if (db.data.clients[address] === undefined) {
        const error = "error client is not defined, open the connection first"
        log.error(`setEncoding("${address}", "${encoding}") -> "${error}"`)
        emitter.emit('setEncoding', address, encoding, error)
        return error
    }

    // Return if client is not defined
    if (db.data.clients[address].isOpen === true) {
        const error = "error connection open, close the connection first"
        log.error(`setEncoding("${address}", "${encoding}") -> "${error}"`)
        emitter.emit('setEncoding', address, encoding, error)
        return error
    }

    // Defined encodings
    if (encoding === "hex") {
        db.data.clients[address].encoding = encoding
    } else if (encoding === "ascii") {
        db.data.clients[address].encoding = encoding
    } else if (encoding === "utf8") {
        db.data.clients[address].encoding = encoding
    } else {
        db.data.clients[address].encoding = "ascii"
    }

    emitter.emit('setEncoding', address, encoding, db.data.clients[address].encoding)
    db.write()
}
function close(address) {
    log.debug(`trying close("${address}")`)

    // Return if client is not defined
    if (db.data.clients[address] === undefined) {
        const error = "error client is not defined, open the connection first"
        log.error(`close("${address}") -> "${error}"`)
        emitter.emit('close', address, error)
        return error
    }

    // Return if the client is already closed
    else if (db.data.clients[address]?.isOpen === false) {
        const error = "error client already closed"
        log.error(`close("${address}") -> "${error}"`)
        emitter.emit('close', address, error)
        return error
    }

    // Close connection
    sockets[address].end()
    db.data.clients[address].isReconnect = false
    return "ok"
}
function remove(address) {

    // Return if client is not defined
    if (db.data.clients[address] === undefined) {
        const error = "error client is not defined, open the connection first"
        log.error(`remove("${address}") -> "${error}"`)
        emitter.emit('remove', address, error)
        return error
    }

    // Close if open
    log.debug(`remove("${address}") -> "ok"`)
    if (db.data.clients[address]?.isOpen === true) {
        close(address)
    }

    delete db.data.clients[address]
    delete sockets[address]
    db.write()
}

function openAll() {
    Object.keys(db.data.clients).forEach(address => {
        open(address, db.data.clients[address].encoding)
    })
}
function closeAll() {
    Object.keys(db.data.clients).forEach(address => {
        close(address)
    })
}
function removeAll() {
    Object.keys(db.data.clients).forEach(address => {
        remove(address)
    })
}

function getClientWithHistory(address) {

    // Return if client is not defined
    if (db.data.clients[address] === undefined) {
        const error = "error client is not defined, open the connection first"
        // log.error(`getClientWithHistory("${address}") -> "${error}"`)
        return error
    }

    // log.debug(`getClientWithHistory("${address}") -> isOpen=${db.data.clients[address].isOpen}`, db.data.clients[address])
    return db.data.clients[address]
}
function getClientsWithHistory() {
    const array = []
    Object.keys(db.data.clients).forEach(address => {
        const clientWithHistory = getClientWithHistory(address)
        array.push(clientWithHistory)
    })
    // log.debug(`getClientsWithHistory() -> clients ${array.length}`, array)
    return array
}
function getClient(address) {
    const clientWithHistory = getClientWithHistory(address)
    const client = {
        isOpen: clientWithHistory.isOpen,
        isReconnect: clientWithHistory.isReconnect,
        address: clientWithHistory.address,
        encoding: clientWithHistory.encoding,
    }
    // log.debug(`getClient("${address}") -> ${JSON.stringify(client)}`, client)
    return client
}
function getClients() {
    const array = []
    Object.keys(db.data.clients).forEach(address => {
        const clientWithoutHistory = getClient(address)
        array.push(clientWithoutHistory)
    })
    // log.debug(`getClients() -> clients ${array.length}`, array)
    return array
}
function getHistory(address) {
    return getClientWithHistory(address).history ?? []
}

// Tests
// if (process.env.DEV_MODE) await runTests("tcp-client.js")
async function runTests(testName) {
    let pass = true
    log.info("...Running Tests")

    log.info(`...Tests pass: ${pass}`)
    if (pass !== true) console.log(testName, '\x1b[31mTESTS FAILED\x1b[0m')
}

// setTimeout(() => {
//     const address = "192.168.1.9:23"

//     close(address)
//     console.log("removeAll()", removeAll());

//     console.log("try open", address);
//     open(address, "ascii", () => {
//         const history = getHistory(address)
//         console.log("history", history);
//         console.log("data", history[history.length - 1]);
//         send(address, "hello")
//     })

//     // Events: "open", "error", "close", "receive", "send"
//     emitter.on("open", (address) => {
//         console.log("open", address);
//         console.log("client", getClient(address));
//     })
//     emitter.on("error", (address, error) => {
//         console.log("error", address, "->", error);
//     })
//     emitter.on("close", (address) => {
//         console.log("close");
//         console.log("client", getClients(address));
//         const history = getHistory(address)
//         console.log("history", history);
//         console.log("data", history[history.length - 1]);
//     })
//     emitter.on("receive", (address, data) => {
//         console.log("receive", address, "->", data);
//     })
//     emitter.on("send", (address, data) => {
//         console.log("send", address, "->", data);
//     })

//     // setTimeout(() => {
//     //     console.log("closeAll()", closeAll());
//     // }, 1000);

//     // setTimeout(() => {
//     //     console.log("openAll()", openAll());
//     // }, 1200);

//     // setTimeout(() => {
//     //     console.log("removeAll()", removeAll());
//     //     console.log("closeAll()", closeAll());
//     //     console.log("close(address)", close(address));
//     //     console.log("removeAll()", removeAll());
//     //     console.log("openAll()", openAll());
//     // }, 2000);

// }, 1000);

// setTimeout(() => {
//     const address = "192.168.1.32:23"

//     console.log("try open", address);
//     open(address, "ascii", () => {
//         send(address, "MVDOWN\r")
//     })

//     // Events: "open", "error", "close", "receive", "send"
//     emitter.on("open", (address) => {
//         console.log("open", address);
//         console.log("client", getClient(address));
//     })
//     emitter.on("error", (address, error) => {
//         console.log("error", address, "->", error);
//     })
//     emitter.on("close", (address) => {
//         console.log("close");
//     })
//     emitter.on("receive", (address, data) => {
//         console.log("receive", address, "->", data);
//     })
//     emitter.on("send", (address, data) => {
//         console.log("send", address, "->", data);
//     })

// }, 1000);