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
    // emitter, // available, data, history, status, status-all, create, kill, delete

    // available,
    // program,
    // programs,
    // history,



    // available,

    // status,
    // history,

    // create,
    // start,
    // send,
    // kill,
    // restart,
    // remove,

    // setDirectory,
    // setCommand,
    // setStartOnBoot,
    // setEnviromentVariables,

    // statusAll,
    // startAll,
    // sendAll,
    // killAll,
    // restartAll,
    // removeAll,

    // splitByWhitespace,
    // PATH_TO_PROGRAMS as PATH,

    // resetToDefault,
}

// Constants
const PATH_TO_PROGRAMS = "../private/programs" // ~/av-server/private/programs
const MAX_HISTORY_LENGTH = 1_000
const UPDATE_AVAILABLE_MS = 1_000
const RESTART_TIMEOUT_MS = 100
const DEFAULT_STATE = { programs: {}, available: {} }

// Variables
const log = new Logger("program-v1.js")
const emitter = new EventEmitter()
const spawnedList = {}
let dbOLD = await createDatabase('programs', DEFAULT_STATE)

// Startup
emitter.setMaxListeners(100)
dbResetRunning()
await checkAvailablePrograms()
setInterval(async () => {
    await checkAvailablePrograms()
}, UPDATE_AVAILABLE_MS)

// Functions
// const groups = {
//     get: () => dbGroups.getKey('groups'),
//     sub: (callback) => dbGroups.subKey('groups', callback),
//     unsub: (callback) => dbGroups.unsubKey('groups', callback),
//     create: log.call(async (group) => {
//         // Errors
//         if (!validGroup(group)) {
//             return `error group '${group}' is not valid, only: alphanumaric, whitespace, special charactors _ ! @ # $ % ^ & -`
//         } else if (isGroup(group)) {
//             return `error group '${group}' arlready exists`
//         }

//         // Create group
//         const groups = dbGroups.getKey('groups')
//         groups.push(group)
//         await dbGroups.setKey('groups', groups)
//         await dbGroups.write()
//         return 'ok'
//     }, 'groups.create'),
// }

// Functions ------------------------------------------
function available() {
    const array = []
    Object.keys(dbOLD.data.available).forEach(name => {
        array.push({ name: name, ...dbOLD.data.available[name] })
    })
    // log.debug(`available()`, db.data.available)
    return array
}

function status(name) {
    if (!dbOLD.data.programs[name]) {
        const error = `error program "${name}" does NOT exist`
        log.error(`status("${name}") -> ${error}`)
        return error
    }
    const statusWithoutHistory = {
        name: name,
        command: dbOLD.data.programs[name].command,
        env: dbOLD.data.programs[name].env,
        directory: dbOLD.data.programs[name].directory,
        startOnBoot: dbOLD.data.programs[name].startOnBoot,
        running: dbOLD.data.programs[name].running,
        pid: dbOLD.data.programs[name].pid,
    }
    // log.debug(`status("${name}")`, statusWithoutHistory)
    return statusWithoutHistory
}
function history(name) {
    if (!dbOLD.data.programs[name]) {
        const error = `error program "${name}" does NOT exist`
        log.error(`history("${name}") -> ${error}`)
        return error
    }
    // log.debug(`history("${name}")`, db.data.programs[name].history)
    return dbOLD.data.programs[name].history
}
function statusAll() {
    const array = []
    Object.keys(dbOLD.data.programs).forEach(name => {
        array.push(status(name))
    })
    // log.debug(`statusAll()`, array)
    return array
}

function create(name, directory, command, env = {}, startOnBoot = false) {

    // Errors
    if (dbOLD.data.programs[name]?.running === true) {
        const error = `error program "${name}" is running`
        log.error(`create("${name}", "${directory}", "${command}", "${startOnBoot}", "${JSON.stringify(env)}") -> ${error}`)
        return error
    }

    // Create
    dbOLD.data.programs[name] = {
        running: false,
        startOnBoot: startOnBoot,
        pid: undefined,
        directory: directory,
        command: command,
        env: env,
        history: [],
    }
    emitter.emit('create', name)
    emitter.emit('status', name, status(name))
    emitter.emit('status-all', statusAll())
    log.debug(`create("${name}", "${directory}", "${command}", "${startOnBoot}", "${JSON.stringify(env)}") -> "ok"`, dbOLD.data.programs[name])
    dbOLD.write()
    return "ok"
}
function start(name, callback = () => { }) {
    log.debug(`trying start("${name}")`)

    // Errors
    if (!dbOLD.data.programs[name]) {
        const error = `error program "${name}" does NOT exist`
        log.error(`start("${name}") -> ${error}`)
        return error
    } else if (dbOLD.data.programs[name].running === true) {
        const error = `error program "${name}" is running`
        log.error(`start("${name}") -> ${error}`)
        return error
    }

    // Spawn
    const program = dbOLD.data.programs[name]
    const commandArray = splitByWhitespace(program.command)
    const commandProgram = commandArray[0]
    commandArray.shift()
    try {
        spawnedList[name] = spawn(commandProgram, commandArray, {
            shell: false,
            cwd: program.directory,
            env: {
                ...program.env,
                PATH: process.env.PATH, // crashes without this
            },
        })
    } catch (error) {
        emitter.emit('start', name, error)
        log.error(`start("${name}") event: "error" -> ${error.message}`, error)
    }
    // spawnedList[name] = spawned
    program.running = false
    program.pid = spawnedList[name].pid

    // Events
    spawnedList[name].on('spawn', (code, signal) => {
        program.running = true
        emitter.emit('status', name, status(name))
        emitter.emit('status-all', statusAll())
        log.debug(`start("${name}") event: "spawn"`)
        dbOLD.write()
        callback(name)
    })
    spawnedList[name].on('error', (error) => {
        emitter.emit('start', name, error)
        log.error(`start("${name}") event: "error" -> ${error.message}`, error)
    })
    spawnedList[name].on('exit', (code, signal) => {
        program.running = false
        emitter.emit('status', name, status(name))
        emitter.emit('status-all', statusAll())
        log.debug(`start("${name}") event: "exit"`)
        dbOLD.write()
    })
    spawnedList[name].stdout.on('data', (data) => {
        const dataObj = {
            from: "stdout",
            timestampISO: new Date(Date.now()).toISOString(),
            data: data.toString('utf8'),
        }
        program.history.push(dataObj)
        if (program.history.length > MAX_HISTORY_LENGTH) { program.history.shift() }
        emitter.emit('receive', name, dataObj.data)
        emitter.emit('data', name, dataObj)
        emitter.emit('history', name, history(name))
        log.debug(`start("${name}") event: "stdout" -> ${JSON.stringify(dataObj.data)}`, dataObj)
        dbOLD.write()
    })
    spawnedList[name].stderr.on('data', (data) => {
        const dataObj = {
            from: "stderr",
            timestampISO: new Date(Date.now()).toISOString(),
            data: data.toString('utf8'),
        }
        program.history.push(dataObj)
        if (program.history.length > MAX_HISTORY_LENGTH) { program.history.shift() }
        emitter.emit('receive', name, dataObj.data)
        emitter.emit('data', name, dataObj)
        emitter.emit('history', name, history(name))
        // log.debug(`start("${name}") event: "stderr" -> ${JSON.stringify(dataObj.data)}`, dataObj)
        dbOLD.write()
    })

    return "ok"
}
function send(name, text) {

    // Errors
    if (!dbOLD.data.programs[name]) {
        const error = `error program "${name}" does NOT exist`
        log.error(`send("${name}", "${text}") -> error program "${name}" does NOT exist`)
        return error
    } else if (dbOLD.data.programs[name].running === false) {
        const error = `error program "${name}" is NOT running`
        log.error(`send("${name}") -> ${error}`)
        return error
    }

    // Send
    try {
        const program = dbOLD.data.programs[name]
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
        log.debug(`send("${name}", "${text}") -> "ok"`)
        dbOLD.write()
        return "ok"
    } catch (err) {
        const error = `error program "${name}" could NOT send "${text}"`
        log.error(`send("${name}", "${text}") -> ${error}`, err)
        return error
    }
}
function kill(name) {

    // Errors
    if (!dbOLD.data.programs[name]) {
        const error = `error program "${name}" does NOT exist`
        log.error(`kill("${name}") -> ${error}`)
        return error
    }

    // Kill
    try {
        dbOLD.data.programs[name].running = false
        dbOLD.write()
        emitter.emit('kill', name)
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
    if (!dbOLD.data.programs[name]) {
        const error = `error program "${name}" does NOT exist`
        log.error(`restart("${name}") -> ${error}`)
        return error
    }

    // Kill then Start
    try {
        dbOLD.data.programs[name].running = false
        dbOLD.write()
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
    if (!dbOLD.data.programs[name]) {
        const error = `error program "${name}" does NOT exist`
        log.error(`remove("${name}") -> ${error}`)
        return error
    }

    // Kill then Remove
    try {
        dbOLD.data.programs[name].running = false
        dbOLD.write()
        emitter.emit('status', name, status(name))
        emitter.emit('status-all', statusAll())
        spawnedList[name].kill()
        delete dbOLD.data.programs[name]
        dbOLD.write()
        emitter.emit('delete', name)
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
    if (!dbOLD.data.programs[name]) {
        const error = `error program "${name}" does NOT exist`
        log.error(`setDirectory("${name}", "${directory}") -> ${error}`)
        return error
    } else if (dbOLD.data.programs[name].running === true) {
        const error = `error program "${name}" is running`
        log.error(`setDirectory("${name}", "${directory}") -> ${error}`)
        return error
    }

    // Set directory
    dbOLD.data.programs[name].directory = directory
    dbOLD.write()
    emitter.emit('status', name, status(name))
    emitter.emit('status-all', statusAll())
    log.debug(`setDirectory("${name}", "${directory}") -> "ok"`)
    return "ok"
}
function setCommand(name, command) {

    // Errors
    if (!dbOLD.data.programs[name]) {
        const error = `error program "${name}" does NOT exist`
        log.error(`setCommand("${name}", "${command}") -> ${error}`)
        return error
    } else if (dbOLD.data.programs[name].running === true) {
        const error = `error program "${name}" is running`
        log.error(`setCommand("${name}", "${command}") -> ${error}`)
        return error
    }

    // Set command
    dbOLD.data.programs[name].command = command
    dbOLD.write()
    emitter.emit('status', name, status(name))
    emitter.emit('status-all', statusAll())
    log.debug(`setCommand("${name}", "${command}") -> "ok"`)
    return "ok"
}
function setStartOnBoot(name, startOnBoot) {

    // Errors
    if (!dbOLD.data.programs[name]) {
        const error = `error program "${name}" does NOT exist`
        log.error(`setStartOnBoot("${name}", "${startOnBoot}") -> ${error}`)
        return error
    } else if (dbOLD.data.programs[name].running === true) {
        const error = `error program "${name}" is running`
        log.error(`setStartOnBoot("${name}", "${startOnBoot}") -> ${error}`)
        return error
    }

    // Set startOnBoot
    if (startOnBoot) dbOLD.data.programs[name].startOnBoot = true
    else dbOLD.data.programs[name].startOnBoot = false
    dbOLD.write()
    emitter.emit('status', name, status(name))
    emitter.emit('status-all', statusAll())
    log.debug(`setStartOnBoot("${name}", "${startOnBoot}") -> "ok"`)
    return "ok"
}
function setEnviromentVariables(name, env) {

    // Errors
    if (!dbOLD.data.programs[name]) {
        const error = `error program "${name}" does NOT exist`
        log.error(`setEnviromentVariables("${name}", "${JSON.stringify(env)}") -> ${error}`)
        return error
    } else if (dbOLD.data.programs[name].running === true) {
        const error = `error program "${name}" is running`
        log.error(`setEnviromentVariables("${name}", "${JSON.stringify(env)}") -> ${error}`)
        return error
    } else if (typeof env !== 'object') {
        const error = `error env is NOT an object`
        log.error(`setEnviromentVariables("${name}", "${JSON.stringify(env)}") -> ${error}`)
        return error
    }

    // Set enviroment variables
    dbOLD.data.programs[name].env = env
    dbOLD.write()
    emitter.emit('status', name, status(name))
    emitter.emit('status-all', statusAll())
    log.debug(`setEnviromentVariables("${name}", "${JSON.stringify(env)}") -> "ok"`)
    return "ok"
}

function startAll() {
    log.debug(`startAll() -> "ok"`)
    Object.keys(dbOLD.data.programs).forEach(name => start(name))
    return "ok"
}
function sendAll(text) {
    log.debug(`killAll() -> "ok"`)
    Object.keys(dbOLD.data.programs).forEach(name => send(name, text))
    return "ok"
}
function killAll() {
    log.debug(`killAll() -> "ok"`)
    Object.keys(dbOLD.data.programs).forEach(name => kill(name))
    return "ok"
}
function restartAll() {
    log.debug(`restartAll() -> "ok"`)
    Object.keys(dbOLD.data.programs).forEach(name => restart(name))
    return "ok"
}
function removeAll() {
    log.debug(`removeAll() -> "ok"`)
    Object.keys(dbOLD.data.programs).forEach(name => remove(name))
    dbOLD.data.programs = {}
    return "ok"
}

async function resetToDefault() {
    dbOLD = await resetDatabase("programs")
    emitter.emit('status-all', statusAll())
}


// Helper Functions
function dbResetRunning() {
    Object.keys(dbOLD.data.programs).forEach(name => {
        dbOLD.data.programs[name].running = false
    })
}
function splitByWhitespace(string) {
    return string.trim().split(/\s+/)
}
async function checkAvailablePrograms() {
    const availableAsJSON_prev = JSON.stringify(dbOLD.data.available)
    const stats = await getStatsRecursive(PATH_TO_PROGRAMS)
    dbOLD.data.available = {}
    for (const folder of stats.contains_folders) {
        const directory = folder.folder_name.replace("/", "")
        dbOLD.data.available[directory] = {
            directory: `${PATH_TO_PROGRAMS}/${directory}`,
            command: "echo hi",
            env: {},
            files: [],
        }
        for (const file of folder.contains_files) {
            dbOLD.data.available[directory].files.push(file.file_name)
            if (file.file_name.endsWith(".js") || file.file_name.endsWith(".mjs")) {
                dbOLD.data.available[directory].command = "node " + file.file_name
            }
            else if (file.file_name.endsWith(".py")) {
                dbOLD.data.available[directory].command = "python3 " + file.file_name
            }
            else if (file.file_name.endsWith(".env")) {
                const envFile = await readText(file.path)
                const envFileLines = envFile.split("\n")
                envFileLines.forEach(line => {
                    const key = line.split("=")[0].trim()
                    const value = line.split("=")[1].trim()
                    dbOLD.data.available[directory].env[key] = value
                });
            }
        }
    }
    const availableAsJSON = JSON.stringify(dbOLD.data.available)
    if (availableAsJSON !== availableAsJSON_prev) {
        emitter.emit('available', dbOLD.data.available)
        log.debug(`available() -> "updated"`, dbOLD.data.available)
        await dbOLD.write()
    }
    return dbOLD.data.available
}
