// Imports
import * as system from '../modules/system.js'

// Functions
export async function test() {
    let pass = true
    let response = {}

    // Tests
    response = system.getSystemInfo()
    response = system.getTime()
    response = system.getTimeAsISO()
    response = system.getUptime()

    return pass
}
