const net = require('net')
const events = require('events')

// Constants
const tcpClients = {}
const emitter = new events.EventEmitter()
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
  ip: "192.168.1.1",
  port: "23",
  address: "192.168.1.1:23",
  expectedDelimiter: "\r\n",
  history: [],
  error: null,
}

// Helper Functions
function log(text) {
  text = addEscapeCharsToAscii(text)
  console.log(text)
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
function copyClientObj(obj) {
  const objCopy = Object.assign({}, obj);
  // const objCopy = JSON.parse(JSON.stringify(obj))
  delete objCopy["clientObj"]; 
  log(`return ${JSON.stringify(objCopy)}`)
  return objCopy
}

// Functions
function open(ip, port = 23, delimiter = "\r\n") {
  log(`open(${ip}, ${port}, ${delimiter})`)
  const address = `${ip}:${port}`

  // Return if the connection is already open
  if (tcpClients[address]?.isOpen === true) {
    const error = { "error": "connection already open" }
    log(`return ${JSON.stringify(error)}`)
    return error
  }

  // Prepare delimiter?
  // TODO

  // Create client object
  tcpClients[address] = {
    clientObj: new net.Socket(),
    isOpen: false,
    ip: ip,
    port: port,
    address: address,
    expectedDelimiter: delimiter,
    history: [],
    error: null,
  }

  // Open Connection
  tcpClients[address].clientObj.connect(port, ip, () => {
    tcpClients[address].isOpen = true
    log(`connected to ${address}`)

    // Emit event
    const tcpClientCopy = copyClientObj(tcpClients[address])
    emitter.emit('client', address, tcpClientCopy)
  })

  // Error event
  tcpClients[address].clientObj.on('error', (err) => {
    tcpClients[address].error = err
    log(err)

    // Emit event
    const tcpClientCopy = copyClientObj(tcpClients[address])
    emitter.emit('client', address, tcpClientCopy)
  })

  // Close event
  tcpClients[address].clientObj.on('close', () => {
    tcpClients[address].isOpen = false
    log(`closed connection to ${address}`)
    
    // Emit event
    const tcpClientCopy = copyClientObj(tcpClients[address])
    emitter.emit('client', address, tcpClientCopy)
  })

  // Listen for new data
  tcpClients[address].clientObj.on('data', (data) => {
    log(`received ${data}`)

    // Create receive object
    const rxObj = { 
      wasReceived: true,
      timestampISO: new Date(Date.now()).toISOString(),
      hex: data.toString('hex'),
      ascii: data.toString('ascii'),
      buffer: data,
      error: "",
    }

    // Add to history
    tcpClients[address].history.push(rxObj)
  
    // If the history length is greater than MAX_HISTORY_LENGTH then remove the first/oldest element
    if (tcpClients[address].history.length > MAX_HISTORY_LENGTH) tcpClients[address].history.shift()

    // Emit event
    const tcpClientCopy = copyClientObj(tcpClients[address])
    emitter.emit('client', address, tcpClientCopy)
  })

  // Return
  const tcpClientCopy = copyClientObj(tcpClients[address])
  log(`return ${JSON.stringify(tcpClientCopy)}`)
  return tcpClientCopy
}
function send(ip, port, data, encoding = "ascii", cr = false, lf = false) {
  log(`send(${ip}, ${port}, ${data})`)
  const address = `${ip}:${port}`

  // Return if client is not defined
  if (tcpClients[address] === undefined) {
    const error = "client is not defined, open the connection first"
    tcpClients[address] = {error: error}
    log(`error ${error}`)

    // Emit event
    const tcpClientCopy = copyClientObj(tcpClients[address])
    emitter.emit('client', address, tcpClientCopy)

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
  if (tcpClients[address].isOpen === true) {
    tcpClients[address].clientObj.write(txObj.buffer)
  }
  else {
    txObj.error = "data not sent, connection not open"
  }

  // Add to history
  tcpClients[address].history.push(txObj)

  // If the history length is greater than MAX_HISTORY_LENGTH
  if (tcpClients[address].history.length > MAX_HISTORY_LENGTH) {
    // Then remove the first/oldest element
    tcpClients[address].history.shift()
  }

  // Emit event
  const tcpClientCopy = copyClientObj(tcpClients[address])
  emitter.emit('client', address, tcpClientCopy)

  // Return
  log(`return ${JSON.stringify(txObj)}`)
  return txObj
}
function close(ip, port) {
  log(`close(${ip}, ${port})`)
  const address = `${ip}:${port}`

  // Return if client is not defined
  if (tcpClients[address] === undefined) {
    const error = "client is not defined, open the connection first"
    tcpClients[address] = {error: error}
    log(`error ${error}`)

    // Emit event
    const tcpClientCopy = copyClientObj(tcpClients[address])
    emitter.emit('client', address, tcpClientCopy)

    // Return
    return error
  }

  // Return if the client is already closed
  if (tcpClients[address]?.isOpen === false) {
    const error = "client already closed"
    log(`error ${error}`)

    // Emit event
    const tcpClientCopy = copyClientObj(tcpClients[address])
    emitter.emit('client', address, tcpClientCopy)
  
    // Return
    return error
  }

  // Close Port
  tcpClients[address].clientObj.end()

  // Return
  let tcpClientCopy = copyClientObj(tcpClients[address])
  tcpClientCopy.isOpen = false
  log(`return ${JSON.stringify(tcpClientCopy)}`)
  return tcpClientCopy
}
function getTcpClients() {
  log(`getTcpClients()`)

  // Remove clientObj from returned object
  let tcpClientsCopy = {}
  Object.keys(tcpClients).forEach(address => {
    const tcpClientCopy = copyClientObj(tcpClients[address])
    tcpClientsCopy[address] = tcpClientCopy
  })

  // Return
  log(`return ${JSON.stringify(tcpClientsCopy)}`)
  return tcpClientsCopy

}
function getTcpClient(ip, port) {
  const address = `${ip}:${port}`
  log(`getTcpClient(${ip}, ${port})`)

  // Return if client is not defined
  if (tcpClients[address] === undefined) {
    const error = "client is not defined, open the connection first"
    tcpClients[address] = {error: error}
    log(`error ${error}`)

    // Return
    return error
  }

  // Return client
  const tcpClientCopy = copyClientObj(tcpClients[address])
  log(`return ${JSON.stringify(tcpClientCopy)}`)
  return tcpClientCopy
}

// Export
exports.emitter = emitter
exports.open = open
exports.send = send
exports.close = close
exports.getTcpClients = getTcpClients
exports.getTcpClient = getTcpClient

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
