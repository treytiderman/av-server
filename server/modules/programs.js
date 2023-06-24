// Overview: spawn sub processes / user scripts
// TODO: tests
// TODO: use logger.js
// TODO: Check out: https://pm2.keymetrics.io/docs/usage/pm2-api/
const { spawn } = require('child_process')
const { getStatsRecursive, readText } = require('./files')

// Event Emitter
const events = require('events')
const emitter = new events.EventEmitter()

/* Events example
const programs = require('../modules/programs')
programs.emitter.on("avaiable", (body) => {}
programs.emitter.on("start", (name, body) => {}
programs.emitter.on("error", (name, body) => {}
programs.emitter.on("exit", (name, body) => {}
programs.emitter.on("out", (name, body) => {}
*/

// Variables
const MAX_HISTORY_LENGTH = 1_000
const UPDATE_AVAILABLE_MS = 1_000
const RESTART_TIMEOUT_MS = 1_000
const STATE = {
    programs: {},
    available: {},
}

// Helper Functions
function splitByWhitespace(string) {
    return string.trim().split(/\s+/)
}
function clampHistory(name) {
    if (STATE.programs[name].out.length > MAX_HISTORY_LENGTH) {
        STATE.programs[name].out.shift()
    }
}
async function updateAvailablePrograms() {
    const availableAsJSON_prev = JSON.stringify(STATE.available)
    const stats = await getStatsRecursive("../private/programs")
    stats.contains_folders.forEach(folder => {
        const folderName = folder.folder_name.replace("/", "")
        STATE.available[folderName] = {
            path: `../private/programs/${folderName}`,
            files: [],
            program: "node",
            args: "",
            env: {},
        }
        folder.contains_files.forEach(async file => {
            STATE.available[folderName].files.push(file.file_name)
            if (file.file_name.endsWith(".js")) {
                STATE.available[folderName].program = "node"
                STATE.available[folderName].args = file.path
            }
            else if (file.file_name.endsWith(".py")) {
                STATE.available[folderName].program = "python"
                STATE.available[folderName].args = file.path
            }
            else if (file.file_name.endsWith(".env")) {
                const envFile = await readText(file.path)
                const envFileLines = envFile.split("\n")
                envFileLines.forEach(line => {
                    const key = line.split("=")[0].trim()
                    const value = line.split("=")[1].trim()
                    STATE.available[folderName].env[key] = value
                });
            }
        })
    })

    const availableAsJSON = JSON.stringify(STATE.available)
    if (availableAsJSON !== availableAsJSON_prev) {
        emitter.emit('avaiable', STATE.available)
    }

    return STATE.available
}

// Functions
function getAvailable() {
    return STATE.available
}
function start(name, program, args, env = {}) {
    console.log(`${name} starting "${program} ${args}"`, env === {} ? JSON.stringify(env) : "")

    if (STATE.programs[name]?.running === true) {
        const error = "program already running"
        console.log(`${name} error ${error}`)
        emitter.emit('start', name, { error: error })
        return error
    }

    const argsArray = splitByWhitespace(args)
    const spawned = spawn(program, argsArray, {
        shell: false,
        env: env,
    })

    STATE.programs[name] = {
        program: program,
        args: args,
        env: env,
        pid: spawned.pid,
        running: false,
        out: [],
        spawn: spawned,
    }

    spawned.on('spawn', (code, signal) => {
        console.log(`${name} start`)
        STATE.programs[name].running = true
        emitter.emit('start', name)
    })

    spawned.on('exit', (code, signal) => {
        console.log(`${name} exit`)
        STATE.programs[name].running = false
        emitter.emit('exit', name)
    })

    spawned.stdout.on('data', (data) => {
        const dataObj = {
            from: "stdout",
            timestampISO: new Date(Date.now()).toISOString(),
            ascii: data.toString('ascii'),
        }
        console.log(`${name} stdout: ${dataObj.ascii}`)
        STATE.programs[name].out.push(dataObj)
        clampHistory(name)
        emitter.emit('out', name, dataObj)
    })

    spawned.stderr.on('data', (data) => {
        const dataObj = {
            from: "stderr",
            timestampISO: new Date(Date.now()).toISOString(),
            ascii: data.toString('ascii'),
        }
        console.log(`${name} stderr: ${dataObj.ascii}`)
        STATE.programs[name].out.push(dataObj)
        clampHistory(name)
        emitter.emit('out', name, dataObj)
    })
}
function startAvailable(programFolderName, name = programFolderName, env = {}) {
    const program = STATE.available[programFolderName].program
    const args = STATE.available[programFolderName].args
    start(name, program, args, env)
}
function kill(name) {
    const running = STATE.programs[name].running
    console.log(`${name} killed ${running ? "" : "...wasn't running"}`)
    STATE.programs[name].spawn.kill()
}
function killAll() {
    Object.keys(STATE.programs).forEach(name => kill(name))
}
function restart(name) {
    console.log(`${name} restarting`)
    const program = STATE.programs[name].program
    const args = STATE.programs[name].args
    const env = STATE.programs[name].env
    STATE.programs[name].spawn.kill()
    setTimeout(() => {
        start(name, program, args, env)
    }, RESTART_TIMEOUT_MS)
}
function getProgram(name) {
    if (STATE.programs[name]) {
        return {
            program: STATE.programs[name].program,
            args: STATE.programs[name].args,
            env: STATE.programs[name].env,
            pid: STATE.programs[name].pid,
            running: STATE.programs[name].running,
        }
    }
    return `${name} program not defined`
}
function getPrograms() {
    const array = []
    Object.keys(STATE.programs).forEach(name => {
        array.push(getProgram(name))
    })
    return array
}
function getDataHistory(name) {
    if (STATE.programs[name]) {
        return STATE.programs[name].out
    }
    return `${name} program not defined`
}

// Startup
setInterval(async () => {
    await updateAvailablePrograms()
}, UPDATE_AVAILABLE_MS)

// Export
exports.emitter = emitter
exports.getAvailable = getAvailable
exports.start = start
exports.startAvailable = startAvailable
exports.kill = kill
exports.killAll = killAll
exports.restart = restart
exports.getProgram = getProgram
exports.getPrograms = getPrograms
exports.getDataHistory = getDataHistory

// Testing

// console.log(splitByWhitespace("1   jkhgakfger ef       whfiwheifhbwe fwef"))

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
//     console.log(getAvailable())
//     startAvailable("test-python-log")
//     // startAvailable("test-nodejs-express", "test-nodejs-express", {port: 2009})
// }, 2_000)
// setTimeout(() => {
//     console.log(getProgram("test-python-log"))
// }, 4_000)
// setTimeout(() => killAll(), 15_000)

// sudo netstat -lpn |grep :200*
// kill -9 1995300