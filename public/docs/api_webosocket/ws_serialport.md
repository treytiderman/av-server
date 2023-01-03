# Serial API | WebSocket

## Available

Send

```json
{
  "name": "/serial/v1",
  "event": "available"
}
```

Subscribes to "/serial/v1"

Receive event updates

```json
{
  "name": "/serial/v1",
  "event": "available",
  "body": [
    {
      "path": "COM1",
      "manufacturer": "(Standard port types)",
      "pnpId": "ACPI\\PNP0501\\0",
      "friendlyName": "Communications Port (COM1)"
    },
    {
      "path": "COM4",
      "manufacturer": "FTDI",
      "serialNumber": "AB0OJ5M6",
      "pnpId": "FTDIBUS\\VID_0403+PID_6001+AB0OJ5M6A\\0000",
      "friendlyName": "USB Serial Port (COM4)",
      "vendorId": "0403",
      "productId": "6001"
    },
    {
      "path": "COM3",
      "manufacturer": "FTDI",
      "serialNumber": "FTCK2VXE",
      "pnpId": "FTDIBUS\\VID_0403+PID_6001+FTCK2VXEA\\0000",
      "friendlyName": "USB Serial Port (COM3)",
      "vendorId": "0403",
      "productId": "6001"
    }
  ]
}
```

## Open

Send

```json
{
  "name": "/serial/v1",
  "event": "open",
  "body": {
    "path": "COM3",
    "baudRate": 9600,
    "expectedDelimiter": "\r\n"
  }
}
```

Receive

```json
{
  "name": "/serial/v1/COM3",
  "event": "open",
  "body": {
    "isOpen": true,
    "path": "COM3",
    "baudRate": 9600,
    "expectedDelimiter": "\r\n",
    "error": null
  }
}
```

Error

```json
{
  "name": "/serial/v1/COM3",
  "event": "open",
  "body": {
    "error": "connection already open"
  }
}
```

```json
{
  "name": "/serial/v1/COM2",
  "event": "error",
  "body": {
    "error": "COM port / path not found"
  }
}
```

## Send

Send

```json
{
  "name": "/serial/v1",
  "event": "send",
  "body": {
    "path": "COM3",
    "data": "mc 01 02\r",
    "encoding": "ascii"
  }
}
```

Receive

```json
{
  "name": "/serial/v1/COM3",
  "event": "send",
  "body": {
    "wasReceived": false,
    "timestampISO": "2022-12-26T20:36:00.898Z",
    "hex": "6d632030312030320d",
    "ascii": "mc 01 02\r",
    "buffer": {
      "type": "Buffer",
      "data": [109,99,32,48,49,32,48,50,13]
    },
    "error": null
  }
}
```

Error

```json
{
  "name": "/serial/v1/COM3",
  "event": "send",
  "body": {
    "error": "client is not defined, open the connection first"
  }
}
```

## Close

Send

```json
{
  "name": "/serial/v1",
  "event": "close",
  "body": {
    "path": "COM3"
  }
}
```

Receive

```json
{
  "name": "/serial/v1/COM3",
  "event": "close",
  "body": {
    "isOpen": false,
    "path": "COM3",
    "baudRate": 9600,
    "expectedDelimiter": "\r\n",
    "error": null
  }
}
```

Error

```json
{
  "name": "/serial/v1/COM3",
  "event": "close",
  "body": {
    "error": "client already closed"
  }
}
```

## Port

Send

```json
{
  "name": "/serial/v1",
  "event": "port",
  "body": {
    "path": "COM3"
  }
}
```

Receive

```json
{
  "name": "/serial/v1/COM3",
  "event": "port",
  "body": {
    "isOpen": false,
    "path": "COM3",
    "baudRate": 9600,
    "expectedDelimiter": "\r\n",
    "history": [
      {
        "wasReceived": false,
        "timestampISO": "2022-12-26T20:40:37.654Z",
        "hex": "6d632030312030320d",
        "ascii": "mc 01 02\r",
        "buffer": {
          "type": "Buffer",
          "data": [109,99,32,48,49,32,48,50,13]
        },
        "error": null
      }
    ],
    "historyRaw": [
      {
        "wasReceived": false,
        "timestampISO": "2022-12-26T20:40:37.654Z",
        "hex": "6d632030312030320d",
        "ascii": "mc 01 02\r",
        "buffer": {
          "type": "Buffer",
          "data": [109,99,32,48,49,32,48,50,13]
        },
        "error": null
      }
    ],
    "error": null
  }
}
```

## Ports

Send

```json
{
  "name": "/serial/v1",
  "event": "ports"
}
```

Receive

```json
{
  "name": "/serial/v1",
  "event": "ports",
  "body": {
    "COM3": {
      "isOpen": false,
      "path": "COM3",
      "baudRate": 9600,
      "expectedDelimiter": "\r\n",
      "history": [
        {
          "wasReceived": false,
          "timestampISO": "2022-12-26T20:45:25.586Z",
          "hex": "6d632030312030320d",
          "ascii": "mc 01 02\r",
          "buffer": {
            "type": "Buffer",
            "data": [109,99,32,48,49,32,48,50,13]
          },
          "error": null
        }
      ],
      "historyRaw": [
        {
          "wasReceived": false,
          "timestampISO": "2022-12-26T20:45:25.586Z",
          "hex": "6d632030312030320d",
          "ascii": "mc 01 02\r",
          "buffer": {
            "type": "Buffer",
            "data": [109,99,32,48,49,32,48,50,13]
          },
          "error": null
        }
      ],
      "error": null
    },
    "COM4": {
      "isOpen": true,
      "path": "COM4",
      "baudRate": 9600,
      "expectedDelimiter": "\r\n",
      "history": [],
      "historyRaw": [],
      "error": null
    }
  }
}
```

## /serial/v1

```json
{
  "name": "/serial/v1",
  "event": "subscribe"
}
```

Receive

```json
{
  "name": "/serial/v1",
  "event": "open",
  "body": {
    "isOpen": true,
    "path": "COM3",
    "baudRate": 9600,
    "expectedDelimiter": "\r\n",
    "error": null
  }
}
```

```json
{
  "name": "/serial/v1",
  "event": "send",
  "body": {
    "wasReceived": false,
    "timestampISO": "2022-12-26T20:40:37.654Z",
    "hex": "6d632030312030320d",
    "ascii": "mc 01 02\r",
    "buffer": {
      "type": "Buffer",
      "data": [109,99,32,48,49,32,48,50,13]
    },
    "error": null,
    "path": "COM3"
  }
}
```

```json
{
  "name": "/serial/v1",
  "event": "close",
  "body": {
    "isOpen": false,
    "path": "COM3",
    "baudRate": 9600,
    "expectedDelimiter": "\r\n",
    "error": null
  }
}
```

Error

```json
{
  "name": "/serial/v1",
  "event": "open",
  "body": {
    "error": "connection already open",
    "path": "COM3"
  }
}
```

```json
{
  "name": "/serial/v1",
  "event": "error",
  "body": {
    "error": "COM port / path not found",
    "path": "COM2"
  }
}
```

```json
{
  "name": "/serial/v1",
  "event": "send",
  "body": {
    "error": "client is not defined, open the connection first",
    "path": "COM3"
  }
}
```

```json
{
  "name": "/serial/v1",
  "event": "close",
  "body": {
    "error": "client already closed",
    "path": "COM3"
  }
}
```


