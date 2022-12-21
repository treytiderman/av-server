# Serial API | WebSocket

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