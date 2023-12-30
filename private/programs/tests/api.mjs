// Send
const obj = { path: "v1/system/time/get/", body: {} }
const json = JSON.stringify(obj)
process.stdout.write(Buffer.from(json) + '\r\n')

// Receive
process.stdin.on("data", eventHandler)
function eventHandler(buffer) {
    const data = buffer.toString()

    // Is JSON?
    try { JSON.parse(data) }
    catch (error) { return }
    const obj = JSON.parse(data)

    // Is Path?
    const path = obj.path
    const body = obj.body
    if (path === "v1/system/time/get/") {
        process.stdin.removeListener("data", eventHandler)
        console.log(body)
    }
}
