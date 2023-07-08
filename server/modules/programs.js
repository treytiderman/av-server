// Overview: spawn sub processes / user scripts

// Todos
// use db.js
// check out: https://pm2.keymetrics.io/docs/usage/pm2-api/

import { spawn } from 'child_process'
import { getStatsRecursive, readText } from './files.js'
import { Logger } from './logger.js'
import { getDatabase } from './db.js'

// Event Emitter
import events from 'events'
const emitter = new events.EventEmitter()

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

/* Events example
    const programs = require('../modules/programs')
    programs.emitter.on("available", (body) => {})
    programs.emitter.on("start", (name, body) => {})
    programs.emitter.on("error", (name, body) => {})
    programs.emitter.on("exit", (name, body) => {})
    programs.emitter.on("out", (name, body) => {})
*/

// Variables
const PATH_TO_PROGRAMS = "../programs"
const MAX_HISTORY_LENGTH = 1_000
const UPDATE_AVAILABLE_MS = 1_000
const RESTART_TIMEOUT_MS = 1_000
const DEFAULT_STATE = { programs: {} }

const log = new Logger("programs.js")
// const State = new StateClass('programs', DEFAULT_STATE)
let programs = {}
const available = {}
const spawnedList = {}

// Helper Functions
function splitByWhitespace(string) {
    return string.trim().split(/\s+/)
}
async function checkAvailablePrograms() {
    const availableAsJSON_prev = JSON.stringify(available)
    const stats = await getStatsRecursive(PATH_TO_PROGRAMS)
    for (const folder of stats.contains_folders) {
        const folderName = folder.folder_name.replace("/", "")
        available[folderName] = {
            directory: `${PATH_TO_PROGRAMS}/${folderName}`,
            command: "echo hi",
            env: {},
            files: [],
        }
        for (const file of folder.contains_files) {
            available[folderName].files.push(file.file_name)
            if (file.file_name.endsWith(".js")) {
                available[folderName].command = "node " + file.file_name
            }
            else if (file.file_name.endsWith(".py")) {
                available[folderName].command = "python " + file.file_name
            }
            else if (file.file_name.endsWith(".env")) {
                const envFile = await readText(file.path)
                const envFileLines = envFile.split("\n")
                envFileLines.forEach(line => {
                    const key = line.split("=")[0].trim()
                    const value = line.split("=")[1].trim()
                    available[folderName].env[key] = value
                });
            }
        }
    }
    const availableAsJSON = JSON.stringify(available)
    if (availableAsJSON !== availableAsJSON_prev) {
        emitter.emit('available', available)
    }
    return available
}

// Functions
function getAvailable() {
    return available
}
function getProgram(name) {
    // const programs = State.get("programs")
    if (programs[name]) {
        return {
            command: programs[name].command,
            env: programs[name].env,
            pid: programs[name].pid,
            running: programs[name].running,
        }
    }
    return { error: name + " doesn't exist"}
}
function getProgramWithHistory(name) {
    // const programs = State.get("programs")
    if (programs[name]) {
        return {
            command: programs[name].command,
            env: programs[name].env,
            pid: programs[name].pid,
            running: programs[name].running,
            out: programs[name].out,
        }
    }
    return { error: name + "program doesn't exist"}
}
function getPrograms() {
    // const programs = State.get("programs")
    const array = []
    Object.keys(programs).forEach(name => {
        array.push(getProgram(name))
    })
    return array
}
async function clearPrograms() {
    // await State.set("programs", {})
    programs = {}
}
async function start(name, directory, command, env = {}) {
    // const programs = State.get("programs")

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
        startOnBoot: false,
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
        // await State.set("programs", programs)
    })
    spawned.on('exit', async (code, signal) => {
        log.debug(`${name} exit`)
        programs[name].running = false
        emitter.emit('exit', name, "ok")
        // await State.set("programs", programs)
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
        // await State.set("programs", programs)
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
        // await State.set("programs", programs)
    })

    // await State.set("programs", programs)
    return programs[name]
}
async function startAvailable(folderName, name, env = {}) {
    const directory = available[folderName].directory
    const command = available[folderName].command
    const program = await start(name, directory, command, env)
    return program
}
async function startExisting(name) {
    const programs = State.get("programs")
    const directory = programs[name].directory
    const command = programs[name].command
    const env = programs[name].env
    const program = await start(name, directory, command, env)
    return program
}
function kill(name) {
    const programs = State.get("programs")
    if (programs[name].running) {
        try {
            spawnedList[name].spawn.kill()
            log.debug(`${name} killed`)
        } catch (error) {
            log.error(`${name} could not be killed`)            
        }
    } else {
        log.debug(`${name} could not be killed because it wasn't running`)
    }
}
function killAll() {
    const programs = State.get("programs")
    Object.keys(programs).forEach(name => kill(name))
}
function restart(name) {
    log.debug(`${name} restarting...`)
    const programs = State.get("programs")
    const program = programs[name].program
    const args = programs[name].args
    const env = programs[name].env
    kill(name)
    setTimeout(async () => {
        await start(name, program, args, env)
    }, RESTART_TIMEOUT_MS)
}
function restartRunningStatus() {
    // const programs = State.get("programs")
    // Object.keys(programs).forEach(name => programs[name].running = false)
}

// Startup
setInterval(async () => {
    await checkAvailablePrograms()
}, UPDATE_AVAILABLE_MS)

// Testing
if (process.env.RUN_TESTS) await runTests("programs.js")
async function runTests(testName) {
    let pass = true

    const test1 = splitByWhitespace("1  jkhgakfger-=[];,/.,/`163-9 ef   whfiwheifhbwe fwef")
    if (test1[2] !== "ef") pass = false
    const test2 = splitByWhitespace("one")
    if (test2[0] !== "one" || test2.length !== 1) pass = false
    
    // const p1 = await start("p1", `${PATH_TO_PROGRAMS}/test-nodejs-log`, "node main.js")
    // if (p1.command !== "node main.js") pass = false
    // // console.log(p1)
    
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

    // setTimeout(() => killAll(), 1000)

    // emitter.on("out", (name, body) => {
    //     console.log(name, body)
    // })

    // emitter.on("available", (body) => {})
    // emitter.on("start", (name, body) => {})
    // emitter.on("error", (name, body) => {})
    // emitter.on("exit", (name, body) => {})

    
    // await clearPrograms()
    if (pass !== true) console.log(testName, '\x1b[31mTESTS FAILED\x1b[0m')
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