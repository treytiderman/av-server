// Overview: api wrapper for system.js module

// Imports
import * as api from '../modules/api.js'
import * as serial from '../modules/serial.js'
import { Logger } from '../modules/logger.js'

const logger = new Logger("api-serial")

// Functions
api.receiveAdmin("/serial/v0/func/open/", async (client, path, body, params) => {
    const response = await logger.call(serial.open)(body.path, body.baudrate, body.encoding, body.delimiter)
    client.send(path, response)
})
api.receiveAdmin("/serial/v0/func/send/", async (client, path, body, params) => {
    const response = await logger.call(serial.send)(body.path, body.data, body.encoding)
    client.send(path, response)
})
api.receiveAdmin("/serial/v0/func/close/", async (client, path, body, params) => {
    const response = await logger.call(serial.close)(body.path)
    client.send(path, response)
})
api.receiveAdmin("/serial/v0/func/remove/", async (client, path, body, params) => {
    const response = await logger.call(serial.remove)(body.path)
    client.send(path, response)
})

// Topics
api.receiveAdmin("/serial/v0/topic/available/", async (client, path, body, params) => {
    const callback = data => api.send("/serial/v0/topic/available/", data)
    serial.db.unsubKey("available", callback)
    serial.db.subKey("available", callback)
    client.send(path, serial.db.getKey("available"))
})
api.receiveAdmin("/serial/v0/topic/status/:port", async (client, path, body, params) => {
    const callback = data => api.send(`/serial/v0/topic/status/${params.port}`, data)
    serial.db.unsubKey(params.port + "-status", callback)
    serial.db.subKey(params.port + "-status", callback)
    client.send(path, serial.db.getKey(params.port + "-status"))
})
api.receiveAdmin("/serial/v0/topic/data/:port", async (client, path, body, params) => {
    const callback = data => api.send(`/serial/v0/topic/data/${params.port}`, data)
    serial.db.unsubKey(params.port + "-data", callback)
    serial.db.subKey(params.port + "-data", callback)
})
api.receiveAdmin("/serial/v0/topic/history/:port", async (client, path, body, params) => {
    const callback = data => api.send(`/serial/v0/topic/history/${params.port}`, data)
    serial.db.unsubKey(params.port + "-history", callback)
    serial.db.subKey(params.port + "-history", callback)
})
