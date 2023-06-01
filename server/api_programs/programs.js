const { spawn } = require('child_process')
const events = require('events')
const { getStatsRecursive } = require('../modules/files')

// TODO: Check out: https://pm2.keymetrics.io/docs/usage/pm2-api/

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
const emitter = new events.EventEmitter()
const state = {
    programs: {},
    available: {},
}

// Helper Functions
function splitByWhitespace(string) {
    return string.trim().split(/\s+/)
}
function clampHistory(name) {
    if (state.programs[name].out.length > MAX_HISTORY_LENGTH) {
        state.programs[name].out.shift()
    }
}

// Functions
async function updateAvailablePrograms() {
    const availableAsJSON_prev = JSON.stringify(state.available)
    const stats = await getStatsRecursive("../private/programs")
    stats.contains_folders.forEach(folder => {
        const folderName = folder.folder_name.replace("/", "")
        state.available[folderName] = {
            path: `../private/programs/${folderName}`,
            files: [],
            program: "node",
            args: "",
            env: {},
        }
        folder.contains_files.forEach(file => {
            state.available[folderName].files.push(file.file_name)
            if (file.file_name.endsWith(".js")) {
                state.available[folderName].program = "node"
                state.available[folderName].args = file.path
            }
            else if (file.file_name.endsWith(".py")) {
                state.available[folderName].program = "python"
                state.available[folderName].args = file.path
            }
        });
    });

    const availableAsJSON = JSON.stringify(state.available)
    if (availableAsJSON !== availableAsJSON_prev) {
        emitter.emit('avaiable', state.available)
    }

    return state.available
}
function getAvailablePrograms() {
    return state.available
}
function start(name, program, args, env = {}) {
    console.log(`${name} starting "${program} ${args}"`, env === {} ? JSON.stringify(env) : "")

    if (state.programs[name]?.running === true) {
        const error = "program already running"
        console.log(`${name} error ${error}`)
        emitter.emit('error', name, { error: error })
        return error
    }

    const argsArray = splitByWhitespace(args)
    const spawned = spawn(program, argsArray, {
        shell: false,
        env: env,
    })

    state.programs[name] = {
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
        state.programs[name].running = true
        emitter.emit('start', name)
    })

    spawned.on('exit', (code, signal) => {
        console.log(`${name} exit`)
        state.programs[name].running = false
        emitter.emit('exit', name)
    })

    spawned.stdout.on('data', (data) => {
        const dataObj = {
            from: "stdout",
            timestampISO: new Date(Date.now()).toISOString(),
            ascii: data.toString('ascii'),
        }
        console.log(`${name} stdout: ${dataObj.ascii}`)
        state.programs[name].out.push(dataObj)
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
        state.programs[name].out.push(dataObj)
        clampHistory(name)
        emitter.emit('out', name, dataObj)
    })
}
function startAvailable(folderName, name = folderName, env = {}) {
    const program = state.available[folderName].program
    const args = state.available[folderName].args
    start(name, program, args, env)
}
function kill(name) {
    const running = state.programs[name].running
    console.log(`${name} killed ${running ? "" : "...wasn't running"}`)
    state.programs[name].spawn.kill()
}
function killAll() {
    Object.keys(state.programs).forEach(name => kill(name))
}
function restart(name) {
    console.log(`${name} restarting`)
    const program = state.programs[name].program
    const args = state.programs[name].args
    const env = state.programs[name].env
    state.programs[name].spawn.kill()
    setTimeout(() => {
        start(name, program, args, env)
    }, RESTART_TIMEOUT_MS);
}
function getProgram(name) {
    return {
        program: state.programs[name].program,
        args: state.programs[name].args,
        env: state.programs[name].env,
        pid: state.programs[name].pid,
        running: state.programs[name].running,
        out: state.programs[name].out,
    }
}
function getPrograms() {
    const array = []
    Object.keys(state.programs).forEach(name => {
        array.push(getProgram(name))
    })
    return array
}

// Startup
setInterval(async () => {
    await updateAvailablePrograms()
}, UPDATE_AVAILABLE_MS)

// Export
exports.emitter = emitter
exports.start = start
exports.startAvailable = startAvailable
exports.kill = kill
exports.killAll = killAll
exports.restart = restart
exports.getProgram = getProgram
exports.getPrograms = getPrograms
exports.getAvailablePrograms = getAvailablePrograms
exports.updateAvailablePrograms = updateAvailablePrograms

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
//     console.log(getAvailablePrograms())
//     startAvailable("test-python-log")
//     startAvailable("test-nodejs-express", "test-nodejs-express", {port: 2009})
// }, 2_000)
// setTimeout(() => killAll(), 15_000)

// sudo netstat -lpn |grep :200*
// kill -9 1995300