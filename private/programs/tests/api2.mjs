// Get Time
const time = await send("v1/system/time/get/")
console.log(time)

// Sub Uptime for 4 seconds
const unsubscribeUptime = subscribe("v1/system/uptime/sub/", uptime => {
    console.log(uptime)
})
await sleep(4000)
unsubscribeUptime()

// Await Sleep Function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// Api Send Function
function send(path, body = {}) {

    // Send
    const json = JSON.stringify({ path: path, body: body })
    process.stdout.write(Buffer.from(json) + '\r\n')
    
    // Receive
    return new Promise((resolve, reject) => {

        // New Data Handler
        function eventHandler(buffer) {

            // Is JSON?
            const data = buffer.toString()
            try { JSON.parse(data) }
            catch (error) { return }
            
            // Is Path?
            const obj = JSON.parse(data)
            if (obj.path !== path) return
            
            // Stop listening and resolve the Promise
            process.stdin.removeListener("data", eventHandler)
            resolve(obj.body)
        }

        // Listen for new data events
        process.stdin.on("data", eventHandler)
    })
}

// Api Subscribe Function
function subscribe(path, callback = () => {}) {

    // Send
    const json = JSON.stringify({ path: path })
    process.stdout.write(Buffer.from(json) + '\r\n')

    // Unsubscribe
    function unsubscribe() {
        send(path.replace("/sub/", "/unsub/"))
        process.stdin.removeListener("data", eventHandler)
    }

    // New Data Handler
    function eventHandler(buffer) {

        // Is JSON?
        const data = buffer.toString()
        try { JSON.parse(data) }
        catch (error) { return }

        // Is Path or Pub Path?
        const obj = JSON.parse(data)
        const pubPath = path.replace("/sub/", "/pub/")
        if (obj.path !== path && obj.path !== pubPath) return

        // Resolve the Promise
        callback(obj.body)
    }

    // Listen for new data events
    process.stdin.on("data", eventHandler)

    // Return the unsubscribe function
    return unsubscribe
}
