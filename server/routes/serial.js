// Create Express router
const express = require('express')
const router = express.Router()
const routes = {
  "/available": {
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
      "path": "/dev/tty.usbserial-FTCK2VXE",
    },
    "body (optional)": {
      "baudRate": 9600,
      "expectedDelimiter": "\r\n",
    },
    "response (exaample)": {
      "path": "/dev/tty.usbserial-FTCK2VXE",
      "error": null,
      "isOpen": true,
      "baudRate": 9600,
      "expectedDelimiter": "\r\n",
      "portObj": "for server use only",
      "data": [],
      "dataRaw": [],
    }
  },
  "/send": {
    "method": "POST",
    "description": "Send a hex or ascii data out the serial port",
    "body (example)": {
      "path": "/dev/tty.usbserial-FTCK2VXE",
      "data": "mc 01 02\r",
      "encoding": "ascii || hex"
    },
    "body (optional)": {
      "cr": false,
      "lf": false
    },
    "response (exaample)": {
      "wasReceived": false,
      "timestampISO": "2022-11-20T20:04:28.386Z",
      "hex": "6d632030312030320d",
      "ascii": "mc 01 02\r",
      "buffer": {
        "type": "Buffer",
        "data": [
          109,
          99,
          32,
          48,
          49,
          32,
          48,
          50,
          13
        ]
      },
      "error": ""
    }
  },
  "/close": {
    "method": "POST",
    "description": "Close the serial port",
    "body (example)": {
      "path": "/dev/tty.usbserial-FTCK2VXE",
    },
    "response (exaample)": {
      "path": "/dev/tty.usbserial-FTCK2VXE",
      "error": null,
      "isOpen": false,
      "baudRate": 9600,
      "expectedDelimiter": "\r\n",
      "portObj": "for server use only",
      "data": [],
      "dataRaw": []
    }
  },
  "/ports": {
    "method": "GET",
    "description": "Returns a JSON with all serial port data",
    "response (example)": {
      "/dev/tty.usbserial-FTCK2VXE": {
        "path": "/dev/tty.usbserial-FTCK2VXE",
        "error": null,
        "isOpen": true,
        "baudRate": 9600,
        "expectedDelimiter": "\r\n",
        "portObj": "for server use only",
        "data": [
          {
            "wasReceived": false,
            "timestampISO": "2022-11-20T20:07:40.228Z",
            "hex": "6d632030312030320d",
            "ascii": "mc 01 02\r",
            "buffer": {
              "type": "Buffer",
              "data": [
                109,
                99,
                32,
                48,
                49,
                32,
                48,
                50,
                13
              ]
            },
            "error": ""
          }
        ],
        "dataRaw": [
          {
            "wasReceived": false,
            "timestampISO": "2022-11-20T20:07:40.228Z",
            "hex": "6d632030312030320d",
            "ascii": "mc 01 02\r",
            "buffer": {
              "type": "Buffer",
              "data": [
                109,
                99,
                32,
                48,
                49,
                32,
                48,
                50,
                13
              ]
            },
            "error": ""
          },
          {
            "wasReceived": true,
            "timestampISO": "2022-11-20T20:07:40.269Z",
            "hex": "63203031",
            "ascii": "c 01",
            "buffer": {
              "type": "Buffer",
              "data": [
                99,
                32,
                48,
                49
              ]
            },
            "error": ""
          },
          {
            "wasReceived": true,
            "timestampISO": "2022-11-20T20:07:40.284Z",
            "hex": "204f4b303278",
            "ascii": " OK02x",
            "buffer": {
              "type": "Buffer",
              "data": [
                32,
                79,
                75,
                48,
                50,
                120
              ]
            },
            "error": ""
          }
        ]
      }
    }
  },
  "/port": {
    "method": "POST",
    "description": "Returns a JSON with the named serial port's data",
    "body (example)": {
      "path": "/dev/tty.usbserial-FTCK2VXE",
    },
    "response (example)": {
      "path": "/dev/tty.usbserial-FTCK2VXE",
      "error": null,
      "isOpen": true,
      "baudRate": 9600,
      "expectedDelimiter": "\r\n",
      "portObj": "for server use only",
      "data": [
        {
          "wasReceived": false,
          "timestampISO": "2022-11-20T20:08:19.808Z",
          "hex": "6d632030312030320d",
          "ascii": "mc 01 02\r",
          "buffer": {
            "type": "Buffer",
            "data": [
              109,
              99,
              32,
              48,
              49,
              32,
              48,
              50,
              13
            ]
          },
          "error": ""
        }
      ],
      "dataRaw": [
        {
          "wasReceived": false,
          "timestampISO": "2022-11-20T20:08:19.808Z",
          "hex": "6d632030312030320d",
          "ascii": "mc 01 02\r",
          "buffer": {
            "type": "Buffer",
            "data": [
              109,
              99,
              32,
              48,
              49,
              32,
              48,
              50,
              13
            ]
          },
          "error": ""
        },
        {
          "wasReceived": true,
          "timestampISO": "2022-11-20T20:08:19.845Z",
          "hex": "63",
          "ascii": "c",
          "buffer": {
            "type": "Buffer",
            "data": [
              99
            ]
          },
          "error": ""
        },
        {
          "wasReceived": true,
          "timestampISO": "2022-11-20T20:08:19.861Z",
          "hex": "203031204f4b303278",
          "ascii": " 01 OK02x",
          "buffer": {
            "type": "Buffer",
            "data": [
              32,
              48,
              49,
              32,
              79,
              75,
              48,
              50,
              120
            ]
          },
          "error": ""
        }
      ]
    }
  },
}

// Module
const serialport = require("../modules/serial")

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
    body.path,
    body.baudRate,
    body.expectedDelimiter,
  )
  res.json(output)
})
router.post('/send', (req, res) => {
  const body = req.body
  const output = serialport.send(
    body.path,
    body.data,
    body.encoding,
    body.cr,
    body.lf,
  )
  res.json(output)
})
router.post('/close', (req, res) => {
  const body = req.body
  const output = serialport.close(body.path)
  res.json(output)
})

router.get('/available', async (req, res) => {
  res.json(await serialport.getAvailablePorts())
})
router.get('/ports', async (req, res) => {
  res.json(await serialport.getPorts())
})
router.post('/port', (req, res) => {
  const body = req.body
  const output = serialport.getPort(body.path)
  res.json(output)
})

// Export
exports.router = router
exports.routes = routes