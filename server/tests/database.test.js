// Imports
import * as db from '../modules/database.js'

// Functions
export async function test() {
    let pass = true
    let response = {}

    // Tests
    // const db1 = await createDatabase("test-database-1")
    // db1.data.list = []
    // db1.data.list.push("apple")
    // db1.data.list.push("banana")

    // try {
    //     getDatabase()
    //     pass = false
    // } catch (error) {
    //     if (!error.message.startsWith("error")) pass = false
    // }

    // try {
    //     getDatabase("taco")
    //     pass = false
    // } catch (error) {
    //     if (!error.message.startsWith("error")) pass = false
    // }

    // try {
    //     const db3 = getDatabase("test-database-1")
    //     if (db3.list.length !== 2) pass = false
    // } catch (error) {
    //     if (error.message.startsWith("error")) pass = false
    // }

    // try {
    //     await deleteDatabase("test-database-1")
    // } catch (error) {
    //     if (error.message.startsWith("error")) pass = false
    // }

    // try {
    //     await deleteDatabase("test-database-1")
    // } catch (error) {
    //     if (!error.message.startsWith("error")) pass = false
    // }

    const defaultState = { num: 72, array: [1, 2] }
    let db2 = await db.createDatabase("test-database-2", defaultState)
    
    // if (db2.data.num !== 72) pass = false
    // setKeyInDatabase("test-database-2", "num", 42)
    // if (db2.data.num !== 42) pass = false
    // if (getKeyInDatabase("test-database-2", "num") !== 42) pass = false
    // if (db2.defaultData.num !== 72) pass = false

    // if (db2.data.array.length !== 2) pass = false
    // db2.data.array.shift()
    // if (db2.data.array.length !== 1) pass = false
    // if (db2.defaultData.array.length !== 2) pass = false

    // await writeDatabase("test-database-2")

    // db2 = await resetDatabase("test-database-2")

    // if (db2.data.num !== 72) pass = false
    // db2.data.num = 42
    // if (db2.data.num !== 42) pass = false
    // deleteKeyInDatabase("test-database-2", "num")
    // if (db2.data.num) pass = false
    // if (db2.defaultData.num !== 72) pass = false

    // if (db2.data.array.length !== 2) pass = false
    // db2.data.array.shift()
    // if (db2.data.array.length !== 1) pass = false
    // if (db2.defaultData.array.length !== 2) pass = false

    await db.deleteDatabase("test-database-2")

    return pass
}
