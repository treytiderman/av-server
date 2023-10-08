// Overview: websocket routes for the users.js module
// wss = websocket server
// ws  = websocket client

// Imports
import {
    receivePath,
    sendPath,
    sendPathIfSub,
    sendAllPath,
    sendAllPathIfSub, subscribe,
    unsubscribe,
} from '../core/websocket-server.js'
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
} from '../modules/user.js'

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

// user/v1/topic
receivePath("user/v1/topic/token", async (ws, path, body) => {
    if (body === "unsub") {
        unsubscribe(ws, path)
    } else if (body === "sub") {
        subscribe(ws, path)
    }
    
    if (isAuth(ws, path)) {
        sendPath(ws, path, ws.token)
    }
})
receivePath("user/v1/topic/who-am-i", async (ws, path, body) => {
    if (body === "unsub") {
        unsubscribe(ws, path)
    } else if (body === "sub") {
        subscribe(ws, path)
    }
    
    if (isAuth(ws, path)) {
        sendPath(ws, path, ws.user)
    }
})
receivePath("user/v1/topic/groups", async (ws, path, body) => {
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
receivePath("user/v1/topic/users", async (ws, path, body) => {
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

// user/v1/func/login-
receivePath("user/v1/func/login", async (ws, path, body) => {
    try {
        const token = getToken(body.username, body.password)
        const user = getUser(body.username)
        ws.auth = true
        ws.user = user
        ws.token = token
        sendPath(ws, path, "ok")
        sendPathIfSub(ws, "user/v1/topic/token", token)
        sendPathIfSub(ws, "user/v1/topic/who-am-i", user)
    } catch (error) {
        sendPath(ws, path, error.message)
    }
})
receivePath("user/v1/func/login-with-token", async (ws, path, body) => {
    try {
        verifyToken(body, (response, error) => {
            if (error) sendPath(ws, path, error)
            else {
                const user = getUser(response.username)
                ws.auth = true
                ws.user = user
                ws.token = body
                sendPath(ws, path, "ok")
                sendPathIfSub(ws, "user/v1/topic/who-am-i", user)
            }
        })
    } catch (error) {
        sendPath(ws, path, error.message)
    }
})
receivePath("user/v1/func/logout", async (ws, path, body) => {
    ws.auth = false
    ws.user = undefined
    ws.token = undefined
    sendPath(ws, path, "ok")
    sendPathIfSub(ws, "user/v1/topic/who-am-i", ws.user)
})

// user/v1/func/group-
receivePath("user/v1/func/group-create", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        try {
            await createGroup(body)
            const groups = getGroups()
            sendPath(ws, path, "ok")
            sendAllPathIfSub("user/v1/topic/groups", groups)
        } catch (error) {
            sendPath(ws, path, error.message)
        }
    }
})
receivePath("user/v1/func/group-delete", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        try {
            await deleteGroup(body)
            const groups = getGroups()
            sendPath(ws, path, "ok")
            sendAllPathIfSub("user/v1/topic/groups", groups)
        } catch (error) {
            sendPath(ws, path, error.message)
        }
    }
})

// user/v1/func/group-
receivePath("user/v1/func/group-create", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        try {
            await createGroup(body)
            const groups = getGroups()
            sendPath(ws, path, "ok")
            sendAllPathIfSub("user/v1/topic/groups", groups)
        } catch (error) {
            sendPath(ws, path, error.message)
        }
    }
})
receivePath("user/v1/func/group-delete", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        try {
            await deleteGroup(body)
            const groups = getGroups()
            sendPath(ws, path, "ok")
            sendAllPathIfSub("user/v1/topic/groups", groups)
        } catch (error) {
            sendPath(ws, path, error.message)
        }
    }
})

// user/v1/func/user-
receivePath("user/v1/func/user-create", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        try {
            console.log(body.groups);
            await createUser(body.username, body.password, body.passwordConfirm, body.groups)
            const users = getUsers()
            sendPath(ws, path, "ok")
            sendAllPathIfSub("user/v1/topic/users", users)
        } catch (error) {
            sendPath(ws, path, error.message)
        }
    }
})
receivePath("user/v1/func/user-delete", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        try {
            await deleteUser(body)
            const users = getUsers()
            sendPath(ws, path, "ok")
            sendAllPathIfSub("user/v1/topic/users", users)
        } catch (error) {
            sendPath(ws, path, error.message)
        }
    }
})
receivePath("user/v1/func/user-add-group", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        try {
            await addGroupToUser(body.username, body.group)
            const users = getUsers()
            sendPath(ws, path, "ok")
            sendAllPathIfSub("user/v1/topic/users", users)
        } catch (error) {
            sendPath(ws, path, error.message)
        }
    }
})
receivePath("user/v1/func/user-remove-group", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        try {
            await removeGroupFromUser(body.username, body.group)
            const users = getUsers()
            sendPath(ws, path, "ok")
            sendAllPathIfSub("user/v1/topic/users", users)
        } catch (error) {
            sendPath(ws, path, error.message)
        }
    }
})
receivePath("user/v1/func/user-change-password", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        try {
            await changeUserPassword(body.username, body.password, body.passwordConfirm)
            const users = getUsers()
            sendPath(ws, path, "ok")
            sendAllPathIfSub("user/v1/topic/users", users)
        } catch (error) {
            sendPath(ws, path, error.message)
        }
    }
})

// user/v1/func/reset-
receivePath("user/v1/func/reset-to-default", async (ws, path, body) => {
    if (isAdmin(ws, path)) {
        try {
            await resetUsersToDefault()
            const users = getUsers()
            sendPath(ws, path, "ok")
            sendAllPathIfSub("user/v1/topic/groups", users)
        } catch (error) {
            sendPath(ws, path, error.message)
        }
    }
})
