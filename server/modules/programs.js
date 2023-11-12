// Overview: spawn sub processes / user scripts

// Todos
// check out PM2: https://pm2.keymetrics.io/docs/usage/pm2-api/ & https://pm2.io/docs/runtime/reference/pm2-programmatic/
// - PM2 doesn't let you attach to stdin / stdout ??

// Imports
import { Logger } from './logger.js'
import { EventEmitter } from 'events'
import { createDatabase, resetDatabase } from './database.js'
import { getStatsRecursive, readText } from './files.js'
import { spawn } from 'child_process'

// Exports
export {
    emitter, // available, data, history, status, status-all

    available,
    
    status,
    history,

    create,
    start,
    send,
    kill,
    restart,
    remove,

    setDirectory,
    setCommand,
    setStartOnBoot,
    setEnviromentVariables,
    
    statusAll,
    startAll,
    sendAll,
    killAll,
    restartAll,
    removeAll,

    splitByWhitespace,
    PATH_TO_PROGRAMS as PATH,
    
    // Reset
    resetToDefault,
}

// Constants
const PATH_TO_PROGRAMS = "../private/programs" // ~/av-server/private/programs
const MAX_HISTORY_LENGTH = 1_000
const UPDATE_AVAILABLE_MS = 1_000
const RESTART_TIMEOUT_MS = 100
const DEFAULT_STATE = { programs: {}, available: {} }

// Variables
const log = new Logger("modules/programs.js")
const emitter = new EventEmitter()
const spawnedList = {}
let db = await createDatabase('programs', DEFAULT_STATE)

// Startup
emitter.setMaxListeners(100)
dbResetRunning()
await checkAvailablePrograms()
setInterval(async () => {
    await checkAvailablePrograms()
}, UPDATE_AVAILABLE_MS)

// Helper Functions
function dbResetRunning() {
    Object.keys(db.data.programs).forEach(name => {
        db.data.programs[name].running = false
    })
}
function splitByWhitespace(string) {
    return string.trim().split(/\s+/)
}
async function checkAvailablePrograms() {
    const availableAsJSON_prev = JSON.stringify(db.data.available)
    const stats = await getStatsRecursive(PATH_TO_PROGRAMS)
    db.data.available = {}
    for (const folder of stats.contains_folders) {
        const directory = folder.folder_name.replace("/", "")
        db.data.available[directory] = {
            directory: `${PATH_TO_PROGRAMS}/${directory}`,
            command: "echo hi",
            env: {},
            files: [],
        }
        for (const file of folder.contains_files) {
            db.data.available[directory].files.push(file.file_name)
            if (file.file_name.endsWith(".js") || file.file_name.endsWith(".mjs")) {
                db.data.available[directory].command = "node " + file.file_name
            }
            else if (file.file_name.endsWith(".py")) {
                db.data.available[directory].command = "python3 " + file.file_name
            }
            else if (file.file_name.endsWith(".env")) {
                const envFile = await readText(file.path)
                const envFileLines = envFile.split("\n")
                envFileLines.forEach(line => {
                    const key = line.split("=")[0].trim()
                    const value = line.split("=")[1].trim()
                    db.data.available[directory].env[key] = value
                });
            }
        }
    }
    const availableAsJSON = JSON.stringify(db.data.available)
    if (availableAsJSON !== availableAsJSON_prev) {
        emitter.emit('available', db.data.available)
        log.debug(`available() -> "updated"`, db.data.available)
        await db.write()
    }
    return db.data.available
}

// Functions
function available() {
    const array = []
    Object.keys(db.data.available).forEach(name => {
        array.push({name: name, ...db.data.available[name]})
    })
    // log.debug(`available()`, db.data.available)
    return array
}

function status(name) {
    if (!db.data.programs[name]) {
        const error = `error program "${name}" does NOT exist`
        log.error(`status("${name}") -> ${error}`)
        return error
    }
    const statusWithoutHistory = {
        name: name,
        command: db.data.programs[name].command,
        env: db.data.programs[name].env,
        directory: db.data.programs[name].directory,
        startOnBoot: db.data.programs[name].startOnBoot,
        running: db.data.programs[name].running,
        pid: db.data.programs[name].pid,
    }
    // log.debug(`status("${name}")`, statusWithoutHistory)
    return statusWithoutHistory
}
function history(name) {
    if (!db.data.programs[name]) {
        const error = `error program "${name}" does NOT exist`
        log.error(`history("${name}") -> ${error}`)
        return error
    }
    // log.debug(`history("${name}")`, db.data.programs[name].history)
    return db.data.programs[name].history
}
function statusAll() {
    const array = []
    Object.keys(db.data.programs).forEach(name => {
        array.push(status(name))
    })
    // log.debug(`statusAll()`, array)
    return array
}

function create(name, directory, command, env = {}, startOnBoot = false) {

    // Errors
    if (db.data.programs[name]?.running === true) {
        const error = `error program "${name}" is running`
        log.error(`create("${name}", "${directory}", "${command}", "${startOnBoot}", "${JSON.stringify(env)}") -> ${error}`)
        return error
    }

    // Create
    db.data.programs[name] = {
        running: false,
        startOnBoot: startOnBoot,
        pid: undefined,
        directory: directory,
        command: command,
        env: env,
        history: [],
    }
    emitter.emit('status', name, status(name))
    emitter.emit('status-all', statusAll())
    log.debug(`create("${name}", "${directory}", "${command}", "${startOnBoot}", "${JSON.stringify(env)}") -> "ok"`, db.data.programs[name])
    db.write()
    return "ok"
}
function start(name, callback = () => {}) {
    log.debug(`trying start("${name}")`)

    // Errors
    if (!db.data.programs[name]) {
        const error = `error program "${name}" does NOT exist`
        log.error(`start("${name}") -> ${error}`)
        return error
    } else if (db.data.programs[name].running === true) {
        const error = `error program "${name}" is running`
        log.error(`start("${name}") -> ${error}`)
        return error
    }

    // Spawn
    const program = db.data.programs[name]
    const commandArray = splitByWhitespace(program.command)
    const commandProgram = commandArray[0]
    commandArray.shift()
    const spawned = spawn(commandProgram, commandArray, {
        shell: false,
        cwd: program.directory,
        env: {
            ...program.env,
            PATH: process.env.PATH, // crashes without this
        },
    })
    spawnedList[name] = spawned
    program.running = false
    program.pid = spawned.pid

    // Events
    spawned.on('spawn', (code, signal) => {
        program.running = true
        emitter.emit('status', name, status(name))
        emitter.emit('status-all', statusAll())
        log.debug(`start(${name}) event: "spawn"`)
        db.write()
        callback(name)
    })
    spawned.on('error', (error) => {
        emitter.emit('start', name, error)
        log.error(`start(${name}) event: "error" -> ${error.message}`, error)
    })
    spawned.on('exit', (code, signal) => {
        program.running = false
        emitter.emit('status', name, status(name))
        emitter.emit('status-all', statusAll())
        log.debug(`start(${name}) event: "exit"`)
        db.write()
    })
    spawned.stdout.on('data', (data) => {
        const dataObj = {
            from: "stdout",
            timestampISO: new Date(Date.now()).toISOString(),
            data: data.toString('utf8'),
        }
        program.history.push(dataObj)
        if (program.history.length > MAX_HISTORY_LENGTH) { program.history.shift() }
        emitter.emit('data', name, dataObj)
        emitter.emit('history', name, history(name))
        // log.debug(`start(${name}) event: "stdout" -> ${JSON.stringify(dataObj.data)}`, dataObj)
        db.write()
    })
    spawned.stderr.on('data', (data) => {
        const dataObj = {
            from: "stderr",
            timestampISO: new Date(Date.now()).toISOString(),
            data: data.toString('utf8'),
        }
        program.history.push(dataObj)
        if (program.history.length > MAX_HISTORY_LENGTH) { program.history.shift() }
        emitter.emit('data', name, dataObj)
        emitter.emit('history', name, history(name))
        // log.debug(`start(${name}) event: "stderr" -> ${JSON.stringify(dataObj.data)}`, dataObj)
        db.write()
    })

    return "ok"
}
function send(name, text) {

    // Errors
    if (!db.data.programs[name]) {
        const error = `error program "${name}" does NOT exist`
        log.error(`send("${name}", "${text}") -> error program "${name}" does NOT exist`)
        return error
    } else if (db.data.programs[name].running === false) {
        const error = `error program "${name}" is NOT running`
        log.error(`start("${name}") -> ${error}`)
        return error
    }

    // Send
    try {
        const program = db.data.programs[name]
        spawnedList[name].stdin.write(Buffer.from(text))
        const dataObj = {
            from: "stdin",
            timestampISO: new Date(Date.now()).toISOString(),
            data: text,
        }
        program.history.push(dataObj)
        if (program.history.length > MAX_HISTORY_LENGTH) { program.history.shift() }
        emitter.emit('data', name, dataObj)
        emitter.emit('history', name, history(name))
        // log.debug(`send("${name}", "${text}") -> "ok"`)
        db.write()
        return "ok"
    } catch (err) {
        const error = `error program "${name}" could NOT send "${text}"`
        log.error(`send("${name}", "${text}") -> ${error}`, err)
        return error
    }
}
function kill(name) {

    // Errors
    if (!db.data.programs[name]) {
        const error = `error program "${name}" does NOT exist`
        log.error(`kill("${name}") -> ${error}`)
        return error
    }
    
    // Kill
    try {
        db.data.programs[name].running = false
        db.write()
        emitter.emit('status', name, status(name))
        emitter.emit('status-all', statusAll())
        spawnedList[name].kill()
        log.debug(`kill("${name}") -> "ok"`)
        return "ok"
    } catch (err) {
        const error = `error program ${name} could NOT be killed`
        log.error(`kill("${name}") -> ${error}`, err)
        return error
    }
}
function restart(name) {

    // Errors
    if (!db.data.programs[name]) {
        const error = `error program "${name}" does NOT exist`
        log.error(`restart("${name}") -> ${error}`)
        return error
    }

    // Kill then Start
    try {
        db.data.programs[name].running = false
        db.write()
        emitter.emit('status', name, status(name))
        emitter.emit('status-all', statusAll())
        spawnedList[name].kill()
        setTimeout(() => start(name), RESTART_TIMEOUT_MS)
        log.debug(`restart("${name}") -> "ok"`)
        return "ok"
    } catch (err) {
        const error = `error program "${name}" could NOT be killed`
        log.error(`restart("${name}") -> ${error}`, err)
        return error
    }
}
function remove(name) {

    // Errors
    if (!db.data.programs[name]) {
        const error = `error program "${name}" does NOT exist`
        log.error(`remove("${name}") -> ${error}`)
        return error
    }

    // Kill then Remove
    try {
        db.data.programs[name].running = false
        db.write()
        emitter.emit('status', name, status(name))
        emitter.emit('status-all', statusAll())
        spawnedList[name].kill()
        delete db.data.programs[name]
        db.write()
        emitter.emit('status-all', statusAll())
        log.debug(`remove("${name}") -> "ok"`)
        return "ok"
    } catch (err) {
        const error = `error program "${name}" could NOT be killed`
        log.error(`remove("${name}") -> ${error}`, err)
        return error
    }
}

function setDirectory(name, directory) {

    // Errors
    if (!db.data.programs[name]) {
        const error = `error program "${name}" does NOT exist`
        log.error(`setDirectory("${name}", "${directory}") -> ${error}`)
        return error
    } else if (db.data.programs[name].running === true) {
        const error = `error program "${name}" is running`
        log.error(`setDirectory("${name}", "${directory}") -> ${error}`)
        return error
    }

    // Set directory
    db.data.programs[name].directory = directory
    db.write()
    emitter.emit('status', name, status(name))
    emitter.emit('status-all', statusAll())
    log.debug(`setDirectory("${name}", "${directory}") -> "ok"`)
    return "ok"
}
function setCommand(name, command) {
    
    // Errors
    if (!db.data.programs[name]) {
        const error = `error program "${name}" does NOT exist`
        log.error(`setCommand("${name}", "${command}") -> ${error}`)
        return error
    } else if (db.data.programs[name].running === true) {
        const error = `error program "${name}" is running`
        log.error(`setCommand("${name}", "${command}") -> ${error}`)
        return error
    }

    // Set command
    db.data.programs[name].command = command
    db.write()
    emitter.emit('status', name, status(name))
    emitter.emit('status-all', statusAll())
    log.debug(`setCommand("${name}", "${command}") -> "ok"`)
    return "ok"
}
function setStartOnBoot(name, startOnBoot) {
        
    // Errors
    if (!db.data.programs[name]) {
        const error = `error program "${name}" does NOT exist`
        log.error(`setStartOnBoot("${name}", "${startOnBoot}") -> ${error}`)
        return error
    } else if (db.data.programs[name].running === true) {
        const error = `error program "${name}" is running`
        log.error(`setStartOnBoot("${name}", "${startOnBoot}") -> ${error}`)
        return error
    }

    // Set startOnBoot
    if (startOnBoot) db.data.programs[name].startOnBoot = true
    else db.data.programs[name].startOnBoot = false
    db.write()
    emitter.emit('status', name, status(name))
    emitter.emit('status-all', statusAll())
    log.debug(`setStartOnBoot("${name}", "${startOnBoot}") -> "ok"`)
    return "ok"
}
function setEnviromentVariables(name, env) {
            
    // Errors
    if (!db.data.programs[name]) {
        const error = `error program "${name}" does NOT exist`
        log.error(`setEnviromentVariables("${name}", "${JSON.stringify(env)}") -> ${error}`)
        return error
    } else if (db.data.programs[name].running === true) {
        const error = `error program "${name}" is running`
        log.error(`setEnviromentVariables("${name}", "${JSON.stringify(env)}") -> ${error}`)
        return error
    } else if (typeof env !== 'object') {
        const error = `error env is NOT an object`
        log.error(`setEnviromentVariables("${name}", "${JSON.stringify(env)}") -> ${error}`)
        return error
    }

    // Set enviroment variables
    db.data.programs[name].env = env
    db.write()
    emitter.emit('status', name, status(name))
    emitter.emit('status-all', statusAll())
    log.debug(`setEnviromentVariables("${name}", "${JSON.stringify(env)}") -> "ok"`)
    return "ok"
}

function startAll() {
    log.debug(`startAll() -> "ok"`)
    Object.keys(db.data.programs).forEach(name => start(name))
    return "ok"
}
function sendAll(text) {
    log.debug(`killAll() -> "ok"`)
    Object.keys(db.data.programs).forEach(name => send(name, text))
    return "ok"
}
function killAll() {
    log.debug(`killAll() -> "ok"`)
    Object.keys(db.data.programs).forEach(name => kill(name))
    return "ok"
}
function restartAll() {
    log.debug(`restartAll() -> "ok"`)
    Object.keys(db.data.programs).forEach(name => restart(name))
    return "ok"
}
function removeAll() {
    log.debug(`removeAll() -> "ok"`)
    Object.keys(db.data.programs).forEach(name => remove(name))
    db.data.programs = {}
    return "ok"
}

async function resetToDefault() {
    db = await resetDatabase("programs")
    emitter.emit('status-all', statusAll())
}