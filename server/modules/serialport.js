const { SerialPort } = require('serialport')
const { DelimiterParser } = require('@serialport/parser-delimiter')

// Variables
const CR = { hex: "0D", ascii: "\r" }
const LF = { hex: "0A", ascii: "\n" }
const baudRates = [9600, 14400, 19200, 38400, 57600, 115200]
let ports = {
  // example: {
  //   path: path,
  //   isOpen: false,
  //   baudRate: baudRate,
  //   delimiter: delimiter,
  //   tx: [],
  //   txFail: [],
  //   rx: [],
  //   rxRaw: [],
  //   error: null,
  //   portObj: new SerialPort({ path: path, baudRate: baudRate })
  // }
}

async function list() {
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
function add(name, path, baudRate = 9600, delimiter = "\r\n") {
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

}
function send(name, message, messageType, cr = true, lf = true) {
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
function remove(name) {
  ports[name].portObj.close((err) => ports[name].closeError)
}

function getData() { return ports }
function getTx(name) { return ports[name].tx }
function getRx(name) { return ports[name].rx }
function getRxRaw(name) { return ports[name].rxRaw }
function getRxLast(name) {
  const length = ports[name].rx.length
  return ports[name].rx[length-1]
}

// Export
exports.list = list;
exports.add = add;
exports.send = send;
exports.remove = remove;

exports.getData = getData;
exports.getTx = getTx;
exports.getRx = getRx;
exports.getRxRaw = getRxRaw;
exports.getRxLast = getRxLast;

/* Example

const serialport = require("./serialport.js")

serialport.list().then(list => console.log(list))

serialport.add("serial1", "COM3", 9600, "\r\n")
serialport.add("serial2", "COM4", 38400, "\r\n")
serialport.add("serial3", "COM87", 9600, "\r\n")

setTimeout(() => {
  serialport.send("serial1", "PWR", "ascii", true, true)
}, 1000);

setTimeout(() => {
  serialport.send("serial2", "PWR", "ascii", true, true)
}, 2000);

setTimeout(() => {
  serialport.send("serial1", "PWR2", "ascii", true, true)
}, 3000);

setTimeout(() => {
  serialport.send("serial3", "PWR3", "ascii", true, true)
}, 4000);

setTimeout(() => {
  console.log(serialport.getData());
}, 5000);

*/