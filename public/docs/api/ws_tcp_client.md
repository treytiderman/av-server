# TCP Client API | WebSocket

## open

Send

```json
{
  "name": "/tcp/client/v1",
  "event": "open",
  "body": {
    "ip": "192.168.1.246",
    "port": 23,
    "expectedDelimiter": "\r"
  }
}
```

Subscribes to "/tcp/client/v1/192.168.1.246:23"
Receive event updates [open, close, send, receive, error]

```json
{
  "name": "/tcp/client/v1/192.168.1.246:23",
  "event": "open",
  "body": true
}
```

## send

Send

```json
{
  "name": "/tcp/client/v1",
  "event": "send",
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

Subscribes to "/tcp/client/v1/192.168.1.246:23"
Receive event updates [open, close, send, receive, error]

```json
{
  "name": "/tcp/client/v1/192.168.1.246:23",
  "event": "send",
  "body": {
    "wasReceived": false,
    "timestampISO": "2022-12-22T02:43:09.981Z",
    "hex": "4d563f0d",
    "ascii": "MV?\r",
    "buffer": {
      "type": "Buffer",
      "data": [77,86,63,13]
    },
    "error": null
  }
}
```

```json
{
  "name": "/tcp/client/v1/192.168.1.246:23",
  "event": "receive",
  "body": {
    "wasReceived": true,
    "timestampISO": "2022-12-22T02:43:10.005Z",
    "hex": "4d5634300d",
    "ascii": "MV40\r",
    "buffer": {
      "type": "Buffer",
      "data": [77,86,52,48,13]
    },
    "error": null
  }
}
```

## close

Send

```json
{
  "name": "/tcp/client/v1",
  "event": "close",
  "body": {
    "ip": "192.168.1.246",
    "port": 23
  }
}
```

Subscribes to "/tcp/client/v1/192.168.1.246:23"
Receive event updates [open, close, send, receive, error]

```json
{
  "name": "/tcp/client/v1/192.168.1.246:23",
  "event": "close",
  "body": true
}
```

## getClient

Send

```json
{
  "name": "/tcp/client/v1/",
  "event": "getClient",
  "body": {
    "ip": "192.168.1.246",
    "port": 23
  }
}
```

Receive the whole client obj

```json
{
  "name": "/tcp/client/v1/192.168.1.246:23",
  "event": "getClient",
  "body": {
    "isOpen": false,
    "ip": "192.168.1.246",
    "port": 23,
    "address": "192.168.1.246:23",
    "expectedDelimiter": "\r",
    "history": [
      {
        "wasReceived": false,
        "timestampISO": "2022-12-22T02:47:22.098Z",
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
        "timestampISO": "2022-12-22T02:47:22.134Z",
        "hex": "4d5634300d",
        "ascii": "MV40\r",
        "buffer": {
          "type": "Buffer",
          "data": [77,86,52,48,13]
        },
        "error": null
      },
      {
        "wasReceived": true,
        "timestampISO": "2022-12-22T02:47:22.179Z",
        "hex": "4d564d41582039380d",
        "ascii": "MVMAX 98\r",
        "buffer": {
          "type": "Buffer",
          "data": [77,86,77,65,88,32,57,56,13]
        },
        "error": null
      }
    ],
    "error": null
  }
}
```

## getClients

Send

```json
{
  "name": "/tcp/client/v1",
  "event": "getClients"
}
```

Receive event updates [open, close, send, receive, error]

```json
{
  "name": "/tcp/client/v1",
  "event": "getClients",
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
