// Imports
import * as logger from './logger-v0.js'
import * as system from './system-v1.js'

// Functions
export async function test() {
    let pass = true

    // Tests
    await logger.call("system-v1.test.js", system.time.get, "time.get")()
    await logger.call("system-v1.test.js", system.uptime.get, "time.get")()
    await logger.call("system-v1.test.js", system.info.get, "time.get")()

    return pass
}
