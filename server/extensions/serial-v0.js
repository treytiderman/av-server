// Overview: use COM ports to send serial commands

// Imports
import { SerialPort } from 'serialport'
import { DelimiterParser } from '@serialport/parser-delimiter'
import { Logger } from './logger.js'
import { Store } from './store.js'

// Exports
export {
    db,

    available,
    open,
    send,
    close,
    remove,

    // setBaudrate,
    // setDelimiter,
    // setEncoding,

    // openAll,
    // sendAll,
    // closeAll,
    // removeAll,
}

// Constants
const CR = { hex: "0D", ascii: "\r" }
const LF = { hex: "0A", ascii: "\n" }
const HEX_SEPERATORS = ["\\x", "0x", " "]
const BAUDRATES = [9600, 14400, 19200, 38400, 57600, 115200]
const ENCODINGS = ["ascii", "hex"]
const MAX_HISTORY_LENGTH = 1000

// Variables
const logger = new Logger("modules/serial.js")
const db = new Store("serial-ports")
const ports = {}

// Startup
await db.create({})
await dbStartupReset()
await logger.call(available)()
setInterval(available, 1000);

// Helper Functions
async function dbStartupReset() {
    const statusKeys = db.getKeys().filter(key => key.endsWith("-status"))
    statusKeys.forEach(key => {
        const port = db.getKey(key)
        port.isOpen = false
        db.setKey(key, port)
    })
    await db.write()
}
function removeEscapeCharsFromAscii(text) {
    if (typeof text !== "string") return text
    text = text.replace(/\\r/g, CR.ascii)
    text = text.replace(/\\n/g, LF.ascii)
    return text
}
function removeAllSeperatorsFromHex(text) {
    if (typeof text !== "string") return text
    text = text.replace(/\\x/g, "")
    text = text.replace(/0x/g, "")
    text = text.replace(/ /g, "")
    return text
}
function addEscapeCharsToAscii(text) {
    text = text.replace(/\r/g, "\\r")
    text = text.replace(/\n/g, "\\n")
    return text
}

// Functions
/**
 * 
 * @returns 
 */
async function available() {
    db.setKey("available", [])
    try {
        const list = await SerialPort.list()
        db.setKey("available", list)
        await db.write()
        return list
    } catch (err) {
        const error = `error could NOT get available serial ports (${err.message})`
        db.setKey("available", [error])
        await db.write()
        return error
    }
    /* Example response
    [
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
    ]
    */
}

/** Open serial port by path.
 * @param {string} path 
 * @param {string|number} [baudRate = 9600] baud rate of serial port
 * @param {string} encoding see the data in "ascii" or "hex"
 * @param {string} delimiter expected delimiter such as "\r\n". leave blank "" or "none" to receive all data.
 * @returns {Promise<string>} Promise<"ok" or "error...">
 * @example
 *     open('COM1', 9600, "ascii", "\r\n")
 *     open('COM2', 14400, "hex", "0D0A")
 */ 
async function open(path, baudRate = 9600, encoding = "ascii", delimiter = "none") {
    const port = db.getKey(path + "-status")

    // Errors
    if (port?.isOpen === true) return `error ${path} already open`

    // Unescape the delimiter if needed
    delimiter = delimiter.replace(/\\r/g, CR.ascii)
    delimiter = delimiter.replace(/\\n/g, LF.ascii)

    // Force encoding
    if (encoding !== "ascii" && encoding !== "hex") encoding = "ascii"
    if (encoding === "hex") delimiter = removeAllSeperatorsFromHex(delimiter)
    console.log("delimiter:", addEscapeCharsToAscii(delimiter));

    // New serial port
    ports[path] = new SerialPort({ path: path, baudRate: Number(baudRate) })
    db.setKey(path + "-data", undefined)
    db.setKey(path + "-history", [])
    db.setKey(path + "-status", {
        isOpen: false,
        path: path,
        baudRate: baudRate,
        encoding: encoding,
        delimiter: delimiter,
    })

    // Events
    ports[path].on('open', () => onOpen(path))
    ports[path].on('close', () => onClose(path))
    ports[path].on('error', (error) => onError(path, error))

    if (delimiter === "none" || delimiter === "") {
        ports[path].on('data', (data) => onRawData(path, data)) // Raw received data
    } else {
        ports[path].parser = ports[path].pipe(new DelimiterParser({ delimiter: delimiter }))
        ports[path].parser.on('data', (data) => onData(path, data)) // Gather by delimiter
    }

    // delay by 200ms because send function will not work for about 60ms after port is opened
    return new Promise(resolve => setTimeout(() => resolve("ok"), 200));
}
async function onOpen(path) {
    const port = db.getKey(path + "-status")
    port.isOpen = true
    db.setKey(path + "-status", port)
    await db.write()
}
async function onClose(path) {
    const port = db.getKey(path + "-status")
    port.isOpen = false
    db.setKey(path + "-status", port)
    await db.write()
}
async function onError(path, error) {
    db.setKey(path + "-error", error.message)
    await db.write()
}
async function onRawData(path, data) {
    const port = db.getKey(path + "-status")
    console.log("rx raw:\t", addEscapeCharsToAscii(data.toString(port.encoding)))
}
async function onData(path, data) {
    const port = db.getKey(path + "-status")
    const history = db.getKey(path + "-history")
    const rxObj = {
        wasReceived: true,
        timestampISO: new Date(Date.now()).toISOString(),
        encoding: port.encoding,
        data: data.toString(port.encoding) + port.delimiter,
    }
    console.log("receive:", addEscapeCharsToAscii(rxObj.data))

    // Add to history
    history.push(rxObj)
    if (history.length > MAX_HISTORY_LENGTH) history.shift()

    // Updata db
    db.setKey(path + "-data", rxObj)
    db.setKey(path + "-history", history)
    await db.write()
}

/** Send data out a serial port
 * @param {*} path 
 * @param {*} data 
 * @param {*} encoding 
 * @returns 
 */
async function send(path, data, encoding = "ascii") {
    const port = db.getKey(path + "-status")
    const history = db.getKey(path + "-history")

    // Errors
    if (!port || port?.isOpen !== true) return `error ${path} NOT open`

    // Prepare data
    data += port.delimiter
    if (encoding === "hex") {
        data = removeAllSeperatorsFromHex(data)
    } else {
        encoding = "ascii"
        data = removeEscapeCharsFromAscii(data)
    }

    // Create send object
    const txObj = {
        wasReceived: false,
        timestampISO: new Date(Date.now()).toISOString(),
        encoding: encoding,
        data: data,
    }
    console.log("send:\t", addEscapeCharsToAscii(data))

    // Send
    ports[path].write(Buffer.from(data, encoding))

    // Add to history
    history.push(txObj)
    if (history.length > MAX_HISTORY_LENGTH) history.shift()

    // Updata db
    db.setKey(path + "-data", txObj)
    db.setKey(path + "-history", history)
    await db.write()

    return "ok"
}

/**
 * 
 * @param {*} path 
 * @returns 
 */
async function close(path) {
    const port = db.getKey(path + "-status")

    // Errors
    if (!port || port?.isOpen !== true) return `error ${path} NOT open`

    // Close
    ports[path].close(async error => {
        db.setKey(path + "-error", error.message)
        await db.write()
    })

    return "ok"
}

/**
 * 
 * @param {*} path 
 * @returns 
 */
async function remove(path) {
    db.deleteKey(path + "-status")
    db.deleteKey(path + "-history")
    db.deleteKey(path + "-data")
    db.deleteKey(path + "-error")

    return "ok"
}
