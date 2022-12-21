# TCP Client API | WebSocket

## /tcp/client/v1/open

Send

```json
{
  "request": "call",
  "name": "/tcp/client/v1/open",
  "body": {
    "ip": "192.168.1.246",
    "port": 23,
    "expectedDelimiter": "\r"
  }
}
```

Subscribes to "/tcp/client/v1/client/192.168.1.246:23"

```json
{
  "name": "/tcp/client/v1/client/192.168.1.246:23",
  "body": {
    "isOpen": true,
    "ip": "192.168.1.246",
    "port": 23,
    "address": "192.168.1.246:23",
    "expectedDelimiter": "\r",
    "history": [],
    "error": null
  }
}
```

## /tcp/client/v1/send

`Send`

```json
{
  "request": "call",
  "name": "/tcp/client/v1/send",
  "body": {
    "ip": "192.168.1.246",
    "port": 23,
    "data": "MV?",
    "encoding": "ascii",
    "cr": true,
    "lf": false
  }
}
```

`Response`

```json
{
  "name": "/tcp/client/v1/client/192.168.1.246:23",
  "body": {
    "isOpen": true,
    "ip": "192.168.1.246",
    "port": 23,
    "address": "192.168.1.246:23",
    "expectedDelimiter": "\r",
    "history": [
      {
        "wasReceived": false,
        "timestampISO": "2022-12-21T05:19:44.262Z",
        "hex": "4d563f0d",
        "ascii": "MV?\r",
        "buffer": {
          "type": "Buffer",
          "data": [77,86,63,13]
        },
        "error": null
      }
    ],
    "error": null
  }
}
```

## /tcp/client/v1/close

`Send`

```json
{
  "request": "call",
  "name": "/tcp/client/v1/close",
  "body": {
    "ip": "192.168.1.246",
    "port": 23
  }
}
```

`Response`

```json
{
  "name": "/tcp/client/v1/client/192.168.1.246:23",
  "body": {
    "isOpen": false,
    "ip": "192.168.1.246",
    "port": 23,
    "address": "192.168.1.246:23",
    "expectedDelimiter": "\r",
    "history": [
      {
        "wasReceived": false,
        "timestampISO": "2022-12-21T05:19:44.262Z",
        "hex": "4d563f0d",
        "ascii": "MV?\r",
        "buffer": {
          "type": "Buffer",
          "data": [77,86,63,13]
        },
        "error": null
      },
      {
        "wasReceived": true,
        "timestampISO": "2022-12-21T05:19:44.304Z",
        "hex": "4d5634300d",
        "ascii": "MV40\r",
        "buffer": {
          "type": "Buffer",
          "data": [77,86,52,48,13]
        },
        "error": ""
      },
      {
        "wasReceived": true,
        "timestampISO": "2022-12-21T05:19:44.358Z",
        "hex": "4d564d41582039380d",
        "ascii": "MVMAX 98\r",
        "buffer": {
          "type": "Buffer",
          "data": [77,86,77,65,88,32,57,56,13]
        },
        "error": ""
      }
    ],
    "error": null
  }
}
```

## /tcp/client/v1/client/{ip}:{port}

`Send`

```json
{
  "request": "{get, subscribe, unsubscribe}",
  "name": "/tcp/client/v1/client/192.168.1.246:23"
}
```

`Response`

```json
{
  "name": "/tcp/client/v1/client/192.168.1.246:23",
  "body": {
    "isOpen": false,
    "ip": "192.168.1.246",
    "port": 23,
    "address": "192.168.1.246:23",
    "expectedDelimiter": "\r",
    "history": [],
    "error": null
  }
}
```

## /tcp/client/v1/clients

`Send`

```json
{
  "request": "{get, subscribe, unsubscribe}",
  "name": "/tcp/client/v1/clients"
}
```

`Response`

```json
{
  "name": "/tcp/client/v1/clients",
  "body": {
    "192.168.1.246:23": {
      "isOpen": false,
      "ip": "192.168.1.246",
      "port": 23,
      "address": "192.168.1.246:23",
      "expectedDelimiter": "\r",
      "history": [],
      "error": null
    }
  }
}
```

