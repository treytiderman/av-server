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

`Empty Request`

```json
```

`Response`

```json
{
  "error": "invalid JSON",
  "try this": {
    "request": "get",
    "name": "time"
  }
}
```

### Example 2

`Request`

```json
{
  "request": "get",
  "name": "time"
}
```

`Response`

```json
{
  "name": "time",
  "body": "2022-12-21T02:23:29.418Z"
}
```

### Example 3

`Request`

```json
{
  "request": "subscribe",
  "name": "time"
}
```

`Response everytime "time" is updated`

```json
{
  "name": "time",
  "body": "2022-12-21T02:24:14.778Z"
}
```

### Example 4

`Request`

```json
{
  "request": "subscribe",
  "name": "uptime"
}
```

`Response everytime "uptime" is updated`

```json
{
  "name": "uptime",
  "body": "72"
}
```

### Example 5

`Request`

```json
{
  "request": "subscribed"
}
```

`Response`

```json
{
  "request": "subscribed",
  "body": [
    "time",
    "uptime"
  ]
}
```

### Example 6

`Request`

```json
{
  "request": "unsubscribe",
  "name": "time"
}
```

`No updates for "time" anymore`

```json
```

### Example 7

`Request`

```json
{
  "request": "unsubscribeAll"
}
```

`No more updates`

```json
```

### Example 8

`Request`

```json
{
  "request": "idk",
  "name": "?"
}
```

`Response`

```json
{
  "request": "idk",
  "name": "?",
  "error": "request unknown",
  "try_this": {
    "request": "get",
    "name": "time"
  }
}
```

### Example 9

`Request`

```json
{
  "request": "publish",
  "name": "key",
  "body": "value",
}
```

`Response`

```json
{
  "request": "idk",
  "name": "?",
  "error": "request unknown",
  "try_this": {
    "request": "get",
    "name": "time"
  }
}
```

### Example 10

`Request`

```json
{
  "request": "get",
  "name": "*"
}
```

`Response`

```json
{
  "time": "2022-12-21T02:42:01.228Z",
  "uptime": 154,
  "test": "success",
  "192.168.1.9": {
    "key": "value"
  }
}
```