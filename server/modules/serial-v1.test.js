// Imports
import * as serial from './serial-v0.js'

// Functions
export async function test() {
    let pass = true
    let response = false

    // Tests
    response = await serial.open("/dev/ttyUSB0", 9600, "ascii", "\r")
    if (response !== "ok") pass = false

    response = await serial.send("/dev/ttyUSB0", "yo", "ascii")

    setTimeout(() => {
        console.log()
        response = serial.send("/dev/ttyUSB0", "\\x79\\x6f", "hex")
    }, 500);

    return pass
}
