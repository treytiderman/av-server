// Imports
import fs from 'fs/promises'
import { Logger } from './logger.js'

// Exports
export {
    // databases,
    create,
    write,
    remove,
    // removeAll,
    
    get,
    set,
    // keys,
    // reset,
    // sub,
    // unsub,

    // getKey,
    // setKey,
    // removeKey,
    // subKey,
    // unsubKey,

    DB,

    isObject,
    STORAGE_PATH
}

// State
const STORAGE_PATH = "../private/databases/"
const log = new Logger("modules/database-v1.js")

/** Database state object
 * @typedef {Object} Database
 * @property {string} filename - The name of the database file
 * @property {string} path - The path to file relative to this file
 * @property {number} data - The cached Data
 * @property {number} defaultData - The default data. The data to reset to
 * @property {{key: callback[]}} keyCallbacks - Array of callback functions per key
 * @property {callback[]} dataCallbacks - Array of callback functions
*/

/**
 * @type {{filename: Database}}
*/
const dbs = {}

// Functions
/** Create an observable json data store.
 * @param {string} filename Filename without an extention. The extension ".json" will be added.
 * @param {Object} [defaultData={}] Data starting point. Is also used to reset to
 * @returns {Promise<string>} await "ok" or "error..."
 * @example
 *     await create("my-file", { key: "value" })
 */
async function create(filename, defaultData = {}) {
    if (dbs[filename]) return `error database "${filename}" exists`

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
}

/** Write the json data to a file
 * @param {string} filename Filename without an extention.
 * @returns {Promise<string>} await "ok" or "error..."
 * @example
 *     await write("my-file")
 */
async function write(filename) {
    if (!dbs[filename]) return `error database "${filename}" doesn't exist`
    await writeJson(dbs[filename].path, dbs[filename].data)
    return "ok"
}

/** Remove the json file from disk
 * @param {string} filename Filename without an extention.
 * @returns {Promise<string>} await "ok" or "error..."
 * @example
 *     await remove("my-file")
 */
async function remove(filename) {
    if (!dbs[filename]) return `error database "${filename}" doesn't exist`
    await deleteFile(dbs[filename].path)
    delete dbs[filename]
    return "ok"
}

/** Get data (cached)
 * @param {string} filename Filename without an extention.
 * @returns {Promise<Object|undefined>} await data or "error..."
 * @example
 *     await remove("my-file")
 */
function get(filename) {
    return dbs[filename]?.data
}

await log.call(create)("test", {key: "val"})
log.call(get)("test")

/** Set data (cache only). Must write() to save to disk
 * @param {string} filename The filename without an extention.
 * @param {string} object The new data for database
 * @returns {Promise<string>} await "ok" or "error..."
 * @example
 *     await remove("my-file")
 */
function set(filename, object = {}) {
    if (!dbs[filename]) return `error database "${filename}" doesn't exist`

    for (const key in dbs[filename].data) {
        if (!object[key]) removeKey(filename, key)
    }

    // this.#data = clone(object)
    // log.debug(this.filename, "setData(", object, ")", this.#data)
    // this.#dataCallbacks.forEach((callback) => callback(this.#data))
    // for (const key in this.#data) {
    //     if (!this.#keyCallbacks[key]) { this.#keyCallbacks[key] = [] }
    //     this.#keyCallbacks[key].forEach((callback) => callback(this.#data[key]))
    // }

    return "ok"
}

/** Set data (cache only). Must write() to save to disk
 * @param {string} filename Filename without an extention.
 * @returns {Promise<string>} await "ok" or "error..."
 * @example
 *     await remove("my-file")
 */
function asfafw(filename, object = {}) {
    if (!dbs[filename]) return `error database "${filename}" doesn't exist`
    return "ok"
}

async function getAllNames() {
    return await readDirectory(STORAGE_PATH)
}
async function deleteAll() {
    await deleteFolder(STORAGE_PATH)
}


// Class
class DB {
    #data
    #defaultData
    #keyCallbacks
    #dataCallbacks

    constructor(filename) {
        this.filename = filename
        this.path = STORAGE_PATH + filename + ".json"

        // Private variables
        this.#data = {}
        this.#defaultData = {}
        this.#keyCallbacks = {}
        this.#dataCallbacks = []
    }

    async create(defaultData) {
        if (isObject(defaultData) === false) defaultData = {}
        this.#defaultData = clone(defaultData)
        const db = await readJson(this.path)
        if (db) {
            for (const key in db) { this.#keyCallbacks[key] = [] }
            this.#data = db
        } else {
            for (const key in defaultData) { this.#keyCallbacks[key] = [] }
            this.#data = defaultData
            await this.write()
        }
        log.debug(this.filename, "create(", defaultData, ")", this.#data)
        return db
    }
    async write() {
        log.debug(this.filename, "write()", this.path, this.#data)
        return await writeJson(this.path, this.#data)
    }
    async delete() {
        this.#data = {}
        this.#defaultData = {}
        this.#keyCallbacks = {}
        this.#dataCallbacks = []
        log.debug(this.filename, "delete()", this.path)
        return await deleteFile(this.path)
    }

    getData() {
        return this.#data
    }
    setData(object = {}) {
        for (const key in this.#data) {
            if (!object[key]) this.deleteKey(key)
        }
        this.#data = clone(object)
        log.debug(this.filename, "setData(", object, ")", this.#data)
        this.#dataCallbacks.forEach((callback) => callback(this.#data))
        for (const key in this.#data) {
            if (!this.#keyCallbacks[key]) { this.#keyCallbacks[key] = [] }
            this.#keyCallbacks[key].forEach((callback) => callback(this.#data[key]))
        }
    }
    resetData() {
        log.debug(this.filename, "resetData()", this.#defaultData);
        this.setData(this.#defaultData)
    }

    subData(callback) {
        this.#dataCallbacks.push(callback)
        callback(this.#data)
    }
    unsubData(callback) {
        this.#dataCallbacks = this.#dataCallbacks.filter((cb) => cb !== callback)
    }

    getKeys() {
        return Object.keys(this.#data)
    }

    getKey(key) {
        return this.#data[key]
    }
    setKey(key, value = "") {
        log.debug(this.filename, "setKey(", key, value, ")", this.#data)
        this.#data[key] = clone(value)
        if (!this.#keyCallbacks[key]) { this.#keyCallbacks[key] = [] }
        this.#keyCallbacks[key].forEach((callback) => callback(value))
        this.#dataCallbacks.forEach((callback) => callback(this.#data))
    }
    deleteKey(key) {
        log.debug(this.filename, "deleteKey(", key, ")", this.#data)
        if (!this.#keyCallbacks[key]) { this.#keyCallbacks[key] = [] }
        this.#keyCallbacks[key].forEach((callback) => callback(undefined))
        delete this.#data[key]
        // delete this.#keyCallbacks[key] // deletes the callback before running callback(undefined)
    }

    subKey(key, callback) {
        if (!this.#keyCallbacks[key]) { this.#keyCallbacks[key] = [] }
        this.#keyCallbacks[key].push(callback)
        callback(this.#data[key])
    }
    unsubKey(key, callback) {
        if (!this.#keyCallbacks[key]) return
        this.#keyCallbacks[key] = this.#keyCallbacks[key].filter((cb) => cb !== callback)
    }
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
        return error
    }
}
