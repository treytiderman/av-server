// Overview: connect to TCP servers

// Imports
// import { Socket } from 'net'
import net from 'net'
import { Logger } from './logger.js'
import { EventEmitter } from 'events'
import { createDatabase } from './database.js'

// Exports
export {
    open,
    send,
    close,

    getClient,
    getClients,

    getClientWithHistory,
    getClientsWithHistory,

    emitter,
}

// Constants
const CR = { hex: "0D", ascii: "\r" }
const LF = { hex: "0A", ascii: "\n" }
const MAX_HISTORY_LENGTH = 1000
const DATA_MODEL = {
    wasReceived: false,
    timestampISO: "time",
    hex: "EE FF CC 0D",
    ascii: "ka 01 00\r",
    buffer: null,
    error: null,
}
const TCP_CLIENT_MODEL = {
    clientObj: "for server use only",
    isOpen: false,
    address: "192.168.1.246:23",
    expectedDelimiter: "\r\n",
    history: [DATA_MODEL],
    error: null,
}
const DEFAULT_STATE = {
    clients: {},
}

// Variables
const log = new Logger("tcp-client.js")
const emitter = new EventEmitter()
const db = await createDatabase("tcp-client", DEFAULT_STATE)
const sockets = {}

// Helper Functions
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
function removeSeperatorsFromHex(text) {
    if (typeof text !== "string") return text
    text = text.replace(/\\x/g, "")
    text = text.replace(/0x/g, "")
    text = text.replace(/ /g, "")
    return text
}

function open(address, callback = () => { }) {
    log.debug(`open("${address}")`)
    const split = address.split(":")
    const ip = split[0]
    const port = split[1]

    // Return if the connection is already open
    if (db.data.clients[address]?.isOpen === true) {
        const error = "error socket already open"
        log.error(`open("${address}") -> "${error}"`)
        emitter.emit('open', address, error)
        return error
    }

    // Create socket and client object
    sockets[address] = new net.Socket()
    db.data.clients[address] = {
        isOpen: false,
        address: address,
        history: [],
    }

    // Open event
    sockets[address].connect(port, ip, () => {
        db.data.clients[address].isOpen = true
        log.debug(`open("${address}") event: "open"`)
        emitter.emit('open', address, "ok")
        callback(address)
    })

    // Error event
    sockets[address].on('error', (error) => {
        log.error(`open("${address}") event: "error" -> "error code ${error.code}"`, error)
        emitter.emit('error', address, error)
        console.log(error);
    })

    // Close event
    sockets[address].on('close', () => {
        db.data.clients[address].isOpen = false
        log.debug(`open("${address}") event: "close"`)
        emitter.emit('close', address, "ok")
    })

    // Data event
    sockets[address].on('data', (data) => {

        // Create receive object
        const rxObj = {
            wasReceived: true,
            timestampISO: new Date(Date.now()).toISOString(),
            hex: data.toString('hex'),
            ascii: data.toString('ascii'),
            buffer: data,
        }

        // Add to history
        db.data.clients[address].history.push(rxObj)
        // If the history length is greater than MAX_HISTORY_LENGTH
        if (db.data.clients[address].history.length > MAX_HISTORY_LENGTH) {
            // Then remove the first/oldest element
            db.data.clients[address].history.shift()
        }

        // Emit event
        log.debug(`open("${address}") event: "data" -> "${rxObj.ascii}"`)
        emitter.emit('receive', address, rxObj)
    })

    return "ok"
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
    return "ok"
}
function send(address, data, encoding = "ascii") {

    // Return if client is not defined
    if (db.data.clients[address] === undefined) {
        const error = "error client is not defined, open the connection first"
        log.error(`send("${address}") -> "${error}"`)
        emitter.emit('send', address, error)
        return error
    }

    // Return if the client is closed
    else if (db.data.clients[address]?.isOpen === false) {
        const error = "error connection closed, open the connection first"
        log.error(`send("${address}") -> "${error}"`)
        emitter.emit('send', address, error)
        return error
    }

    // Create send object
    const txObj = {
        wasReceived: false,
        timestampISO: new Date(Date.now()).toISOString(),
        hex: "",
        ascii: "",
        buffer: undefined,
    }

    // Prepare data
    if (encoding === "ascii") {
        data = removeEscapeCharsFromAscii(data)
        txObj.ascii = data
        txObj.buffer = Buffer.from(data, 'ascii')
        txObj.hex = txObj.buffer.toString('hex')
    }
    else if (encoding === "hex") {
        data = removeSeperatorsFromHex(data)
        txObj.hex = data
        txObj.buffer = Buffer.from(data, 'hex')
        txObj.ascii = txObj.buffer.toString('ascii')
    }

    // Send data
    sockets[address].write(txObj.buffer)

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
    return "ok"
}
function getClientWithHistory(address) {

    // Return if client is not defined
    if (db.data.clients[address] === undefined) {
        const error = "error client is not defined, open the connection first"
        log.error(`getClient("${address}") -> "${error}"`)
        return error
    }

    log.debug(`getClientWithHistory("${address}") -> isOpen=${db.data.clients[address].isOpen}`, db.data.clients[address])
    return db.data.clients[address]
}
function getClientsWithHistory() {
    const array = []
    db.data.clients.forEach(client => {
        const clientWithHistory = getClientWithHistory(client.address)
        array.push(clientWithHistory)
    })
    log.debug(`getClientsWithHistory() -> clients ${array.length}`, array)
    return array
}
function getClient(address) {
    const clientWithHistory = getClientWithHistory(address)
    const client = {
        isOpen: clientWithHistory.isOpen,
        address: clientWithHistory.address,
    }
    log.debug(`getClient("${address}") -> isOpen=${client.isOpen}`, client)
    return client
}
function getClients() {
    const array = []
    db.data.clients.forEach(client => {
        const clientWithoutHistory = getClient(client.address)
        array.push(clientWithoutHistory)
    })
    log.debug(`getClients() -> clients ${array.length}`, array)
    return array
}

// Tests
if (process.env.DEV_MODE) await runTests("tcp-client.js")
async function runTests(testName) {
    let pass = true
    log.info("...Running Tests")

    // const address = "192.168.1.9:23"
    // open(address, () => {
    //     send(address, "hello")
    // })

    pass = false

    log.info(`...Tests pass: ${pass}`)
    if (pass !== true) console.log(testName, '\x1b[31mTESTS FAILED\x1b[0m')
}

// let socket = new Socket()
// socket.on()

// var s = require('net').Socket();
// s.connect(80, 'google.com');
// s.write('GET http://www.google.com/ HTTP/1.1\n\n');

// s.on('data', function(d){
//     console.log.debug(d.toString());
// });

// s.end();

// Testing
// const IP = "192.168.1.246"
// const PORT = "23"
// open(IP, PORT)
// setTimeout(() => send(IP, PORT, "PWON\r"), 1 * 1000)
// setTimeout(() => send(IP, PORT, "NSA\r"), 2 * 1000)
// setTimeout(() => send(IP, PORT, "MV?\r"), 3 * 1000)
// setTimeout(() => send(IP, PORT, "MVUP\r"), 4 * 1000)
// setTimeout(() => send(IP, PORT, "MVUP\r"), 5 * 1000)
// setTimeout(() => send(IP, PORT, "MV?\r"), 6 * 1000)
// setTimeout(() => send(IP, PORT, "PWSTANDBY\r"), 9 * 1000)
// setTimeout(() => close(IP, PORT), 10 * 1000)

