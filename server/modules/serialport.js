const { SerialPort } = require('serialport')
const { DelimiterParser } = require('@serialport/parser-delimiter')

// Variables
const CR = { hex: "0D", ascii: "\r" }
const LF = { hex: "0A", ascii: "\n" }
const baudRates = [9600, 14400, 19200, 38400, 57600, 115200]
let ports = {
  // example: {
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

function open(name, path, baudRate = 9600, delimiter = "\r\n") {
  log(`open(${name}, ${path}, ${baudRate}, ${delimiter})`)

  // Open connection and create port object
  ports[name] = {
    path: path,
    isOpen: false,
    baudRate: baudRate,
    delimiter: delimiter,
    tx: [],
    txFail: [],
    rx: [],
    rxRaw: [],
    error: null,
    portObj: new SerialPort({ path: path, baudRate: baudRate })
  }
  ports[name].portObj.on('error', (err) => {ports[name].error = err; console.log(ports[name].error)})
  ports[name].portObj.on('open', () => ports[name].isOpen = true)
  ports[name].portObj.on('close', () => ports[name].isOpen = false)
  
  // Listen for any new data
  ports[name].portObj.on('data', (data) => {
    // Create rxObj
    let rxObj = { buffer: data }
    rxObj.timestamp = new Date(Date.now()).toISOString(),
    rxObj.ascii = rxObj.buffer.toString('ascii'),
    rxObj.hex = rxObj.buffer.toString('hex'),
    rxObj.crlf = rxObj.ascii.endsWith("\r\n"),
    rxObj.lf = rxObj.ascii.endsWith("\n"),
    rxObj.cr = rxObj.ascii.endsWith("\r"),
    // Add rxObj to array
    ports[name].rxRaw.push(rxObj)
    // Remove the first element from the array if its length is greater than 1000
    if (ports[name].rxRaw.length > 1000) ports[name].rxRaw.shift()
  })

  // Listen for new data that ends with the delimiter
  const parser = ports[name].portObj.pipe(new DelimiterParser({ delimiter: delimiter }))
  parser.on('data', (data) => {
    // Create rxObj
    let rxObj = { buffer: data }
    rxObj.timestamp = new Date(Date.now()).toISOString(),
    rxObj.ascii = rxObj.buffer.toString('ascii'),
    rxObj.hex = rxObj.buffer.toString('hex'),
    // Add rxObj to array
    ports[name].rx.push(rxObj)
    // Remove the first element from the array if its length is greater than 1000
    if (ports[name].rx.length > 1000) ports[name].rx.shift()
  })

  // Return
  let portCopy = JSON.parse(JSON.stringify(ports[name]))
  portCopy.portObj = "for server use only"
  return portCopy
}
function send(name, message, messageType, cr = false, lf = false) {
  log(`send(${name}, ${message}, ${messageType}, ${cr}, ${lf})`)

  // Create send object
  let txObj = {
    timestamp: new Date(Date.now()).toISOString(),
    message: message,
    messageType: messageType,
    cr: cr,
    lf: lf
  }

  // If the serial port isn't open exit
  if (ports[name].isOpen === false) {
    ports[name].txFail.push(txObj)
    if (ports[name].txFail.length > 1000) ports[name].txFail.shift()
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
  ports[name].portObj.write(txObj.buffer)
  ports[name].tx.push(txObj)
  // Remove the first element from the array if its length is greater than 1000
  if (ports[name].tx.length > 1000) ports[name].tx.shift()
  return txObj

}
function close(name) {
  log(`close(${name})`)
  ports[name].portObj.close((err) => ports[name].closeError)

  // Return
  let portCopy = JSON.parse(JSON.stringify(ports[name]))
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
function getPort(name) {
  log(`getPort(${name})`)
  let portCopy = JSON.parse(JSON.stringify(ports[name]))
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

serialport.open("serial1", "COM3", 9600, "\r\n")
serialport.open("serial2", "COM4", 38400, "\r\n")
serialport.open("serial3", "COM87", 9600, "\r\n")

setTimeout(() => {
  serialport.send("serial1", "PWR", "ascii", true, true)
}, 1000)

setTimeout(() => {
  serialport.send("serial2", "PWR", "ascii", true, true)
}, 2000)

setTimeout(() => {
  serialport.send("serial1", "PWR2", "ascii", true, true)
}, 3000)

setTimeout(() => {
  serialport.send("serial3", "PWR3", "ascii", true, true)
}, 4000)

setTimeout(() => {
  console.log(serialport.getPorts())
}, 5000)

*/