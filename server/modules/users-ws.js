// Overview: websocket routes for the users.js module
// wss = websocket server
// ws  = websocket client

// Imports
import { receiveEvent, subscribe, sendEvent, sendEventAll, unsubscribe } from '../tools/websocket-server.js'
import {
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
} from './users.js'

// Receive
receiveEvent("user", "login-with-password", async (ws, body) => {
    subscribe(ws, "user")
    const response = getToken(body.username, body.password)
    // Sending "password incorrect" or "username doesn't exists" is bad for security
    if (response === "error password incorrect") sendEvent(ws, "user", "login-with-password", "error username or password incorrect")
    else if (response === "error username doesn't exists") sendEvent(ws, "user", "login-with-password", "error username or password incorrect")
    else {
        const user = getUser(body.username)
        ws.auth = true
        ws.user = user
        sendEvent(ws, "user", "login-with-password", response)
        sendEvent(ws, "user", "who-am-i", user)
    }
})
receiveEvent("user", "login-with-token", async (ws, body) => {
    subscribe(ws, "user")
    verifyToken(body.token, (response) => {
        if (response === "error bad token") sendEvent(ws, "user", "login-with-token", response)
        else {
            const user = getUser(body.username)
            ws.auth = true
            ws.user = user
            sendEvent(ws, "user", "login-with-token", "ok")
            sendEvent(ws, "user", "who-am-i", user)
        }
    })
})
receiveEvent("user", "who-am-i", async (ws, body) => {
    subscribe(ws, "user")
    if (ws.auth) sendEvent(ws, "user", "who-am-i", ws.user)
    else sendEvent(ws, "user", "who-am-i", "error login first")
})
receiveEvent("user", "logout", async (ws, body) => {
    subscribe(ws, "user")
    ws.auth = false
    ws.user = {}
    sendEvent(ws, "user", "logout", "ok")
    sendEvent(ws, "user", "who-am-i", {})
})

receiveEvent("user", "groups", async (ws, body) => {
    subscribe(ws, "user")
    sendEvent(ws, "user", "groups", getGroups())
})
receiveEvent("user", "add-group", async (ws, body) => {
    subscribe(ws, "user")
    if (!ws.auth) sendEvent(ws, "user", "add-group", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) sendEvent(ws, "user", "add-group", "error not in group admins")
    else {
        await addGroup(body)
        sendEvent(ws, "user", "add-group", "ok")
        sendEventAll("user", "groups", getGroups())
    }
})
receiveEvent("user", "remove-group", async (ws, body) => {
    subscribe(ws, "user")
    if (!ws.auth) sendEvent(ws, "user", "remove-group", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) sendEvent(ws, "user", "remove-group", "error not in group admins")
    else {
        await removeGroup(body)
        sendEvent(ws, "user", "remove-group", "ok")
        sendEventAll("user", "groups", getGroups())
        sendEventAll("user", "users", getUsers())
    }
})

receiveEvent("user", "users", async (ws, body) => {
    subscribe(ws, "user")
    sendEvent(ws, "user", "users", getUsers())
})
receiveEvent("user", "reset-users-to-default", async (ws, body) => {
    subscribe(ws, "user")
    if (!ws.auth) sendEvent(ws, "user", "reset-users-to-default", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) sendEvent(ws, "users", "reset-users-to-default", "error not in group admins")
    else {
        await resetUsersToDefault()
        sendEvent(ws, "user", "users", getUsers())
    }
})

receiveEvent("user", "add", async (ws, body) => {
    subscribe(ws, "user")
    if (!ws.auth) sendEvent(ws, "user", "add", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) sendEvent(ws, "user", "add", "error not in group admins")
    else {
        const response = await addUser(body.username, body.password, body.passwordConfirm, body.groups)
        if (response.startsWith("error")) sendEvent(ws, "user", "add", response)
        else {
            sendEvent(ws, "user", "add", response)
            sendEventAll("user", "users", getUsers())
        }
    }
})
receiveEvent("user", "add-group-to-user", async (ws, body) => {
    subscribe(ws, "user")
    if (!ws.auth) sendEvent(ws, "user", "add-group-to-user", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) sendEvent(ws, "user", "add-group-to-user", "error not in group admins")
    else {
        const response = await addGroupToUser(body.username, body.groupToAdd)
        if (response.startsWith("error")) sendEvent(ws, "user", "add-group-to-user", response)
        else {
            sendEvent(ws, "user", "add-group-to-user", response)
            sendEventAll("user", "users", getUsers())
            const isSelf = ws.user.username === body.username
            if (isSelf) {
                const user = getUser(body.username)
                ws.user = user
                sendEvent(ws, "user", "who-am-i", ws.user)
            }
        }
    }
})
receiveEvent("user", "remove-group-from-user", async (ws, body) => {
    subscribe(ws, "user")
    if (!ws.auth) sendEvent(ws, "user", "remove-group-from-user", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) sendEvent(ws, "user", "remove-group-from-user", "error not in group admins")
    else {
        const response = await removeGroupFromUser(body.username, body.groupToRemove)
        if (response.startsWith("error")) sendEvent(ws, "user", "remove-group-from-user", response)
        else {
            sendEvent(ws, "user", "remove-group-from-user", response)
            sendEventAll("user", "users", getUsers())
            const isSelf = ws.user.username === body.username
            if (isSelf) {
                const user = getUser(body.username)
                ws.user = user
                sendEvent("user", "who-am-i", ws.user)
            }
        }
    }
})
receiveEvent("user", "change-user-password", async (ws, body) => {
    subscribe(ws, "user")
    if (!ws.auth) sendEvent(ws, "user", "change-user-password", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) sendEvent(ws, "user", "change-user-password", "error not in group admins")
    else {
        const response = await changeUserPassword(body.username, body.newPassword, body.newPasswordConfirm)
        if (response.startsWith("error")) sendEvent(ws, "user", "change-user-password", response)
        else {
            sendEvent(ws, "user", "change-user-password", response)
        }
    }
})
receiveEvent("user", "remove", async (ws, body) => {
    subscribe(ws, "user")
    if (!ws.auth) sendEvent(ws, "user", "remove", "error login first")
    else if (!ws.user.groups.some(group => group === "admins")) sendEvent(ws, "user", "remove", "error not in group admins")
    else {
        const isSelf = ws.user.username === body.username
        const response = await removeUser(body.username)
        if (response.startsWith("error")) sendEvent(ws, "user", "remove", response)
        else {
            sendEvent(ws, "user", "remove", response)
            sendEventAll("user", "users", getUsers())
            if (isSelf) {
                ws.auth = false
                ws.user = {}
                sendEvent(ws, "user", "who-am-i", {})
            }
        }
    }
})
