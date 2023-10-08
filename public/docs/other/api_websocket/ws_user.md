# User API | WebSocket

## Login

Client Emmits

```json
{
  "name": "/user/v1",
  "event": "login",
  "body": {
    "username": "user",
    "password": "password"
  }
}
```

Subscribes to "/user/v1"

Server Emmits

```json
{
  "name": "/user/v1",
  "event": "login",
  "body": "success"
}
```

## Login

Client Emmits

```json
{
  "name": "/user/v1",
  "event": "login",
  "body": {
    "username": "user",
    "password": "password"
  }
}
```

Subscribes to "/user/v1"

Server Emmits

```json
{
  "name": "/user/v1",
  "event": "login",
  "body": "success"
}
```

