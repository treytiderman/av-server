// Imports
import * as logger from '../modules/logger.js'

// Functions
export async function test() {
    let pass = true
    let obj = { key: "value" }

    // Tests
    logger.debug("modules/logger.js", "test debug level log message", obj)
    logger.info("modules/logger.js", "test info level log message", obj)
    logger.error("modules/logger.js", "test error level log message", obj)

    return pass
}
