// Imports
import * as log from '../modules/logger.js'
import * as db from '../modules/database.js'

import * as api from "./api.test.js";
import * as auth from "./auth.test.js";
import * as database_v1 from "./database-v1.test.js";
import * as files from "./files.test.js";
import * as logger from "./logger.test.js";
import * as programs from "./programs.test.js";
import * as serial from "./serial.test.js";
import * as system from "./system.test.js";
import * as tcpClient from "./tcp-client.test.js";
import * as user_v1 from "./user-v1.test.js";

// Run Tests
if (process.env.DEV_MODE) {
    await db.deleteDatabases()
    await log.deleteLogs()
    await sleep(2000)
    log.info("tests/run.js", "DEV_MODE environment variable set to true")
    
    // Tests
    await test("api", api)
    await test("auth", auth)
    await test("database_v1", database_v1)
    await test("files", files)
    await test("logger", logger)
    await test("programs", programs)
    await test("serial", serial)
    await test("system", system)
    await test("tcpClient", tcpClient)
    await test("user_v1", user_v1)

    log.info("tests/run.js", "complete")
}

// Functions
async function test(name, obj) {
    log.info("tests/run.js", `run "${name}" tests...`)
    const results = await obj.test()
    if (results === true) {
        log.info("tests/run.js", `results of "${name}" tests: "pass"`)
    } else {
        log.error("tests/run.js", `results of "${name}" tests: "fail"`)
        if (results !== true) console.log(name, '\x1b[31mTESTS FAILED\x1b[0m')
    }
    return results
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
