// Overview: api wrapper for system.js module

// Imports
import * as api from '../modules/api.js'
import * as um from '../modules/user-v1.js'

// Functions
api.receive("/users/v1/func/login/", (client, path, body, params) => {
    const token = um.token.get(body.username, body.password)
    if (token.startsWith("error")) {
        client.send(path, token)
    } else {
        const user = um.user.get(body.username)
        client.auth = true
        client.user = user
        client.token = token
        client.send(path, "ok")
        api.send("/users/v1/topic/token/", token)
        api.send("/users/v1/topic/who-am-i/", user)
    }
})
api.receive("/users/v1/func/login-with-token/", (client, path, body, params) => {
    um.token.verify(body, (response, error) => {
        if (error) client.send(path, error)
        else {
            const user = um.user.get(response.username)
            client.auth = true
            client.user = user
            client.send(path, "ok")
            api.send("/users/v1/topic/who-am-i/", user)
        }
    })
})
api.receive("/users/v1/func/logout/", (client, path, body, params) => {
    client.auth = false
    client.user = undefined
    client.token = undefined
    client.send(path, "ok")
    api.send(client, "/users/v1/topic/who-am-i/", client.user)
})

api.receiveAdmin("/users/v1/func/group-create/", async (client, path, body, params) => {
    client.send(path, await um.groups.create(body))
})
api.receiveAdmin("/users/v1/func/group-delete/", async (client, path, body, params) => {
    client.send(path, await um.groups.delete(body))
})
api.receiveAdmin("/users/v1/func/groups-reset-to-default/", async (client, path, body, params) => {
    client.send(path, await um.groups.reset())
})

api.receiveAdmin("/users/v1/func/user-create/", async (client, path, body, params) => {
    client.send(path, await um.user.create(body.username, body.password, body.passwordConfirm, body.groups))
})
api.receiveAdmin("/users/v1/func/user-delete/", async (client, path, body, params) => {
    client.send(path, await um.user.delete(body))
})
api.receiveAdmin("/users/v1/func/user-add-group/", async (client, path, body, params) => {
    client.send(path, await um.user.addGroup(body.username, body.group))
})
api.receiveAdmin("/users/v1/func/user-remove-group/", async (client, path, body, params) => {
    client.send(path, await um.user.removeGroup(body.username, body.group))
})
api.receiveAdmin("/users/v1/func/user-change-password/", async (client, path, body, params) => {
    client.send(path, await um.user.changePassword(body.username, body.password, body.passwordConfirm))
})

api.receiveAdmin("/users/v1/func/users-reset-to-default/", async (client, path, body, params) => {
    client.send(path, await um.users.reset())
})

// Topics
api.receive("/users/v1/topic/token/", async (client, path, body, params) => {
    // client.send(path, client.token)
})
api.receiveAdmin("/users/v1/topic/who-am-i/", async (client, path, body, params) => {
    const callback = (user) => api.send("/users/v1/topic/who-am-i/", user)
    um.user.unsub(client.user.username, callback)
    um.user.sub(client.user.username, callback)
    client.send(path, client.user)
})
api.receiveAdmin("/users/v1/topic/groups/", async (client, path, body, params) => {
    const callback = (groups) => api.send("/users/v1/topic/groups/", groups)
    um.groups.unsub(callback)
    um.groups.sub(callback)
    client.send(path, um.groups.get())
})
api.receiveAdmin("/users/v1/topic/user/:username/", async (client, path, body, params) => {
    const callback = (user) => api.send(`/users/v1/topic/user/${user.username}/`, user)
    um.user.unsub(params.username, callback)
    um.user.sub(params.username, callback)
    client.send(path, um.user.get(params.username))
})
api.receiveAdmin("/users/v1/topic/users/", async (client, path, body, params) => {
    const callback = (users) => api.send("/users/v1/topic/users/", users)
    um.users.unsub(callback)
    um.users.sub(callback)
    client.send(path, um.users.get())
})
