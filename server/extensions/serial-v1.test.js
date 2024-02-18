// Imports
import * as sm from './serial-v1.js'

// Functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
export async function test() {
    let pass = true
    let response = false

    // Tests
    await sleep(1000)
    response = sm.available.get()
    console.log(response);
    
    // response = await sm.log.port.open("COM3")
    // console.log(response);
    // await sleep(1000)
    
    // response = await sm.log.port.send("COM3", "data")
    // console.log(response);

    return pass
}
