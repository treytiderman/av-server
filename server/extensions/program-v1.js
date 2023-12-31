// Overview: spawn sub processes / user scripts

// Todos
// check out PM2: https://pm2.keymetrics.io/docs/usage/pm2-api/ & https://pm2.io/docs/runtime/reference/pm2-programmatic/
// - PM2 doesn't let you attach to stdin / stdout ??

// Imports
import { spawn } from 'child_process'
import { Logger } from '../modules/logger-v0.js'
import { Database } from '../modules/database-v1.js'
import { getStatsRecursive, readText } from '../modules/file-v0.js'

// Exports
export {
    available, // get, sub, unsub, read
    program, // get, sub, unsub, create, start, send, kill, restart, remove, 
             // set, setDirectory, setCommand, setStartOnBoot, setEnviromentVariables,
    data, // get, sub, unsub
    history, // get, sub, unsub
    programs, // get, sub, unsub, start, send, kill, restart, remove
    logger as log, // program, programs
}

// Variables
const log = new Logger('program-v1.js')
const dbSettings = new Database('program-settings-v1')
const dbStatus = new Database('program-status-v1')
const dbHistory = new Database('program-history-v1')
const dbAvailable = new Database('program-avaiable-v1')
const spawned = {}

// Startup
await dbSettings.create({
    PATH_TO_PROGRAMS: "../private/programs", // ~/av-server/private/programs
    MAX_HISTORY_LENGTH: 1_000,
    UPDATE_AVAILABLE_MS: 1_000,
    RESTART_TIMEOUT_MS: 100,
})
await dbStatus.create()
await dbStatus.set({})
await dbStatus.write()
await dbHistory.create()
await dbAvailable.create({ available: {} })

// Functions
const available = {
    get: () => dbAvailable.getKey("available", ),
    sub: (callback) => dbAvailable.subKey("available", callback),
    unsub: (callback) => dbAvailable.unsubKey("available", callback),
    update: async () => {
        const stats = await getStatsRecursive(dbSettings.getKey("PATH_TO_PROGRAMS"))
        const availablePromise = stats.contains_folders.map(async folder => await parseFolder(folder))
        const available = await Promise.all(availablePromise)

        const availableAsJSON = JSON.stringify(available)
        const availableAsJSON_prev = JSON.stringify(dbAvailable.getKey("available"))
        if (availableAsJSON !== availableAsJSON_prev) {
            dbAvailable.setKey("available", available)
            await dbAvailable.write()
        }
        return "ok"
    },
    pollStart: async () => {
        await available.update()
        setInterval(async () => await available.update(), dbSettings.getKey("UPDATE_AVAILABLE_MS"))
        return "ok"
    }
}
const program = {
    get: (name) => dbStatus.getKey(name),
    sub: (name, callback) => dbStatus.subKey(name, callback),
    unsub: (name, callback) => dbStatus.unsubKey(name, callback),
    create: async (name, directory, command, startOnBoot = false, env = {}) => {

        // Errors
        if (dbStatus.getKey(name)?.running) return `error program '${name}' is running`

        // Create program
        const prog = {
            name: name,
            running: false,
            startOnBoot: startOnBoot,
            pid: undefined,
            directory: directory,
            command: command,
            env: env,
        }
        dbHistory.setKey(name, [])
        dbStatus.setKey(name, prog)
        await dbStatus.write()
        return 'ok'
    },
    setDirectory: async (name, directory) => program.set(name, "directory", directory),
    setCommand: async (name, command) => program.set(name, "command", command),
    setStartOnBoot: async (name, startOnBoot) => program.set(name, "startOnBoot", startOnBoot),
    setEnviromentVariables: async (name, env) => program.set(name, "env", env),
    start: (name, callback = () => { }) => {
        const prog = dbStatus.getKey(name)

        // Errors
        if (!prog) return `error program '${name}' does NOT exist`
        else if (prog.running) return `error program '${name}' is running`

        // Spawn
        const commandArray = splitByWhitespace(prog.command)
        const commandProgram = commandArray[0]
        commandArray.shift()
        try {
            spawned[name] = spawn(commandProgram, commandArray, {
                shell: false,
                cwd: prog.directory,
                env: {
                    ...prog.env,
                    PATH: process.env.PATH, // crashes without this
                },
            })
        } catch (error) {
            return `error program '${name}' failed to start ${error.message}`
        }

        // Event Functions
        async function onSpawn(name) {
            const prog = dbStatus.getKey(name)
            if (!prog) return
            prog.running = true
            prog.pid = spawned[name].pid
            dbStatus.setKey(name, prog)
            callback(name)
            await dbStatus.write()
        }
        async function onExit(name) {
            const prog = dbStatus.getKey(name)
            if (!prog) return
            prog.running = false
            dbStatus.setKey(name, prog)
            await dbStatus.write()
        }
        async function onError(name, error) {
            return error.message
        }
        function onData(name, from, data) {
            const dataObj = {
                from: from,
                timestampISO: new Date(Date.now()).toISOString(),
                data: data,
            }

            const history = dbHistory.getKey(name)
            history.push(dataObj)
            if (history.length > dbSettings.getKey("MAX_HISTORY_LENGTH")) { history.shift() }
            dbHistory.setKey(name, history)
        }
        function onStdout(name, data) {
            onData(name, "stdout", data)
        }
        function onStderr(name, data) {
            onData(name, "stderr", data)
        }

        // Events
        spawned[name].on('spawn', (code, signal) => log.call(onSpawn, "program.onSpawn")(name))
        spawned[name].on('exit', (code, signal) => log.call(onExit, "program.onExit")(name))
        spawned[name].on('error', (error) => log.call(onError, "program.onError")(name, error))
        spawned[name].stdout.on('data', (data) => log.call(onStdout, "program.onStdout")(name, data.toString('utf8')))
        spawned[name].stderr.on('data', (data) => log.call(onStderr, "program.onStderr")(name, data.toString('utf8')))

        return 'ok'
    },
    send: (name, text) => {
        const prog = dbStatus.getKey(name)

        // Errors
        if (!prog) return `error program '${name}' does NOT exist`
        else if (!prog.running) return `error program '${name}' is NOT running`

        // Send
        try { spawned[name].stdin.write(Buffer.from(text)) }
        catch (err) { return `error program '${name}' could NOT send "${text}"` }

        // History
        const dataObj = {
            from: "stdin",
            timestampISO: new Date(Date.now()).toISOString(),
            data: text,
        }
        const history = dbHistory.getKey(name)
        history.push(dataObj)
        if (history.length > dbSettings.getKey("MAX_HISTORY_LENGTH")) { history.shift() }
        dbHistory.setKey(name, history)

        return "ok"
    },
    kill: (name) => {
        const prog = dbStatus.getKey(name)

        // Errors
        if (!prog) return `error program '${name}' does NOT exist`

        // Kill
        try { spawned[name].kill() }
        catch (err) { return `error program '${name}' could NOT be killed "${err.message}"` }

        return "ok"
    },
    restart: (name) => {
        const prog = dbStatus.getKey(name)

        // Errors
        if (!prog) return `error program '${name}' does NOT exist`

        // Restart
        try {
            spawned[name].kill()
            setTimeout(() => program.start(name), dbSettings.getKey("RESTART_TIMEOUT_MS"))
        } catch (err) {
            return `error program '${name}' could NOT be killed "${err.message}"`
        }

        return "ok"
    },
    remove: async (name) => {
        const prog = dbStatus.getKey(name)

        // Errors
        if (!prog) return `error program '${name}' does NOT exist`

        // Remove
        try {
            // program.kill(name)
            spawned[name].kill()
            await dbStatus.removeKey(name)
            await dbHistory.removeKey(name)
        } catch (err) {
            return `error program '${name}' could NOT be killed "${err.message}"`
        }

        return "ok"
    },
    set: async (name, key, value) => {
        const prog = dbStatus.getKey(name)
        const validKeys = ["directory", "command", "startOnBoot", "env"]

        // Errors
        if (!prog) return `error program '${name}' does NOT exist`
        else if (!prog.running) return `error program '${name}' is NOT running`
        else if (!validKeys.some(validKey => key === validKey)) return `error key "${key}" is NOT valid`

        // Set
        prog[key] = value
        dbStatus.setKey(name, prog)
        await dbStatus.write()

        return "ok"
    },
    log: {
        create: (name, directory, command, startOnBoot, env) => log.call(program.create, "program.create")(name, directory, command, startOnBoot, env),
        setDirectory: (name, directory) => log.call(program.setDirectory, "program.setDirectory")(name, directory),
        setCommand: (name, command) => log.call(program.setCommand, "program.setCommand")(name, command),
        setStartOnBoot: (name, startOnBoot) => log.call(program.setStartOnBoot, "program.setStartOnBoot")(name, startOnBoot),
        setEnviromentVariables: (name, env) => log.call(program.setEnviromentVariables, "program.setEnviromentVariables")(name, env),
        start: (name, callback = () => { }) => log.call(program.start, "program.start")(name, callback = () => { }),
        send: (name, text) => log.call(program.send, "program.send")(name, text),
        kill: (name) => log.call(program.kill, "program.kill")(name),
        restart: (name) => log.call(program.restart, "program.restart")(name),
        remove: (name) => log.call(program.remove, "program.remove")(name),
        set: (name, key, value) => log.call(program.set, "program.set")(name, key, value),
    },
}
const programs = {
    get: () => dbStatus.get(),
    sub: (callback) => dbStatus.sub(callback),
    unsub: (callback) => dbStatus.unsub(callback),
    start: async () => {
        dbStatus.keys().forEach(name => program.start(name))
        return 'ok'
    },
    send: async (text) => {
        dbStatus.keys().forEach(name => program.send(name, text))
        return 'ok'
    },
    kill: async () => {
        dbStatus.keys().forEach(name => program.kill(name))
        return 'ok'
    },
    restart: async () => {
        dbStatus.keys().forEach(name => program.restart(name))
        return 'ok'
    },
    remove: async () => {
        dbStatus.keys().forEach(name => program.remove(name))
        return 'ok'
    },
    log: {
        start: () => log.call(programs.start, "programs.start")(),
        send: (text) => log.call(programs.send, "programs.send")(text),
        kill: () => log.call(programs.kill, "programs.kill")(),
        restart: () => log.call(programs.restart, "programs.restart")(),
        remove: () => log.call(programs.remove, "programs.remove")(),
    },
}
const data = {
    get: (name) => dbHistory.getKey(name),
    sub: (name, callback) => dbHistory.subKey(name, data => {
        data = data.splice(-1)[0]
        if (data) callback(data)
    }),
    unsub: (name, callback) => dbHistory.unsubKey(name, data => {
        data = data.splice(-1)[0]
        if (data) callback(data)
    }),
}
const history = {
    get: (name) => dbHistory.getKey(name),
    sub: (name, callback) => dbHistory.subKey(name, callback),
    unsub: (name, callback) => dbHistory.unsubKey(name, callback),
}
const logger = {
    program: {
        create: (name, directory, command, startOnBoot, env) => log.call(program.create, "program.create")(name, directory, command, startOnBoot, env),
        setDirectory: (name, directory) => log.call(program.setDirectory, "program.setDirectory")(name, directory),
        setCommand: (name, command) => log.call(program.setCommand, "program.setCommand")(name, command),
        setStartOnBoot: (name, startOnBoot) => log.call(program.setStartOnBoot, "program.setStartOnBoot")(name, startOnBoot),
        setEnviromentVariables: (name, env) => log.call(program.setEnviromentVariables, "program.setEnviromentVariables")(name, env),
        start: (name, callback = () => { }) => log.call(program.start, "program.start")(name, callback),
        send: (name, text) => log.call(program.send, "program.send")(name, text),
        kill: (name) => log.call(program.kill, "program.kill")(name),
        restart: (name) => log.call(program.restart, "program.restart")(name),
        remove: (name) => log.call(program.remove, "program.remove")(name),
        set: (name, key, value) => log.call(program.set, "program.set")(name, key, value),
    },
    programs: {
        start: () => log.call(programs.start, "programs.start")(),
        send: (text) => log.call(programs.send, "programs.send")(text),
        kill: () => log.call(programs.kill, "programs.kill")(),
        restart: () => log.call(programs.restart, "programs.restart")(),
        remove: () => log.call(programs.remove, "programs.remove")(),
    },
}

// Helper Functions
async function parseFolder(folder) {
    const directory = folder.folder_name.replace("/", "")
    const avaiableProgramFolder = {
        directory: `${dbSettings.getKey("PATH_TO_PROGRAMS")}/${directory}`,
        command: "",
        env: {},
        files: [],
    }

    for (const file of folder.contains_files) {
        avaiableProgramFolder.files.push(file.file_name)
        if (file.file_name.endsWith(".js") || file.file_name.endsWith(".mjs")) {
            avaiableProgramFolder.command = "node " + file.file_name
        }
        else if (file.file_name.endsWith(".py")) {
            avaiableProgramFolder.command = "python3 " + file.file_name
        }
        else if (file.file_name.endsWith(".env")) {
            const envFile = await readText(file.path)
            const envFileLines = envFile.split("\n")
            envFileLines.forEach(line => {
                const key = line.split("=")[0].trim()
                const value = line.split("=")[1].trim()
                avaiableProgramFolder.env[key] = value
            })
        }
    }
    return avaiableProgramFolder
}
function splitByWhitespace(string) {
    return string.trim().split(/\s+/)
}

// Startup
await log.call(available.pollStart, "available.pollStart")()
