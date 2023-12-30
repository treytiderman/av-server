// Overview: standard way to create log files
// Location: ~/av-server/private/logs/filename.log
// Filename: log_YEAR-MONTH-DAY-STARTUPTIME-SEQ.log
// Log Line: timestampISO LEVEL [group] message >> obj

// Imports
import { appendText, makeDir, getStatsRecursive, deleteFile } from './file-v0.js'
import { EventEmitter } from 'events'

// Exports
export {
    Logger,
    debug,
    info,
    warn,
    error,
    call,
    getHistory,
    deleteLogs,
    emitter,
}

// Constants
const MAX_HISTORY_LENGTH = 1_000
const NUMBER_OF_FILES_MAX = 30
const NUMBER_OF_LINES_MAX = 10_000
const OBJ_JSON_LENGTH_MAX = 1_000
const PATH_TO_LOG_FOLDER = "../private/logs/" // ~/av-server/private/logs
const SPACER = ">>"
const LOG_LEVELS = [
    // "TRACE", 
    "DEBUG",
    "INFO ",
    "WARN ",
    "ERROR",
    // "FATAL",
]

// State
const emitter = new EventEmitter()
const startup = Date.now()
let count = 0
let history = []

// Startup
await makeDir(PATH_TO_LOG_FOLDER)

// Functions
function getHistory(length = 1000) {
    return history.slice(history.length - length, history.length)
}
async function debug(group, message, obj = {}) {
    await log("DEBUG", group, message, obj)
}
async function info(group, message, obj = {}) {
    await log("INFO ", group, message, obj)
}
async function warn(group, message, obj = {}) {
    await log("WARN ", group, message, obj)
}
async function error(group, message, obj = {}) {
    await log("ERROR", group, message, obj)
}
const call = (group, func, name = "") => async (...args) => {
    const start_ms = Date.now()
    const result = await func(...args)

    const functionString = name !== "" ? name : func.name
    const argStrings = args.map(arg => JSON.stringify(arg))
    const resultString = JSON.stringify(result)
    // const logType = resultString && resultString.startsWith('"error') ? "WARN " : "DEBUG"
    const logType = resultString && resultString.startsWith('"error') ? "FUNC " : "FUNC "
    const obj = isObject(result) || isArray(result) ? result : {}

    const message = `${Date.now() - start_ms}ms ${functionString}(${argStrings.join(", ")}) -> ${resultString}`
    await log(logType, group, message, obj)

    return result
}
async function deleteLogs() {
    const logFilesStats = await getStatsRecursive(PATH_TO_LOG_FOLDER)
    if (logFilesStats.contains_files.length > 0) {
        const fileNames = logFilesStats.contains_files
        fileNames.forEach(async file => {
            await deleteFile(file.path)
        })
    }
    // debug("logger.js", "deleteLogs()")
}

// Class
class Logger {
    constructor(group) {
        this.group = group
    }
    async debug(message, obj = {}) {
        await debug(this.group, message, obj)
    }
    async info(message, obj = {}) {
        await info(this.group, message, obj)
    }
    async warn(message, obj = {}) {
        await warn(this.group, message, obj)
    }
    async error(message, obj = {}) {
        await error(this.group, message, obj)
    }
    call = (func, name = "") => async (...args) => {
        return call(this.group, func, name)(...args)
    }
}

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
    const line = `${timestampISO} ${SPACER} ${level} ${SPACER} [${group}] ${message} ${SPACER} ${JSON.stringify(obj)}`
    return line
}
async function deleteOldLogs() {
    const logFilesStats = await getStatsRecursive(PATH_TO_LOG_FOLDER)
    if (logFilesStats?.contains_files && logFilesStats.contains_files.length > NUMBER_OF_FILES_MAX) {
        const fileNames = logFilesStats.contains_files
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
async function log(level, group, message, obj = {}) {
    count++
    const line = createLogLine(level, group, message, obj)
    const path = getCurrentPath()
    history.push(line)
    if (history.length > MAX_HISTORY_LENGTH) history.shift()

    emitter.emit("log", line)
    await makeDir(PATH_TO_LOG_FOLDER)
    await appendText(path, line + "\n")
    await deleteOldLogs()
}
function isObject(obj) {
    return typeof obj === 'object' && !Array.isArray(obj) && obj !== null
}
function isArray(array) {
    return Array.isArray(array) && array !== null
}
