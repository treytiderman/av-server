// Overview: api wrapper for system.js module

// Imports
import * as api from '../modules/api.js'
import * as um from '../modules/user-v1.js'

// Exports
export { routes }

// Help
const routes = [

    // Auth
    { path: "v1/login/",body: { username: "username", password: "password" } },
    { path: "v1/login-with-token/", body: { token: "token" } },
    { path: "v1/logout/" },

    // Who Am I
    { path: "v1/whoami/get/" },
    { path: "v1/whoami/sub/" },
    { path: "v1/whoami/unsub/" },

    // User
    { path: "v1/user/get/:username/" },
    { path: "v1/user/sub/:username/" },
    { path: "v1/user/unsub/:username/" },
    { path: "v1/user/create/:username/", body: { password: "password", passwordConfirm: "password", groups: ["group"] } },
    { path: "v1/user/delete/:username/", body: { password: "password", passwordConfirm: "password", groups: ["group"] } },
    { path: "v1/user/add-group/:username/", body: { group: "group" } },
    { path: "v1/user/delete-group/:username/", body: { group: "group" } },
    { path: "v1/user/change-password/:username/", body: { password: "password", passwordConfirm: "password" } },

    // All Users
    { path: "v1/user/all/get/" },
    { path: "v1/user/all/sub/" },
    { path: "v1/user/all/unsub/" },
    { path: "v1/user/all/reset/" },

    // User Groups
    { path: "v1/user/groups/get/" },
    { path: "v1/user/groups/sub/" },
    { path: "v1/user/groups/unsub/" },
    { path: "v1/user/groups/reset/" },
    { path: "v1/user/groups/create/", body: { group: "group" } },
    { path: "v1/user/groups/delete/", body: { group: "group" } },

]

// Auth
api.receive("v1/login/", async (client, path, body, params) => {
    const token = await um.token.get(body.username, body.password)
    if (token.startsWith("error")) {
        client.send(path, token)
    } else {
        const user = um.user.get(body.username)
        client.auth = true
        client.user = user
        client.token = token
        client.send(path, token)
        api.send("v1/whoami/pub/", user)
    }
})
api.receive("v1/login-with-token/", (client, path, body, params) => {
    um.token.verify(body.token, (response, error) => {
        if (error) client.send(path, error)
        else {
            const user = um.user.get(response.username)
            client.auth = true
            client.user = user
            client.send(path, "ok")
            api.send("v1/whoami/pub/", user)
        }
    })
})
api.receive("v1/logout/", (client, path, body, params) => {
    client.auth = false
    client.user = undefined
    client.token = undefined
    client.send(path, "ok")
    api.send("v1/whoami/pub/", client.user)
})

// Who Am I
api.receive("v1/whoami/get/", async (client, path, body, params) => {
    client.send(path, client.user)
})
api.receive("v1/whoami/sub/", async (client, path, body, params) => {
    client.send(path, client.user)
    client.sub("v1/whoami/pub/")
})
api.receive("v1/whoami/unsub/", async (client, path, body, params) => {
    client.unsub("v1/whoami/pub/")
})

// User
api.receiveAdmin("v1/user/get/:username/", async (client, path, body, params) => {
    client.send(path, um.user.get(params.username))
})
api.receiveAdmin("v1/user/sub/:username/", async (client, path, body, params) => {
    client.send(path, um.user.get(params.username))
    client.sub(`v1/user/pub/${params.username}/`)
    const callback = (user) => api.send(`v1/user/pub/${params.username}/`, user)
    um.user.unsub(params.username, callback)
    um.user.sub(params.username, callback)
})
api.receiveAdmin("v1/user/unsub/:username/", async (client, path, body, params) => {
    client.unsub(`v1/user/pub/${params.username}/`)
})
api.receiveAdmin("v1/user/create/:username/", async (client, path, body, params) => {
    client.send(path, await um.user.create(params.username, body.password, body.passwordConfirm, body.groups))
})
api.receiveAdmin("v1/user/delete/:username/", async (client, path, body, params) => {
    client.send(path, await um.user.delete(params.username))
})
api.receiveAdmin("v1/user/add-group/:username/", async (client, path, body, params) => {
    client.send(path, await um.user.addGroup(params.username, body.group))
})
api.receiveAdmin("v1/user/remove-group/:username/", async (client, path, body, params) => {
    client.send(path, await um.user.removeGroup(params.username, body.group))
})
api.receiveAdmin("v1/user/change-password/:username/", async (client, path, body, params) => {
    client.send(path, await um.user.changePassword(params.username, body.password, body.passwordConfirm))
})

// Users
api.receiveAdmin("v1/user/all/get/", async (client, path, body, params) => {
    client.send(path, um.users.get())
})
api.receiveAdmin("v1/user/all/sub/", async (client, path, body, params) => {
    client.send(path, um.users.get())
    client.sub(`v1/user/all/pub/`)
    const callback = (user) => api.send(`v1/user/all/pub/`, user)
    um.users.unsub(callback)
    um.users.sub(callback)
})
api.receiveAdmin("v1/user/all/unsub/", async (client, path, body, params) => {
    client.unsub(`v1/user/all/pub/`)
})
api.receiveAdmin("v1/user/all/reset/", async (client, path, body, params) => {
    client.send(path, await um.users.reset())
})

// Groups
api.receiveAdmin("v1/user/groups/get/", async (client, path, body, params) => {
    client.send(path, um.groups.get())
})
api.receiveAdmin("v1/user/groups/sub/", async (client, path, body, params) => {
    client.send(path, um.groups.get())
    client.sub(`v1/user/groups/pub/`)
    const callback = (groups) => api.send(`v1/user/groups/pub/`, groups)
    um.groups.unsub(callback)
    um.groups.sub(callback)
})
api.receiveAdmin("v1/user/groups/unsub/", async (client, path, body, params) => {
    client.unsub(`v1/user/groups/pub/`)
})
api.receiveAdmin("v1/user/groups/reset/", async (client, path, body, params) => {
    client.send(path, await um.groups.reset())
})
api.receiveAdmin("v1/user/groups/create/", async (client, path, body, params) => {
    client.send(path, await um.groups.create(body.group))
})
api.receiveAdmin("v1/user/groups/delete/", async (client, path, body, params) => {
    client.send(path, await um.groups.delete(body.group))
})
