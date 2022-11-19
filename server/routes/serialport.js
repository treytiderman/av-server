// Create Express router
const express = require('express')
const router = express.Router()
const routes = {
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
  "/availablePorts": {
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
  "/ports": {
    "method": "GET",
    "description": "Returns a JSON with all serial port data",
    "response (example)": {}
  },
  "/port": {
    "method": "POST",
    "description": "Returns a JSON with the named serial port's data",
    "body (example)": {"name": "whatever you want"},
    "response (example)": {}
  },
}

// Module
const serialport = require("../modules/serialport")

// Routes
router.get('/', (req, res) => {
  res.json(routes)
})
router.get('/help', (req, res) => {
  res.json(routes)
})

router.post('/open', (req, res) => {
  const body = req.body
  const output = serialport.open(
    body.name,
    body.path,
    body.baudRate,
    body.delimiter,
  )
  res.json(output)
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
  res.json(output)
})
router.post('/close', (req, res) => {
  const body = req.body
  const output = serialport.close(body.name)
  res.json(output)
})

router.get('/availablePorts', async (req, res) => {
  res.json(await serialport.getAvailablePorts())
})
router.get('/ports', async (req, res) => {
  res.json(await serialport.getPorts())
})
router.post('/port', (req, res) => {
  const body = req.body
  const output = serialport.getPort(body.name)
  res.json(output)
})

// Export
exports.router = router
exports.routes = routes