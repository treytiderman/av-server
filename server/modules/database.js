// Overview: simple local JSON database to maintain state

// Imports
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { Logger } from './logger.js'
import { EventEmitter } from 'events'
import { makeDir, deleteFile } from "./files.js";

// Exports
export {
    emitter, // create, delete, reset, names, data, key, error

    createDatabase,
    getDatabase,
    writeDatabase,
    deleteDatabase,
    resetDatabase,

    getKeyInDatabase,
    setKeyInDatabase,
    setAndWriteKeyInDatabase,
    deleteKeyInDatabase,

    getDatabaseNames,
    deleteDatabases,
}

// Constants
const PATH_TO_DATABASE_FOLDER = "../private/databases" // ~/av-server/private/database

// Variables
const log = new Logger("modules/database.js")
const emitter = new EventEmitter()
const databaseList = {}

// Startup
await makeDir(PATH_TO_DATABASE_FOLDER)

// Functions
function getDatabase(name) {
    if (!databaseList[name]) {
        const error = `error database "${name}" doesn't exist`
        log.error(`getDatabase("${name}") -> ${error}`)
        return error
    }
    // log.debug(`getDatabase("${name}") -> "ok"`, databaseList[name].data)
    return databaseList[name].data
}
async function createDatabase(name, defaultData = {}) {
    const path = `${PATH_TO_DATABASE_FOLDER}/${name}.json`
    let db
    try {
        const adapter = new JSONFile(path)
        db = new Low(adapter, defaultData || {})
        await db.read()
        db.defaultData = JSON.parse(JSON.stringify(defaultData || {}))
        db.path = path
        databaseList[name] = db
        emitter.emit('create', name, defaultData)
        emitter.emit('data', name, defaultData)
        emitter.emit('names', getDatabaseNames())
        await db.write()
        log.debug(`createDatabase("${name}", defaultData) -> "ok"`, {"defaultData": defaultData})
    } catch (error) {
        log.debug(`createDatabase("${name}", defaultData) -> ${error.message}`, error)
        return error.message
    }
    return db
}
async function writeDatabase(name) {
    if (!databaseList[name]) {
        const error = `error database "${name}" doesn't exist`
        log.error(`writeDatabase("${name}") -> ${error}`)
        return error
    }
    await databaseList[name].write()
    log.debug(`writeDatabase("${name}") -> "ok"`)
    return "ok"
}
async function deleteDatabase(name) {
    if (!databaseList[name]) {
        const error = `error database "${name}" doesn't exist`
        log.error(`deleteDatabase("${name}") -> ${error}`)
        return error
    }
    const path = databaseList[name].path
    delete databaseList[name]
    await deleteFile(path)
    emitter.emit('delete', name)
    emitter.emit('data', name, {})
    emitter.emit('names', getDatabaseNames())
    log.debug(`deleteDatabase("${name}") -> "ok"`)
    return "ok"
}
async function resetDatabase(name) {
    if (!databaseList[name]) {
        const error = `error database "${name}" doesn't exist`
        log.error(`resetDatabase("${name}") -> ${error}`)
        return error
    }
    const defaultData = databaseList[name].defaultData
    await deleteDatabase(name)
    const db = await createDatabase(name, defaultData)
    emitter.emit('reset', name, defaultData)
    emitter.emit('data', name, defaultData)
    log.debug(`resetDatabase("${name}") -> "ok"`)
    return db
}

function getKeyInDatabase(name, key) {
    if (!databaseList[name]) {
        const error = `error database "${name}" doesn't exist`
        log.error(`getKeyInDatabase("${name}, "${key}") -> ${error}`)
        return error
    }
    // log.debug(`getKeyInDatabase("${name}", "${key}") -> ${databaseList[name].data[key]}`)
    return databaseList[name].data[key]
}
function setKeyInDatabase(name, key, value) {
    if (!databaseList[name]) {
        const error = `error database "${name}" doesn't exist`
        log.error(`setKeyInDatabase("${name}, "${key}", "${value}") -> ${error}`)
        return error
    }
    databaseList[name].data[key] = value
    emitter.emit('key', name, key, value)
    emitter.emit('data', name, databaseList[name].data)
    log.debug(`setKeyInDatabase("${name}", "${key}", "${value}") -> ${getKeyInDatabase(name, key)}`)
    return getKeyInDatabase(name, key)
}
async function setAndWriteKeyInDatabase(name, key, value) {
    if (!databaseList[name]) {
        const error = `error database "${name}" doesn't exist`
        log.error(`setAndWriteKeyInDatabase("${name}, "${key}", "${value}") -> ${error}`)
        return error
    }
    databaseList[name].data[key] = value
    await databaseList[name].write()
    emitter.emit('key', name, key, value)
    emitter.emit('data', name, databaseList[name].data)
    log.debug(`setAndWriteKeyInDatabase("${name}", "${key}", "${value}") -> ${getKeyInDatabase(name, key)}`)
    return getKeyInDatabase(name, key)
}
function deleteKeyInDatabase(name, key) {
    if (!databaseList[name]) {
        const error = `error database "${name}" doesn't exist`
        log.error(`deleteKeyInDatabase("${name}, "${key}") -> ${error}`)
        return error
    }
    delete databaseList[name].data[key]
    log.debug(`deleteKeyInDatabase("${name}", "${key}") -> ${getKeyInDatabase(name, key)}`)
    emitter.emit('key', name, key, "")
    emitter.emit('data', name, databaseList[name].data)
    return getKeyInDatabase(name, key)
}

function getDatabaseNames() {
    // log.debug(`getDatabaseNames() -> ${Object.keys(databaseList)}`, Object.keys(databaseList))
    return Object.keys(databaseList)
}
async function deleteDatabases() {
    const databaseNameList = getDatabaseNames()
    log.info(`deleteDatabases()`, databaseNameList)
    for (const name in databaseNameList) {
        await deleteDatabase(name)
    }
}
