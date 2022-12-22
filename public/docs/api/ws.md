# Websocket API

## API sturcture

### `GET`

Get named value from the server

```json
{
  "request": "get",
  "name": "/api/v1/clients"
}
```

Server Response

```json
{
  "name": "/api/v1/clients",
  "body": "bla bla bla"
}
```

### `SUBSCRIBE`

Subscribe to that named value and receive updates whenever new data is available

```json
{
  "request": "subscribe",
  "name": "/api/v1/clients"
}
```

Server Response

```json
{
  "name": "/api/v1/clients",
  "body": "bla bla bla"
}
```

### `UNSUBSCRIBE`

Unsubscribe from named value

```json
{
  "request": "unsubscribe",
  "name": "/api/v1/clients"
}
```

### `UNSUBSCRIBE ALL`

Unsubscribe from everything

```json
{
  "request": "unsubscribe",
  "name": "*"
}
```

### `Call`

Call a function on the server

```json
{
  "request": "call",
  "name": "/api/v1/send",
  "body": "something to send"
}
```

Server Response

```json
{
  "name": "/api/v1/send",
  "body": "bla bla bla"
}
```

### `PUBLISH`

Publish data to whoever is listening

```json
{
  "request": "publish",
  "name": "/api/v1/position",
  "body": [32, 67]
}
```

## Examples

### Example 1

Empty Request

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
  "body": "2022-12-21T02:23:29.418Z"
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
  "body": "2022-12-21T02:24:14.778Z"
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
  "body": "72"
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

Response

```json
```

### Example 9

Request

```json
{
  "name": "key",
  "event": "publish",
  "body": "value"
}
```

### Example 10

Request

```json
{
  "name": "*",
  "event": "get"
}
```

Response

```json
{
  "name": "*",
  "event": "get",
  "body": {    
    "time": "2022-12-21T02:42:01.228Z",
    "uptime": 154,
    "test": "success",
    "192.168.1.9": {
      "key": "value"
    }
  }
}
```