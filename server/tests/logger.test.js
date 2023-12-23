// Imports
import * as logger from '../modules/logger.js'


// Functions
export async function test() {
    let pass = true
    let obj = { key: "value" }

    // Tests
    const log = new logger.Logger("modules/logger.js")
    log.debug("test debug level log message", obj)
    log.info("test info level log message", obj)
    log.warn("test error level log message", obj)
    log.error("test error level log message", obj)

    const add = (a, b) => a + b
    log.call(add)(3, 6)

    return pass
}
