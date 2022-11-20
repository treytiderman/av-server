const { SerialPort } = require('serialport')
const { DelimiterParser } = require('@serialport/parser-delimiter')

// Variables
const CR = { hex: "0D", ascii: "\r" }
const LF = { hex: "0A", ascii: "\n" }
const baudRates = [9600, 14400, 19200, 38400, 57600, 115200]
let ports = {
  // examplePath: {
  //   path: "path",
  //   isOpen: false,
  //   baudRate: "baudRate",
  //   delimiter: "delimiter",
  //   tx: [],
  //   txFail: [],
  //   rx: [],
  //   rxRaw: [],
  //   error: null,
  //   portObj: "new SerialPort({ path: path, baudRate: baudRate })"
  // }
}

// Functions
const logInConsole = true
function log(text) {
  const logger = require('../modules/log')
  text = text.replace("\n", "\\n")
  text = text.replace("\r", "\\r")
  logger.log(text, "../public/logs/", 'serial', logInConsole)
}

function open(path, baudRate = 9600, delimiter = "\r\n") {
  log(`open(${path}, ${baudRate}, ${delimiter})`)

  // Stop if the path is already open
  if (ports[path] !== undefined) {
    return { "error": "port already open" }
  }

  // Open connection and create port object
  ports[path] = {
    path: path,
    portObj: new SerialPort({ path: path, baudRate: baudRate }),
    isOpen: false,
    baudRate: baudRate,
    delimiter: delimiter,
    txrx: [],
    tx: [],
    txFail: [],
    rx: [],
    rxRaw: [],
    error: null,
  }
  ports[path].portObj.on('error', (err) => {ports[path].error = err; log(ports[path].error)})
  ports[path].portObj.on('open', () => ports[path].isOpen = true)
  ports[path].portObj.on('close', () => ports[path].isOpen = false)
  
  // Listen for any new data
  ports[path].portObj.on('data', (data) => {
    // Create rxObj
    let rxObj = { buffer: data }
    rxObj.timestamp = new Date(Date.now()).toISOString(),
    rxObj.ascii = rxObj.buffer.toString('ascii'),
    rxObj.hex = rxObj.buffer.toString('hex'),
    rxObj.crlf = rxObj.ascii.endsWith("\r\n"),
    rxObj.lf = rxObj.ascii.endsWith("\n"),
    rxObj.cr = rxObj.ascii.endsWith("\r"),
    // Add rxObj to array
    ports[path].rxRaw.push(rxObj)
    // Remove the first element from the array if its length is greater than 1000
    if (ports[path].rxRaw.length > 1000) ports[path].rxRaw.shift()
  })

  // Listen for new data that ends with the delimiter
  const parser = ports[path].portObj.pipe(new DelimiterParser({ delimiter: delimiter }))
  parser.on('data', (data) => {
    // Create rxObj
    let rxObj = { buffer: data }
    rxObj.timestamp = new Date(Date.now()).toISOString(),
    rxObj.ascii = rxObj.buffer.toString('ascii'),
    rxObj.hex = rxObj.buffer.toString('hex'),
    // Add rxObj to array
    ports[path].rx.push(rxObj)
    // Remove the first element from the array if its length is greater than 1000
    if (ports[path].rx.length > 1000) ports[path].rx.shift()
  })

  // Return
  let portCopy = JSON.parse(JSON.stringify(ports[path]))
  portCopy.portObj = "for server use only"
  return portCopy
}
function send(path, message, messageType, cr = false, lf = false) {
  log(`send(${path}, ${message}, ${messageType}, ${cr}, ${lf})`)

  // Stop if the path is already open
  console.log("\n", ports[path] === undefined);
  if (ports[path] === undefined) {
    return { "error": "port is not defined, open the port first then send" }
  }

  // Create send object
  let txObj = {
    timestamp: new Date(Date.now()).toISOString(),
    message: message,
    messageType: messageType,
    cr: cr,
    lf: lf
  }

  // If the serial port isn't open exit
  if (ports[path].isOpen === false) {
    ports[path].txFail.push(txObj)
    if (ports[path].txFail.length > 1000) ports[path].txFail.shift()
    return txObj
  }

  // Serial Port is good to go prepare and send message
  if (messageType === "ascii") {
    txObj.messageToSend = message + (cr ? CR.ascii : "") + (lf ? LF.ascii : "")
    txObj.buffer = Buffer.from(txObj.messageToSend, "ascii")
  }
  else if (messageType === "hex") {
    txObj.messageToSend = message + (cr ? CR.hex : "") + (lf ? LF.hex : "")
    txObj.buffer = Buffer.from(txObj.messageToSend, "hex")
  }
  ports[path].portObj.write(txObj.buffer)
  ports[path].tx.push(txObj)
  // Remove the first element from the array if its length is greater than 1000
  if (ports[path].tx.length > 1000) ports[path].tx.shift()
  return txObj

}
function close(path) {
  log(`close(${path})`)
  ports[path].portObj.close((err) => ports[path].closeError)

  // Return
  let portCopy = JSON.parse(JSON.stringify(ports[path]))
  portCopy.portObj = "for server use only"
  return portCopy
}

async function getAvailablePorts() {
  log(`list()`)
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
  log(`getData()`)
  let portsReturn = {}
  Object.entries(ports).forEach(port => {
    const [name, object] = port
    let portCopy = JSON.parse(JSON.stringify(ports[name]))
    portCopy.portObj = "for server use only"
    portsReturn[name] = portCopy
  })
  return portsReturn
}
function getPort(path) {
  if (ports[path] === undefined) {
    log(`getPort(${path}) doesn't exist`)
    return { "error": "port hasn't been open before" }
  }
  log(`getPort(${path})`)
  let portCopy = JSON.parse(JSON.stringify(ports[path]))
  portCopy.portObj = "for server use only"
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