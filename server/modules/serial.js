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
  history: [],
  historyRaw: [],
}

// Helper Functions
const logInConsole = true
function log(text) {
  text = addEscapeCharsToAscii(text)
  const logger = require('./log')
  logger.log(text, "../public/logs/", 'serial', logInConsole)
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
function removeEscapeCharsFromHex(text) {
  if (typeof text !== "string") return text
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
    const error = "connection already open"

    // Emit event
    log(`open ${path} ${error}`)
    emitter.emit('open', path, {error: error})

    // Return
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
    emitter.emit('error', path, {error: ports[path].error})
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
function send(path, data, encoding = "ascii", cr = false, lf = false) {
  log(`send(${path}, ${data}, ${encoding}, ${cr}, ${lf})`)

  // Return if client is not defined
  if (ports[path] === undefined) {
    const error = "client is not defined, open the connection first"
    
    // Emit event
    emitter.emit('send', path, {error: error})
    
    // Return
    log(`send ${path} ${error}`)
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
  if (ports[path].history.length > MAX_HISTORY_LENGTH) {
    // Then remove the first/oldest element
    ports[path].history.shift()
    ports[path].historyRaw.shift()
  }

  // Emit event
  log(`send ${path} ${JSON.stringify(txObj)}`)
  emitter.emit('send', path, txObj)

  // Return
  log(`return ${JSON.stringify(txObj)}`)
  return txObj
}
function close(path) {
  log(`close(${path})`)

  // Return if client is not defined
  if (ports[path] === undefined) {
    const error = "client is not defined, open the connection first"
    
    // Emit event
    emitter.emit('close', path, {error: error})
    
    // Return
    log(`close ${path} ${error}`)
    return error
  }

  // Return if the client is already closed
  if (ports[path]?.isOpen === false) {
    const error = "client already closed"

    // Emit event
    emitter.emit('close', path, {error: error})
    
    // Return
    log(`close ${path} ${error}`)
    return error
  }

  // Close Port
  ports[path].portObj.close(err => {
    ports[path].error = err
  })

  // Return
  return "OK"
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

  // Remove clientObj from returned object
  let portsReturn = {}
  Object.keys(ports).forEach(path => {
    const portCopy = copyPortObj(ports[path])
    portsReturn[path] = portCopy
  })

  // Return ports
  log(`return ${JSON.stringify(portsReturn)}`)
  return portsReturn
}
function getPort(path) {
  log(`getPort(${path})`)

  // Stop if port not defined / open
  if (ports[path] === undefined) {
    const error = "client is not defined, open the connection first"
    
    // Emit event
    // emitter.emit('error', path, {error: error})
    
    // Return
    log(`getClient ${path} ${error}`)
    return error
  }

  // Return client
  const portCopy = copyPortObj(ports[path])
  log(`return ${JSON.stringify(portCopy)}`)
  return portCopy
}

// Export
exports.emitter = emitter
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