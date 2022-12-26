# Websocket API

### Connect

Open a WebSocket connection to ws://HOST:PORT
- Example: ws://192.168.1.9:4620

### Example 1

Empty Send

```json
```

Response

```json
{
  "error": "invalid JSON",
  "try this": {
    "name": "time",
    "event": "get"
  }
}
```

### Example 2

Send

```json
{
  "name": "time",
  "event": "get"
}
```

Receive

```json
{
  "name": "time",
  "event": "get",
  "body": "2022-12-26T17:08:20.264Z"
}
```

### Example 3

Send

```json
{
  "name": "time",
  "event": "subscribe"
}
```

Receive everytime "time" is updated

```json
{
  "name": "time",
  "event": "publish",
  "body": "2022-12-26T17:08:36.407Z"
}
```

### Example 4

Send

```json
{
  "name": "uptime",
  "event": "subscribe"
}
```

Receive everytime "uptime" is updated

```json
{
  "name": "uptime",
  "event": "publish",
  "body": 211
}
```

### Example 5

Send

```json
{
  "event": "subscribed"
}
```

Receive

```json
{
  "event": "subscribed",
  "body": [
    "time",
    "uptime"
  ]
}
```

### Example 6

Send

```json
{
  "name": "time",
  "event": "unsubscribe"
}
```

Stop receiving "uptime" events

```json
```

### Example 7

Send

```json
{
  "name": "*",
  "event": "unsubscribe"
}
```

Stop receiving all events

```json
```

### Example 8

Send

```json
{
  "name": "?",
  "event": "idk"
}
```

Receive nothing

### Example 9

Send

```json
{
  "name": "key",
  "event": "publish",
  "body": "value"
}
```

### Example 10

Send

```json
{
  "name": "*",
  "event": "get"
}
```

Receive

```json
{
  "name": "*",
  "event": "get",
  "body": {
    "time": "2022-12-26T17:10:04.126Z",
    "uptime": 279,
    "test": "success",
    "192.168.1.9": {
      "key": "value"
    }
  }
}
```