// Overview: api wrapper for system.js module

// Imports
import * as api from '../modules/api.js'
import * as programs from '../modules/programs.js'

// Functions
api.receive("programs/v0/func/create", async (client, path, body, params) => {
    if (api.isAdmin(client, path) === false) return
    client.sendPath(path, programs.create(body.name, body.directory, body.command, body.env, body.startOnBoot))
})
api.receive("programs/v0/func/start", async (client, path, body, params) => {
    if (api.isAdmin(client, path) === false) return
    client.sendPath(path, programs.start(body.name))
})
api.receive("programs/v0/func/send", async (client, path, body, params) => {
    if (api.isAdmin(client, path) === false) return
    client.sendPath(path, programs.send(body.name, body.text))
})
api.receive("programs/v0/func/kill", async (client, path, body, params) => {
    if (api.isAdmin(client, path) === false) return
    client.sendPath(path, programs.kill(body.name))
})
api.receive("programs/v0/func/restart", async (client, path, body, params) => {
    if (api.isAdmin(client, path) === false) return
    client.sendPath(path, programs.restart(body.name))
})
api.receive("programs/v0/func/remove", async (client, path, body, params) => {
    if (api.isAdmin(client, path) === false) return
    client.sendPath(path, programs.remove(body.name))
})

api.receive("programs/v0/func/set-directory", async (client, path, body, params) => {
    if (api.isAdmin(client, path) === false) return
    client.sendPath(path, programs.setDirectory(body.name, body.directory))
})
api.receive("programs/v0/func/set-command", async (client, path, body, params) => {
    if (api.isAdmin(client, path) === false) return
    client.sendPath(path, programs.setCommand(body.name, body.command))
})
api.receive("programs/v0/func/set-start-on-boot", async (client, path, body, params) => {
    if (api.isAdmin(client, path) === false) return
    client.sendPath(path, programs.setStartOnBoot(body.name, body.startOnBoot))
})
api.receive("programs/v0/func/set-enviroment-variables", async (client, path, body, params) => {
    if (api.isAdmin(client, path) === false) return
    client.sendPath(path, programs.setEnviromentVariables(body.name, body.env))
})

api.receive("programs/v0/func/start-all", async (client, path, body, params) => {
    if (api.isAdmin(client, path) === false) return
    client.sendPath(path, programs.startAll())
})
api.receive("programs/v0/func/send-all", async (client, path, body, params) => {
    if (api.isAdmin(client, path) === false) return
    client.sendPath(path, programs.sendAll(body.text))
})
api.receive("programs/v0/func/kill-all", async (client, path, body, params) => {
    if (api.isAdmin(client, path) === false) return
    client.sendPath(path, programs.killAll())
})
api.receive("programs/v0/func/restart-all", async (client, path, body, params) => {
    if (api.isAdmin(client, path) === false) return
    client.sendPath(path, programs.restartAll())
})
api.receive("programs/v0/func/remove-all", async (client, path, body, params) => {
    if (api.isAdmin(client, path) === false) return
    client.sendPath(path, programs.removeAll())
})

// Topics
api.receive("programs/v0/topic/available", async (client, path, body, params) => {
    if (body === "unsub") client.unsubscribe(path)
    else if (body === "sub") client.subscribe(path)
    client.sendPath(path, programs.available())
})
api.receive("programs/v0/topic/data/:name", async (client, path, body, params) => {
    if (body === "unsub") client.unsubscribe(path)
    else if (body === "sub") client.subscribe(path)
})
api.receive("programs/v0/topic/history/:name", async (client, path, body, params) => {
    if (body === "unsub") client.unsubscribe(path)
    else if (body === "sub") client.subscribe(path)
    client.sendPath(path, programs.history(params.name))
})
api.receive("programs/v0/topic/status/:name", async (client, path, body, params) => {
    if (body === "unsub") client.unsubscribe(path)
    else if (body === "sub") client.subscribe(path)
    client.sendPath(path, programs.status(params.name))
})
api.receive("programs/v0/topic/status-all", async (client, path, body, params) => {
    if (body === "unsub") client.unsubscribe(path)
    else if (body === "sub") client.subscribe(path)
    client.sendPath(path, programs.statusAll())
})

// Events
programs.emitter.on("available", (data) => {
    api.send(`programs/v0/topic/available`, data)
})
programs.emitter.on("data", (name, data) => {
    api.send(`programs/v0/topic/data/${name}`, data)
})
programs.emitter.on("history", (name, data) => {
    api.send(`programs/v0/topic/history/${name}`, data)
})
programs.emitter.on("status", (name, data) => {
    api.send(`programs/v0/topic/status/${name}`, data)
})
programs.emitter.on("status-all", (data) => {
    api.send(`programs/v0/topic/status-all`, data)
})
