# Serial API | WebSocket

## API sturcture

### `GET`

> Get named value from the server

```json
{
  "method": "get",
  "name": "/api/v1/clients"
}
```

> Server Response

```json
{
  "name": "/api/v1/clients",
  "value": "bla bla bla"
}
```

### `SUBSCRIBE`

> Subscribe to that named value and receive updates whenever new data is available

```json
{
  "method": "subscribe",
  "name": "/api/v1/clients"
}
```

> Server Response

```json
{
  "name": "/api/v1/clients",
  "value": "bla bla bla"
}
```

### `UNSUBSCRIBE`

> Unsubscribe from named value

```json
{
  "method": "unsubscribe",
  "name": "/api/v1/clients"
}
```

### `UNSUBSCRIBE ALL`

> Unsubscribe from everything

```json
{
  "method": "unsubscribe",
  "name": "*"
}
```

### `Call`

> Call a function on the server

```json
{
  "method": "call",
  "name": "/api/v1/send",
  "value": "something to send"
}
```

> Server Response

```json
{
  "name": "/api/v1/send",
  "value": "bla bla bla"
}
```

### `PUBLISH`

> Publish data to whoever is listening

```json
{
  "method": "publish",
  "name": "/api/v1/position",
  "value": [32, 67]
}
```

## /serial/v1/available

`Send`

```json
{
  "method": "[get, subscribe, unsubscribe]",
  "name": "/serial/v1/available"
}
```

`Response`

```json
{
  "name": "/serial/v1/available",
  "value": [
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
  "method": "call",
  "name": "/serial/v1/open",
  "value": {
    "path": "/dev/tty.usbserial-FTCK2VXE"
  }
}
```

```json
{
  "method": "call",
  "name": "/serial/v1/open",
  "value": {
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
  "value": [
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