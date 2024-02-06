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
    // settings,
}

// State
const log = new Logger('program-v1.js')
const db = {
    settings: new Database('program-settings-v1'),
    status: new Database('program-status-v1'),
    history: new Database('program-history-v1'),
    available: new Database('program-avaiable-v1'),
}
const spawned = {}

// Startup
await db.settings.create({
    PATH_TO_PROGRAMS: "../private/programs", // ~/av-server/private/programs
    MAX_HISTORY_LENGTH: 1_000,
    UPDATE_AVAILABLE_MS: 1_000,
    RESTART_TIMEOUT_MS: 100,
})
await db.status.create()
await db.status.set({})
await db.status.write()
await db.history.create()
await db.available.create({ available: {} })

// Functions
const available = {
    get: () => db.available.getKey("available"),
    sub: (callback) => db.available.subKey("available", callback),
    unsub: (callback) => db.available.unsubKey("available", callback),
    update: async () => {
        const stats = await getStatsRecursive(db.settings.getKey("PATH_TO_PROGRAMS"))
        const availablePromise = stats.contains_folders.map(async folder => await parseFolder(folder))
        const available = await Promise.all(availablePromise)

        const availableAsJSON = JSON.stringify(available)
        const availableAsJSON_prev = JSON.stringify(db.available.getKey("available"))
        if (availableAsJSON !== availableAsJSON_prev) {
            db.available.setKey("available", available)
            await db.available.write()
        }
        return "ok"
    },
    pollStart: async () => {
        await available.update()
        setInterval(async () => await available.update(), db.settings.getKey("UPDATE_AVAILABLE_MS"))
        return "ok"
    }
}
const program = {
    get: (name) => db.status.getKey(name),
    sub: (name, callback) => db.status.subKey(name, callback),
    unsub: (name, callback) => db.status.unsubKey(name, callback),
    create: async (name, directory, command, startOnBoot = false, env = {}) => {

        // Errors
        if (db.status.getKey(name)?.running) return `error program '${name}' is running`

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
        db.history.setKey(name, [])
        db.status.setKey(name, prog)
        await db.status.write()
        return 'ok'
    },
    set: async (name, key, value) => {
        const status = db.status.getKey(name)
        const validKeys = ["directory", "command", "startOnBoot", "env"]

        // Errors
        if (!status) return `error program '${name}' does NOT exist`
        else if (status.running) return `error program '${name}' is running`
        else if (!validKeys.some(validKey => key === validKey)) return `error key '${key}' is NOT valid`

        // Set
        status[key] = value
        db.status.setKey(name, status)
        await db.status.write()

        return "ok"
    },
    setDirectory: async (name, directory) => program.set(name, "directory", directory),
    setCommand: async (name, command) => program.set(name, "command", command),
    setStartOnBoot: async (name, startOnBoot) => program.set(name, "startOnBoot", startOnBoot),
    setEnviromentVariables: async (name, env) => program.set(name, "env", env),
    start: (name, callback = () => { }) => {
        const status = db.status.getKey(name)

        // Errors
        if (!status) return `error program '${name}' does NOT exist`
        else if (status.running) return `error program '${name}' is running`

        // Spawn
        const commandArray = splitByWhitespace(status.command)
        const commandProgram = commandArray[0]
        commandArray.shift()
        try {
            spawned[name] = spawn(commandProgram, commandArray, {
                shell: false,
                cwd: status.directory,
                env: {
                    ...status.env,
                    PATH: process.env.PATH, // crashes without this
                },
            })
        } catch (error) {
            return `error program '${name}' failed to start ${error.message}`
        }

        // Event Functions
        async function onSpawn(name) {
            const status = db.status.getKey(name)
            if (!status) return
            status.running = true
            status.pid = spawned[name].pid
            db.status.setKey(name, status)
            callback(name)
            await db.status.write()
        }
        async function onExit(name) {
            const status = db.status.getKey(name)
            if (!status) return
            status.running = false
            db.status.setKey(name, status)
            await db.status.write()
        }
        async function onError(name, error) {
            console.log("program-v1:", error.message);
        }
        function onData(name, from, data) {
            const dataObj = {
                from: from,
                timestamp: new Date(Date.now()).toISOString(),
                data: data,
            }

            const history = db.history.getKey(name)
            history.push(dataObj)
            if (history.length > db.settings.getKey("MAX_HISTORY_LENGTH")) { history.shift() }
            db.history.setKey(name, history)
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
    send: (name, data) => {
        const status = db.status.getKey(name)

        // Errors
        if (!status) return `error program '${name}' does NOT exist`
        else if (!status.running) return `error program '${name}' is NOT running`

        // Send
        try { spawned[name].stdin.write(Buffer.from(data)) }
        catch (err) { return `error program '${name}' could NOT send "${data}"` }

        // History
        const dataObj = {
            from: "stdin",
            timestamp: new Date(Date.now()).toISOString(),
            data: data,
        }
        const history = db.history.getKey(name)
        history.push(dataObj)
        if (history.length > db.settings.getKey("MAX_HISTORY_LENGTH")) history.shift()
        db.history.setKey(name, history)

        return "ok"
    },
    kill: (name) => {
        const status = db.status.getKey(name)

        // Errors
        if (!status) return `error program '${name}' does NOT exist`

        // Kill
        try { spawned[name].kill() }
        catch (err) { return `error program '${name}' could NOT be killed "${err.message}"` }

        return "ok"
    },
    restart: (name) => {
        const status = db.status.getKey(name)

        // Errors
        if (!status) return `error program '${name}' does NOT exist`

        // Restart
        try {
            spawned[name].kill()
            setTimeout(() => program.start(name), db.settings.getKey("RESTART_TIMEOUT_MS"))
        } catch (err) {
            return `error program '${name}' could NOT be killed "${err.message}"`
        }

        return "ok"
    },
    remove: async (name) => {
        const status = db.status.getKey(name)

        // Errors
        if (!status) return `error program '${name}' does NOT exist`

        // Remove
        try {
            program.kill(name)
            await db.status.removeKey(name)
            await db.history.removeKey(name)
        } catch (err) {
            return `error program '${name}' could NOT be killed "${err.message}"`
        }

        return "ok"
    },
    log: {
        create: (name, directory, command, startOnBoot, env) => log.call(program.create, "program.create")(name, directory, command, startOnBoot, env),
        setDirectory: (name, directory) => log.call(program.setDirectory, "program.setDirectory")(name, directory),
        setCommand: (name, command) => log.call(program.setCommand, "program.setCommand")(name, command),
        setStartOnBoot: (name, startOnBoot) => log.call(program.setStartOnBoot, "program.setStartOnBoot")(name, startOnBoot),
        setEnviromentVariables: (name, env) => log.call(program.setEnviromentVariables, "program.setEnviromentVariables")(name, env),
        start: (name, callback = () => { }) => log.call(program.start, "program.start")(name, callback = () => { }),
        send: (name, data) => log.call(program.send, "program.send")(name, data),
        kill: (name) => log.call(program.kill, "program.kill")(name),
        restart: (name) => log.call(program.restart, "program.restart")(name),
        remove: (name) => log.call(program.remove, "program.remove")(name),
        set: (name, key, value) => log.call(program.set, "program.set")(name, key, value),
    },
}
const programs = {
    get: () => db.status.get(),
    sub: (callback) => db.status.sub(callback),
    unsub: (callback) => db.status.unsub(callback),
    start: async () => {
        db.status.keys().forEach(name => program.start(name))
        return 'ok'
    },
    send: async (data) => {
        db.status.keys().forEach(name => program.send(name, data))
        return 'ok'
    },
    kill: async () => {
        db.status.keys().forEach(name => program.kill(name))
        return 'ok'
    },
    restart: async () => {
        db.status.keys().forEach(name => program.restart(name))
        return 'ok'
    },
    remove: async () => {
        db.status.keys().forEach(name => program.remove(name))
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
    get: (name) => db.history.getKey(name),
    sub: (name, callback) => db.history.subKey(name, data => {
        data = data.splice(-1)[0]
        if (data) callback(data)
    }),
    unsub: (name, callback) => db.history.unsubKey(name, data => {
        data = data.splice(-1)[0]
        if (data) callback(data)
    }),
}
const history = {
    get: (name) => db.history.getKey(name),
    sub: (name, callback) => db.history.subKey(name, callback),
    unsub: (name, callback) => db.history.unsubKey(name, callback),
}
const logger = {
    program: {
        create: (name, directory, command, startOnBoot, env) => log.call(program.create, "program.create")(name, directory, command, startOnBoot, env),
        setDirectory: (name, directory) => log.call(program.setDirectory, "program.setDirectory")(name, directory),
        setCommand: (name, command) => log.call(program.setCommand, "program.setCommand")(name, command),
        setStartOnBoot: (name, startOnBoot) => log.call(program.setStartOnBoot, "program.setStartOnBoot")(name, startOnBoot),
        setEnviromentVariables: (name, env) => log.call(program.setEnviromentVariables, "program.setEnviromentVariables")(name, env),
        start: (name, callback = () => { }) => log.call(program.start, "program.start")(name, callback),
        send: (name, data) => log.call(program.send, "program.send")(name, data),
        kill: (name) => log.call(program.kill, "program.kill")(name),
        restart: (name) => log.call(program.restart, "program.restart")(name),
        remove: (name) => log.call(program.remove, "program.remove")(name),
        set: (name, key, value) => log.call(program.set, "program.set")(name, key, value),
    },
    programs: {
        start: () => log.call(programs.start, "programs.start")(),
        send: (data) => log.call(programs.send, "programs.send")(data),
        kill: () => log.call(programs.kill, "programs.kill")(),
        restart: () => log.call(programs.restart, "programs.restart")(),
        remove: () => log.call(programs.remove, "programs.remove")(),
    },
}

// Helper Functions
async function parseFolder(folder) {
    const directory = folder.folder_name.replace("/", "")
    const avaiableProgramFolder = {
        directory: `${db.settings.getKey("PATH_TO_PROGRAMS")}/${directory}`,
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
