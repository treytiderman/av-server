// Overview: api wrapper for system.js module

// Imports
import * as api from '../modules/api.js'
import * as programs from './program-v0.js'

// Functions
api.receiveAdmin("/programs/v0/func/create/", async (client, path, body, params) => {
    client.send(path, programs.create(body.name, body.directory, body.command, body.env, body.startOnBoot))
})
api.receiveAdmin("/programs/v0/func/start/", async (client, path, body, params) => {
    client.send(path, programs.start(body.name))
})
api.receiveAdmin("/programs/v0/func/send/", async (client, path, body, params) => {
    client.send(path, programs.send(body.name, body.text))
})
api.receiveAdmin("/programs/v0/func/kill/", async (client, path, body, params) => {
    client.send(path, programs.kill(body.name))
})
api.receiveAdmin("/programs/v0/func/restart/", async (client, path, body, params) => {
    client.send(path, programs.restart(body.name))
})
api.receiveAdmin("/programs/v0/func/remove/", async (client, path, body, params) => {
    client.send(path, programs.remove(body.name))
})

api.receiveAdmin("/programs/v0/func/set-directory/", async (client, path, body, params) => {
    client.send(path, programs.setDirectory(body.name, body.directory))
})
api.receiveAdmin("/programs/v0/func/set-command/", async (client, path, body, params) => {
    client.send(path, programs.setCommand(body.name, body.command))
})
api.receiveAdmin("/programs/v0/func/set-start-on-boot/", async (client, path, body, params) => {
    client.send(path, programs.setStartOnBoot(body.name, body.startOnBoot))
})
api.receiveAdmin("/programs/v0/func/set-enviroment-variables/", async (client, path, body, params) => {
    client.send(path, programs.setEnviromentVariables(body.name, body.env))
})

api.receiveAdmin("/programs/v0/func/start-all/", async (client, path, body, params) => {
    client.send(path, programs.startAll())
})
api.receiveAdmin("/programs/v0/func/send-all/", async (client, path, body, params) => {
    client.send(path, programs.sendAll(body.text))
})
api.receiveAdmin("/programs/v0/func/kill-all/", async (client, path, body, params) => {
    client.send(path, programs.killAll())
})
api.receiveAdmin("/programs/v0/func/restart-all/", async (client, path, body, params) => {
    client.send(path, programs.restartAll())
})
api.receiveAdmin("/programs/v0/func/remove-all/", async (client, path, body, params) => {
    client.send(path, programs.removeAll())
})

// Topics
api.receiveAdmin("/programs/v0/topic/available/", async (client, path, body, params) => {
    client.send(path, programs.available())
})
api.receiveAdmin("/programs/v0/topic/data/:name/", async (client, path, body, params) => {})
api.receiveAdmin("/programs/v0/topic/history/:name/", async (client, path, body, params) => {
    client.send(path, programs.history(params.name))
})
api.receiveAdmin("/programs/v0/topic/status/:name/", async (client, path, body, params) => {
    client.send(path, programs.status(params.name))
})
api.receiveAdmin("/programs/v0/topic/status-all/", async (client, path, body, params) => {
    client.send(path, programs.statusAll())
})

// Events
programs.emitter.on("available", (data) => {
    api.send(`/programs/v0/topic/available/`, data)
})
programs.emitter.on("data", (name, data) => {
    api.send(`/programs/v0/topic/data/${name}/`, data)
})
programs.emitter.on("history", (name, data) => {
    api.send(`/programs/v0/topic/history/${name}/`, data)
})
programs.emitter.on("status", (name, data) => {
    api.send(`/programs/v0/topic/status/${name}/`, data)
})
programs.emitter.on("status-all", (data) => {
    api.send(`/programs/v0/topic/status-all/`, data)
})
