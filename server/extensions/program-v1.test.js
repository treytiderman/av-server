// Imports
import * as pm from './program-v1.js'

// Functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
export async function test() {
    let pass = true
    let response = {}

    const path = "../private/programs"

    // Tests
    await pm.programs.remove()
    
    // Program 0 - fakeProg
    response = await pm.log.program.start("fakeProg")
    if (!response.startsWith("error ")) pass = false
    response = await pm.log.program.send("0", "420")
    if (!response.startsWith("error ")) pass = false

    // Program 1 - node log.js
    response = await pm.log.program.create("1", `${path}/tests`, "node log.js")
    if (response !== "ok") pass = false
    response = await pm.log.program.start("1")
    if (response !== "ok") pass = false
    
    // Program 2 - node interval.js
    response = await pm.log.program.create("2", `${path}/tests`, "node interval.js")
    if (response !== "ok") pass = false

    response = await pm.log.program.start("2")
    if (response !== "ok") pass = false
    await sleep(300)

    response = await pm.log.program.restart("2")
    if (response !== "ok") pass = false
    await sleep(300)
    if (pm.program.get("2").running === false) pass = false

    response = await pm.log.program.kill("2")
    if (response !== "ok") pass = false
    await sleep(300)
    if (pm.program.get("2").running === true) pass = false

    // Program 3 - python3 log.py
    response = await pm.log.program.create("3", `${path}/tests`, "python3 log.py")
    if (response !== "ok") pass = false

    response = await pm.log.program.start("3")
    if (response !== "ok") pass = false
    await sleep(100)

    response = await pm.log.program.start("3")
    if (response !== "ok") pass = false

    // Program 4 - node env.js
    response = await pm.log.program.create("4", `${path}/tests`, "node env.js", true, {name: "arlo"})
    if (response !== "ok") pass = false

    response = await pm.log.program.start("4")
    if (response !== "ok") pass = false
    await sleep(200)

    response = await pm.log.program.remove("4")
    if (response !== "ok") pass = false
    await sleep(100)

    // Program 5 - node echo.mjs
    response = await pm.log.program.create("5", `${path}/tests`, "node echo.mjs")
    if (response !== "ok") pass = false

    response = await pm.log.program.start("5", async name => {
        response = await pm.log.program.send(name, "420")
        if (response !== "ok") pass = false
        await sleep(100)

        response = pm.history.get(name)[1].data
        if (!response.includes("echo: 420")) pass = false
    })
    await sleep(100)

    response = await pm.log.program.create("5", `${path}/tests`, "node echo.mjs")
    if (response === "ok") pass = false

    response = await pm.log.program.kill("5")
    if (response !== "ok") pass = false
    await sleep(100)

    // Program 6 - node api.mjs
    response = await pm.log.program.create("6", `${path}/tests`, "node api.mjs")
    response = await pm.log.program.start("6", name => {
        pm.data.sub(name, res => {
            if (res.from === "stdin" && !res.data.startsWith(`{"path":"v1/system/time/get/`)) pass = false
        })
    })

    // Kill and Remove
    await sleep(500)
    await pm.log.programs.kill()
    await pm.log.programs.remove()

    // Program 7 - node test.mjs
    response = await pm.log.program.create("7", `${path}/examples`, "node quick-start.mjs")

    await sleep(100)
    return pass
}
