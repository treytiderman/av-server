// Imports
import fs from 'fs/promises'
import { Logger } from './logger-v0.js'

// Exports
export {
    getNames,
    subNames,
    unsubNames,

    create,
    write,
    remove,
    removeAll,

    get,
    sub,
    unsub,
    set,
    reset,

    getKey,
    subKey,
    unsubKey,
    setKey,
    removeKey,

    Database,

    isObject,
    STORAGE_PATH
}

// Constants
const STORAGE_PATH = "../private/databases/"
const POLL_RATE = 1000

// State
const log = new Logger("database-v1.js")
const dbs = {}

// Functions
const getNames = async () => await getKey("database-v1", "names")
const subNames = (callback) => subKey("database-v1", "names", callback)
const unsubNames = (callback) => unsubKey("database-v1", "names", callback)

/** Create an observable json data store.
 * @param {string} filename Filename without an extention. The extension ".json" will be added.
 * @param {Object} [defaultData={}] Data starting point. Is also used to reset to
 * @returns {Promise<string>} await "ok" or "error..."
 * @example await create("my-file", { key: "value" })
 */
const create = log.call(async (filename, defaultData = {}) => {
    if (dbs[filename]) return `error database '${filename}' exists`

    if (isObject(defaultData) === false) defaultData = {}
    dbs[filename] = {
        filename: filename,
        path: STORAGE_PATH + filename + ".json",
        data: {},
        defaultData: clone(defaultData),
        keyCallbacks: {},
        dataCallbacks: [],
    }

    const obj = await readJson(dbs[filename].path)
    if (obj) {
        for (const key in obj) { dbs[filename].keyCallbacks[key] = [] }
        dbs[filename].data = obj
    } else {
        for (const key in defaultData) { dbs[filename].keyCallbacks[key] = [] }
        dbs[filename].data = defaultData
        await write(filename)
    }

    return "ok"
}, "create")

/** Write the json data to a file
 * @param {string} filename Filename without an extention.
 * @returns {Promise<string>} await "ok" or "error..."
 * @example await write("my-file")
 */
const write = log.call(async (filename) => {
    if (!dbs[filename]) return `error database '${filename}' doesn't exist`
    await writeJson(dbs[filename].path, dbs[filename].data)
    return "ok"
}, "write",)

/** Remove the json file from disk
 * @param {string} filename Filename without an extention.
 * @returns {Promise<string>} await "ok" or "error..."
 * @example await remove("my-file")
 */
const remove = log.call(async (filename) => {
    if (!dbs[filename]) return `error database '${filename}' doesn't exist`
    await deleteFile(dbs[filename].path)
    delete dbs[filename]
    return "ok"
}, "remove")

const removeAll = log.call(async () => {
    await deleteFolder(STORAGE_PATH)
}, "removeAll")

/** Get data (cached)
 * @param {string} filename Filename without an extention.
 * @returns {Promise<Object|undefined>} await data or undefined
 * @example await get("my-file")
 */
const get = (filename) => {
    if (!dbs[filename]) return `error database '${filename}' doesn't exist`
    return dbs[filename]?.data
}

/** Set data (cache only). Must write() to save to disk
 * @param {string} filename The filename without an extention.
 * @param {Object} object The new data for database
 * @returns {Promise<string>} await "ok" or "error..."
 * @example await set("my-file", {key2: "val2"})
 */
const set = log.call((filename, object) => {
    if (!dbs[filename]) return `error database '${filename}' doesn't exist`
    if (isObject(object) === false) return `error must provide an object`
    
    for (const key in dbs[filename].data) {
        if (!object[key]) removeKey(filename, key)
    }
    
    dbs[filename].data = clone(object)
    dbs[filename].dataCallbacks.forEach((callback) => callback(dbs[filename].data))
    for (const key in dbs[filename].data) {
        if (!dbs[filename].keyCallbacks[key]) { dbs[filename].keyCallbacks[key] = [] }
        dbs[filename].keyCallbacks[key].forEach((callback) => callback(dbs[filename].data[key]))
    }
    
    return "ok"
}, "set")

function keys(filename) {
    if (!dbs[filename]) return `error database '${filename}' doesn't exist`
    return Object.keys(dbs[filename].data)
}

const reset = log.call((filename) => {
    if (!dbs[filename]) return `error database '${filename}' doesn't exist`
    set(filename, dbs[filename].defaultData)
    return "ok"
}, "reset")

function sub(filename, callback) {
    if (!dbs[filename]) return `error database '${filename}' doesn't exist`
    dbs[filename].dataCallbacks.push(callback)
    callback(dbs[filename].data)
    return "ok"
}

function unsub(filename, callback) {
    if (!dbs[filename]) return `error database '${filename}' doesn't exist`
    dbs[filename].dataCallbacks = dbs[filename].dataCallbacks.filter((cb) => cb !== callback)
    return "ok"
}

function getKey(filename, key) {
    if (!dbs[filename]) return `error database '${filename}' doesn't exist`
    return dbs[filename].data[key]
}

const setKey = (filename, key, value) => {
    if (!dbs[filename]) return `error database '${filename}' doesn't exist`
    
    dbs[filename].data[key] = clone(value)
    if (!dbs[filename].keyCallbacks[key]) { dbs[filename].keyCallbacks[key] = [] }
    dbs[filename].keyCallbacks[key].forEach((callback) => callback(value))
    dbs[filename].dataCallbacks.forEach((callback) => callback(dbs[filename].data))
    return "ok"
}

const removeKey = log.call((filename, key) => {
    if (!dbs[filename]) return `error database '${filename}' doesn't exist`
    
    delete dbs[filename].data[key]
    if (!dbs[filename].keyCallbacks[key]) { dbs[filename].keyCallbacks[key] = [] }
    dbs[filename].keyCallbacks[key].forEach((callback) => callback(undefined))
    dbs[filename].dataCallbacks.forEach((callback) => callback(dbs[filename].data))
    // delete dbs[filename].keyCallbacks[key] // deletes the callback before running callback(undefined)
    return "ok"
}, "removeKey")

function subKey(filename, key, callback) {
    if (!dbs[filename]) return `error database '${filename}' doesn't exist`
    if (!dbs[filename].keyCallbacks[key]) { dbs[filename].keyCallbacks[key] = [] }
    dbs[filename].keyCallbacks[key].push(callback)
    callback(dbs[filename].data[key])
    return "ok"
}

function unsubKey(filename, key, callback) {
    if (!dbs[filename]) return `error database '${filename}' doesn't exist`
    if (!dbs[filename].keyCallbacks[key]) return
    dbs[filename].keyCallbacks[key] = dbs[filename].keyCallbacks[key].filter((cb) => cb !== callback)
    return "ok"
}

// Startup
create("database-v1", { names: [] })
setInterval(async () => {
    const names = getKey("database-v1", "names")
    const newNames = await readDirectory(STORAGE_PATH)
    if (JSON.stringify(names) !== JSON.stringify(newNames)) {
        setKey("database-v1", "names", await readDirectory(STORAGE_PATH))
        write("database-v1")
    }
}, POLL_RATE);

// Classes
class Database {
    constructor(filename = "undefined") {
        this.filename = filename
    }

    create(defaultData = {}) { return create(this.filename, defaultData) }
    write() { return write(this.filename) }
    remove() { return remove(this.filename) }

    get() { return get(this.filename) }
    set(object = {}) { return set(this.filename, object) }
    keys() { return keys(this.filename) }
    reset() { return reset(this.filename) }
    sub(callback) { return sub(this.filename, callback) }
    unsub(callback) { return unsub(this.filename, callback) }

    getKey(key) { return getKey(this.filename, key) }
    setKey(key, value = "") { return setKey(this.filename, key, value) }
    removeKey(key) { return removeKey(this.filename, key) }
    subKey(key, callback) { return subKey(this.filename, key, callback) }
    unsubKey(key, callback) { return unsubKey(this.filename, key, callback) }
}

// Helper Functions
function clone(obj) {
    return JSON.parse(JSON.stringify(obj))
}
function isObject(obj) {
    return typeof obj === 'object' && !Array.isArray(obj) && obj !== null
}

async function readDirectory(path) {
    try {
        const filenames = await fs.readdir(path)
        const dbs = filenames.map(filename => filename.replace(".json", ""))
        return dbs
    } catch (error) {
        return
    }
}
async function createDirectory(path) {
    try {
        await fs.mkdir(path, { recursive: true })
    } catch (error) {
        return error
    }
}
async function readJson(path) {
    try {
        const file = await fs.readFile(path)
        const json = JSON.parse(file)
        return json
    } catch (error) {
        return
    }
}
async function writeJson(path, obj) {
    try {
        const json = JSON.stringify(obj, null, 2)
        await fs.writeFile(path, json)
    }
    catch (error) {
        if (error?.code === "ENOENT") {
            await createDirectory(path.slice(0, path.lastIndexOf('/')) + "/")
            await writeJson(path, obj)
            return
        }
        return error
    }
}
async function deleteFile(path) {
    try {
        await fs.rm(path)
    } catch (error) {
        return error
    }
}
async function deleteFolder(path) {
    try {
        await fs.rm(path, { recursive: true })
    } catch (error) {
        return error.message
    }
}
