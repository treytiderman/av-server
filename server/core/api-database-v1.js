// Overview: api wrapper for system.js module

// Imports
import * as api from '../modules/api.js'
import * as db from '../modules/store.js'

// Functions
api.receiveAdmin("/database/v0/func/create/", async (client, path, body, params) => {
    const response = db.createDatabase(body.name, body.defaultData)
    client.send(path, response)
})
api.receiveAdmin("/database/v0/func/write/", async (client, path, body, params) => {
    const response = db.writeDatabase(body.name)
    client.send(path, response)
})
api.receiveAdmin("/database/v0/func/reset/", async (client, path, body, params) => {
    const response = db.createDatabase(body.name)
    client.send(path, response)
})
api.receiveAdmin("/database/v0/func/delete/", async (client, path, body, params) => {
    const response = db.deleteDatabase(body.name)
    client.send(path, response)
})
api.receiveAdmin("/database/v0/func/delete-all/", async (client, path, body, params) => {
    const response = db.deleteDatabases()
    client.send(path, response)
})

api.receiveAdmin("/database/v0/func/set-key/", async (client, path, body, params) => {
    const response = db.setKeyInDatabase(body.name, body.key, body.value)
    client.send(path, response)
})
api.receiveAdmin("/database/v0/func/set-key-write-database/", async (client, path, body, params) => {
    const response = db.setAndWriteKeyInDatabase(body.name, body.key, body.value)
    client.send(path, response)
})
api.receiveAdmin("/database/v0/func/delete-key/", async (client, path, body, params) => {
    const response = db.deleteKeyInDatabase(body.name, body.key)
    client.send(path, response)
})

// Topics
api.receiveAdmin("/database/v0/topic/names/", async (client, path, body, params) => {
    client.send(path, db.getDatabaseNames())
})
api.receiveAdmin("/database/v0/topic/data/:name/", async (client, path, body, params) => {
    client.send(path, db.getDatabase(params.name))
})
api.receiveAdmin("/database/v0/topic/key/:name/:key/", async (client, path, body, params) => {
    client.send(path, db.getKeyInDatabase(params.name, params.key))
})

// Events
db.emitter.on("names", (data) => {
    api.send(`/database/v0/topic/names/`, data)
})
db.emitter.on("data", (name, data) => {
    api.send(`/database/v0/topic/data/${name}/`, data)
})
db.emitter.on("key", (name, key, data) => {
    api.send(`/database/v0/topic/key/${name}/${key}/`, key, data)
})
