# Websocket API | Sturcture

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
