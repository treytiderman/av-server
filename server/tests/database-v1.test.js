// Imports
import * as database from '../modules/database-v1.js'

// Functions
export async function test() {
    let pass = true
    let response = {}
    
    // Tests
    await database.remove("test-file-dafe-to-delete")

    const db = new database.Database("test-file-dafe-to-delete")
    await db.create({key: "val"})

    response = await db.get()
    if (response.key !== "val") pass = false
    
    response = await db.getKey("key")
    if (response !== "val") pass = false
    
    response = await db.set({key2: "val2"})
    if (response !== "ok") pass = false
    
    response = await db.write()
    if (response !== "ok") pass = false
    
    response = await db.getKey("key2")
    if (response !== "val2") pass = false
    
    response = await db.setKey("key2", "val3")
    if (response !== "ok") pass = false
    
    response = await db.getKey("key2")
    if (response !== "val3") pass = false
    
    response = await db.reset()
    if (response !== "ok") pass = false
    
    response = await db.keys()
    if (response[0] !== "key") pass = false

    response = await db.setKey("key4", "val4")
    if (response !== "ok") pass = false
    
    response = await db.removeKey("key")
    if (response !== "ok") pass = false
    
    response = await db.getKey("key")
    if (response !== undefined) pass = false
    
    response = await db.remove()
    if (response !== "ok") pass = false

    return pass
}
