// Overview: api wrapper for the database-v1.js module

// Imports
import * as api from '../modules/api-v1.js'
import * as pm from './program-v1.js'

// Exports
export { routes }

// Help
const routes = [

    // Available
    { path: "v1/program/available/get/" },
    { path: "v1/program/available/sub/" },
    { path: "v1/program/available/unsub/" },

    // Program
    { path: "v1/program/get/:name/" },
    { path: "v1/program/sub/:name/" },
    { path: "v1/program/unsub/:name/" },
    { path: "v1/program/create/:name/", body: { name: "p1", directory: "../private/programs/examples", command: "node example.mjs", startOnBoot: true, env: { key: "value" } } },
    { path: "v1/program/set-directory/:name/", body: { directory: 9600 } },
    { path: "v1/program/set-command/:name/", body: { command: "node example.mjs" } },
    { path: "v1/program/set-start-on-boot/:name/", body: { startOnBoot: false } },
    { path: "v1/program/set-env/:name/", body: { env: { key: "value" } } },
    { path: "v1/program/start/:name/" },
    { path: "v1/program/send/:name/", body: { data: "string" } },
    { path: "v1/program/kill/:name/" },
    { path: "v1/program/restart/:name/" },
    { path: "v1/program/remove/:name/" },

    // Data
    { path: "v1/program/data/get/:name/" },
    { path: "v1/program/data/sub/:name/" },
    { path: "v1/program/data/unsub/:name/" },

    // History
    { path: "v1/program/history/get/:name/" },
    { path: "v1/program/history/sub/:name/" },
    { path: "v1/program/history/unsub/:name/" },

    // All programs
    { path: "v1/program/all/get/" },
    { path: "v1/program/all/sub/" },
    { path: "v1/program/all/unsub/" },
    { path: "v1/program/all/start/" },
    { path: "v1/program/all/send/", body: { data: "any" } },
    { path: "v1/program/all/kill/" },
    { path: "v1/program/all/restart/" },
    { path: "v1/program/all/remove/" },

    // Reset
    { path: "v1/program/reset-to-default/" },

]

// Available
api.receive("v1/program/available/get/", async (client, path, body, params) => {
    client.send(path, pm.available.get())
})
api.receive("v1/program/available/sub/", async (client, path, body, params) => {
    client.send(path, pm.available.get())
    client.sub("v1/program/available/pub/")
    const callback = (user) => api.send(`v1/program/available/pub/`, user)
    pm.available.unsub(callback)
    pm.available.sub(callback)
})
api.receive("v1/program/available/unsub/", async (client, path, body, params) => {
    client.unsub("v1/program/available/pub/")
})

// Program
api.receive("v1/program/get/:name/", async (client, path, body, params) => {
    client.send(path, pm.program.get(params.name))
})
api.receive("v1/program/sub/:name/", async (client, path, body, params) => {
    client.send(path, pm.program.get(params.name))
    client.sub(`v1/program/pub/${params.name}/`)
    const callback = (user) => api.send(`v1/program/pub/${params.name}/`, user)
    pm.program.unsub(params.name, callback)
    pm.program.sub(params.name, callback)
})
api.receive("v1/program/unsub/:name/", async (client, path, body, params) => {
    client.unsub(`v1/program/pub/${params.name}/`)
})
api.receiveAdmin("v1/program/create/:name/", async (client, path, body, params) => {
    client.send(path, await pm.log.program.create(params.name, body.directory, body.command, body.startOnBoot, body.env))
})
api.receiveAdmin("v1/program/set-directory/:name/", async (client, path, body, params) => {
    client.send(path, await pm.log.program.setDirectory(params.name, body.directory))
})
api.receiveAdmin("v1/program/set-command/:name/", async (client, path, body, params) => {
    client.send(path, await pm.log.program.setCommand(params.name, body.command))
})
api.receiveAdmin("v1/program/set-start-on-boot/:name/", async (client, path, body, params) => {
    client.send(path, await pm.log.program.setStartOnBoot(params.name, body.startOnBoot))
})
api.receiveAdmin("v1/program/set-env/:name/", async (client, path, body, params) => {
    client.send(path, await pm.log.program.setEnviromentVariables(params.name, body.env))
})
api.receiveAdmin("v1/program/start/:name/", async (client, path, body, params) => {
    client.send(path, await pm.log.program.start(params.name))
})
api.receiveAdmin("v1/program/send/:name/", async (client, path, body, params) => {
    client.send(path, await pm.log.program.send(params.name, body.data))
})
api.receiveAdmin("v1/program/kill/:name/", async (client, path, body, params) => {
    client.send(path, await pm.log.program.kill(params.name))
})
api.receiveAdmin("v1/program/restart/:name/", async (client, path, body, params) => {
    client.send(path, await pm.log.program.restart(params.name))
})
api.receiveAdmin("v1/program/remove/:name/", async (client, path, body, params) => {
    client.send(path, await pm.log.program.remove(params.name))
})

// Data
api.receive("v1/program/data/get/:name/", async (client, path, body, params) => {
    client.send(path, pm.data.get(params.name))
})
api.receive("v1/program/data/sub/:name/", async (client, path, body, params) => {
    client.send(path, pm.data.get(params.name))
    client.sub(`v1/program/data/pub/${params.name}/`)
    const callback = (user) => api.send(`v1/program/data/pub/${params.name}/`, user)
    pm.data.unsub(params.name, callback)
    pm.data.sub(params.name, callback)
})
api.receive("v1/program/data/unsub/:name/", async (client, path, body, params) => {
    client.unsub(`v1/program/data/pub/${params.name}/`)
})

// History
api.receive("v1/program/history/get/:name/", async (client, path, body, params) => {
    client.send(path, pm.history.get(params.name))
})
api.receive("v1/program/history/sub/:name/", async (client, path, body, params) => {
    client.send(path, pm.history.get(params.name))
    client.sub(`v1/program/history/pub/${params.name}/`)
    const callback = (user) => api.send(`v1/program/history/pub/${params.name}/`, user)
    pm.history.unsub(params.name, callback)
    pm.history.sub(params.name, callback)
})
api.receive("v1/program/history/unsub/:name/", async (client, path, body, params) => {
    client.unsub(`v1/program/history/pub/${params.name}/`)
})

// All Programs
api.receive("v1/program/all/get/", async (client, path, body, params) => {
    client.send(path, pm.programs.get())
})
api.receive("v1/program/all/sub/", async (client, path, body, params) => {
    client.send(path, pm.programs.get())
    client.sub(`v1/program/all/pub/`)
    const callback = (user) => api.send(`v1/program/all/pub/`, user)
    pm.programs.unsub(callback)
    pm.programs.sub(callback)
})
api.receive("v1/program/all/unsub/", async (client, path, body, params) => {
    client.unsub(`v1/program/all/pub/`)
})
api.receiveAdmin("v1/program/all/start/", async (client, path, body, params) => {
    client.send(path, await pm.log.programs.start())
})
api.receiveAdmin("v1/program/all/send/", async (client, path, body, params) => {
    client.send(path, await pm.log.programs.send(body.data))
})
api.receiveAdmin("v1/program/all/kill/", async (client, path, body, params) => {
    client.send(path, await pm.log.programs.kill())
})
api.receiveAdmin("v1/program/all/restart/", async (client, path, body, params) => {
    client.send(path, await pm.log.programs.restart())
})
api.receiveAdmin("v1/program/all/remove/", async (client, path, body, params) => {
    client.send(path, await pm.log.programs.remove())
})
