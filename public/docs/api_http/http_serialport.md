# Serial API | HTTP

## `GET` /api/serial/v1/available

> List available serial ports (COM)

`Response`

```json
[
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
```

## `POST` /api/serial/v1/open

> Open a serial port connection

`Body`

```json
{ "path": "/dev/tty.usbserial-FTCK2VXE" }
```

`Body +`

```json
{
  "path": "/dev/tty.usbserial-FTCK2VXE",
  "baudRate": 9600,
  "delimiter": "\r\n"
}
```

`Response`

```json
{
  "path": "/dev/tty.usbserial-FTCK2VXE",
  "error": null,
  "isOpen": true,
  "baudRate": 9600,
  "delimiter": "\r\n",
  "portObj": "for server use only",
  "data": [],
  "dataRaw": [],
}
```

## `POST` /api/serial/v1/send

> Send a hex or ascii message out the serial port

`Body`

```json
{
  "path": "/dev/tty.usbserial-FTCK2VXE",
  "message": "mc 01 02\r",
  "encoding": "[ascii, hex]"
}
```

`Body +`

```json
{
  "path": "/dev/tty.usbserial-FTCK2VXE",
  "message": "mc 01 02",
  "encoding": "[ascii, hex]",
  "cr": true,
  "lf": false
}
```

`Response`

```json
{
  "path": "/dev/tty.usbserial-FTCK2VXE",
  "error": null,
  "isOpen": true,
  "baudRate": 9600,
  "delimiter": "\r\n",
  "portObj": "for server use only",
  "data": [],
  "dataRaw": [],
}
```

## `POST` /api/serial/v1/close

> Close the serial port

`Body`

```json
{ "path": "/dev/tty.usbserial-FTCK2VXE" }
```

`Response`

```json
{
  "path": "/dev/tty.usbserial-FTCK2VXE",
  "error": null,
  "isOpen": false,
  "baudRate": 9600,
  "delimiter": "\r\n",
  "portObj": "for server use only",
  "data": [],
  "dataRaw": []
}
```

## `GET` /api/serial/v1/ports

> Returns a JSON with all serial port data

`Response`

```json
{
  "/dev/tty.usbserial-FTCK2VXE": {
    "path": "/dev/tty.usbserial-FTCK2VXE",
    "error": null,
    "isOpen": true,
    "baudRate": 9600,
    "delimiter": "\r\n",
    "portObj": "for server use only",
    "data": [
      {
        "wasReceived": false,
        "timestampISO": "2022-11-20T20:07:40.228Z",
        "hex": "6d632030312030320d",
        "ascii": "mc 01 02\r",
        "buffer": {
          "type": "Buffer",
          "data": [109,99,32,48,49,32,48,50,13]
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
          "data": [109,99,32,48,49,32,48,50,13]
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
          "data": [99,32,48,49]
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
          "data": [32,79,75,48,50,120]
        },
        "error": ""
      }
    ]
  }
}
```

## `POST` /api/serial/v1/port

> Returns a JSON with the named serial port's data

`Body`

```json
{ "path": "/dev/tty.usbserial-FTCK2VXE" }
```

`Response`

```json
{
  "path": "/dev/tty.usbserial-FTCK2VXE",
  "error": null,
  "isOpen": true,
  "baudRate": 9600,
  "delimiter": "\r\n",
  "portObj": "for server use only",
  "data": [
    {
      "wasReceived": false,
      "timestampISO": "2022-11-20T20:08:19.808Z",
      "hex": "6d632030312030320d",
      "ascii": "mc 01 02\r",
      "buffer": {
        "type": "Buffer",
        "data": [109,99,32,48,49,32,48,50,13]
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
        "data": [109,99,32,48,49,32,48,50,13]
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
        "data": [99]
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
        "data": [32,48,49,32,79,75,48,50,120]
      },
      "error": ""
    }
  ]
}
```
