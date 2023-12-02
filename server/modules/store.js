import fs from 'fs/promises'

export {
    Store,
    deleteAll,
    isObject,
    STORAGE_PATH
}

const DEBUG = false
const STORAGE_PATH = "./json/"
function log(...params) { if (DEBUG) console.log(...params) }

// Class
class Store {
    #data
    #defaultData
    #keyCallbacks
    #dataCallbacks

    constructor(fileName) {
        this.fileName = fileName
        this.path = STORAGE_PATH + fileName + ".json"

        // Private variables
        this.#data = {}
        this.#defaultData = {}
        this.#keyCallbacks = {}
        this.#dataCallbacks = []
    }

    async create(defaultData) {
        if (isObject(defaultData) === false) defaultData = {}
        this.#defaultData = clone(defaultData)
        const store = await readJson(this.path)
        if (store) {
            for (const key in store) { this.#keyCallbacks[key] = [] }
            this.#data = store
        } else {
            for (const key in defaultData) { this.#keyCallbacks[key] = [] }
            this.#data = defaultData
            await this.write()
        }
        log(this.fileName, "create(", defaultData, ")", this.#data)
        return store
    }
    async write() {
        log(this.fileName, "write()", this.path, this.#data)
        return await writeJson(this.path, this.#data)
    }
    async delete() {
        this.#data = {}
        this.#defaultData = {}
        this.#keyCallbacks = {}
        this.#dataCallbacks = []
        log(this.fileName, "delete()", this.path)
        return await deleteFile(this.path)
    }
    
    getKeys() {
        return Object.keys(this.#data)
    }
    getData() {
        return this.#data
    }
    setData(object = {}) {
        for (const key in this.#data) {
            if (!object[key]) this.deleteKey(key)
        }
        this.#data = clone(object)
        log(this.fileName, "setData(", object, ")", this.#data)
        this.#dataCallbacks.forEach((callback) => callback(this.#data))
        for (const key in this.#data) {
            if (!this.#keyCallbacks[key]) { this.#keyCallbacks[key] = [] }
            this.#keyCallbacks[key].forEach((callback) => callback(this.#data[key]))
        }
    }
    resetData() {
        log(this.fileName, "resetData()", this.#defaultData);
        this.setData(this.#defaultData)
    }
    
    subData(callback) {
        this.#dataCallbacks.push(callback)
        callback(this.#data)
    }
    unsubData(callback) {
        this.#dataCallbacks = this.#dataCallbacks.filter((cb) => cb !== callback)
    }
    
    getKey(key) {
        return this.#data[key]
    }
    setKey(key, value = "") {
        log(this.fileName, "setKey(", key, value, ")", this.#data)
        this.#data[key] = clone(value)
        if (!this.#keyCallbacks[key]) { this.#keyCallbacks[key] = [] }
        this.#keyCallbacks[key].forEach((callback) => callback(value))
        this.#dataCallbacks.forEach((callback) => callback(this.#data))
    }
    deleteKey(key) {
        log(this.fileName, "deleteKey(", key, ")", this.#data)
        if (!this.#keyCallbacks[key]) { this.#keyCallbacks[key] = [] }
        this.#keyCallbacks[key].forEach((callback) => callback(undefined))
        delete this.#data[key]
        // delete this.#keyCallbacks[key]
    }

    subKey(key, callback) {
        if (!this.#keyCallbacks[key]) { this.#keyCallbacks[key] = [] }
        this.#keyCallbacks[key].push(callback)
        callback(this.#data[key])
    }
    unsubKey(key, callback) {
        if (!this.#keyCallbacks[key]) { this.#keyCallbacks[key] = [] }
        this.#keyCallbacks[key] = this.#keyCallbacks[key].filter((cb) => cb !== callback)
    }
}

// Functions
async function deleteAll() {
    await deleteFolder(STORAGE_PATH)
}

// Helper Functions
function clone(obj) {
    return JSON.parse(JSON.stringify(obj))
}
function isObject(obj) {
    return typeof obj === 'object' && !Array.isArray(obj) && obj !== null
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
