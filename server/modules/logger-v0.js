// Overview: standard way to create log files
// Location: ~/av-server/private/logs/filename.log
// Filename: log_YEAR-MONTH-DAY-STARTUPTIME-SEQ.log
// Log Line: timestampISO >> level >> group >> message >> obj

// Imports
import { appendText, readText, makeDir, getStatsRecursive, deleteFile } from './files.js'
import { EventEmitter } from 'events'

// Classes
// new Logger

// Functions
// debug(level, group, message, obj)
// info(level, group, message, obj)
// error(level, group, message, obj)
// getLogHistory(length)
// getLogs()
// deleteLogs()

// Exports
export {
    debug,
    info,
    error,
    // getLogs,
    // getLogHistory,
    // deleteLogs,
    emitter,
}

// Constants
const NUMBER_OF_FILES_MAX = 4
const NUMBER_OF_LINES_MAX = 10_0
const OBJ_JSON_LENGTH_MAX = 10_000
const PATH_TO_LOG_FOLDER = "../private/logs/" // ~/av-server/private/logs
const SPACER = " >> "

// Variables
const emitter = new EventEmitter()
const startup = Date.now()
let count = 0

// Helper Functions
function getCurrentPath() {
    const timestampISO = new Date(Date.now()).toISOString()
    const date = timestampISO.split('T')[0]
    const sequence = Math.floor(count / NUMBER_OF_LINES_MAX)
    return PATH_TO_LOG_FOLDER + "log_" + date + "_" + startup + `_${sequence}.log`
}
function createLogLine(level, group, message, obj) {
    if (JSON.stringify(obj).length > OBJ_JSON_LENGTH_MAX) {
        obj = `VALUE NOT SHOWN object length greater than ${OBJ_JSON_LENGTH_MAX} characters`
    }
    const timestampISO = new Date(Date.now()).toISOString()
    const line = timestampISO + SPACER + level + SPACER + group + SPACER + message + SPACER + obj
    return line
}
async function deleteOldLogs() {
    const logFilesStats = await getStatsRecursive(PATH_TO_LOG_FOLDER)
    console.log(logFilesStats.contains_files.length);
    const fileNames = logFilesStats.contains_files
    const numberOfFiles = fileNames.length
    if (numberOfFiles > NUMBER_OF_FILES_MAX) {
        fileNames.sort((a, b) => {
            const keyA = new Date(a.created_iso)
            const keyB = new Date(b.created_iso)
            if (keyA < keyB) return -1
            if (keyA > keyB) return 1
            return 0
        })
        const deletePath = fileNames[0].path
        await deleteFile(deletePath)
    }
}

// Functions
async function log(level, group, message, obj = {}) {
    await makeDir(PATH_TO_LOG_FOLDER)
    const line = createLogLine(level, group, message, obj)
    const path = getCurrentPath()
    count++
    await appendText(path, line + "\n")
    emitter.emit("log", line)
    await deleteOldLogs()
}
async function debug(group, message, obj = {}) {
    await log("debug", group, message, obj)
}
async function info(group, message, obj = {}) {
    await log("info", group, message, obj)
}
async function error(group, message, obj = {}) {
    await log("error", group, message, obj)
}
async function deleteLogs() {
    const logFilesStats = await getStatsRecursive(PATH_TO_LOG_FOLDER)
    console.log(logFilesStats.contains_files.length);
    if (logFilesStats.contains_files > 0) {
        const fileNames = logFilesStats.contains_files
        fileNames.forEach(async file => {
            await deleteFile(file.path)
        })
    }
    log("debug", "logger", "deleteAllLogs")
}

// Class
class Logger {
    constructor(group) {
        this.group = group
    }
    async debug(message, obj = {}) {
        await log("debug", this.group, message, obj)
    }
    async info(message, obj = {}) {
        await log("info", this.group, message, obj)
    }
    async error(message, obj = {}) {
        await log("error", this.group, message, obj)
    }
}

// Startup
await makeDir(PATH_TO_LOG_FOLDER)
await deleteLogs()
if (process.env.DEV_MODE) await deleteLogs()

// Testing
const logger = new Logger("logger.js")
let counter = 0
setInterval(() => {
    counter++
    logger.debug("counter", counter)
    logger.info("counter", counter)
    logger.error("counter", counter)
}, 100)
// emitter.on("log", (logObj) => {
//     console.log(logObj)
// })
