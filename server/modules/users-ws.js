// Overview: websocket routes for the users.js module
// wss = websocket server
// ws  = websocket client

// Imports
import { receiveEvent, subscribe, sendEvent, sendEventAll, unsubscribe, receiveAny } from '../tools/websocket-server.js'
import {
    validUsermame,
    validPassword,

    isUser,
    getUserAndPassword,
    getUser,
    getUsers,
    
    getGroups,
    isGroup,
    areGroups,
    createGroup,
    deleteGroup,
    
    getToken,
    verifyToken,
    
    createUser,
    isUserInGroup,
    addGroupToUser,
    removeGroupFromUser,
    changeUserPassword,
    deleteUser,
    resetUsersToDefault,
} from './users.js'

// Exports
export { isAdmin }

// Helper Functions
function isAdmin(ws, topic, event) {
    subscribe(ws, topic)
    if (!ws.auth) {
        sendEvent(ws, topic, event, "error login first")
        return true
    } else if (!ws.user.groups.some(group => group === "admins")) {
        sendEvent(ws, topic, event, "error not in group admins")
        return true
    } else {
        return false
    }
}

// Receive user/token
receiveEvent("user/token", "login", async (ws, body) => {
    subscribe(ws, "user/token")
    try {
        const token = getToken(body.username, body.password)
        sendEvent(ws, `user/token`, "login", "ok")
        sendEvent(ws, `user/token`, "pub", token)
        const user = getUser(body.username)
        ws.auth = true
        ws.user = user
    } catch (error) {
        sendEvent(ws, `user/token`, "login", error.message)
    }
})
receiveEvent("user/token", "get", async (ws, body) => {
    subscribe(ws, "user/token")
    try {
        const token = getToken(ws.user.username, ws.user.password)
        sendEvent(ws, `user/token`, "get", "ok")
        sendEvent(ws, `user/token`, "pub", token)
        ws.auth = true
        unsubscribe(ws, `user/token`)
    } catch (error) {
        sendEvent(ws, `user/token`, "get", error.message)
        unsubscribe(ws, `user/token`)
    }
})
receiveEvent("user/token", "sub", async (ws, body) => {
    subscribe(ws, "user/token")
    try {
        const token = getToken(ws.user.username, ws.user.password)
        sendEvent(ws, `user/token`, "sub", "ok")
        sendEvent(ws, `user/token`, "pub", token)
        ws.auth = true
    } catch (error) {
        sendEvent(ws, `user/token`, "sub", error.message)
    }
})

// Receive user/users
receiveEvent("user/users", "get", async (ws, body) => {
    subscribe(ws, "user/users")
    try {
        if (isAdmin(ws, "user/users", "get")) {
            const users = getUsers()
            sendEvent(ws, `user/users`, "get", "ok")
            sendEvent(ws, `user/users`, "pub", users)
            unsubscribe(ws, `user/users`)
        }
    } catch (error) {
        sendEvent(ws, `user/users`, "get", error.message)
        unsubscribe(ws, `user/users`)
    }
})
receiveEvent("user/users", "sub", async (ws, body) => {
    subscribe(ws, "user/users")
    try {
        if (isAdmin(ws, "user/users", "sub")) {
            const users = getUsers()
            sendEvent(ws, `user/users`, "sub", "ok")
            sendEvent(ws, `user/users`, "pub", users)
        }
    } catch (error) {
        sendEvent(ws, `user/users`, "sub", error.message)
    }
})
receiveEvent("user/users", "reset-to-defualt", async (ws, body) => {
    subscribe(ws, "user/users")
    try {
        if (isAdmin(ws, "user/users", "reset-to-defualt")) {
            await resetUsersToDefault()
            const users = getUsers()
            sendEvent(ws, `user/users`, "reset-to-defualt", "ok")
            sendEventAll(`user/users`, "pub", users)
            unsubscribe(ws, `user/users`)
        }
    } catch (error) {
        sendEvent(ws, `user/users`, "reset-to-defualt", error.message)
        unsubscribe(ws, `user/users`)
    }
})

// Receive user/groups
receiveEvent("user/groups", "get", async (ws, body) => {
    subscribe(ws, "user/groups")
    try {
        if (isAdmin(ws, "user/groups", "get")) {
            const groups = getGroups()
            sendEvent(ws, `user/groups`, "get", "ok")
            sendEvent(ws, `user/groups`, "pub", groups)
            unsubscribe(ws, `user/groups`)
        }
    } catch (error) {
        sendEvent(ws, `user/groups`, "get", error.message)
        unsubscribe(ws, `user/groups`)
    }
})
receiveEvent("user/groups", "sub", async (ws, body) => {
    subscribe(ws, "user/groups")
    try {
        if (isAdmin(ws, "user/groups", "sub")) {
            const groups = getGroups()
            sendEvent(ws, `user/groups`, "sub", "ok")
            sendEvent(ws, `user/groups`, "pub", groups)
        }
    } catch (error) {
        sendEvent(ws, `user/groups`, "sub", error.message)
    }
})
receiveEvent("user/groups", "create", async (ws, body) => {
    subscribe(ws, "user/groups")
    try {
        if (isAdmin(ws, "user/groups", "create")) {
            await createGroup(body)
            const groups = getGroups()
            sendEvent(ws, `user/groups`, "create", "ok")
            sendEventAll(`user/groups`, "pub", groups)
            unsubscribe(ws, `user/groups`)
        }
    } catch (error) {
        sendEvent(ws, `user/groups`, "create", error.message)
        unsubscribe(ws, `user/groups`)
    }
})
receiveEvent("user/groups", "delete", async (ws, body) => {
    subscribe(ws, "user/groups")
    try {
        if (isAdmin(ws, "user/groups", "delete")) {
            await deleteGroup(body)
            const groups = getGroups()
            sendEvent(ws, `user/groups`, "delete", "ok")
            sendEventAll(`user/groups`, "pub", groups)
            unsubscribe(ws, `user/groups`)
        }
    } catch (error) {
        sendEvent(ws, `user/groups`, "delete", error.message)
        unsubscribe(ws, `user/groups`)
    }
})

// Receive user/who-am-i
receiveEvent("user/who-am-i", "get", async (ws, body) => {
    subscribe(ws, "user/who-am-i")
    try {
        if (!ws.auth) sendEvent(ws, "user/who-am-i", "get", "error login first")
        else sendEvent(ws, "user/who-am-i", "get", ws.user)
        unsubscribe(ws, `user/who-am-i`)
    } catch (error) {
        sendEvent(ws, `user/who-am-i`, "get", error.message)
        unsubscribe(ws, `user/who-am-i`)
    }
})
receiveEvent("user/who-am-i", "sub", async (ws, body) => {
    subscribe(ws, "user/who-am-i")
    try {
        if (!ws.auth) sendEvent(ws, "user/who-am-i", "sub", "error login first")
        else sendEvent(ws, "user/who-am-i", "sub", ws.user)
    } catch (error) {
        sendEvent(ws, `user/who-am-i`, "sub", error.message)
    }
})

// Receive user/{username}
receiveAny(async (ws, topic, event, body) => {
    const topicSplit = topic?.split("/")
    if (topic && topic.startsWith("user/") && topicSplit.length === 2) {
        const username = topicSplit[1]
        subscribe(ws, `user/${username}`)

        if (event === "get") {
            try {
                const user = getUser(username)
                sendEvent(ws, `user/${username}`, "get", "ok")
                sendEvent(ws, `user/${username}`, "pub", user)
                unsubscribe(ws, `user/${username}`)
            } catch (error) {
                sendEvent(ws, `user/${username}`, "get", error.message)
                unsubscribe(ws, `user/${username}`)
            }
        }
        else if (event === "sub") {
            try {
                const user = getUser(username)
                sendEvent(ws, `user/${username}`, "sub", "ok")
                sendEvent(ws, `user/${username}`, "pub", user)
            } catch (error) {
                sendEvent(ws, `user/${username}`, "sub", error.message)
            }
        }
        else if (event === "login-wih-token") {
            try {
                verifyToken(body.token, (response, error) => {
                    if (error) sendEvent(ws, `user/${username}`, "login-with-token", error)
                    else {
                        const user = getUser(response.username)
                        ws.auth = true
                        ws.user = user
                        sendEvent(ws, `user/${username}`, "login-wih-token", "ok")
                        sendEvent(ws, `user/${username}`, "pub", user)
                    }
                })
            } catch (error) {
                sendEvent(ws, `user/${username}`, "login-wih-token", error.message)
            }
        }
        else if (event === "logout") {
            ws.auth = false
            ws.user = {}
            sendEvent(ws, `user/${username}`, "logout", "ok")
            sendEvent(ws, `user/${username}`, "pub", user)
        }
        else if (event === "create") {
            try {
                if (isAdmin(ws, `user/${username}`, "create")) {
                    await createUser(username, body.password, body.passwordConfirm, body.groups)
                    const user = getUser(username)
                    sendEvent(ws, `user/${username}`, "create", "ok")
                    sendEventAll(`user/${username}`, "pub", user)
                    const users = getUsers()
                    sendEventAll(`user/users`, "pub", users)
                }
            } catch (error) {
                sendEvent(ws, `user/${username}`, "create", error.message)
            }
        }
        else if (event === "delete") {
            try {
                if (isAdmin(ws, `user/${username}`, "delete")) {
                    await deleteUser(username)
                    const user = getUser(username)
                    sendEvent(ws, `user/${username}`, "delete", "ok")
                    sendEventAll(`user/${username}`, "pub", user)
                    const users = getUsers()
                    sendEventAll(`user/users`, "pub", users)
                }
            } catch (error) {
                sendEvent(ws, `user/${username}`, "delete", error.message)
            }
        }
        else if (event === "add-group") {
            try {
                if (isAdmin(ws, `user/${username}`, "add-group")) {
                    await addGroupToUser(username, body)
                    const user = getUser(username)
                    sendEvent(ws, `user/${username}`, "add-group", "ok")
                    sendEventAll(`user/${username}`, "pub", user)
                    const users = getUsers()
                    sendEventAll(`user/users`, "pub", users)
                }
            } catch (error) {
                sendEvent(ws, `user/${username}`, "add-group", error.message)
            }
        }
        else if (event === "remove-group") {
            try {
                if (isAdmin(ws, `user/${username}`, "remove-group")) {
                    await removeGroupFromUser(username, body)
                    const user = getUser(username)
                    sendEvent(ws, `user/${username}`, "remove-group", "ok")
                    sendEventAll(`user/${username}`, "pub", user)
                    const users = getUsers()
                    sendEventAll(`user/users`, "pub", users)
                }
            } catch (error) {
                sendEvent(ws, `user/${username}`, "remove-group", error.message)
            }
        }
        else if (event === "change-password") {
            try {
                if (isAdmin(ws, `user/${username}`, "change-password")) {
                    await changeUserPassword(username, body.newPassword, body.newPasswordConfirm)
                    const user = getUser(username)
                    sendEvent(ws, `user/${username}`, "change-password", "ok")
                    sendEventAll(`user/${username}`, "pub", user)
                    const users = getUsers()
                    sendEventAll(`user/users`, "pub", users)
                }
            } catch (error) {
                sendEvent(ws, `user/${username}`, "change-password", error.message)
            }
        }

    }
})
