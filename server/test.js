// Imports
import * as log from './core/logger-v0.js'
// import * as db from '../modules/database.js'
import * as db from './core/database-v1.js'

// Test Lib
import * as api_v1 from "./core/api-v1.test.js";
import * as auth_v0 from "./core/auth-v0.test.js";
import * as database_v1 from "./core/database-v1.test.js";
// import * as files_v1 from "./core/file-v0.test.js";
import * as logger_v0 from "./core/logger-v0.test.js";
// import * as serial_v1 from "./core/serial-v1.test.js";
import * as system_v1 from "./core/system-v1.test.js";
import * as user_v1 from "./core/user-v1.test.js";

// Test Module
import * as program_v1 from "./modules/program-v1.test.js";
// import * as tcpClient_v1 from "./core/tcp-client-v1.test.js";

// Functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
async function test(name, func) {
    log.info("test.js", `run "${name}" tests...`)
    const results = await func()
    if (results === true) {
        log.info("test.js", `results of "${name}" tests: "pass"`)
    } else {
        log.error("test.js", `results of "${name}" tests: "fail"`)
        if (results !== true) console.log(name, '\x1b[31mTESTS FAILED\x1b[0m')
    }
    return results
}

// Run Tests
if (process.env.DEV_MODE) {
    // await db.removeAll()
    await log.deleteLogs()
    await sleep(2000)
    log.info("test.js", "DEV_MODE environment variable set to true")

    // Tests
    await test("api_v1", api_v1.test)
    await test("auth_v0", auth_v0.test)
    await test("database_v1", database_v1.test)
    // await test("files_v1", files_v1)
    await test("logger_v0", logger_v0.test)
    await test("program_v1", program_v1.test)
    // await test("serial_v1", serial_v1)
    await test("system_v1", system_v1.test)
    // await test("tcpClient_v1", tcpClient_v1)
    await test("user_v1", user_v1.test)

    log.info("test.js", "all tests are complete")
}
