// Overview: websocket routes for the users.js module
const {
    getUser,
    getUsers,
    resetUsersToDefault,
    getGroups,
    addGroup,
    removeGroup,
    getToken,
    verifyToken,
    addUser,
    removeUser,
    addGroupToUser,
    removeGroupFromUser,
    changeUserPassword
} = require('./users')

// wss = websocket server
// ws  = websocket client
const wss = require('../tools/websocket-server')

// Receive
wss.receiveEvent("user", "login-with-password", async (ws, body) => {
    wss.subscribe(ws, "user")
    const response = getToken(body.username, body.password)
    // Sending "password incorrect" or "username doesn't exists" is bad for security
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
    verifyToken(body.token, (response) => {
        if (response === "error bad token") wss.sendEvent(ws, "user", "login-with-token", response)
        else {
            const user = getUser(body.username)
            ws.auth = true
            ws.user = user
            wss.sendEvent(ws, "user", "login-with-token", "ok")
            wss.sendEvent(ws, "user", "who-am-i", user)
        }
    })
})
wss.receiveEvent("user", "who-am-i", async (ws, body) => {
    wss.subscribe(ws, "user")
    if (ws.auth) wss.sendEvent(ws, "user", "who-am-i", ws.user)
    else wss.sendEvent(ws, "user", "who-am-i", "error login first")
})
wss.receiveEvent("user", "logout", async (ws, body) => {
    wss.subscribe(ws, "user")
    ws.auth = false
    ws.user = {}
    wss.sendEvent(ws, "user", "logout", "ok")
    wss.sendEvent(ws, "user", "who-am-i", {})
})

wss.receiveEvent("user", "groups", async (ws, body) => {
    wss.subscribe(ws, "user")
    wss.sendEvent(ws, "user", "groups", getGroups())
})
wss.receiveEvent("user", "add-group", async (ws, body) => {
    wss.subscribe(ws, "user")
    if (!ws.auth) wss.sendEvent(ws, "user", "add-group", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) wss.sendEvent(ws, "user", "add-group", "error not in group admins")
    else {
        await addGroup(body)
        wss.sendEvent(ws, "user", "add-group", "ok")
        wss.sendEventAll("user", "groups", getGroups())
    }
})
wss.receiveEvent("user", "remove-group", async (ws, body) => {
    wss.subscribe(ws, "user")
    if (!ws.auth) wss.sendEvent(ws, "user", "remove-group", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) wss.sendEvent(ws, "user", "remove-group", "error not in group admins")
    else {
        await removeGroup(body)
        wss.sendEvent(ws, "user", "remove-group", "ok")
        wss.sendEventAll("user", "groups", getGroups())
        wss.sendEventAll("user", "users", getUsers())
    }
})

wss.receiveEvent("user", "users", async (ws, body) => {
    wss.subscribe(ws, "user")
    wss.sendEvent(ws, "user", "users", getUsers())
})
wss.receiveEvent("user", "reset-users-to-default", async (ws, body) => {
    wss.subscribe(ws, "user")
    if (!ws.auth) wss.sendEvent(ws, "user", "reset-users-to-default", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) wss.sendEvent(ws, "users", "reset-users-to-default", "error not in group admins")
    else {
        await resetUsersToDefault()
        wss.sendEvent(ws, "user", "users", getUsers())
    }
})

wss.receiveEvent("user", "add", async (ws, body) => {
    wss.subscribe(ws, "user")
    if (!ws.auth) wss.sendEvent(ws, "user", "add", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) wss.sendEvent(ws, "user", "add", "error not in group admins")
    else {
        const response = await addUser(body.username, body.password, body.passwordConfirm, body.groups)
        if (response.startsWith("error")) wss.sendEvent(ws, "user", "add", response)
        else {
            wss.sendEvent(ws, "user", "add", response)
            wss.sendEventAll("user", "users", getUsers())
        }
    }
})
wss.receiveEvent("user", "add-group-to-user", async (ws, body) => {
    wss.subscribe(ws, "user")
    if (!ws.auth) wss.sendEvent(ws, "user", "add-group-to-user", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) wss.sendEvent(ws, "user", "add-group-to-user", "error not in group admins")
    else {
        const response = await addGroupToUser(body.username, body.groupToAdd)
        if (response.startsWith("error")) wss.sendEvent(ws, "user", "add-group-to-user", response)
        else {
            wss.sendEvent(ws, "user", "add-group-to-user", response)
            wss.sendEventAll("user", "users", getUsers())
            const isSelf = ws.user.username === body.username
            if (isSelf) {
                const user = getUser(body.username)
                ws.user = user
                wss.sendEvent(ws, "user", "who-am-i", ws.user)
            }
        }
    }
})
wss.receiveEvent("user", "remove-group-from-user", async (ws, body) => {
    wss.subscribe(ws, "user")
    if (!ws.auth) wss.sendEvent(ws, "user", "remove-group-from-user", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) wss.sendEvent(ws, "user", "remove-group-from-user", "error not in group admins")
    else {
        const response = await removeGroupFromUser(body.username, body.groupToRemove)
        if (response.startsWith("error")) wss.sendEvent(ws, "user", "remove-group-from-user", response)
        else {
            wss.sendEvent(ws, "user", "remove-group-from-user", response)
            wss.sendEventAll("user", "users", getUsers())
            const isSelf = ws.user.username === body.username
            if (isSelf) {
                const user = getUser(body.username)
                ws.user = user
                wss.sendEvent("user", "who-am-i", ws.user)
            }
        }
    }
})
wss.receiveEvent("user", "change-user-password", async (ws, body) => {
    wss.subscribe(ws, "user")
    if (!ws.auth) wss.sendEvent(ws, "user", "change-user-password", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) wss.sendEvent(ws, "user", "change-user-password", "error not in group admins")
    else {
        const response = await changeUserPassword(body.username, body.newPassword, body.newPasswordConfirm)
        if (response.startsWith("error")) wss.sendEvent(ws, "user", "change-user-password", response)
        else {
            wss.sendEvent(ws, "user", "change-user-password", response)
        }
    }
})
wss.receiveEvent("user", "remove", async (ws, body) => {
    wss.subscribe(ws, "user")
    if (!ws.auth) wss.sendEvent(ws, "user", "remove", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) wss.sendEvent(ws, "user", "remove", "error not in group admins")
    else {
        const isSelf = ws.user.username === body.username
        const response = await removeUser(body.username)
        if (response.startsWith("error")) wss.sendEvent(ws, "user", "remove", response)
        else {
            wss.sendEvent(ws, "user", "remove", response)
            wss.sendEventAll("user", "users", getUsers())
            if (isSelf) {
                ws.auth = false
                ws.user = {}
                wss.sendEvent(ws, "user", "who-am-i", {})
            }
        }
    }
})
