const { SerialPort } = require('serialport')
const { DelimiterParser } = require('@serialport/parser-delimiter')
const { Buffer } = require('node:buffer')

// Constants
const CR = { hex: "0D", ascii: "\r" }
const LF = { hex: "0A", ascii: "\n" }
const MAXLINES = 1000
const BAUDRATES = [9600, 14400, 19200, 38400, 57600, 115200]
const DATA_MODEL = {
  wasReceived: false,
  timestampISO: "time",
  hex: "EE FF CC 0D",
  ascii: "ka 01 00\r",
  buffer: null,
  error: "",
}
const PORT_MODEL = {
  path: "path",
  error: null,
  isOpen: false,
  baudRate: "baudRate",
  delimiter: "delimiter",
  portObj: "new SerialPort({ path: path, baudRate: baudRate })",
  data: [],
  dataRaw: [],
}

// Logging
const logInConsole = false
function log(text) {
  const logger = require('../modules/log')
  text = text.replace("\n", "\\n")
  text = text.replace("\r", "\\r")
  logger.log(text, "../public/logs/", 'serial', logInConsole)
}

// Functions
let ports = {}
function open(path, baudRate = 9600, delimiter = "\r\n") {
  log(`open(${path}, ${baudRate}, ${delimiter})`)

  // Stop if the path is already open
  if (ports[path]?.isOpen === true) {
    return { "error": "port already open" }
  }

  // Unescape the delimiter if needed
  delimiter = delimiter.replace(/\\r/g, CR.ascii)
  delimiter = delimiter.replace(/\\n/g, LF.ascii)
  // delimiter = delimiter.replace(/ /g, "")
  delimiter = delimiter.replace(/\\x/g, "")
  delimiter = delimiter.replace(/0x/g, "")

  // Open connection and create port object
  ports[path] = {
    path: path,
    error: null,
    isOpen: false,
    baudRate: baudRate,
    delimiter: delimiter,
    portObj: new SerialPort({ path: path, baudRate: baudRate }),
    data: [],
    dataRaw: [],
  }
  ports[path].portObj.on('error', (err) => {ports[path].error = err; log(ports[path].error)})
  ports[path].portObj.on('open', () => ports[path].isOpen = true)
  ports[path].portObj.on('close', () => ports[path].isOpen = false)
  
  // Listen for any new data
  ports[path].portObj.on('data', (data) => {
    // Create rxObj
    let rxObj = { 
      wasReceived: true,
      timestampISO: new Date(Date.now()).toISOString(),
      hex: data.toString('hex'),
      ascii: data.toString('ascii'),
      buffer: data,
      error: "",
    }
    // Add rxObj to array
    ports[path].dataRaw.push(rxObj)
    // Remove the first element from the array if its length is greater than MAXLINES
    if (ports[path].dataRaw.length > MAXLINES) ports[path].dataRaw.shift()
  })

  // Listen for new data that ends with the delimiter
  const parser = ports[path].portObj.pipe(new DelimiterParser({ delimiter: delimiter }))
  parser.on('data', (data) => {
    // Create rxObj
    let rxObj = { 
      wasReceived: true,
      timestampISO: new Date(Date.now()).toISOString(),
      hex: data.toString('hex') + delimiter,
      ascii: data.toString('ascii') + delimiter,
      buffer: data,
      error: "",
    }
    // Add rxObj to array
    ports[path].data.push(rxObj)
    // Remove the first element from the array if its length is greater than MAXLINES
    if (ports[path].data.length > MAXLINES) ports[path].data.shift()
  })

  // Return
  let portCopy = JSON.parse(JSON.stringify(ports[path]))
  portCopy.portObj = "for server use only"
  portCopy.isOpen = true
  return portCopy
}
function send(path, message, messageType, cr = false, lf = false) {
  log(`send(${path}, ${message}, ${messageType}, ${cr}, ${lf})`)

  // Stop if the port not defined
  if (ports[path] === undefined) {
    return { "error": "port is not defined, open the port first then send" }
  }

  // Create send object
  let txObj = {
    wasReceived: false,
    timestampISO: new Date(Date.now()).toISOString(),
    hex: "",
    ascii: "",
    buffer: "",
    error: "",
  }

  // Transform the message
  if (messageType === "ascii") {
    message = message.replace(/\\r/g, CR.ascii)
    message = message.replace(/\\n/g, LF.ascii)
    const messageToSend = message + (cr ? CR.ascii : "") + (lf ? LF.ascii : "")
    txObj.buffer = Buffer.from(messageToSend, 'ascii')
    txObj.ascii = messageToSend
    txObj.hex = txObj.buffer.toString('hex')
  }
  else if (messageType === "hex") {
    message = message.replace(/ /g, "")
    message = message.replace(/\\x/g, "")
    message = message.replace(/0x/g, "")
    const messageToSend = message + (cr ? CR.hex : "") + (lf ? LF.hex : "")
    txObj.buffer = Buffer.from(messageToSend, 'hex')
    txObj.hex = messageToSend
    txObj.ascii = txObj.buffer.toString('ascii')
  }

  // If the serial port isn't open exit
  if (ports[path].isOpen === false) {
    txObj.error = "message not sent, port not open"
    // Add sent message to data array
    ports[path].data.push(txObj)
    ports[path].dataRaw.push(txObj)
    // Remove the first element from the array if its length is greater than MAXLINES
    if (ports[path].data.length > MAXLINES) ports[path].data.shift()
    if (ports[path].dataRaw.length > MAXLINES) ports[path].dataRaw.shift()
    return txObj
  }

  // Send message
  ports[path].portObj.write(txObj.buffer)
  // Add sent message to data array
  ports[path].data.push(txObj)
  ports[path].dataRaw.push(txObj)
  // Remove the first element from the array if its length is greater than MAXLINES
  if (ports[path].data.length > MAXLINES) ports[path].data.shift()
  if (ports[path].dataRaw.length > MAXLINES) ports[path].dataRaw.shift()
  return txObj

}
function close(path) {
  log(`close(${path})`)

  // Stop if the port not defined
  if (ports[path] === undefined) {
    return { "error": "port is not defined, open the port first then close" }
  }
  
  // Stop if the path is already open
  if (ports[path]?.isOpen === false) {
    return { "error": "port already closed" }
  }

  // Close Port
  ports[path].portObj.close((err) => ports[path].error)

  // Return
  let portCopy = JSON.parse(JSON.stringify(ports[path]))
  portCopy.portObj = "for server use only"
  portCopy.isOpen = false
  return portCopy
}

async function getAvailablePorts() {
  log(`getAvailablePorts()`)
  let list = await SerialPort.list()
  return list
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
function getPorts() {
  log(`getPorts()`)
  // Remove portObj from returned object
  let portsReturn = {}
  Object.entries(ports).forEach(port => {
    const [name, object] = port
    let portCopy = JSON.parse(JSON.stringify(ports[name]))
    portCopy.portObj = "for server use only"
    portsReturn[name] = portCopy
  })
  // Return ports
  return portsReturn
}
function getPort(path) {
  // Stop if port not defined / open
  if (ports[path] === undefined) {
    log(`getPort(${path}) doesn't exist`)
    return { "error": "port hasn't been open before" }
  }
  // Remove portObj from returned object
  let portCopy = JSON.parse(JSON.stringify(ports[path]))
  portCopy.portObj = "for server use only"
  // Return port
  log(`getPort(${path})`)
  return portCopy
}

// Export
exports.open = open
exports.send = send
exports.close = close

exports.getAvailablePorts = getAvailablePorts
exports.getPorts = getPorts
exports.getPort = getPort

/* Example

const serialport = require("./serialport.js")

serialport.getAvailablePorts().then(list => console.log(list))

serialport.open("COM3", 9600, "\r\n")
serialport.open("COM4", 38400, "\r\n")
serialport.open("COM87", 9600, "\r\n")

setTimeout(() => {
  serialport.send("COM3", "PWR", "ascii", true, true)
}, 1000)

setTimeout(() => {
  serialport.send("COM4", "PWR", "ascii", true, true)
}, 2000)

setTimeout(() => {
  serialport.send("COM3", "PWR2", "ascii", true, true)
}, 3000)

setTimeout(() => {
  serialport.send("COM87", "PWR3", "ascii", true, true)
}, 4000)

setTimeout(() => {
  console.log(serialport.getPorts())
}, 5000)

*/