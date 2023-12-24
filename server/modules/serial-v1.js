// Overview: use COM ports to send serial commands

// Imports
import { SerialPort } from 'serialport'
import { DelimiterParser } from '@serialport/parser-delimiter'
import { Logger } from './logger.js'
import { EventEmitter } from 'events'
import { Database } from './database.js'

// Exports
export {
    MAX_HISTORY_LENGTH,
    RECONNECT_TIMER,
    LINE_FEED,
    CARRIAGE_RETURN,
    HEX_SEPERATORS,

    // Available
    available_get,
    available_sub,
    available_unsub,

    // Port
    port_get,
    port_sub,
    port_unsub,
    port_setBaudrate,
    port_setDelimiter,
    port_setEncoding,

    port_open,
    port_send,
    port_close,
    port_remove,

    // Data
    portData_sub,
    portData_unsub,
    
    // History
    portHistory_get,

    // All Ports
    allPorts_get,
    allPorts_sub,
    allPorts_unsub,
    allPorts_send,
    allPorts_close,
    allPorts_remove,
}

// Constants
const MAX_HISTORY_LENGTH = 1000
const RECONNECT_TIMER = 5000
const LINE_FEED = { hex: "0A", ascii: "\n" }
const CARRIAGE_RETURN = { hex: "0D", ascii: "\r" }
const HEX_SEPERATORS = ["\\x", "0x", " "]

// Variables
const log = new Logger("modules/serial.js")
const sockets = {}
const timeouts = {}
const dbAvailable = new Database("serial-available")
const dbPorts = new Database("serial-ports")

// Startup
await dbAvailable.create([])
await dbPorts.create({})
dbResetIsOpen()
getAvailable()

// Helper Functions
function dbResetIsOpen() {
    dbPorts.getData()
    Object.keys(dbPorts.getData()).forEach(address => {
        const port = dbPorts.getKey(address)
        port.isOpen = false
        dbPorts.setKey(address, port)
    })
}
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
function removeAlleperatorsFromHex(text) {
    if (typeof text !== "string") return text
    text = text.replace(/\\x/g, "")
    text = text.replace(/0x/g, "")
    text = text.replace(/ /g, "")
    return text
}

// Functions
async function getAvailable() {
    try {
        let list = await SerialPort.list()
        log.debug(`getAvailable() -> ${JSON.stringify(list)}`, list)
        dbAvailable.setData(list)
        return "ok"
    } catch (err) {
        const error = `error could NOT get available serial ports (${err.message})`
        log.debug(`getAvailable() -> ${error}`, err)
        dbAvailable.setData([error])
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
function open(path, baudRate = 9600, delimiter = "\r\n") {
    log(`open(${path}, ${baudRate}, ${delimiter})`)

    // Return if the connection is already open
    if (ports[path]?.isOpen === true) {
        const error = "connection already open"

        // Emit event
        log(`open ${path} ${error}`)
        emitter.emit('open', path, { error: error })

        // Return
        return error
    }

    // Unescape the delimiter if needed
    delimiter = delimiter.replace(/\\r/g, CARRIAGE_RETURN.ascii)
    delimiter = delimiter.replace(/\\n/g, LINE_FEED.ascii)
    delimiter = delimiter.replace(/\\x/g, "")
    delimiter = delimiter.replace(/0x/g, "")

    // Create port object
    ports[path] = {
        portObj: new SerialPort({ path: path, baudRate: baudRate }),
        isOpen: false,
        path: path,
        baudRate: baudRate,
        expectedDelimiter: delimiter,
        history: [],
        historyRaw: [],
        error: null,
    }

    // Event Open
    ports[path].portObj.on('open', () => {
        ports[path].isOpen = true

        // Emit event
        log(`open ${path}`)
        emitter.emit('open', path, {
            isOpen: true,
            path: path,
            baudRate: baudRate,
            expectedDelimiter: delimiter,
            error: null,
        })
    })

    // Event Error
    ports[path].portObj.on('error', (error) => {
        ports[path].error = error

        // Port not found
        if (error.message.includes("File not found")) {
            ports[path].error = "COM port / path not found"
        }

        // Emit event
        log(`error ${path} ${error}`)
        emitter.emit('error', path, { error: ports[path].error })
    })

    // Event Close
    ports[path].portObj.on('close', () => {
        ports[path].isOpen = false

        // Emit event
        log(`close ${path}`)
        emitter.emit('close', path, {
            isOpen: false,
            path: path,
            baudRate: baudRate,
            expectedDelimiter: delimiter,
            error: ports[path].error,
        })
    })

    // Listen for any new data
    ports[path].portObj.on('data', (data) => {

        // Create rxObj
        const rxObj = {
            wasReceived: true,
            timestampISO: new Date(Date.now()).toISOString(),
            hex: data.toString('hex'),
            ascii: data.toString('ascii'),
            buffer: data,
            error: null,
        }

        // Add to history
        ports[path].historyRaw.push(rxObj)

        // If the history length is greater than MAX_HISTORY_LENGTH
        if (ports[path].historyRaw.length > MAX_HISTORY_LENGTH) {
            // Then remove the first/oldest element
            ports[path].historyRaw.shift()
        }

        // Emit event
        log(`received ${path} ${JSON.stringify(data)}`)
        emitter.emit('receiveRaw', path, rxObj)
    })

    // Listen for new data that ends with the delimiter
    const parser = ports[path].portObj.pipe(new DelimiterParser({ delimiter: delimiter }))
    parser.on('data', (data) => {

        // Create rxObj
        const rxObj = {
            wasReceived: true,
            timestampISO: new Date(Date.now()).toISOString(),
            hex: data.toString('hex') + delimiter,
            ascii: data.toString('ascii') + delimiter,
            buffer: data,
            error: null,
        }

        // Add rxObj to array
        ports[path].history.push(rxObj)

        // If the history length is greater than MAX_HISTORY_LENGTH
        if (ports[path].history.length > MAX_HISTORY_LENGTH) {
            // Then remove the first/oldest element
            ports[path].history.shift()
        }

        // Emit event
        log(`received ${path} ${JSON.stringify(data)}`)
        emitter.emit('receive', path, rxObj)
    })

    // Return
    const portCopy = copyPortObj(ports[path])
    return portCopy
}