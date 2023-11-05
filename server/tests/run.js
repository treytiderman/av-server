// Imports
import * as log from '../modules/logger.js'
import * as api from "./api.test.js";
import * as database from "./database.test.js";
import * as files from "./files.test.js";
import * as logger from "./logger.test.js";
import * as serial from "./serial.test.js";
import * as system from "./system.test.js";
import * as tcpClient from "./tcp-client.test.js";
import * as user from "./user.test.js";

// Run Tests
if (process.env.DEV_MODE) {
    await log.deleteLogs()
    log.info("tests/run.js", "DEV_MODE environment variable set to true")
    
    // Tests
    await test("api", api)
    await test("database", database)
    await test("files", files)
    await test("logger", logger)
    await test("serial", serial)
    await test("system", system)
    await test("tcpClient", tcpClient)
    await test("user", user)

    log.info("tests/run.js", "complete")
}

// Functions
async function test(name, obj) {
    log.debug("tests/run.js", `run "${name}" tests...`)
    const results = await obj.test()
    log.debug("tests/run.js", `results of "${name}" tests: ${results ? "ok" : "error"}`)
    if (results !== true) console.log(name, '\x1b[31mTESTS FAILED\x1b[0m')
    return results
}
