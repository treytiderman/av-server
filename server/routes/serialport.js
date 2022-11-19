// Create Express router
const { response } = require('express')
const express = require('express')
const router = express.Router()
const routes = {
  "/list": {
    "method": "GET",
    "description": "List available serial ports (COM)",
    "response (example)": [
      {
        "path": "COM3",
        "manufacturer": "FTDI",
        "serialNumber": "FTCK2VXE",
        "pnpId": "FTDIBUS\\VID_0403+PID_6001+FTCK2VXEA\\0000",
        "locationId": undefined,
        "friendlyName": "USB Serial Port (COM3)",
        "vendorId": "0403",
        "productId": "6001"
      }
    ]
  },
  "/open": {
    "method": "POST",
    "description": "Open a serial port connection",
    "body (example)": {
      "name": "whatever you want",
      "path": "COM3"
    },
    "body (optional)": {
      "baudRate": "9600",
      "delimiter": "\r\n"
    }
  },
  "/send": {
    "method": "POST",
    "description": "Send a hex or ascii message out the serial port",
    "body (example)": {
      "name": "whatever you want",
      "message": "POWOF",
      "messageType": "ascii || hex"
    },
    "body (optional)": {
      "cr": false,
      "lf": false
    }
  },
  "/close": {
    "method": "POST",
    "description": "Close the serial port",
    "body (example)": {"name": "whatever you want"},
  },
  "/getData": {
    "method": "GET",
    "description": "Returns a JSON with all serial port data",
    "response (example)": {}
  },
  "/getTx": {
    "method": "GET",
    "description": "Returns a JSON with all transmited data for a named serial port",
    "body (example)": {"name": "whatever you want"},
    "response (example)": {}
  },
  "/getRx": {
    "method": "GET",
    "description": "Returns a JSON with all the delimited received data for a named serial port",
    "body (example)": {"name": "whatever you want"},
    "response (example)": {}
  },
  "/getRxRaw": {
    "method": "GET",
    "description": "Returns a JSON with all raw received data for a named serial port",
    "body (example)": {"name": "whatever you want"},
    "response (example)": {}
  },
  "/getRxLast": {
    "method": "GET",
    "description": "Returns a JSON with the last received data for a named serial port",
    "body (example)": {"name": "whatever you want"},
    "response (example)": {}
  },
}

// Module
const serialport = require("../modules/serialport")

// Routes
router.get('/list', async (req, res) => {
  res.json(await serialport.list())
})
router.post('/open', (req, res) => {
  const body = req.body
  const output = serialport.open(
    body.name,
    body.path,
    body.baudRate,
    body.delimiter,
  )
  // res.status(200)
  res.status(200).json(output)
})
router.post('/send', (req, res) => {
  const body = req.body
  const output = serialport.send(
    body.name,
    body.message,
    body.messageType,
    body.cr,
    body.lf,
  )
  res.status(200).json(output)
})
router.post('/close', (req, res) => {
  const body = req.body
  const output = serialport.close(body.name)
  res.status(200).json(output)
})

router.get('/getData', async (req, res) => {
  res.json(await serialport.getData())
})
router.get('/getTx', (req, res) => {
  const body = req.body
  const output = serialport.getTx(body.name)
  res.status(200).json(output)
})
router.get('/getRx', (req, res) => {
  const body = req.body
  const output = serialport.getRx(body.name)
  res.status(200).json(output)
})
router.get('/getRxRaw', (req, res) => {
  const body = req.body
  const output = serialport.getRxRaw(body.name)
  res.status(200).json(output)
})
router.get('/getRxLast', (req, res) => {
  const body = req.body
  const output = serialport.getRxLast(body.name)
  res.status(200).json(output)
})

// Export
exports.router = router
exports.routes = routes