// Imports
import { stdio as api } from "./stdio.mjs";

// Exports
export {

    // Functions
    open,
    send,
    setEncoding,
    close,
    remove,

    openAll,
    closeAll,
    removeAll,

    // Topics
    getClient,
    subClient,
    unsubClient,

    getClients,
    subClients,
    unsubClients,

    getData,
    subData,
    unsubData,

    getHistory,
    subHistory,
    unsubHistory,
}

// Functions
function open(address, encoding, callback = () => { }) {
    api.send.path("/tcp-client/v0/func/open/", {
        address: address,
        encoding: encoding,
    })
    api.receiveOnce.path("/tcp-client/v0/func/open/", (response) => callback(response))
}
function send(address, data, encoding, callback = () => { }) {
    api.send.path("/tcp-client/v0/func/send/", {
        address: address,
        data: data,
        encoding: encoding,
    })
    api.receiveOnce.path("/tcp-client/v0/func/send/", (response) => callback(response))
}
function setEncoding(address, encoding, callback = () => { }) {
    api.send.path("/tcp-client/v0/func/set-encoding/", {
        address: address,
        encoding: encoding,
    })
    api.receiveOnce.path("/tcp-client/v0/func/set-encoding/", (response) => callback(response))
}
function close(address, callback = () => { }) {
    api.send.path("/tcp-client/v0/func/close/", {
        address: address,
    })
    api.receiveOnce.path("/tcp-client/v0/func/close/", (response) => callback(response))
}
function remove(address, callback = () => { }) {
    api.send.path("/tcp-client/v0/func/remove/", {
        address: address,
    })
    api.receiveOnce.path("/tcp-client/v0/func/remove/", (response) => callback(response))
}

function openAll(callback = () => { }) {
    api.send.path("/tcp-client/v0/func/open-all/")
    api.receiveOnce.path("/tcp-client/v0/func/open-all/", (response) => callback(response))
}
function closeAll(callback = () => { }) {
    api.send.path("/tcp-client/v0/func/close-all/")
    api.receiveOnce.path("/tcp-client/v0/func/close-all/", (response) => callback(response))
}
function removeAll(callback = () => { }) {
    api.send.path("/tcp-client/v0/func/remove-all/")
    api.receiveOnce.path("/tcp-client/v0/func/remove-all/", (response) => callback(response))
}

// Topics
function getClient(address, callback = () => { }) {
    api.send.path(`/tcp-client/v0/topic/client/${address}/`, "get")
    api.receiveOnce.path(`/tcp-client/v0/topic/client/${address}/`, (response) => callback(response))
}
function subClient(address, callback = () => { }) {
    api.send.path(`/tcp-client/v0/topic/client/${address}/`, "sub")
    api.receive.path(`/tcp-client/v0/topic/client/${address}/`, (response) => callback(response))
}
function unsubClient(address, callback = () => { }) {
    api.send.path(`/tcp-client/v0/topic/client/${address}/`, "unsub")
    api.receiveOnce.path(`/tcp-client/v0/topic/client/${address}/`, (response) => callback(response))
}

function getClients(callback = () => { }) {
    api.send.path(`/tcp-client/v0/topic/clients/`, "get")
    api.receiveOnce.path(`/tcp-client/v0/topic/clients/`, (response) => callback(response))
}
function subClients(callback = () => { }) {
    api.send.path(`/tcp-client/v0/topic/clients/`, "sub")
    api.receive.path(`/tcp-client/v0/topic/clients/`, (response) => callback(response))
}
function unsubClients(callback = () => { }) {
    api.send.path(`/tcp-client/v0/topic/clients/`, "unsub")
    api.receiveOnce.path(`/tcp-client/v0/topic/clients/`, (response) => callback(response))
}

function getData(address, callback = () => { }) {
    api.send.path(`/tcp-client/v0/topic/data/${address}/`, "get")
    api.receiveOnce.path(`/tcp-client/v0/topic/data/${address}/`, (response) => callback(response))
}
function subData(address, callback = () => { }) {
    api.send.path(`/tcp-client/v0/topic/data/${address}/`, "sub")
    api.receive.path(`/tcp-client/v0/topic/data/${address}/`, (response) => callback(response))
}
function unsubData(address, callback = () => { }) {
    api.send.path(`/tcp-client/v0/topic/data/${address}/`, "unsub")
    api.receiveOnce.path(`/tcp-client/v0/topic/data/${address}/`, (response) => callback(response))
}

function getHistory(address, callback = () => { }) {
    api.send.path(`/tcp-client/v0/topic/history/${address}/`, "get")
    api.receiveOnce.path(`/tcp-client/v0/topic/history/${address}/`, (response) => callback(response))
}
function subHistory(address, callback = () => { }) {
    api.send.path(`/tcp-client/v0/topic/history/${address}/`, "sub")
    api.receive.path(`/tcp-client/v0/topic/history/${address}/`, (response) => callback(response))
}
function unsubHistory(address, callback = () => { }) {
    api.send.path(`/tcp-client/v0/topic/history/${address}/`, "unsub")
    api.receiveOnce.path(`/tcp-client/v0/topic/history/${address}/`, (response) => callback(response))
}
