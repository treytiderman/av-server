// Overview: spawn sub processes / user scripts

// Todos
// check out: https://pm2.keymetrics.io/docs/usage/pm2-api/

/* Events example
    const programs = require('../modules/programs')
    programs.emitter.on("available", (body) => {})
    programs.emitter.on("start", (name, body) => {})
    programs.emitter.on("error", (name, body) => {})
    programs.emitter.on("exit", (name, body) => {})
    programs.emitter.on("out", (name, body) => {})
*/

// Imports
import { spawn } from 'child_process'
import { getStatsRecursive, readText } from './files.js'
import { Logger } from './logger.js'
import { getDatabase } from './database.js'

// Event Emitter
import events from 'events'

// Exports
export {
    emitter,
    getAvailable,
    getProgram,
    getPrograms,
    getProgramWithHistory,
    clearPrograms,
    start,
    startExisting,
    startAvailable,
    kill,
    killAll,
    restart,
}

// Variables
const PATH_TO_PROGRAMS = "../programs"
const MAX_HISTORY_LENGTH = 1_000
const UPDATE_AVAILABLE_MS = 1_000
const RESTART_TIMEOUT_MS = 1_000
const DEFAULT_STATE = { programs: {}, available: {} }

const db = await getDatabase('programs', DEFAULT_STATE)
const emitter = new events.EventEmitter()
const log = new Logger("programs.js")
const spawnedList = {}

// Helper Functions
function splitByWhitespace(string) {
    return string.trim().split(/\s+/)
}
async function checkAvailablePrograms() {
    const availableAsJSON_prev = JSON.stringify(db.data.available)
    const stats = await getStatsRecursive(PATH_TO_PROGRAMS)
    for (const folder of stats.contains_folders) {
        const folderName = folder.folder_name.replace("/", "")
        db.data.available[folderName] = {
            directory: `${PATH_TO_PROGRAMS}/${folderName}`,
            command: "echo hi",
            env: {},
            files: [],
        }
        for (const file of folder.contains_files) {
            db.data.available[folderName].files.push(file.file_name)
            if (file.file_name.endsWith(".js")) {
                db.data.available[folderName].command = "node " + file.file_name
            }
            else if (file.file_name.endsWith(".py")) {
                db.data.available[folderName].command = "python " + file.file_name
            }
            else if (file.file_name.endsWith(".env")) {
                const envFile = await readText(file.path)
                const envFileLines = envFile.split("\n")
                envFileLines.forEach(line => {
                    const key = line.split("=")[0].trim()
                    const value = line.split("=")[1].trim()
                    db.data.available[folderName].env[key] = value
                });
            }
        }
    }
    const availableAsJSON = JSON.stringify(db.data.available)
    if (availableAsJSON !== availableAsJSON_prev) {
        emitter.emit('available', db.data.available)
        await db.write()
    }
    return db.data.available
}

// Functions
function getAvailable() {
    return db.data.available
}
function getProgram(name) {
    const program = db.data.programs[name]
    if (program) {
        return {
            command: program.command,
            env: program.env,
            pid: program.pid,
            running: program.running,
        }
    }
    return { error: name + " doesn't exist"}
}
function getProgramWithHistory(name) {
    const program = db.data.programs[name]
    if (program) {
        return {
            command: program.command,
            env: program.env,
            pid: program.pid,
            running: program.running,
            out: program.out,
        }
    }
    return { error: name + "program doesn't exist"}
}
function getPrograms() {
    const programs = db.data.programs
    const array = []
    Object.keys(programs).forEach(name => {
        array.push(getProgram(name))
    })
    return array
}
async function clearPrograms() {
    await killAll()
    db.data.programs = {}
    await db.write()
}
async function start(name, directory, command, startOnBoot = false, env = {}) {
    const programs = db.data.programs

    // Already running
    if (programs[name]?.running === true) {
        const error = "error program already running"
        log.debug(`start(${name}, ${directory}, ${command}, ${JSON.stringify(env)})`, error)
        emitter.emit('start', name, error)
        return error
    }

    // Spawn
    const commandArray = splitByWhitespace(command)
    const program = commandArray[0]
    commandArray.shift()
    const spawned = spawn(program, commandArray, {
        shell: false,
        cwd: directory,
        env: {
            ...env,
            PATH: process.env.PATH, // crashes without this
        },
    })
    spawnedList[name] = spawned
    programs[name] = {
        running: false,
        startOnBoot: startOnBoot,
        pid: spawned.pid,
        directory: directory,
        command: command,
        env: env,
        out: [],
        // out: [...programs[name].out],
    }

    // Events
    spawned.on('error', (err) => {
        log.error(`start(${name}, ${directory}, ${command}, ${JSON.stringify(env)})` + "failed to start subprocess", err)
    })
    spawned.on('spawn', async (code, signal) => {
        log.debug(`start(${name}, ${directory}, ${command}, ${JSON.stringify(env)})`, "ok")
        programs[name].running = true
        emitter.emit('start', name, "ok")
        await db.write()
    })
    spawned.on('exit', async (code, signal) => {
        log.debug(`${name} exit`)
        programs[name].running = false
        emitter.emit('exit', name, "ok")
        await db.write()
    })
    spawned.stdout.on('data', async (data) => {
        const dataObj = {
            from: "stdout",
            timestampISO: new Date(Date.now()).toISOString(),
            ascii: data.toString('ascii'),
        }
        log.debug(`${name} stdout`, dataObj.ascii)
        emitter.emit('out', name, dataObj)
        programs[name].out.push(dataObj)
        if (programs[name].out.length > MAX_HISTORY_LENGTH) {
            programs[name].out.shift()
        }
        await db.write()
    })
    spawned.stderr.on('data', async (data) => {
        const dataObj = {
            from: "stderr",
            timestampISO: new Date(Date.now()).toISOString(),
            ascii: data.toString('ascii'),
        }
        log.debug(`${name} stderr`, dataObj.ascii)
        emitter.emit('out', name, dataObj)
        programs[name].out.push(dataObj)
        if (programs[name].out.length > MAX_HISTORY_LENGTH) {
            programs[name].out.shift()
        }
        await db.write()
    })

    await db.write()
    return programs[name]
}
async function startAvailable(name, folderName, env = {}) {
    const available = db.data.available
    if (available[folderName]) {
        const directory = available[folderName].directory
        const command = available[folderName].command
        const program = await start(name, directory, command, env)
        return program
    }
    const error = "error folderName doesn't exist"
    log.debug(`startAvailable(${folderName}, ${name}, ${JSON.stringify(env)})`, error)
    emitter.emit('start', name, error)
    return "error program doesn't exist"
}
async function startExisting(name) {
    const programs = db.data.programs
    if (programs[name]) {
        const directory = programs[name].directory
        const command = programs[name].command
        const env = programs[name].env
        const program = await start(name, directory, command, env)
        return program
    }
    const error = "error program doesn't exist"
    log.debug(`startExisting(${name})`, error)
    emitter.emit('start', name, error)
    return error
}
async function kill(name) {
    const programs = db.data.programs
    if (programs[name].running) {
        programs[name].running = false
        try {
            spawnedList[name].kill()
            log.debug(`${name} killed`)
        } catch (error) {
            log.error(`${name} could not be killed`)            
        }
        await db.write()
    } else {
        log.debug(`${name} could not be killed because it wasn't running`)
    }
}
async function killAll() {
    const programs = db.data.programs
    Object.keys(programs).forEach(async name => await kill(name))
}
async function restart(name) {
    log.debug(`${name} restarting...`)
    const programs = db.data.programs
    const program = programs[name].program
    const args = programs[name].args
    const env = programs[name].env
    await kill(name)
    setTimeout(async () => {
        await start(name, program, args, env)
    }, RESTART_TIMEOUT_MS)
}

// Startup
await killAll()
await checkAvailablePrograms()
setInterval(async () => {
    await checkAvailablePrograms()
}, UPDATE_AVAILABLE_MS)

// Testing - takes 1 sec
if (process.env.DEV_MODE) await runTests("programs.js")
async function runTests(testName) {
    let pass = true

    const test1 = splitByWhitespace("1  jkhgakfger-=[];,/.,/`163-9 ef   whfiwheifhbwe fwef")
    if (test1[2] !== "ef") pass = false
    const test2 = splitByWhitespace("one")
    if (test2[0] !== "one" || test2.length !== 1) pass = false

    emitter.on("available", (body) => {
        // console.log("available", body)
    })

    emitter.on("start", (name, body) => {
        // console.log("start", name, body)
        if (name === "p72" && body.startsWith("error") === false) pass = false
    })

    emitter.on("out", (name, body) => {
        // console.log("out", name, body)
        if (name === "p1" && body.ascii.includes("NodeJS") === false) pass = false
        if (name === "p3" && body.ascii.includes("Python") === false) pass = false
    })

    emitter.on("error", (name, body) => {
        // console.log("error", name, body)
    })

    emitter.on("exit", async (name, body) => {
        // console.log("exit", name, body)
        if (name === "p1" && body !== "ok") pass = false
    })

    await start("p1", `${PATH_TO_PROGRAMS}/test-nodejs-log`, "node log.js")
    await start("p2", `${PATH_TO_PROGRAMS}/test-nodejs-log`, "node interval.js")

    await startAvailable("p3", "test-python-log")

    setTimeout(async () => await startExisting("p1"), 200)

    setTimeout(async () => {
        await startExisting("p72") // doesn't exist
    }, 400)

    // setTimeout(async () => {
    //     const p2 = await start("p2", `${PATH_TO_PROGRAMS}/test-nodejs-log`, "node main.js")
    //     if (p2.command !== "node main.js") pass = false
    //     // console.log(p2)
    // }, 500)
    
    // const p4 = await start("p4", `${PATH_TO_PROGRAMS}/test-nodejs-nodemon`, "nodemon main.js")
    // if (p4.command !== "nodemon main.js") pass = false
    
    // const test5 = await start("p3-install", `${PATH_TO_PROGRAMS}/test-nodejs-express`, "npm install")
    // const test6 = await start("p4-install", `${PATH_TO_PROGRAMS}/test-nodejs-nodemon`, "npm install")

    // await start("program2", "node", "../private/programs/test-nodejs-express/main.js", { port: 2005 })
    
    // await clearPrograms()
    setTimeout(async () => {
        await clearPrograms()
        if (pass !== true) console.log(testName, '\x1b[31mTESTS FAILED\x1b[0m')
    }, 1_000);
}

// start("program1", "node", "../private/programs/nodejs-log-test/main.js")

// start("program1", "node", "../private/programs/nodejs-express-test/main.js")
// start("program2", "node", "../private/programs/nodejs-express-test/main.js", { port: 2005 })
// setTimeout(() => kill("program1"), 10_000)
// setTimeout(() => console.log(state), 11_000)
// setTimeout(() => start("program1", "node", "../private/programs/nodejs-express-test/main.js"), 12_000)
// setTimeout(() => killAll(), 20_000)
// setTimeout(() => console.log(state), 21_000)

// start("log test", "node", "../private/programs/nodejs-log-test/main.js")
// start("program1", "node", "../private/programs/nodejs-express-test/main.js")
// setTimeout(() => console.log(getPrograms()), 2_000)
// setTimeout(() => restart("program1"), 10_000)
// setTimeout(() => console.log(getProgram("program1")), 12_000)
// setTimeout(() => killAll(), 15_000)

// setTimeout(() => {
//     // console.log(getAvailable())
//     // startAvailable("test-python-log")
//     // startAvailable("test-nodejs-express", "test-nodejs-express", {port: 2009})
// }, 2_000)
// setTimeout(() => {
//     console.log(getProgram("test-python-log"))
// }, 4_000)
// setTimeout(() => killAll(), 15_000)

// sudo netstat -lpn |grep :200*
// kill -9 1995300