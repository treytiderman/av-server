// Imports
import { stdio as api } from "./stdio.mjs";

// Exports
export {
    getToken,
    subToken,
    unsubToken,

    getUsers,
    subUsers,
    unsubUsers,

    getGroups,
    subGroups,
    unsubGroups,

    getWhoAmI,
    subWhoAmI,
    unsubWhoAmI,

    login,
    loginWithToken,
    logout,

    groupCreate,
    groupDelete,

    userCreate,
    userDelete,
    userAddGroup,
    userRemoveGroup,
    userChangePassword,

    resetToDefault,
}

// Functions
function login(username, password, callback = () => { }) {
    api.send.path("/users/v0/func/login/", { username: username, password: password })
    api.receiveOnce.path("/users/v0/func/login/", (response) => callback(response))
}
function loginWithToken(token, callback = () => { }) {
    api.send.path("/users/v0/func/login-with-token/", token)
    api.receiveOnce.path("/users/v0/func/login-with-token/", (response) => callback(response))
}
function logout(callback = () => { }) {
    api.send.path("/users/v0/func/logout/")
    api.receiveOnce.path("/users/v0/func/logout/", (response) => callback(response))
}

function groupCreate(group, callback = () => { }) {
    api.send.path("/users/v0/func/group-create/", group)
    api.receiveOnce.path("/users/v0/func/group-create/", (response) => callback(response))
}
function groupDelete(group, callback = () => { }) {
    api.send.path("/users/v0/func/group-delete/", group)
    api.receiveOnce.path("/users/v0/func/group-delete/", (response) => callback(response))
}

function userCreate(username, password, passwordConfirm, groups, callback = () => { }) {
    api.send.path("/users/v0/func/user-create/", {
        username: username,
        password: password,
        passwordConfirm: passwordConfirm,
        groups: groups,
    })
    api.receiveOnce.path("/users/v0/func/user-create/", (response) => callback(response))
}
function userDelete(username, callback = () => { }) {
    api.send.path("/users/v0/func/user-delete/", username)
    api.receiveOnce.path("/users/v0/func/user-delete/", (response) => callback(response))
}
function userAddGroup(username, group, callback = () => { }) {
    api.send.path("/users/v0/func/user-add-group/", {
        username: username,
        group: group,
    })
    api.receiveOnce.path("/users/v0/func/user-add-group/", (response) => callback(response))
}
function userRemoveGroup(username, group, callback = () => { }) {
    api.send.path("/users/v0/func/user-remove-group/", {
        username: username,
        group: group,
    })
    api.receiveOnce.path("/users/v0/func/user-remove-group/", (response) => callback(response))
}
function userChangePassword(username, password, passwordConfirm, callback = () => { }) {
    api.send.path("/users/v0/func/user-change-password/", {
        username: username,
        password: password,
        passwordConfirm: passwordConfirm,
    })
    api.receiveOnce.path("/users/v0/func/user-change-password/", (response) => callback(response))
}

function resetToDefault(callback = () => { }) {
    api.send.path("/users/v0/func/reset-to-default/")
    api.receiveOnce.path("/users/v0/func/reset-to-default/", (response) => callback(response))
}

// Topics
function getToken(callback = () => { }) {
    api.send.path("/users/v0/topic/token/", "get")
    api.receiveOnce.path("/users/v0/topic/token/", (response) => callback(response))
}
function subToken(callback = () => { }) {
    api.send.path("/users/v0/topic/token/", "sub")
    api.receive.path("/users/v0/topic/token/", (response) => callback(response))
}
function unsubToken(callback = () => { }) {
    api.send.path("/users/v0/topic/token/", "unsub")
    api.receiveOnce.path("/users/v0/topic/token/", (response) => callback(response))
}

function getWhoAmI(callback = () => { }) {
    api.send.path("/users/v0/topic/who-am-i/", "get")
    api.receiveOnce.path("/users/v0/topic/who-am-i/", (response) => callback(response))
}
function subWhoAmI(callback = () => { }) {
    api.send.path("/users/v0/topic/who-am-i/", "sub")
    api.receive.path("/users/v0/topic/who-am-i/", (response) => callback(response))
}
function unsubWhoAmI(callback = () => { }) {
    api.send.path("/users/v0/topic/who-am-i/", "unsub")
    api.receiveOnce.path("/users/v0/topic/who-am-i/", (response) => callback(response))
}

function getGroups(callback = () => { }) {
    api.send.path("/users/v0/topic/groups/", "get")
    api.receiveOnce.path("/users/v0/topic/groups/", (response) => callback(response))
}
function subGroups(callback = () => { }) {
    api.send.path("/users/v0/topic/groups/", "sub")
    api.receive.path("/users/v0/topic/groups/", (response) => callback(response))
}
function unsubGroups(callback = () => { }) {
    api.send.path("/users/v0/topic/groups/", "unsub")
    api.receiveOnce.path("/users/v0/topic/groups/", (response) => callback(response))
}

function getUsers(callback = () => { }) {
    api.send.path("/users/v0/topic/users/", "get")
    api.receiveOnce.path("/users/v0/topic/users/", (response) => callback(response))
}
function subUsers(callback = () => { }) {
    api.send.path("/users/v0/topic/users/", "sub")
    api.receive.path("/users/v0/topic/users/", (response) => callback(response))
}
function unsubUsers(callback = () => { }) {
    api.send.path("/users/v0/topic/users/", "unsub")
    api.receiveOnce.path("/users/v0/topic/users/", (response) => callback(response))
}
