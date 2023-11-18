// Imports
import { stdio as api } from "./stdio.mjs";

// Exports
export {
    getLogs,
    subLogs,
    unsubLogs,

    getLogsHistory,
    subLogsHistory,
    unsubLogsHistory,

    debug,
    info,
    error,
}

// Functions
function debug(group, message, obj, callback = () => { }) {
    api.send.path("/logger/v0/func/debug/", {
        group: group,
        level: "debug",
        message: message,
        obj: obj,
    })
    api.receiveOnce.path("/logger/v0/func/debug/", (response) => callback(response))
}
function info(group, message, obj, callback = () => { }) {
    api.send.path("/logger/v0/func/info/", {
        group: group,
        level: "info",
        message: message,
        obj: obj,
    })
    api.receiveOnce.path("/logger/v0/func/info/", (response) => callback(response))
}    
function error(group, message, obj, callback = () => { }) {
    api.send.path("/logger/v0/func/error/", {
        group: group,
        level: "error",
        message: message,
        obj: obj,
    })
    api.receiveOnce.path("/logger/v0/func/error/", (response) => callback(response))
}

// Topics
function getLogs(callback = () => { }) {
    api.send.path("/logger/v0/topic/data/", "get")
    api.receiveOnce.path("/logger/v0/topic/data/", (response) => callback(response))
}
function subLogs(callback = () => { }) {
    api.send.path("/logger/v0/topic/data/", "sub")
    api.receive.path("/logger/v0/topic/data/", (response) => callback(response))
}
function unsubLogs(callback = () => { }) {
    api.send.path("/logger/v0/topic/data/", "unsub")
    api.receiveOnce.path("/logger/v0/topic/data/", (response) => callback(response))
}

function getLogsHistory(callback = () => { }) {
    api.send.path("/logger/v0/topic/history/", "get")
    api.receiveOnce.path("/logger/v0/topic/history/", (response) => callback(response))
}
function subLogsHistory(callback = () => { }) {
    api.send.path("/logger/v0/topic/history/", "sub")
    api.receive.path("/logger/v0/topic/history/", (response) => callback(response))
}
function unsubLogsHistory(callback = () => { }) {
    api.send.path("/logger/v0/topic/history/", "unsub")
    api.receiveOnce.path("/logger/v0/topic/history/", (response) => callback(response))
}
