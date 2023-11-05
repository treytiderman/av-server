// Imports
import * as system from '../modules/system.js'
import * as logger from '../modules/logger.js'

// Functions
export async function test() {
    let pass = true
    let response = {}

    // Tests
    logger.debug("modules/system.js", `getTime() -> ${system.getTime()}`)
    logger.debug("modules/system.js", `getTimeAsISO() -> ${system.getTimeAsISO()}`)
    logger.debug("modules/system.js", `getUptime() -> ${system.getUptime()}`)
    logger.debug("modules/system.js", `getSystemInfo() -> hostname: ${system.getSystemInfo().hostname}`)
    
    return pass
}
