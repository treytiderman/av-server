// Imports
import { stdio as api } from "./stdio.mjs";

// Exports
export const v0 = {

    // Functions
    create,
    start,
    send,
    kill,
    restart,
    remove,

    setDirectory,
    setCommand,
    setStartOnBoot,
    setEnviromentVariables,

    startAll,
    sendAll,
    killAll,
    restartAll,
    removeAll,

    // Topics
    getAvailable,
    subAvailable,
    unsubAvailable,

    getData,
    subData,
    unsubData,

    getHistory,
    subHistory,
    unsubHistory,

    getStatus,
    subStatus,
    unsubStatus,

    getStatusAll,
    subStatusAll,
    unsubStatusAll,
}

// Functions
function create(name, directory, command, env, startOnBoot, callback = () => { }) {
    api.send.path("/programs/v0/func/create/", { name: name, directory: directory, command: command, env: env, startOnBoot: startOnBoot })
    api.receiveOnce.path("/programs/v0/func/create/", (response) => callback(response))
}
function start(name, callback = () => { }) {
    api.send.path("/programs/v0/func/start/", { name: name })
    api.receiveOnce.path("/programs/v0/func/start/", (response) => callback(response))
}
function send(name, text, callback = () => { }) {
    api.send.path("/programs/v0/func/send/", { name: name, text: text })
    api.receiveOnce.path("/programs/v0/func/send/", (response) => callback(response))
}
function kill(name, callback = () => { }) {
    api.send.path("/programs/v0/func/kill/", { name: name })
    api.receiveOnce.path("/programs/v0/func/kill/", (response) => callback(response))
}
function restart(name, callback = () => { }) {
    api.send.path("/programs/v0/func/restart/", { name: name })
    api.receiveOnce.path("/programs/v0/func/restart/", (response) => callback(response))
}
function remove(name, callback = () => { }) {
    api.send.path("/programs/v0/func/remove/", { name: name })
    api.receiveOnce.path("/programs/v0/func/remove/", (response) => callback(response))
}

function setDirectory(name, directory, callback = () => { }) {
    api.send.path("/programs/v0/func/set-directory/", { name: name, directory: directory })
    api.receiveOnce.path("/programs/v0/func/set-directory/", (response) => callback(response))
}
function setCommand(name, command, callback = () => { }) {
    api.send.path("/programs/v0/func/set-command/", { name: name, command: command })
    api.receiveOnce.path("/programs/v0/func/set-command/", (response) => callback(response))
}
function setStartOnBoot(name, startOnBoot, callback = () => { }) {
    api.send.path("/programs/v0/func/set-start-on-boot/", { name: name, startOnBoot: startOnBoot })
    api.receiveOnce.path("/programs/v0/func/set-start-on-boot/", (response) => callback(response))
}
function setEnviromentVariables(name, env, callback = () => { }) {
    api.send.path("/programs/v0/func/set-enviroment-variables/", { name: name, env: env })
    api.receiveOnce.path("/programs/v0/func/set-enviroment-variables/", (response) => callback(response))
}

function startAll(callback = () => { }) {
    api.send.path("/programs/v0/func/start-all/", { })
    api.receiveOnce.path("/programs/v0/func/start-all/", (response) => callback(response))
}
function sendAll(text, callback = () => { }) {
    api.send.path("/programs/v0/func/send-all/", { text: text })
    api.receiveOnce.path("/programs/v0/func/send-all/", (response) => callback(response))
}
function killAll(callback = () => { }) {
    api.send.path("/programs/v0/func/kill-all/", { })
    api.receiveOnce.path("/programs/v0/func/kill-all/", (response) => callback(response))
}
function restartAll(callback = () => { }) {
    api.send.path("/programs/v0/func/restart-all/", { })
    api.receiveOnce.path("/programs/v0/func/restart-all/", (response) => callback(response))
}
function removeAll(callback = () => { }) {
    api.send.path("/programs/v0/func/remove-all/", { })
    api.receiveOnce.path("/programs/v0/func/remove-all/", (response) => callback(response))
}

// Topics
function getAvailable(callback = () => { }) {
    api.send.path(`/programs/v0/topic/available/`, "get")
    api.receiveOnce.path(`/programs/v0/topic/available/`, (response) => callback(response))
}
function subAvailable(callback = () => { }) {
    api.send.path(`/programs/v0/topic/available/`, "sub")
    api.receive.path(`/programs/v0/topic/available/`, (response) => callback(response))
}
function unsubAvailable(callback = () => { }) {
    api.send.path(`/programs/v0/topic/available/`, "unsub")
    api.receiveOnce.path(`/programs/v0/topic/available/`, (response) => callback(response))
}

function getData(name, callback = () => { }) {
    api.send.path(`/programs/v0/topic/data/${name}/`, "get")
    api.receiveOnce.path(`/programs/v0/topic/data/${name}/`, (response) => callback(response))
}
function subData(name, callback = () => { }) {
    api.send.path(`/programs/v0/topic/data/${name}/`, "sub")
    api.receive.path(`/programs/v0/topic/data/${name}/`, (response) => callback(response))
}
function unsubData(name, callback = () => { }) {
    api.send.path(`/programs/v0/topic/data/${name}/`, "unsub")
    api.receiveOnce.path(`/programs/v0/topic/data/${name}/`, (response) => callback(response))
}

function getHistory(name, callback = () => { }) {
    api.send.path(`/programs/v0/topic/history/${name}/`, "get")
    api.receiveOnce.path(`/programs/v0/topic/history/${name}/`, (response) => callback(response))
}
function subHistory(name, callback = () => { }) {
    api.send.path(`/programs/v0/topic/history/${name}/`, "sub")
    api.receive.path(`/programs/v0/topic/history/${name}/`, (response) => callback(response))
}
function unsubHistory(name, callback = () => { }) {
    api.send.path(`/programs/v0/topic/history/${name}/`, "unsub")
    api.receiveOnce.path(`/programs/v0/topic/history/${name}/`, (response) => callback(response))
}

function getStatus(name, callback = () => { }) {
    api.send.path(`/programs/v0/topic/status/${name}/`, "get")
    api.receiveOnce.path(`/programs/v0/topic/status/${name}/`, (response) => callback(response))
}
function subStatus(name, callback = () => { }) {
    api.send.path(`/programs/v0/topic/status/${name}/`, "sub")
    api.receive.path(`/programs/v0/topic/status/${name}/`, (response) => callback(response))
}
function unsubStatus(name, callback = () => { }) {
    api.send.path(`/programs/v0/topic/status/${name}/`, "unsub")
    api.receiveOnce.path(`/programs/v0/topic/status/${name}/`, (response) => callback(response))
}

function getStatusAll(callback = () => { }) {
    api.send.path(`/programs/v0/topic/status-all/`, "get")
    api.receiveOnce.path(`/programs/v0/topic/status-all/`, (response) => callback(response))
}
function subStatusAll(callback = () => { }) {
    api.send.path(`/programs/v0/topic/status-all/`, "sub")
    api.receive.path(`/programs/v0/topic/status-all/`, (response) => callback(response))
}
function unsubStatusAll(callback = () => { }) {
    api.send.path(`/programs/v0/topic/status-all/`, "unsub")
    api.receiveOnce.path(`/programs/v0/topic/status-all/`, (response) => callback(response))
}
