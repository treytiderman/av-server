// wss = websocket server
// ws  = websocket client
const wss = require('./websocket-server')
const {
    getUser,
    getToken,
    verifyToken,
    createUser,
    updatePassword,
    updateGroups,
    defaultStateFile,
    getUsers,
    getGroups,
    deleteUser
} = require('./users')

// Receive
wss.receiveEvent("user", "login-with-password", async (ws, body) => {
    wss.subscribe(ws, "user")
    const response = getToken(body.username, body.password)
    if (response === "error password incorrect") wss.sendEvent(ws, "user", "login-with-password", "error username or password incorrect")
    else if (response === "error username doesn't exists") wss.sendEvent(ws, "user", "login-with-password", "error username or password incorrect")
    else {
        const user = getUser(body.username)
        ws.auth = true
        ws.user = user
        wss.sendEvent(ws, "user", "login-with-password", response)
        wss.sendEvent(ws, "user", "who-am-i", user)
    }
})
wss.receiveEvent("user", "login-with-token", async (ws, body) => {
    wss.subscribe(ws, "user")
    const response = verifyToken(body.token)
    if (response.startsWith("error")) wss.sendEvent(ws, "user", "login-with-token", response)
    else {
        const user = getUser(body.username)
        ws.auth = true
        ws.user = user
        wss.sendEvent(ws, "user", "login-with-token", "ok")
        wss.sendEvent(ws, "user", "who-am-i", user)
    }
})
wss.receiveEvent("user", "who-am-i", async (ws, body) => {
    wss.subscribe(ws, "user")
    if (ws.auth) {
        const user = getUser(ws.user.username)
        wss.sendEvent(ws, "user", "who-am-i", user)
    }
    else {
        wss.sendEvent(ws, "user", "who-am-i", "error login first")
    }
})
wss.receiveEvent("user", "logout", async (ws, body) => {
    wss.subscribe(ws, "user")
    ws.auth = false
    ws.user = {}
    wss.sendEvent(ws, "user", "logout", "ok")
})
wss.receiveEvent("user", "groups", async (ws, body) => {
    wss.subscribe(ws, "user")
    wss.sendEvent(ws, "user", "groups", getGroups())
})

wss.receiveEvent("user", "users", async (ws, body) => {
    wss.subscribe(ws, "user")
    wss.sendEvent(ws, "user", "users", getUsers())
})
wss.receiveEvent("user", "new", async (ws, body) => {
    wss.subscribe(ws, "user")
    if (!ws.auth) wss.sendEvent(ws, "user", "new", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) wss.sendEvent(ws, "user", "new", "error not in group admins")
    else {
        const response = await createUser(body.username, body.password, body.passwordConfirm, body.groups)
        if (response.startsWith("error")) wss.sendEvent(ws, "user", "new", response)
        else {
            wss.sendEvent(ws, "user", "new", response)
            wss.sendEvent(ws, "user", "users", getUsers())
        }
    }
})
wss.receiveEvent("user", "update", async (ws, body) => {
    wss.subscribe(ws, "user")
    if (!ws.auth) wss.sendEvent(ws, "user", "update", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) wss.sendEvent(ws, "user", "update", "error not in group admins")
    else {
        if (body.newPassword && body.newPasswordConfirm) {
            const response = await updatePassword(body.username, body.newPassword, body.newPasswordConfirm)
            if (response.startsWith("error")) wss.sendEvent(ws, "user", "update", response)
            else {
                wss.sendEvent(ws, "user", "update", response)
            }
        }
        if (body.newGroups) {
            const response = await updateGroups(body.username, body.newGroups)
            if (response.startsWith("error")) wss.sendEvent(ws, "user", "update", response)
            else {
                wss.sendEvent(ws, "user", "update", response)
                wss.sendEvent(ws, "user", "users", getUsers())
            }
        }
    }
})
wss.receiveEvent("user", "delete", async (ws, body) => {
    wss.subscribe(ws, "user")
    if (!ws.auth) wss.sendEvent(ws, "user", "delete", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) wss.sendEvent(ws, "user", "delete", "error not in group admins")
    else {
        const response = await createUser(body.username, body.password, body.passwordConfirm, body.groups)
        if (response.startsWith("error")) wss.sendEvent(ws, "user", "delete", response)
        else if (ws.user.username === body.username) {
            ws.auth = false
            ws.user = {}
            wss.sendEvent(ws, "user", "delete", response)
            wss.sendEvent(ws, "user", "users", getUsers())
            wss.sendEvent(ws, "user", "who-am-i", "user deleted")
        }
        else {
            wss.sendEvent(ws, "user", "delete", response)
            wss.sendEvent(ws, "user", "users", getUsers())
        }
    }
})
wss.receiveEvent("user", "factory-reset-users", async (ws, body) => {
    wss.subscribe(ws, "user")
    if (!ws.auth) wss.sendEvent(ws, "user", "factory-reset-users", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) wss.sendEvent(ws, "factory-reset-users", "delete", "error not in group admins")
    else {
        await defaultStateFile()
        wss.sendEvent(ws, "user", "users", getUsers())
    }
})

// Send
