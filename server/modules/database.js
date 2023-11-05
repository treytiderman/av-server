// Overview: simple local JSON database to maintain state

// Imports
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import fs from 'fs/promises'
import { Logger } from './logger.js'
import { getStats, makeDir } from "./files.js";

// Exports
export {
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
const databaseList = {}

// Functions
function getDatabase(name) {
    if (!databaseList[name]) {
        log.error(`getDatabase("${name}") -> "error database doesn't exist"`)
        throw new Error("error database doesn't exist")
    }
    log.debug(`getDatabase("${name}") -> "ok"`, databaseList[name].data)
    return databaseList[name].data
}
async function createDatabase(name, defaultData = {}) {
    const path = `${PATH_TO_DATABASE_FOLDER}/${name}.json`
    const adapter = new JSONFile(path)
    const db = new Low(adapter, defaultData || {})
    await db.read()
    db.defaultData = JSON.parse(JSON.stringify(defaultData || {}))
    db.path = path
    databaseList[name] = db
    await db.write()
    log.debug(`createDatabase("${name}", defaultData) -> "ok"`, {"defaultData": defaultData})
    return db
}
async function writeDatabase(name) {
    if (!databaseList[name]) {
        log.error(`writeDatabase("${name}") -> "error database doesn't exist"`)
        throw new Error("error database doesn't exist")
    }
    await databaseList[name].write()
    log.debug(`writeDatabase("${name}") -> "ok"`)
    return databaseList[name]
}
async function deleteDatabase(name) {
    if (!databaseList[name]) {
        log.error(`getDatabase("${name}") -> "error database doesn't exist"`)
        throw new Error("error database doesn't exist")
    }
    const path = databaseList[name].path
    delete databaseList[name]
    await fs.rm(path)
    log.debug(`deleteDatabase("${name}") -> "ok"`)
    return "ok"
}
async function resetDatabase(name) {
    if (!databaseList[name]) {
        log.error(`resetDatabase("${name}") -> "error database doesn't exist"`)
        throw new Error("error database doesn't exist")
    }
    const defaultData = databaseList[name].defaultData
    await deleteDatabase(name)
    const db = await createDatabase(name, defaultData)
    log.debug(`resetDatabase("${name}") -> "ok"`)
    return db
}

function getKeyInDatabase(name, key) {
    if (!databaseList[name]) {
        log.error(`getKeyInDatabase("${name}", "${key}") -> "error database doesn't exist"`)
        throw new Error("error database doesn't exist")
    }
    log.debug(`getKeyInDatabase("${name}", "${key}") -> ${databaseList[name].data[key]}`)
    return databaseList[name].data[key]
}
function setKeyInDatabase(name, key, value) {
    if (!databaseList[name]) {
        log.error(`setKeyInDatabase("${name}", "${key}", "${value}") -> "error database doesn't exist"`)
        throw new Error("error database doesn't exist")
    }
    databaseList[name].data[key] = value
    log.debug(`setKeyInDatabase("${name}", "${key}", "${value}") -> ${getKeyInDatabase(name, key)}`)
    return getKeyInDatabase(name, key)
}
async function setAndWriteKeyInDatabase(name, key, value) {
    if (!databaseList[name]) {
        log.error(`setAndWriteKeyInDatabase("${name}", "${key}", "${value}") -> "error database doesn't exist"`)
        throw new Error("error database doesn't exist")
    }
    databaseList[name].data[key] = value
    await databaseList[name].write()
    log.debug(`setAndWriteKeyInDatabase("${name}", "${key}", "${value}") -> ${getKeyInDatabase(name, key)}`)
    return getKeyInDatabase(name, key)
}
function deleteKeyInDatabase(name, key) {
    if (!databaseList[name]) {
        log.debug(`deleteKeyInDatabase("${name}", "${key}")`, databaseList[name].data[key])
        throw new Error("error database doesn't exist")
    }
    delete databaseList[name].data[key]
    log.debug(`deleteKeyInDatabase("${name}", "${key}") -> ${getKeyInDatabase(name, key)}`)
    return getKeyInDatabase(name, key)
}

function getDatabaseNames() {
    log.debug(`getDatabaseNames() -> ${Object.keys(databaseList)}`, Object.keys(databaseList))
    return Object.keys(databaseList)
}
async function deleteDatabases() {
    const databaseNameList = getDatabaseNames()
    log.info(`deleteDatabases()`, databaseNameList)
    for (const name in databaseNameList) {
        await deleteDatabase(name)
    }
}
async function getDatabaseFiles() {
    const files = await getStats(PATH_TO_DATABASE_FOLDER)
    if (!files) return []
    const fileNames = files.contains_files.map(file => { return file.file_name })
    log.debug(`getDatabaseFiles()`, fileNames)
    return fileNames
}

// Startup
await makeDir(PATH_TO_DATABASE_FOLDER)
// const fileNames = await getDatabaseFiles()
// fileNames.forEach(fileName => createDatabase(fileName.replace(".json", "")))
