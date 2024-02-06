# Websocket API | TCP Client

## Open

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

Receive event updates

```json
{
  "name": "/tcp/client/v1/192.168.1.246:23",
  "event": "open",
  "body": {
    "isOpen": true,
    "ip": "192.168.1.246",
    "port": 23,
    "address": "192.168.1.246:23",
    "expectedDelimiter": "\r",
    "error": null
  }
}
```

Errors

```json
{
  "name": "/tcp/client/v1/192.168.1.246:23",
  "event": "open",
  "body": {
    "error": "connection already open"
  }
}
```

```json
{
  "name": "/tcp/client/v1/192.168.1.9:23",
  "event": "close",
  "body": {
    "isOpen": false,
    "ip": "192.168.1.9",
    "port": 23,
    "address": "192.168.1.9:23",
    "expectedDelimiter": "\r",
    "error": "connection refused"
  }
}
```

## Send

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

Receive event updates

```json
{
  "name": "/tcp/client/v1/192.168.1.246:23",
  "event": "send",
  "body": {
    "wasReceived": false,
    "timestamp": "2022-12-26T17:14:11.935Z",
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
    "timestamp": "2022-12-26T17:14:11.964Z",
    "hex": "4d5632340d",
    "ascii": "MV24\r",
    "buffer": {
      "type": "Buffer",
      "data": [77,86,50,52,13]
    },
    "error": null
  }
}
```

Errors

```json
{
  "name": "/tcp/client/v1/192.168.1.9:23",
  "event": "send",
  "body": {
    "wasReceived": false,
    "timestamp": "2022-12-26T17:36:49.187Z",
    "hex": "4d563f0d",
    "ascii": "MV?\r",
    "buffer": {
      "type": "Buffer",
      "data": [77,86,63,13]
    },
    "error": "data not sent, connection not open"
  }
}
```

```json
{
  "name": "/tcp/client/v1/192.168.1.9:5000",
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
  "name": "/tcp/client/v1",
  "event": "close",
  "body": {
    "ip": "192.168.1.246",
    "port": 23
  }
}
```

Subscribes to "/tcp/client/v1/192.168.1.246:23"

Receive event updates

```json
{
  "name": "/tcp/client/v1/192.168.1.246:23",
  "event": "close",
  "body": {
    "isOpen": false,
    "ip": "192.168.1.246",
    "port": 23,
    "address": "192.168.1.246:23",
    "expectedDelimiter": "\r",
    "error": null
  }
}
```
Errors

```json
{
  "name": "/tcp/client/v1/192.168.1.246:23",
  "event": "close",
  "body": {
    "error": "client already closed"
  }
}
```

```json
{
  "name": "/tcp/client/v1/192.168.1.9:5000",
  "event": "close",
  "body": {
    "error": "client is not defined, open the connection first"
  }
}
```

## getClient

Send

```json
{
  "name": "/tcp/client/v1",
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
        "timestamp": "2022-12-26T17:19:03.664Z",
        "hex": "4d563f0d",
        "ascii": "MV?\r",
        "buffer": {
          "type": "Buffer",
          "data": [77,86,63,13]
        },
        "error": null,
        "address": "192.168.1.246:23"
      },
      {
        "wasReceived": true,
        "timestamp": "2022-12-26T17:19:03.699Z",
        "hex": "4d5632340d",
        "ascii": "MV24\r",
        "buffer": {
          "type": "Buffer",
          "data": [77,86,50,52,13]
        },
        "error": null,
        "address": "192.168.1.246:23"
      },
      {
        "wasReceived": true,
        "timestamp": "2022-12-26T17:19:03.743Z",
        "hex": "4d564d41582039380d",
        "ascii": "MVMAX 98\r",
        "buffer": {
          "type": "Buffer",
          "data": [77,86,77,65,88,32,57,56,13]
        },
        "error": null,
        "address": "192.168.1.246:23"
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

Receive event updates

```json
{
  "name": "/tcp/client/v1",
  "event": "getClients",
  "body": [
    {
      "isOpen": false,
      "ip": "192.168.1.246",
      "port": 23,
      "address": "192.168.1.246:23",
      "expectedDelimiter": "\r",
      "history": [
        {
          "wasReceived": false,
          "timestamp": "2022-12-26T17:19:03.664Z",
          "hex": "4d563f0d",
          "ascii": "MV?\r",
          "buffer": {
            "type": "Buffer",
            "data": [77,86,63,13]
          },
          "error": null,
          "address": "192.168.1.246:23"
        },
        {
          "wasReceived": true,
          "timestamp": "2022-12-26T17:19:03.699Z",
          "hex": "4d5632340d",
          "ascii": "MV24\r",
          "buffer": {
            "type": "Buffer",
            "data": [77,86,50,52,13]
          },
          "error": null,
          "address": "192.168.1.246:23"
        },
        {
          "wasReceived": true,
          "timestamp": "2022-12-26T17:19:03.743Z",
          "hex": "4d564d41582039380d",
          "ascii": "MVMAX 98\r",
          "buffer": {
            "type": "Buffer",
            "data": [77,86,77,65,88,32,57,56,13]
          },
          "error": null,
          "address": "192.168.1.246:23"
        }
      ],
      "error": null
    }
  ]
}
```

## /tcp/client/v1

Send

```json
{
  "name": "/tcp/client/v1",
  "event": "subscribe"
}
```

Receive event updates for every tcp client

```json
{
  "name": "/tcp/client/v1",
  "event": "open",
  "body": {
    "isOpen": true,
    "ip": "192.168.1.246",
    "port": 23,
    "address": "192.168.1.246:23",
    "expectedDelimiter": "\r",
    "error": null
  }
}
```

```json
{
  "name": "/tcp/client/v1",
  "event": "send",
  "body": {
    "wasReceived": false,
    "timestamp": "2022-12-26T17:33:13.394Z",
    "hex": "4d563f0d",
    "ascii": "MV?\r",
    "buffer": {
      "type": "Buffer",
      "data": [77,86,63,13]
    },
    "error": null,
    "address": "192.168.1.246:23"
  }
}
```

```json
{
  "name": "/tcp/client/v1",
  "event": "receive",
  "body": {
    "wasReceived": true,
    "timestamp": "2022-12-26T17:33:13.436Z",
    "hex": "4d5632340d",
    "ascii": "MV24\r",
    "buffer": {
      "type": "Buffer",
      "data": [77,86,50,52,13]
    },
    "error": null,
    "address": "192.168.1.246:23"
  }
}
```

```json
{
  "name": "/tcp/client/v1",
  "event": "close",
  "body": {
    "isOpen": false,
    "ip": "192.168.1.246",
    "port": 23,
    "address": "192.168.1.246:23",
    "expectedDelimiter": "\r",
    "error": null
  }
}
```

Errors

```json
{
  "name": "/tcp/client/v1",
  "event": "open",
  "body": {
    "error": "connection already open",
    "address": "192.168.1.246:23"
  }
}
```

```json
{
  "name": "/tcp/client/v1",
  "event": "send",
  "body": {
    "wasReceived": false,
    "timestamp": "2022-12-26T17:36:49.187Z",
    "hex": "4d563f0d",
    "ascii": "MV?\r",
    "buffer": {
      "type": "Buffer",
      "data": [77,86,63,13]
    },
    "error": "data not sent, connection not open",
    "address": "192.168.1.9:23"
  }
}
```

```json
{
  "name": "/tcp/client/v1",
  "event": "send",
  "body": {
    "wasReceived": false,
    "timestamp": "2022-12-26T17:45:05.237Z",
    "hex": "4d563f0d",
    "ascii": "MV?\r",
    "buffer": {
      "type": "Buffer",
      "data": [77,86,63,13]
    },
    "error": "data not sent, connection not open",
    "address": "192.168.1.246:23"
  }
}
```

```json
{
  "name": "/tcp/client/v1",
  "event": "close",
  "body": {
    "error": "client already closed",
    "address": "192.168.1.246:23"
  }
}
```

```json
{
  "name": "/tcp/client/v1",
  "event": "close",
  "body": {
    "error": "client is not defined, open the connection first",
    "address": "192.168.1.9:5000"
  }
}
```
