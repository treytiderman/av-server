// Imports
import * as log from './logger-v0.js'
// import * as db from '../modules/database.js'
import * as db from './database-v1.js'

import * as api_v1 from "./api-v1.test.js";
import * as auth_v0 from "./auth-v0.test.js";
import * as database_v1 from "./database-v1.test.js";
// import * as files_v1 from "./files-v1.test.js";
import * as logger_v0 from "./logger-v0.test.js";
// import * as programs_v1 from "./programs-v1.test.js";
// import * as serial_v1 from "./serial-v1.test.js";
import * as system_v1 from "./system-v1.test.js";
// import * as tcpClient_v1 from "./tcp-client-v1.test.js";
import * as user_v1 from "./user-v1.test.js";

// Functions
async function test(name, obj) {
    log.info("run.test.js", `run "${name}" tests...`)
    const results = await obj.test()
    if (results === true) {
        log.info("run.test.js", `results of "${name}" tests: "pass"`)
    } else {
        log.error("run.test.js", `results of "${name}" tests: "fail"`)
        if (results !== true) console.log(name, '\x1b[31mTESTS FAILED\x1b[0m')
    }
    return results
}
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Run Tests
if (process.env.DEV_MODE) {
    // crashes await db.removeAll()
    await log.deleteLogs()
    await sleep(2000)
    log.info("run.test.js", "DEV_MODE environment variable set to true")

    // Tests
    await test("api_v1", api_v1)
    await test("auth_v0", auth_v0)
    await test("database_v1", database_v1)
    // await test("files_v1", files_v1)
    await test("logger_v0", logger_v0)
    // await test("programs_v1", programs_v1)
    // await test("serial_v1", serial_v1)
    await test("system_v1", system_v1)
    // await test("tcpClient_v1", tcpClient_v1)
    await test("user_v1", user_v1)

    log.info("run.test.js", "all tests are complete")
}
