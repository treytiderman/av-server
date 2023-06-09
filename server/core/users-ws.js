// wss = websocket server
// ws  = websocket client
const wss = require('./websocket-server')
const {
    ROLES,
    getUser,
    getToken,
    verifyToken,
    createUser,
    updateUserPassword,
    updateUserRole,
    defaultUsersFile,
    getUsers,
    deleteUser
} = require('./users')

// Receive
wss.receiveTopic("user", async (ws, event, body) => {
    wss.subscribe(ws, "user")
})
wss.receiveEvent("user", "roles", async (ws, body) => {
    wss.sendEvent(ws, "user", "roles", ROLES)
})
wss.receiveEvent("user", "whoami", async (ws, body) => {
    if (ws.user) {
        const user = getUser(ws.user.username)
        wss.sendEvent(ws, "user", "whoami", user)
    }
    else {
        wss.sendEvent(ws, "user", "whoami", "login first")
    }
})
wss.receiveEvent("user", "users", async (ws, body) => {
    const users = getUsers()
    wss.sendEvent(ws, "user", "users", users)
})
wss.receiveEvent("user", "login", async (ws, body) => {
    const response = getToken(body.username, body.password)
    if (response === "password incorrect") wss.sendEvent(ws, "user", "login", "username or password incorrect")
    else if (response === "username doesn't exists") wss.sendEvent(ws, "user", "login", "username or password incorrect")
    else {
        const user = getUser(body.username)
        ws.auth = true
        ws.user = user
        wss.sendEvent(ws, "user", "login", "success")
        wss.sendEvent(ws, "user", "token", response)
        wss.sendEvent(ws, "user", "whoami", user)
    }
})
wss.receiveEvent("user", "login-token", async (ws, body) => {
    const response = verifyToken(body)
    if (response === "bad token") wss.sendEvent(ws, "user", "login-token", "bad token")
    else {
        const user = getUser(body.username)
        ws.auth = true
        ws.user = user
        wss.sendEvent(ws, "user", "login-token", "success")
        wss.sendEvent(ws, "user", "whoami", user)
    }
})
wss.receiveEvent("user", "auth", async (ws, body) => {
    wss.sendEvent(ws, "user", "auth", ws.auth ?? false)
})
wss.receiveEvent("user", "logout", async (ws, body) => {
    ws.auth = false
    ws.user = {}
    wss.sendEvent(ws, "user", "logout", "success")
})

// Send
