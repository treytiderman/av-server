const emitter = {}
const api = {
    send: (path, body) => {},
    receive: (path, callback) => {},
}

const protocals = ["websocket", "stdio", "tcp", "udp"]

// Receive
api.receive("/path/to/endpoint", (client, body) => {
    const response = someFunction(body)
    client.send(response)
})
api.receive("/path/to/endpoint/:id", (client, body, params) => {
    const response = anotherFunction(params.id, body)
    client.send(response)
})

// Events
emitter.on("event-name", (data) => {
    const body = data
    api.send("/path/to/endpoint", body)
})
