// Imports
import * as program from './program-v1.js'

// Functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
export async function test() {
    let pass = true
    let response = {}

    // Events
    // program.emitter.on("available", (obj) => {
    //     // console.log("available", obj)
    // })
    // program.emitter.on("status", (name, obj) => {
    //     // console.log("status", name, obj)
    // })
    // program.emitter.on("status-all", (array) => {
    //     // console.log("status-all", array)
    // })
    // program.emitter.on("data", (name, obj) => {
    //     // console.log("data", name, obj.data)
    // })
    // program.emitter.on("history", (name, array) => {
    //     // console.log("history", name, array)
    // })

    // Tests
    // response = program.splitByWhitespace("1  jkhgakfger-=[];,/.,/`163-9 ef   whfiwheifhbwe fwef")
    // if (response[2] !== "ef") pass = false
    // response = program.splitByWhitespace("one")
    // if (response[0] !== "one" || response.length !== 1) pass = false

    // program.removeAll()

    // // Program 0 - fakeProg
    // response = program.start("fakeProg")
    // if (!response.startsWith("error ")) pass = false
    // response = program.send("0", "420")
    // if (!response.startsWith("error ")) pass = false

    // // Program 1 - node log.js
    // response = program.create("1", `${program.PATH}/tests`, "node log.js")
    // if (response !== "ok") pass = false
    // response = program.start("1")
    // if (response !== "ok") pass = false

    // // Program 2 - node interval.js
    // response = program.create("2", `${program.PATH}/tests`, "node interval.js")
    // if (response !== "ok") pass = false
    // response = program.start("2")
    // if (response !== "ok") pass = false
    // await sleep(300)
    // program.restart("2")
    // await sleep(300)
    // if (program.status("2").running === false) pass = false
    // program.kill("2")
    // if (program.status("2").running === true) pass = false

    // // Program 3 - python3 log.py
    // response = program.create("3", `${program.PATH}/tests`, "python3 log.py")
    // if (response !== "ok") pass = false
    // response = program.start("3")
    // if (response !== "ok") pass = false
    // await sleep(100)
    // response = program.start("3")
    // if (response !== "ok") pass = false

    // // Program 4 - node env.js
    // response = program.create("4", `${program.PATH}/tests`, "node env.js", {name: "arlo"})
    // if (response !== "ok") pass = false
    // response = program.start("4")
    // if (response !== "ok") pass = false

    // // Program 5 - node echo.mjs
    // response = program.create("5", `${program.PATH}/tests`, "node echo.mjs")
    // response = program.start("5", async name => {
    //     response = program.send("5", "420")
    //     if (response !== "ok") pass = false
    //     await sleep(200)
    //     if (!program.history("5")[1].data.startsWith("echo: 420")) pass = false
    // })

    // // Program 6 - node api.mjs
    // response = program.create("6", `${program.PATH}/tests`, "node api.mjs")
    // response = program.start("6", () => {
    //     program.emitter.on("receive", (name, data) => {
    //         if (name === "6" && data < 1_000_000) pass = false
    //     })
    // })

    // Kill and Remove
    // await sleep(500)
    // program.killAll()
    // program.removeAll()

    // // Program 7 - node test.mjs
    // response = program.create("7", `${program.PATH}/examples`, "node quick-start.mjs")

    await sleep(100)
    return pass
}
