// Imports
import { stdio as api } from "./stdio.mjs";

// Exports
export {
    createDB,
    writeDB,
    resetDB,
    deleteDB,
    deleteAllDB,

    setKey,
    setKeyWriteDB,
    deleteKey,

    getNames,
    subNames,
    unsubNames,

    getData,
    subData,
    unsubData,

    getKey,
    subKey,
    unsubKey,
}

// Functions
function createDB(name, defaultData, callback = () => { }) {
    api.send.path("/database/v0/func/create/", { name: name, defaultData: defaultData })
    api.receiveOnce.path("/database/v0/func/create/", (response) => callback(response))
}
function writeDB(name, callback = () => { }) {
    api.send.path("/database/v0/func/write/", { name: name })
    api.receiveOnce.path("/database/v0/func/write/", (response) => callback(response))
}
function resetDB(name, callback = () => { }) {
    api.send.path("/database/v0/func/reset/", { name: name })
    api.receiveOnce.path("/database/v0/func/reset/", (response) => callback(response))
}
function deleteDB(name, callback = () => { }) {
    api.send.path("/database/v0/func/delete/", { name: name })
    api.receiveOnce.path("/database/v0/func/delete/", (response) => callback(response))
}
function deleteAllDB(callback = () => { }) {
    api.send.path("/database/v0/func/delete-all/")
    api.receiveOnce.path("/database/v0/func/delete-all/", (response) => callback(response))
}

function setKey(name, key, value, callback = () => { }) {
    api.send.path("/database/v0/func/set-key/", { name: name, key: key, value: value })
    api.receiveOnce.path("/database/v0/func/set-key/", (response) => callback(response))
}
function setKeyWriteDB(name, key, value, callback = () => { }) {
    api.send.path("/database/v0/func/set-key-write-database/", { name: name, key: key, value: value })
    api.receiveOnce.path("/database/v0/func/set-key-write-database/", (response) => callback(response))
}
function deleteKey(name, key, callback = () => { }) {
    api.send.path("/database/v0/func/delete-key/", { name: name, key: key })
    api.receiveOnce.path("/database/v0/func/delete-key/", (response) => callback(response))
}

// Topics
function getNames(callback = () => { }) {
    api.send.path(`/database/v0/topic/names/`, "get")
    api.receiveOnce.path(`/database/v0/topic/names/`, (response) => callback(response))
}
function subNames(callback = () => { }) {
    api.send.path(`/database/v0/topic/names/`, "sub")
    api.receive.path(`/database/v0/topic/names/`, (response) => callback(response))
}
function unsubNames(callback = () => { }) {
    api.send.path(`/database/v0/topic/names/`, "unsub")
    api.receiveOnce.path(`/database/v0/topic/names/`, (response) => callback(response))
}

function getData(name, callback = () => { }) {
    api.send.path(`/database/v0/topic/data/${name}/`, "get")
    api.receiveOnce.path(`/database/v0/topic/data/${name}/`, (response) => callback(response))
}
function subData(name, callback = () => { }) {
    api.send.path(`/database/v0/topic/data/${name}/`, "sub")
    api.receive.path(`/database/v0/topic/data/${name}/`, (response) => callback(response))
}
function unsubData(name, callback = () => { }) {
    api.send.path(`/database/v0/topic/data/${name}/`, "unsub")
    api.receiveOnce.path(`/database/v0/topic/data/${name}/`, (response) => callback(response))
}

function getKey(name, key, callback = () => { }) {
    api.send.path(`/database/v0/topic/key/${name}/${key}/`, "get")
    api.receiveOnce.path(`/database/v0/topic/key/${name}/${key}/`, (response) => callback(response))
}
function subKey(name, key, callback = () => { }) {
    api.send.path(`/database/v0/topic/key/${name}/${key}/`, "sub")
    api.receive.path(`/database/v0/topic/key/${name}/${key}/`, (response) => callback(response))
}
function unsubKey(name, key, callback = () => { }) {
    api.send.path(`/database/v0/topic/key/${name}/${key}/`, "unsub")
    api.receiveOnce.path(`/database/v0/topic/key/${name}/${key}/`, (response) => callback(response))
}
