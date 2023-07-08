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
    getDatabase,
    saveDatabase,
    deleteDatabase,
    resetDatabase,
}

// Constants
const PATH_TO_DATABASE_FOLDER = "../database" // ~/av-server/database

// Variables
const databaseList = {}

// Functions
async function getDatabase(name, defaultData = {}) {
    const path = `${PATH_TO_DATABASE_FOLDER}/${name}.json`
    const adapter = new JSONFile(path)
    const db = new Low(adapter, defaultData)
    await db.read()
    db.defaultData = JSON.parse(JSON.stringify(defaultData))
    db.path = path
    databaseList[name] = db
    return db
}
async function saveDatabase(name) {
    if (!databaseList[name]) return
    await databaseList[name].write()
    return databaseList[name]
}
async function deleteDatabase(name) {
    if (!databaseList[name]) return
    try { await fs.rm(databaseList[name].path) }
    catch (error) { return error }
    delete databaseList[name]
}
async function resetDatabase(name) {
    if (!databaseList[name]) return
    const defaultData = databaseList[name].defaultData
    await deleteDatabase(name)
    const db = await getDatabase(name, defaultData)
    return db
}
// async function setKeyInDatabase(name, key, value) {}
// async function getKeyInDatabase(name, key) {}

// Tests
if (process.env.DEV_MODE) await runTests("state.js")
async function runTests(testName) {
    let pass = true

    const db1 = await getDatabase("test-database-1")
    db1.data.list = []
    db1.data.list.push("apple")
    db1.data.list.push("banana")
    await saveDatabase("test-database-1")
    await deleteDatabase("test-database-1")
    
    const defaultState = { num: 72, array: [1, 2] }
    let db2 = await getDatabase("test-database-2", defaultState)
    
    if (db2.data.num !== 72) pass = false
    db2.data.num = 42
    if (db2.data.num !== 42) pass = false
    if (db2.defaultData.num !== 72) pass = false

    if (db2.data.array.length !== 2) pass = false
    db2.data.array.shift()
    if (db2.data.array.length !== 1) pass = false
    if (db2.defaultData.array.length !== 2) pass = false

    await saveDatabase("test-database-2")

    db2 = await resetDatabase("test-database-2")

    if (db2.data.num !== 72) pass = false
    db2.data.num = 42
    if (db2.data.num !== 42) pass = false
    if (db2.defaultData.num !== 72) pass = false

    if (db2.data.array.length !== 2) pass = false
    db2.data.array.shift()
    if (db2.data.array.length !== 1) pass = false
    if (db2.defaultData.array.length !== 2) pass = false

    await deleteDatabase("test-database-2")

    if (pass !== true) console.log(testName, '\x1b[31mTESTS FAILED\x1b[0m')
}
