// Overview: websocket routes for the users.js module
// wss = websocket server
// ws  = websocket client

// Imports
import {
    receivePath,
    sendPath,
    sendPathIfSub,
    sendAllPath,
    sendAllPathIfSub,
    subscribe,
    unsubscribe,
} from './websocket-server.js'
import {
    getUser,
    getUsers,

    getGroups,
    createGroup,
    deleteGroup,

    getToken,
    verifyToken,

    createUser,
    addGroupToUser,
    removeGroupFromUser,
    changeUserPassword,
    deleteUser,

    resetUsersToDefault,
    emitter,
} from '../modules/users.js'

// Exports
export { isAuth, isAdmin }

// Helper Functions
function isAuth(ws, path) {
    if (ws.auth === false) {
        sendPath(ws, path, "error login first")
        return false
    } else {
        return true
    }
}
function isAdmin(ws, path) {
    if (isAuth(ws, path) === false) {
        return false
    } else if (ws.user.groups.some(group => group === "admin") === false) {
        sendPath(ws, path, "error not in group admin")
        return false
    } else {
        return true
    }
}

// user/v0/topic
receivePath("user/v0/topic/token", async (ws, path, body) => {
    if (body === "unsub") {
        unsubscribe(ws, path)
    } else if (body === "sub") {
        subscribe(ws, path)
    }

    if (isAuth(ws, path)) {
        sendPath(ws, path, ws.token)
    }
})
receivePath("user/v0/topic/who-am-i", async (ws, path, body) => {
    if (body === "unsub") {
        unsubscribe(ws, path)
    } else if (body === "sub") {
        subscribe(ws, path)
    }

    if (isAuth(ws, path)) {
        sendPath(ws, path, ws.user)
    }
})
receivePath("user/v0/topic/groups", async (ws, path, body) => {
    if (body === "unsub") {
        unsubscribe(ws, path)
    } else if (body === "sub") {
        subscribe(ws, path)
    }

    if (isAdmin(ws, path)) {
        const groups = getGroups()
        sendPath(ws, path, groups)
    }
})
receivePath("user/v0/topic/users", async (ws, path, body) => {
    if (body === "unsub") {
        unsubscribe(ws, path)
    } else if (body === "sub") {
        subscribe(ws, path)
    }

    if (isAdmin(ws, path)) {
        const users = getUsers()
        sendPath(ws, path, users)
    }
})

// user/v0/func/login-
receivePath("user/v0/func/login", async (ws, path, body) => {
    try {
        const token = getToken(body.username, body.password)
        const user = getUser(body.username)
        ws.auth = true
        ws.user = user
        ws.token = token
        sendPath(ws, path, "ok")
        sendPathIfSub(ws, "user/v0/topic/token", token)
        sendPathIfSub(ws, "user/v0/topic/who-am-i", user)
    } catch (error) {
        sendPath(ws, path, error.message)
    }
})
receivePath("user/v0/func/login-with-token", async (ws, path, body) => {
    try {
        verifyToken(body, (response, error) => {
            if (error) sendPath(ws, path, error)
            else {
                const user = getUser(response.username)
                ws.auth = true
                ws.user = user
                ws.token = body
                sendPath(ws, path, "ok")
                sendPathIfSub(ws, "user/v0/topic/who-am-i", user)
            }
        })
    } catch (error) {
        sendPath(ws, path, error.message)
    }
})
receivePath("user/v0/func/logout", async (ws, path, body) => {
    ws.auth = false
    ws.user = undefined
    ws.token = undefined
    sendPath(ws, path, "ok")
    sendPathIfSub(ws, "user/v0/topic/who-am-i", ws.user)
})

// user/v0/func/group-
receivePath("user/v0/func/group-create", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        try {
            await createGroup(body)
            sendPath(ws, path, "ok")
        } catch (error) {
            sendPath(ws, path, error.message)
        }
    }
})
receivePath("user/v0/func/group-delete", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        try {
            await deleteGroup(body)
            sendPath(ws, path, "ok")
        } catch (error) {
            sendPath(ws, path, error.message)
        }
    }
})

// user/v0/func/user-
receivePath("user/v0/func/user-create", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        try {
            await createUser(body.username, body.password, body.passwordConfirm, body.groups)
            sendPath(ws, path, "ok")
        } catch (error) {
            sendPath(ws, path, error.message)
        }
    }
})
receivePath("user/v0/func/user-delete", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        try {
            await deleteUser(body)
            sendPath(ws, path, "ok")
        } catch (error) {
            sendPath(ws, path, error.message)
        }
    }
})
receivePath("user/v0/func/user-add-group", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        try {
            await addGroupToUser(body.username, body.group)
            sendPath(ws, path, "ok")
        } catch (error) {
            sendPath(ws, path, error.message)
        }
    }
})
receivePath("user/v0/func/user-remove-group", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        try {
            await removeGroupFromUser(body.username, body.group)
            sendPath(ws, path, "ok")
        } catch (error) {
            sendPath(ws, path, error.message)
        }
    }
})
receivePath("user/v0/func/user-change-password", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        try {
            await changeUserPassword(body.username, body.password, body.passwordConfirm)
            sendPath(ws, path, "ok")
        } catch (error) {
            sendPath(ws, path, error.message)
        }
    }
})

// user/v0/func/reset-
receivePath("user/v0/func/reset-to-default", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        try {
            await resetUsersToDefault()
            sendPath(ws, path, "ok")
        } catch (error) {
            sendPath(ws, path, error.message)
        }
    }
})

// Updates
emitter.on("users", (data) => {
    sendAllPathIfSub("user/v0/topic/users", data)
})
emitter.on("groups", (data) => {
    sendAllPathIfSub("user/v0/topic/groups", data)
})
