const { SerialPort } = require('serialport')
const { DelimiterParser } = require('@serialport/parser-delimiter')
const events = require('events')

// Constants
const ports = {}
const emitter = new events.EventEmitter()
const CR = { hex: "0D", ascii: "\r" }
const LF = { hex: "0A", ascii: "\n" }
const MAX_HISTORY_LENGTH = 1000
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

// Helper Functions
const logInConsole = false
function log(text) {
  text = addEscapeCharsToAscii(text)
  const logger = require('../modules/log')
  logger.log(text, "../public/logs/", 'serial', logInConsole)
}
function addEscapeCharsToAscii(text) {
  text = text.replace(/\r/g, "\\r")
  text = text.replace(/\n/g, "\\n")
  return text
}
function removeEscapeCharsFromAscii(text) {
  text = text.replace(/\\r/g, CR.ascii)
  text = text.replace(/\\n/g, LF.ascii)
  return text
}
function removeEscapeCharsFromHex(text) {
  text = text.replace(/\\x/g, "")
  text = text.replace(/0x/g, "")
  text = text.replace(/ /g, "")
  return text
}
function copyPortObj(obj) {
  const objCopy = Object.assign({}, obj);
  // const objCopy = JSON.parse(JSON.stringify(obj))
  delete objCopy["portObj"]; 
  log(`return ${JSON.stringify(objCopy)}`)
  return objCopy
}

// Functions
function open(path, baudRate = 9600, delimiter = "\r\n") {
  log(`open(${path}, ${baudRate}, ${delimiter})`)

  // Return if the connection is already open
  if (ports[path]?.isOpen === true) {
    const error = { "error": "port already open" }
    log(`return ${JSON.stringify(error)}`)
    return error
  }

  // Unescape the delimiter if needed
  delimiter = delimiter.replace(/\\r/g, CR.ascii)
  delimiter = delimiter.replace(/\\n/g, LF.ascii)
  delimiter = delimiter.replace(/\\x/g, "")
  delimiter = delimiter.replace(/0x/g, "")

  // Create port object
  ports[path] = {
    portObj: new SerialPort({ path: path, baudRate: baudRate }),
    isOpen: false,
    path: path,
    baudRate: baudRate,
    delimiter: delimiter,
    history: [],
    historyRaw: [],
    error: null,
  }
  
  // Event Open
  ports[path].portObj.on('open', () => {
    ports[path].isOpen = true
    log(`port ${path} opened`)

    // Emit event
    const portCopy = copyPortObj(ports[path])
    emitter.emit('port', path, portCopy)
  })

  // Event Error
  ports[path].portObj.on('error', (err) => {
    ports[path].error = err
    log(err)

    // Emit event
    const portCopy = copyPortObj(ports[path])
    emitter.emit('port', path, portCopy)
  })

  // Event Close
  ports[path].portObj.on('close', () => {
    ports[path].isOpen = false
    log(`closed port ${path}`)

    // Emit event
    const portCopy = copyPortObj(ports[path])
    emitter.emit('port', path, portCopy)
  })
  
  // Listen for any new data
  ports[path].portObj.on('data', (data) => {
    // log(`received raw ${data}`)

    // Create rxObj
    let rxObj = { 
      wasReceived: true,
      timestampISO: new Date(Date.now()).toISOString(),
      hex: data.toString('hex'),
      ascii: data.toString('ascii'),
      buffer: data,
      error: "",
    }

    // Add to history
    ports[path].historyRaw.push(rxObj)

    // If the history length is greater than MAX_HISTORY_LENGTH
    if (ports[path].historyRaw.length > MAX_HISTORY_LENGTH) {
      // Then remove the first/oldest element
      ports[path].historyRaw.shift()
    }

    // Emit event
    const portCopy = copyPortObj(ports[path])
    emitter.emit('port', path, portCopy)
  })

  // Listen for new data that ends with the delimiter
  const parser = ports[path].portObj.pipe(new DelimiterParser({ delimiter: delimiter }))
  parser.on('data', (data) => {
    log(`received ${data}`)

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
    ports[path].history.push(rxObj)

    // If the history length is greater than MAX_HISTORY_LENGTH
    if (ports[path].history.length > MAX_HISTORY_LENGTH) {
      // Then remove the first/oldest element
      ports[path].history.shift()
    }

    // Emit event
    const portCopy = copyPortObj(ports[path])
    emitter.emit('port', path, portCopy)
  })

  // Return
  const portCopy = copyPortObj(ports[path])
  // portCopy.isOpen = true
  return portCopy
}
function send(path, data, encoding = "ascii", cr = false, lf = false) {
  log(`send(${path}, ${data}, ${encoding}, ${cr}, ${lf})`)

  // Return if client is not defined
  if (ports[path] === undefined) {
    const error = "port is not defined, open the port first then send"
    ports[path] = {error: error}
    log(`error ${error}`)

    // Emit event
    const portCopy = copyPortObj(ports[path])
    emitter.emit('port', path, portCopy)

    // Return
    return error
  }

  // Create send object
  const txObj = {
    wasReceived: false,
    timestampISO: new Date(Date.now()).toISOString(),
    hex: "",
    ascii: "",
    buffer: "",
    error: null,
  }

  // Prepare data and fill in txObj
  if (encoding === "ascii") {
    data = removeEscapeCharsFromAscii(data)
    data = data + (cr ? CR.ascii : "") + (lf ? LF.ascii : "")
    txObj.ascii = data
    txObj.buffer = Buffer.from(data, 'ascii')
    txObj.hex = txObj.buffer.toString('hex')
  }
  else if (encoding === "hex") {
    data = removeEscapeCharsFromHex(data)
    data = data + (cr ? CR.hex : "") + (lf ? LF.hex : "")
    txObj.hex = data
    txObj.buffer = Buffer.from(data, 'hex')
    txObj.ascii = txObj.buffer.toString('ascii')
  }

  // Send if the connection is open
  if (ports[path].isOpen === true) {
    ports[path].portObj.write(txObj.buffer)
  }
  else {
    txObj.error = "data not sent, connection not open"
  }

  // Add to history
  ports[path].history.push(txObj)
  ports[path].historyRaw.push(txObj)

  // If the history length is greater than MAX_HISTORY_LENGTH
  if (tcpClients[address].history.length > MAX_HISTORY_LENGTH) {
    // Then remove the first/oldest element
    tcpClients[address].history.shift()
    tcpClients[address].historyRaw.shift()
  }

  // Emit event
  const portCopy = copyPortObj(ports[path])
  emitter.emit('client', path, portCopy)

  // Return
  log(`return ${JSON.stringify(txObj)}`)
  return txObj
}
function close(path) {
  log(`close(${path})`)

  // Return if client is not defined
  if (ports[path] === undefined) {
    const error = "port is not defined, open the port first then send"
    ports[path] = {error: error}
    log(`error ${error}`)

    // Emit event
    const portCopy = copyPortObj(ports[path])
    emitter.emit('port', path, portCopy)

    // Return
    return error
  }

  // Return if the client is already closed
  if (ports[path]?.isOpen === false) {
    const error = "client already closed"
    log(`error ${error}`)

    // Emit event
    const portCopy = copyPortObj(ports[path])
    emitter.emit('port', path, portCopy)
  
    // Return
    return error
  }

  // Close Port
  ports[path].portObj.close(err => {
    ports[path].error = err
  })

  // Return
  // Emit event
  const portCopy = copyPortObj(ports[path])
  // portCopy.isOpen = false
  log(`return ${JSON.stringify(portCopy)}`)
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