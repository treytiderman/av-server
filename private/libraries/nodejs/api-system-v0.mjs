// Imports
import { stdio as api } from "./stdio.mjs";

// Exports
export const v0 = {
    getTime,
    subTime,
    unsubTime,

    getTimeAsIso,
    subTimeAsIso,
    unsubTimeAsIso,

    getUptime,
    subUptime,
    unsubUptime,

    getInfo,
    subInfo,
    unsubInfo,
}

// Topics
function getTime(callback = () => { }) {
    api.send.path("/system/v0/topic/time/", "get")
    api.receiveOnce.path("/system/v0/topic/time/", (response) => callback(response))
}
function subTime(callback = () => { }) {
    api.send.path("/system/v0/topic/time/", "sub")
    api.receive.path("/system/v0/topic/time/", (response) => callback(response))
}
function unsubTime(callback = () => { }) {
    api.send.path("/system/v0/topic/time/", "unsub")
    api.receiveOnce.path("/system/v0/topic/time/", (response) => callback(response))
}

function getTimeAsIso(callback = () => { }) {
    api.send.path("/system/v0/topic/time-as-iso/", "get")
    api.receiveOnce.path("/system/v0/topic/time-as-iso/", (response) => callback(response))
}
function subTimeAsIso(callback = () => { }) {
    api.send.path("/system/v0/topic/time-as-iso/", "sub")
    api.receive.path("/system/v0/topic/time-as-iso/", (response) => callback(response))
}
function unsubTimeAsIso(callback = () => { }) {
    api.send.path("/system/v0/topic/time-as-iso/", "unsub")
    api.receiveOnce.path("/system/v0/topic/time-as-iso/", (response) => callback(response))
}

function getUptime(callback = () => { }) {
    api.send.path("/system/v0/topic/uptime/", "get")
    api.receiveOnce.path("/system/v0/topic/uptime/", (response) => callback(response))
}
function subUptime(callback = () => { }) {
    api.send.path("/system/v0/topic/uptime/", "sub")
    api.receive.path("/system/v0/topic/uptime/", (response) => callback(response))
}
function unsubUptime(callback = () => { }) {
    api.send.path("/system/v0/topic/uptime/", "unsub")
    api.receiveOnce.path("/system/v0/topic/uptime/", (response) => callback(response))
}

function getInfo(callback = () => { }) {
    api.send.path("/system/v0/topic/info/", "get")
    api.receiveOnce.path("/system/v0/topic/info/", (response) => callback(response))
}
function subInfo(callback = () => { }) {
    api.send.path("/system/v0/topic/info/", "sub")
    api.receive.path("/system/v0/topic/info/", (response) => callback(response))
}
function unsubInfo(callback = () => { }) {
    api.send.path("/system/v0/topic/info/", "unsub")
    api.receiveOnce.path("/system/v0/topic/info/", (response) => callback(response))
}
