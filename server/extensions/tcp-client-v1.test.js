// Imports
import * as tm from '../extensions/tcp-client-v1.js'

// Functions
export async function test() {
    let pass = true
    let response = {}

    // Tests
    response = false
    if (response) pass = false

    return pass
}

// Manual Testing
// setTimeout(manualTest1, 1000);
async function manualTest1() {

    // Connect
    const address = "192.168.1.9:23"
    await tm.log.client.open(address)

    // Echo
    tm.data.sub(address, obj => {
        if (obj.wasReceived) {
            tm.log.client.send(address, obj.data)
        }
    })
    
    // On Open
    tm.client.sub(address, onOpen)
    function onOpen(status) {
        if (status.isOpen) {
            tm.log.client.send(address, "hey")
        }
    }

    // Close
    setTimeout(async () => {
        tm.client.unsub(address, onOpen)
        await tm.log.client.close(address)
    }, 2000);

}
