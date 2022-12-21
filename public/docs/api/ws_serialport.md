# Serial API | WebSocket

## API sturcture

### `GET`

> Get named value from the server

```json
{
  "request": "get",
  "name": "/api/v1/clients"
}
```

> Server Response

```json
{
  "name": "/api/v1/clients",
  "body": "bla bla bla"
}
```

### `SUBSCRIBE`

> Subscribe to that named value and receive updates whenever new data is available

```json
{
  "request": "subscribe",
  "name": "/api/v1/clients"
}
```

> Server Response

```json
{
  "name": "/api/v1/clients",
  "body": "bla bla bla"
}
```

### `UNSUBSCRIBE`

> Unsubscribe from named value

```json
{
  "request": "unsubscribe",
  "name": "/api/v1/clients"
}
```

### `UNSUBSCRIBE ALL`

> Unsubscribe from everything

```json
{
  "request": "unsubscribe",
  "name": "*"
}
```

### `Call`

> Call a function on the server

```json
{
  "request": "call",
  "name": "/api/v1/send",
  "body": "something to send"
}
```

> Server Response

```json
{
  "name": "/api/v1/send",
  "body": "bla bla bla"
}
```

### `PUBLISH`

> Publish data to whoever is listening

```json
{
  "request": "publish",
  "name": "/api/v1/position",
  "body": [32, 67]
}
```

## /serial/v1/available

`Send`

```json
{
  "request": "[get, subscribe, unsubscribe]",
  "name": "/serial/v1/available"
}
```

`Response`

```json
{
  "name": "/serial/v1/available",
  "body": [
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
}
```

## /serial/v1/open

`Send`

```json
{
  "request": "call",
  "name": "/serial/v1/open",
  "body": {
    "path": "/dev/tty.usbserial-FTCK2VXE"
  }
}
```

```json
{
  "request": "call",
  "name": "/serial/v1/open",
  "body": {
    "path": "/dev/tty.usbserial-FTCK2VXE",
    "baudRate": 9600,
    "delimiter": "\r\n"
  }
}
```

`Response`

```json
{
  "name": "/serial/v1/open",
  "body": [
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
}
```