// Overview: api wrapper for the database-v1.js module

// Imports
import * as api from './api-v1.js'
import * as db from './database-v1.js'

// Exports
export { routes }

// Help
const routes = [

    // Database Names
    { path: "v1/database/names/get/" },
    { path: "v1/database/names/sub/" },
    { path: "v1/database/names/unsub/" },
    
    // Database
    { path: "v1/database/get/:name/" },
    { path: "v1/database/sub/:name/" },
    { path: "v1/database/unsub/:name/" },
    { path: "v1/database/create/:name/", body: { data: {} } },
    { path: "v1/database/remove/:name/" },
    { path: "v1/database/set/:name/", body: { data: {} } },
    { path: "v1/database/write/:name/" },
    { path: "v1/database/reset/:name/" },
    
    // Key
    { path: "v1/database/key/get/:name/:key/" },
    { path: "v1/database/key/sub/:name/:key/" },
    { path: "v1/database/key/unsub/:name/:key/" },
    { path: "v1/database/key/set/:name/:key/", body: { data: "any" } },
    { path: "v1/database/key/remove/:name/:key/" },

    // Reset All
    { path: "v1/database/all/reset/" },

]

// Database Names
api.receiveAdmin("v1/database/names/get/", async (client, path, body, params) => {
    client.send(path, await db.getNames())
})
api.receiveAdmin("v1/database/names/sub/", async (client, path, body, params) => {
    client.send(path, await db.getNames())
    client.sub("v1/database/names/pub/")
    const callback = (names) => api.send("v1/database/names/pub/", names)
    db.unsubNames(callback)
    db.subNames(callback)
})
api.receiveAdmin("v1/database/names/unsub/", async (client, path, body, params) => {
    client.unsub("v1/database/names/pub/")
})

// Database
api.receiveAdmin("v1/database/get/:name/", async (client, path, body, params) => {
    client.send(path, await db.get(params.name))
})
api.receiveAdmin("v1/database/sub/:name/", async (client, path, body, params) => {
    client.send(path, await db.get(params.name))
    client.sub(`v1/database/pub/${params.name}/`)
    const callback = (data) => api.send(`v1/database/pub/${params.name}/`, data)
    db.unsub(params.name, callback)
    db.sub(params.name, callback)
})
api.receiveAdmin("v1/database/unsub/:name/", async (client, path, body, params) => {
    client.unsub(`v1/database/pub/${params.name}/`)
})
api.receiveAdmin("v1/database/create/:name/", async (client, path, body, params) => {
    client.send(path, await db.create(params.name, body.data))
})
api.receiveAdmin("v1/database/remove/:name/", async (client, path, body, params) => {
    client.send(path, await db.remove(params.name))
})
api.receiveAdmin("v1/database/set/:name/", async (client, path, body, params) => {
    client.send(path, await db.set(params.name, body.data))
})
api.receiveAdmin("v1/database/write/:name/", async (client, path, body, params) => {
    client.send(path, await db.write(params.name))
})
api.receiveAdmin("v1/database/reset/:name/", async (client, path, body, params) => {
    client.send(path, await db.reset(params.name))
})

// Key
api.receiveAdmin("v1/database/key/get/:name/:key/", async (client, path, body, params) => {
    client.send(path, db.getKey(params.name, params.key))
})
api.receiveAdmin("v1/database/key/sub/:name/:key/", async (client, path, body, params) => {
    client.send(path, db.getKey(params.name, params.key))
    client.sub(`v1/database/key/pub/${params.name}/${params.key}/`)
    const callback = (data) => api.send(`v1/database/key/pub/${params.name}/${params.key}/`, data)
    db.unsubKey(params.name, params.key, callback)
    db.subKey(params.name, params.key, callback)
})
api.receiveAdmin("v1/database/key/unsub/:name/:key/", async (client, path, body, params) => {
    client.unsub(`v1/database/key/pub/${params.name}/${params.key}/`)
})
api.receiveAdmin("v1/database/key/set/:name/:key/", async (client, path, body, params) => {
    client.send(path, db.setKey(params.name, params.key, body.data))
})
api.receiveAdmin("v1/database/key/remove/:name/:key/", async (client, path, body, params) => {
    client.send(path, await db.removeKey(params.name, params.key))
})

// Reset All
api.receiveAdmin("v1/database/all/reset/", async (client, path, body, params) => {
    // client.send(path, await db.removeAll())
})
