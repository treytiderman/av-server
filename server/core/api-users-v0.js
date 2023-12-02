// Overview: api wrapper for system.js module

// Imports
import * as api from '../modules/api.js'
import * as users from '../modules/users.js'

// Functions
api.receive("/users/v0/func/login/", (client, path, body, params) => {
    const token = users.login(body.username, body.password)
    if (token.startsWith("error")) {
        client.send(path, token)
    } else {
        const user = users.getUser(body.username)
        client.auth = true
        client.user = user
        client.token = token
        client.send(path, "ok")
        api.send("/users/v0/topic/token/", token)
        api.send("/users/v0/topic/who-am-i/", user)
    }
})
api.receive("/users/v0/func/login-with-token/", (client, path, body, params) => {
    users.loginWithToken(body, (response, error) => {
        if (error) client.send(path, error)
        else {
            const user = users.getUser(response.username)
            client.auth = true
            client.user = user
            client.send(path, "ok")
            api.send("/users/v0/topic/who-am-i/", user)
        }
    })
})
api.receive("/users/v0/func/logout/", (client, path, body, params) => {
    users.logout()
    client.auth = false
    client.user = undefined
    client.token = undefined
    client.send(path, "ok")
    api.send(client, "/users/v0/topic/who-am-i/", client.user)
})

api.receiveAdmin("/users/v0/func/group-create/", async (client, path, body, params) => {
    client.send(path, await users.createGroup(body))
})
api.receiveAdmin("/users/v0/func/group-delete/", async (client, path, body, params) => {
    client.send(path, await users.deleteGroup(body))
})

api.receiveAdmin("/users/v0/func/user-create/", async (client, path, body, params) => {
    client.send(path, await users.createUser(body.username, body.password, body.passwordConfirm, body.groups))
})
api.receiveAdmin("/users/v0/func/user-delete/", async (client, path, body, params) => {
    client.send(path, await users.deleteUser(body))
})
api.receiveAdmin("/users/v0/func/user-add-group/", async (client, path, body, params) => {
    client.send(path, await users.addGroupToUser(body.username, body.group))
})
api.receiveAdmin("/users/v0/func/user-remove-group/", async (client, path, body, params) => {
    client.send(path, await users.removeGroupFromUser(body.username, body.group))
})
api.receiveAdmin("/users/v0/func/user-change-password/", async (client, path, body, params) => {
    client.send(path, await users.changeUserPassword(body.username, body.password, body.passwordConfirm))
})

api.receiveAdmin("/users/v0/func/reset-to-default/", async (client, path, body, params) => {
    client.send(path, await users.resetToDefault())
})

// Topics
api.receive("/users/v0/topic/token/", async (client, path, body, params) => {
    // client.send(path, client.token)
})
api.receiveAdmin("/users/v0/topic/who-am-i/", async (client, path, body, params) => {
    client.send(path, client.user)
})
api.receiveAdmin("/users/v0/topic/groups/", async (client, path, body, params) => {
    client.send(path, users.getGroups())
})
api.receiveAdmin("/users/v0/topic/user/:username/", async (client, path, body, params) => {
    client.send(path, users.getUser(params.username))
})
api.receiveAdmin("/users/v0/topic/users/", async (client, path, body, params) => {
    client.send(path, users.getUsers())
})

// Events
users.emitter.on("groups", (groups) => {
    api.send("/users/v0/topic/groups/", groups)
})
users.emitter.on("user", (username, user) => {
    api.send(`/users/v0/topic/user/${username}/`, user)
})
users.emitter.on("users", (users) => {
    api.send("/users/v0/topic/users/", users)
})
