// Overview: simple local JSON database to maintain state

// Todos
// Add function setKeyInDatabase
// Add function getKeyInDatabase

// Imports
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import fs from 'fs/promises'

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
const PATH_TO_DATABASE_FOLDER = "../database" // ~/av-server/database

// Variables
const databaseList = {}

// Functions
function getDatabase(name) {
    if (!databaseList[name]) throw new Error("error database doesn't exist")
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
    return db
}
async function writeDatabase(name) {
    if (!databaseList[name]) throw new Error("error database doesn't exist")
    await databaseList[name].write()
    return databaseList[name]
}
async function deleteDatabase(name) {
    if (!databaseList[name]) throw new Error("error database doesn't exist")
    const path = databaseList[name].path
    delete databaseList[name]
    await fs.rm(path)
    return "ok"
}
async function resetDatabase(name) {
    if (!databaseList[name]) reject(new Error("error database doesn't exist"))
    const defaultData = databaseList[name].defaultData
    await deleteDatabase(name)
    const db = await createDatabase(name, defaultData)
    return db
}

function getKeyInDatabase(name, key) {
    if (!databaseList[name]) throw new Error("error database doesn't exist")
    return databaseList[name].data[key]
}
function setKeyInDatabase(name, key, value) {
    if (!databaseList[name]) throw new Error("error database doesn't exist")
    databaseList[name].data[key] = value
    return getKeyInDatabase(name, key)
}
async function setAndWriteKeyInDatabase(name, key, value) {
    if (!databaseList[name]) throw new Error("error database doesn't exist")
    databaseList[name].data[key] = value
    await databaseList[name].write()
    return getKeyInDatabase(name, key)
}
function deleteKeyInDatabase(name, key) {
    if (!databaseList[name]) throw new Error("error database doesn't exist")
    delete databaseList[name].data[key]
    return getKeyInDatabase(name, key)
}

function getDatabaseNames() {
    return Object.keys(databaseList)
}
async function deleteDatabases() {
    const databaseNameList = getDatabaseNames()
    for (const name in databaseNameList) {
        await deleteDatabase(name)
    }
}

// Tests
if (process.env.DEV_MODE) await runTests("state.js")
async function runTests(testName) {
    let pass = true

    const db1 = await createDatabase("test-database-1")
    db1.data.list = []
    db1.data.list.push("apple")
    db1.data.list.push("banana")
    await writeDatabase("test-database-1")
    await deleteDatabase("test-database-1")
    
    const defaultState = { num: 72, array: [1, 2] }
    let db2 = await createDatabase("test-database-2", defaultState)
    
    if (db2.data.num !== 72) pass = false
    setKeyInDatabase("test-database-2", "num", 42)
    if (db2.data.num !== 42) pass = false
    if (getKeyInDatabase("test-database-2", "num") !== 42) pass = false
    if (db2.defaultData.num !== 72) pass = false

    if (db2.data.array.length !== 2) pass = false
    db2.data.array.shift()
    if (db2.data.array.length !== 1) pass = false
    if (db2.defaultData.array.length !== 2) pass = false

    await writeDatabase("test-database-2")

    db2 = await resetDatabase("test-database-2")

    if (db2.data.num !== 72) pass = false
    db2.data.num = 42
    if (db2.data.num !== 42) pass = false
    deleteKeyInDatabase("test-database-2", "num")
    if (db2.data.num) pass = false
    if (db2.defaultData.num !== 72) pass = false

    if (db2.data.array.length !== 2) pass = false
    db2.data.array.shift()
    if (db2.data.array.length !== 1) pass = false
    if (db2.defaultData.array.length !== 2) pass = false

    await deleteDatabase("test-database-2")

    if (pass !== true) console.log(testName, '\x1b[31mTESTS FAILED\x1b[0m')
}
