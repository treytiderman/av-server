// Overview: api wrapper for the database-v1.js module

// Imports
import * as api from '../modules/api-v1.js'
import * as sm from '../extensions/serial-v1.js'

// Exports
export { routes }

// Help
const routes = [

    // Available
    { path: "v1/serialport/available/get/" },
    { path: "v1/serialport/available/sub/" },
    { path: "v1/serialport/available/unsub/" },

    // Port
    { path: "v1/serialport/get/:path/" },
    { path: "v1/serialport/sub/:path/" },
    { path: "v1/serialport/unsub/:path/" },
    { path: "v1/serialport/open/:path/", body: { baudrate: 9600, encoding: "ascii", delimiter: "none" } },
    { path: "v1/serialport/send/:path/", body: { data: "hi", encoding: "ascii" } },
    { path: "v1/serialport/close/:path/" },
    { path: "v1/serialport/remove/:path/" },
    { path: "v1/serialport/set-baudrate/:path/", body: { baudrate: 9600 } },
    { path: "v1/serialport/set-delimiter/:path/", body: { delimiter: "\r\n" } },
    { path: "v1/serialport/set-encoding/:path/", body: { encoding: "ascii" } },

    // Data
    { path: "v1/serialport/data/get/:path/" },
    { path: "v1/serialport/data/sub/:path/" },
    { path: "v1/serialport/data/unsub/:path/" },

    // History
    { path: "v1/serialport/history/get/:path/" },
    { path: "v1/serialport/history/sub/:path/" },
    { path: "v1/serialport/history/unsub/:path/" },

    // All Ports
    { path: "v1/serialport/all/get/" },
    { path: "v1/serialport/all/sub/" },
    { path: "v1/serialport/all/unsub/" },
    { path: "v1/serialport/all/send/", body: { data: "any" } },
    { path: "v1/serialport/all/close/" },
    { path: "v1/serialport/all/remove/" },

]

// Available
api.receive("v1/serialport/available/get/", async (client, path, body, params) => {
    client.send(path, sm.available.get())
})
api.receive("v1/serialport/available/sub/", async (client, path, body, params) => {
    client.send(path, sm.available.get())
    client.sub("v1/serialport/available/pub/")
    const callback = (user) => api.send(`v1/serialport/available/pub/`, user)
    sm.available.unsub(callback)
    sm.available.sub(callback)
})
api.receive("v1/serialport/available/unsub/", async (client, path, body, params) => {
    client.unsub("v1/serialport/available/pub/")
})

// Port
api.receive("v1/serialport/get/:path/", async (client, path, body, params) => {
    client.send(path, sm.port.get(params.path))
})
api.receive("v1/serialport/sub/:path/", async (client, path, body, params) => {
    client.send(path, sm.port.get(params.path))
    client.sub(`v1/serialport/pub/${params.path}/`)
    const callback = (user) => api.send(`v1/serialport/pub/${params.path}/`, user)
    sm.port.unsub(params.path, callback)
    sm.port.sub(params.path, callback)
})
api.receive("v1/serialport/unsub/:path/", async (client, path, body, params) => {
    client.unsub(`v1/serialport/pub/${params.path}/`)
})
api.receiveAdmin("v1/serialport/open/:path/", async (client, path, body, params) => {
    client.send(path, await sm.log.port.open(params.path, body.baudrate, body.encoding, body.delimiter))
})
api.receiveAdmin("v1/serialport/set-baudrate/:path/", async (client, path, body, params) => {
    client.send(path, await sm.log.port.setBaudrate(params.path, body.baudrate))
})
api.receiveAdmin("v1/serialport/set-encoding/:path/", async (client, path, body, params) => {
    client.send(path, await sm.log.port.setEncoding(params.path, body.encoding))
})
api.receiveAdmin("v1/serialport/set-delimiter/:path/", async (client, path, body, params) => {
    client.send(path, await sm.log.port.setDelimiter(params.path, body.delimiter))
})
api.receiveAdmin("v1/serialport/send/:path/", async (client, path, body, params) => {
    client.send(path, await sm.log.port.send(params.path, body.data))
})
api.receiveAdmin("v1/serialport/reconnect/:path/", async (client, path, body, params) => {
    client.send(path, await sm.log.port.reconnect(params.path))
})
api.receiveAdmin("v1/serialport/close/:path/", async (client, path, body, params) => {
    client.send(path, await sm.log.port.close(params.path))
})
api.receiveAdmin("v1/serialport/remove/:path/", async (client, path, body, params) => {
    client.send(path, await sm.log.port.remove(params.path))
})

// Data
api.receive("v1/serialport/data/get/:path/", async (client, path, body, params) => {
    client.send(path, sm.data.get(params.path))
})
api.receive("v1/serialport/data/sub/:path/", async (client, path, body, params) => {
    client.send(path, sm.data.get(params.path))
    client.sub(`v1/serialport/data/pub/${params.path}/`)
    const callback = (user) => api.send(`v1/serialport/data/pub/${params.path}/`, user)
    sm.data.unsub(params.path, callback)
    sm.data.sub(params.path, callback)
})
api.receive("v1/serialport/data/unsub/:path/", async (client, path, body, params) => {
    client.unsub(`v1/serialport/data/pub/${params.path}/`)
})

// History
api.receive("v1/serialport/history/get/:path/", async (client, path, body, params) => {
    client.send(path, sm.history.get(params.path))
})
api.receive("v1/serialport/history/sub/:path/", async (client, path, body, params) => {
    client.send(path, sm.history.get(params.path))
    client.sub(`v1/serialport/history/pub/${params.path}/`)
    const callback = (user) => api.send(`v1/serialport/history/pub/${params.path}/`, user)
    sm.history.unsub(params.path, callback)
    sm.history.sub(params.path, callback)
})
api.receive("v1/serialport/history/unsub/:path/", async (client, path, body, params) => {
    client.unsub(`v1/serialport/history/pub/${params.path}/`)
})

// All Ports
api.receive("v1/serialport/all/get/", async (client, path, body, params) => {
    client.send(path, sm.ports.get())
})
api.receive("v1/serialport/all/sub/", async (client, path, body, params) => {
    client.send(path, sm.ports.get())
    client.sub(`v1/serialport/all/pub/`)
    const callback = (user) => api.send(`v1/serialport/all/pub/`, user)
    sm.ports.unsub(callback)
    sm.ports.sub(callback)
})
api.receive("v1/serialport/all/unsub/", async (client, path, body, params) => {
    client.unsub(`v1/serialport/all/pub/`)
})
api.receiveAdmin("v1/serialport/all/send/", async (client, path, body, params) => {
    client.send(path, await sm.log.ports.send(body.data))
})
api.receiveAdmin("v1/serialport/all/close/", async (client, path, body, params) => {
    client.send(path, await sm.log.ports.close())
})
api.receiveAdmin("v1/serialport/all/remove/", async (client, path, body, params) => {
    client.send(path, await sm.log.ports.remove())
})
