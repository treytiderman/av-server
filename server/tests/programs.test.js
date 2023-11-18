// Imports
import * as programs from '../modules/programs.js'

// Functions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export async function test() {
    let pass = true
    let response = {}

    // Events
    programs.emitter.on("available", (obj) => {
        // console.log("available", obj)
    })
    programs.emitter.on("status", (name, obj) => {
        // console.log("status", name, obj)
    })
    programs.emitter.on("status-all", (array) => {
        // console.log("status-all", array)
    })
    programs.emitter.on("data", (name, obj) => {
        // console.log("data", name, obj.data)
    })
    programs.emitter.on("history", (name, array) => {
        // console.log("history", name, array)
    })

    // Tests
    response = programs.splitByWhitespace("1  jkhgakfger-=[];,/.,/`163-9 ef   whfiwheifhbwe fwef")
    if (response[2] !== "ef") pass = false
    response = programs.splitByWhitespace("one")
    if (response[0] !== "one" || response.length !== 1) pass = false

    programs.removeAll()

    // Program 0 - fakeProg
    response = programs.start("fakeProg")
    if (!response.startsWith("error ")) pass = false
    response = programs.send("0", "420")
    if (!response.startsWith("error ")) pass = false

    // Program 1 - node log.js
    response = programs.create("1", `${programs.PATH}/tests`, "node log.js")
    if (response !== "ok") pass = false
    response = programs.start("1")
    if (response !== "ok") pass = false

    // Program 2 - node interval.js
    response = programs.create("2", `${programs.PATH}/tests`, "node interval.js")
    if (response !== "ok") pass = false
    response = programs.start("2")
    if (response !== "ok") pass = false
    await sleep(300)
    programs.restart("2")
    await sleep(300)
    if (programs.status("2").running === false) pass = false
    programs.kill("2")
    if (programs.status("2").running === true) pass = false

    // Program 3 - python3 log.py
    response = programs.create("3", `${programs.PATH}/tests`, "python3 log.py")
    if (response !== "ok") pass = false
    response = programs.start("3")
    if (response !== "ok") pass = false
    await sleep(100)
    response = programs.start("3")
    if (response !== "ok") pass = false

    // Program 4 - node env.js
    response = programs.create("4", `${programs.PATH}/tests`, "node env.js", {name: "arlo"})
    if (response !== "ok") pass = false
    response = programs.start("4")
    if (response !== "ok") pass = false

    // Program 5 - node echo.mjs
    response = programs.create("5", `${programs.PATH}/tests`, "node echo.mjs")
    response = programs.start("5", async name => {
        response = programs.send("5", "420")
        if (response !== "ok") pass = false
        await sleep(200)
        if (!programs.history("5")[1].data.startsWith("echo: 420")) pass = false
    })

    // Program 6 - node api.mjs
    response = programs.create("6", `${programs.PATH}/tests`, "node api.mjs")
    response = programs.start("6", () => {
        programs.emitter.on("receive", (name, data) => {
            if (name === "6" && data < 1_000_000) pass = false
        })
    })

    // Kill and Remove
    await sleep(500)
    programs.killAll()
    programs.removeAll()

    // Program 7 - node test.mjs
    response = programs.create("7", `${programs.PATH}/tests`, "node test.mjs")

    await sleep(100)
    return pass
}
