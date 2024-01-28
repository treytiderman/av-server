# API Structure

Overview: Simple JSON api. 

## Signal Flow

Input -> Auth checking -> Routes / Functions -> Output

## Supported Protocols

- WebSocket
- stdio (Standard In / Out)
- TCP (Future)
- UDP (Future)
- HTTP (Future)

## Input JSON

path - Location of the resource
body - Data for the resource

```json
{
    "path": "v0/user/add-group/arlo/",
    "body": "tester"
}
```

## Routes

Authentication
- user is logged in?

Authorization
- in "admin" group?
- in X group?

## Routes

```js
const path = "v0/user/add-group/:username/"
const group = "admin" // "*" for any

api.receive(path, group, (req, res) => {
    // req.path = "v0/user/add-group/arlo/"
    // req.params = { username: "arlo" }
    // req.body = "tester"
    // req.user = {username: "arlo", groups = ["admin"]}
    res.send("ok") // send to this api client
})

api.send("path", "hi") // send to all api clients
```

## Output JSON

path - Location of the resource
body - Data for the resource

```json
{
    "path": "v0/user/add-group/arlo/",
    "body": "ok"
}
{
    "path": "path",
    "body": "hi"
}
```
