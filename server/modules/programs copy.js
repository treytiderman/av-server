// Overview: spawn sub processes / user scripts

// Todos
// check out PM2: https://pm2.keymetrics.io/docs/usage/pm2-api/ & https://pm2.io/docs/runtime/reference/pm2-programmatic/
// - PM2 doesn't let you attach to stdin / stdout ??

// Imports
import { spawn } from 'child_process'
import { getStatsRecursive, readText } from './files.js'
import { Logger } from './logger.js'
import { createDatabase } from './database.js'

// Event Emitter
import events from 'events'

// Exports
export {
    emitter, // available, start, error, exit, out

    getAvailablePrograms,
    // createAvailableProgram,
    
    getProgram,
    getProgramWithHistory,
    createProgram,
    startProgram,
    killProgram,
    restartProgram,
    deleteProgram,
    sendProgram,
    
    setDirectory,
    setCommand,
    setStartOnBoot,
    setEnviromentVariables,
    
    getPrograms,
    killPrograms,
    restartPrograms,
    deletePrograms,
}

// Constants
const PATH_TO_PROGRAMS = "../private/programs" // ~/av-server/private/programs
const MAX_HISTORY_LENGTH = 1_000
const UPDATE_AVAILABLE_MS = 1_000
const RESTART_TIMEOUT_MS = 1_000
const DEFAULT_STATE = { programs: {}, available: {} }

// Variables
const log = new Logger("modules/programs.js")
const emitter = new events.EventEmitter()
const db = await createDatabase('programs', DEFAULT_STATE)
const spawnedList = {}

// Helper Functions
function splitByWhitespace(string) {
    return string.trim().split(/\s+/)
}
async function checkAvailablePrograms() {
    const availableAsJSON_prev = JSON.stringify(db.data.available)
    const stats = await getStatsRecursive(PATH_TO_PROGRAMS)
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
            if (file.file_name.endsWith(".js")) {
                db.data.available[directory].command = "node " + file.file_name
            }
            else if (file.file_name.endsWith(".py")) {
                db.data.available[directory].command = "python " + file.file_name
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
        await db.write()
    }
    return db.data.available
}

// Functions
function getAvailablePrograms() {
    // log.debug(`getAvailablePrograms()`, db.data.available)
    return db.data.available
}

function getProgram(name) {
    const program = db.data.programs[name]
    if (!program) {
        log.error(`getProgram("${name}")`, "error program doesn't exist")
        // throw new Error("error program doesn't exist")
        return undefined
    }
    const programWithoutHistory = {
        command: program.command,
        env: program.env,
        startOnBoot: program.startOnBoot,
        running: program.running,
        pid: program.pid,
    }
    // log.debug(`getProgram("${name}")`, programWithoutHistory)
    return programWithoutHistory
}
function getProgramWithHistory(name) {
    const program = db.data.programs[name]
    if (!program) {
        log.error(`getProgramWithHistory("${name}")`, "error program doesn't exist")
        throw new Error("error program doesn't exist")
    }
    const programWithHistory = {
        command: program.command,
        env: program.env,
        startOnBoot: program.startOnBoot,
        running: program.running,
        pid: program.pid,
        data: program.data,
    }
    log.debug(`getProgramWithHistory("${name}")`, programWithHistory)
    return programWithHistory
}
async function createProgram(name, directory, command, startOnBoot = false, env = {}) {
    const programs = db.data.programs
    if (programs[name]?.running) {
        log.error(`createProgram("${name}", "${directory}", "${command}", "${startOnBoot}", env)`, "error program is running")
        throw new Error("error program is running")
    }

    programs[name] = {
        running: false,
        startOnBoot: startOnBoot,
        pid: undefined,
        directory: directory,
        command: command,
        env: env,
        data: [],
    }
    await db.write()
    log.debug(`createProgram("${name}", "${directory}", "${command}", "${startOnBoot}", env)`, programs[name])
    return programs[name]
}
async function startProgram(name) {
    log.debug(`trying startProgram("${name}")`)
    const program = db.data.programs[name]

    // Errors
    if (!program) {
        const error = "error program does not exist"
        log.error(`startProgram("${name}") -> ${error}`)
        return error
    }
    else if (program.running === true) {
        const error = "error program already running"
        log.error(`startProgram("${name}") -> ${error}`)
        return error
    }

    // Spawn
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
    spawned.on('error', (error) => {
        emitter.emit('error', name, error)
        log.error(`startProgram(${name}) onError -> ${error.message}`, error)
    })
    spawned.on('spawn', async (code, signal) => {
        program.running = true
        emitter.emit('start', name)
        log.debug(`startProgram(${name}) onSpawn -> "ok`)
        await db.write()
    })
    spawned.on('exit', async (code, signal) => {
        program.running = false
        emitter.emit('exit', name)
        log.debug(`startProgram(${name}) onExit`)
        await db.write()
    })
    spawned.stdout.on('data', async (data) => {
        const dataObj = {
            from: "stdout",
            timestampISO: new Date(Date.now()).toISOString(),
            data: data.toString('utf8'),
        }
        program.data.push(dataObj)
        emitter.emit('data', name, dataObj)
        log.debug(`startProgram(${name}) onStdout`, dataObj.data)
        if (program.data.length > MAX_HISTORY_LENGTH) { program.data.shift() }
        await db.write()
    })
    spawned.stderr.on('data', async (data) => {
        const dataObj = {
            from: "stderr",
            timestampISO: new Date(Date.now()).toISOString(),
            data: data.toString('utf8'),
        }
        program.data.push(dataObj)
        emitter.emit('data', name, dataObj)
        log.debug(`startProgram(${name}) onStderr`, dataObj.data)
        if (program.data.length > MAX_HISTORY_LENGTH) { program.data.shift() }
        await db.write()
    })

    return "ok"
}
async function sendProgram(name, text) {
    const program = db.data.programs[name]
    if (!program) {
        log.error(`sendProgram("${name}", "${text}") -> error program does not exist`)
        return "error program does not exist"
    }

    try {
        spawnedList[name].stdin.write(Buffer.from(text))
        const dataObj = {
            from: "stdin",
            timestampISO: new Date(Date.now()).toISOString(),
            data: text,
        }
        program.data.push(dataObj)
        if (program.data.length > MAX_HISTORY_LENGTH) { program.data.shift() }
        log.debug(`sendProgram("${name}", "${text}") -> "ok"`)
        emitter.emit('data', name, dataObj)
        await db.write()
        return "ok"
    } catch (error) {
        log.error(`sendProgram("${name}", "${text}")`, "error could not be sent")
        return "error"
    }
}
async function killProgram(name) {
    const program = db.data.programs[name]
    if (!program) {
        log.error(`killProgram("${name}")`, "error program does not exist")
        throw new Error("error program does not exist")
    }

    program.running = false
    try {
        spawnedList[name].kill()
    } catch (error) {
        log.error(`killProgram("${name}")`, "error could not be killed")
        // throw new Error("error could not be killed")
    }

    await db.write()
    log.debug(`killProgram("${name}")`, program)
    return "ok"
}
async function restartProgram(name) {
    const program = db.data.programs[name]
    if (!program) {
        log.error(`restartProgram("${name}")`, "error program does not exist")
        throw new Error("error program does not exist")
    }

    log.debug(`restartProgram("${name}")`, "restarting...")
    try {
        spawnedList[name].kill()
    } catch (error) {
        log.error(`killProgram("${name}")`, "error could not be killed")
        throw new Error("error could not be killed")
    }
    setTimeout(async () => {
        await start(name)
    }, RESTART_TIMEOUT_MS)
}
async function deleteProgram(name) {
    const program = db.data.programs[name]
    if (!program) {
        log.error(`deleteProgram("${name}")`, "error program does not exist")
        throw new Error("error program does not exist")
    }

    try {
        spawnedList[name].kill()
        delete db.data.programs[name]
        log.debug(`deleteProgram("${name}")`, "ok")
    } catch (error) {
        log.error(`deleteProgram("${name}")`, "error could not be deleted")
        throw new Error("error could not be deleted")
    }

    await db.write()
    return "ok"
}

async function setDirectory(name, directory) {
    const program = db.data.programs[name]
    if (!program) {
        log.error(`setDirectory("${name}", "${directory}")`, "error program does not exist")
        throw new Error("error program does not exist")
    }
    
    program.directory = directory
    await db.write()
    log.debug(`setDirectory("${name}", "${directory}")`, program)
    return program
}
async function setCommand(name, command) {
    const program = db.data.programs[name]
    if (!program) {
        log.error(`setCommand("${name}")`, "error program does not exist")
        throw new Error("error program does not exist")
    }
    
    program.command = command
    await db.write()
    log.debug(`setCommand("${name}", "${command}")`, program)
    return program
}
async function setStartOnBoot(name, startOnBoot) {
    const program = db.data.programs[name]
    if (!program) {
        log.error(`setStartOnBoot("${name}")`, "error program does not exist")
        throw new Error("error program does not exist")
    }
    
    startOnBoot ? program.startOnBoot = true : program.startOnBoot = false
    await db.write()
    log.debug(`setStartOnBoot("${name}", "${startOnBoot}")`, program)
    return program
}
async function setEnviromentVariables(name, env) {
    const program = db.data.programs[name]
    if (!program) {
        log.error(`setEnviromentVariables("${name}", "${JSON.stringify(env)}")`, "error program does not exist")
        throw new Error("error program does not exist")
    }
    else if (typeof env !== 'object') {
        log.error(`setEnviromentVariables("${name}", "${JSON.stringify(env)}")`, "error env is not an object")
        throw new Error("error env is not an object")
    }

    program.env = env
    await db.write()
    log.debug(`setEnviromentVariables("${name}", "${JSON.stringify(env)}")`, program)
    return program
}

function getPrograms() {
    const programs = db.data.programs
    const array = []
    Object.keys(programs).forEach(name => {
        array.push(getProgram(name))
    })
    log.debug(`getPrograms()`, array)
    return array
}
async function killPrograms() {
    Object.keys(db.data.programs).forEach(async name => await killProgram(name))
    
    await db.write()
    log.debug(`killPrograms()`, db.data.programs)
    return db.data.programs
}
async function restartPrograms() {
    try {
        Object.keys(db.data.programs).forEach(async name => await restartProgram(name))
    } catch (error) {
        log.error("restartPrograms()", error.message)
    }
    
    await db.write()
    log.debug(`restartPrograms()`, db.data.programs)
    return db.data.programs
}
async function deletePrograms() {
    try {
        await killPrograms()
        db.data.programs = {}
    } catch (error) {
        log.error("deletePrograms()", error.message)
    }

    await db.write()
    log.debug(`deletePrograms()`, db.data.programs)
    return db.data.programs
}

// Startup
await checkAvailablePrograms()
setInterval(async () => {
    await checkAvailablePrograms()
}, UPDATE_AVAILABLE_MS)
// await killPrograms()
