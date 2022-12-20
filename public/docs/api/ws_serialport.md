# Serial API | WebSocket


## API sturcture

### `GET`

> Get data from the server

```json
{
  "method": "get",
  "key": "/api/v1/clients"
}
```

> Server Response

```json
{
  "key": "/api/v1/clients",
  "value": "bla bla bla"
}
```

### `SUBSCRIBE`

> Subscribe to that data and receive updates whenever new data is available

```json
{
  "method": "subscribe",
  "key": "/api/v1/clients"
}
```

> Server Response

```json
{
  "key": "/api/v1/clients",
  "value": "bla bla bla"
}
```

### `UNSUBSCRIBE`

> Subscribe to that data and receive updates whenever new data is available

```json
{
  "method": "unsubscribe",
  "key": "/api/v1/clients"
}
```

> Server Response

```json
{
  "key": "subscribed",
  "value": "bla bla bla"
}
```

### `FUNCTION`

> Call a function on the server

```json
{
  "method": "/api/v1/send",
  "body": "something to send"
}
```

> Server Response

```json
{
  "key": "/api/v1/clients",
  "value": "bla bla bla"
}
```

### `PUBLISH`

> Publish data to whoever is listening

```json
{
  "method": "publish",
  "key": "/api/v1/position",
  "value": [32, 67]
}
```


const CLIENT_ECHO_OBJ = {
  "method": "get",
  "data": "/api/v1/clients",
  "echo": true
}
const CLIENT_SUBSCRIBE_OBJ = {
  "method": "subscribe",
  "data": "/api/v1/time"
}
const CLIENT_UNSUBSCRIBE_OBJ = {
  "method": "unsubscribe",
  "data": "/api/v1/time"
}
const CLIENT_UNSUBSCRIBE_ALL_OBJ = {
  "method": "unsubscribe",
  "data": "*"
}
const CLIENT_PUBLISH_OBJ = {
  "method": "/api/v1/position",
  "data": "value"
}
const CLIENT_SUBSCRIBED_OBJ = {
  "method": "get",
  "data": "subscriptions"
}

