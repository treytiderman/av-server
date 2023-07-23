// Overview: standard way to create log files
// Location: /logs/log_date.log
// Files: One file per day, No more than <NUMBER_OF_FILES_MAX> files
// File: Is split into a new file if files lines greater than <NUMBER_OF_LINES_MAX>
// Log Object: {
//     "timestampISO": timestampISO,
//     "level": level,
//     "group": group,
//     "message": message,
//     "obj": obj,
// }

// Imports
import { appendText, readText, makeDir, getStatsRecursive, deleteFile } from './files.js'
import { EventEmitter } from 'events'

// Exports
export {
    log,
    deleteAllLogs,
    Logger,
    emitter,
    PATH_TO_LOG_FOLDER,
}

// Constants
const NUMBER_OF_FILES_MAX = 10
const NUMBER_OF_LINES_MAX = 10_000
const OBJ_JSON_LENGTH_MAX = 10_000
const PATH_TO_LOG_FOLDER = "../logs/"

// Variables
const emitter = new EventEmitter()
let logFileIndex = 0

// Functions
function newLogObj(level, group, message, obj) {
    const timestampISO = new Date(Date.now()).toISOString()
    if (JSON.stringify(obj).length > OBJ_JSON_LENGTH_MAX) obj = `VALUE NOT SHOWN length greater than ${OBJ_JSON_LENGTH_MAX} characters`
    const lineObj = {
        "timestampISO": timestampISO,
        "level": level,
        "group": group,
        "message": message,
        "obj": obj,
    }
    return lineObj
}
function getPath() {
    const timeDate = new Date(Date.now()).toISOString()
    const date = timeDate.split('T')[0]
    return PATH_TO_LOG_FOLDER + date + `_${logFileIndex}.log`
}
async function getLogFileStats() {
    const logFilesStats = await getStatsRecursive(PATH_TO_LOG_FOLDER)
    return logFilesStats.contains_files
}
async function updateLogFileIndex() {
    const timeDate = new Date(Date.now()).toISOString()
    const date = timeDate.split('T')[0]
    const fileNames = await getLogFileStats()
    fileNames.forEach(async (file) => {
        const fromToday = file.file_name.startsWith(date)
        if (fromToday) {
            const indexFromFile = Number(file.file_name.replace(date + "_", "").replace(".log", ""))
            if (logFileIndex < indexFromFile) { logFileIndex = indexFromFile }
        }
    })
}
async function checkNumberOfLines(path) {
    const file = await readText(path) || ""
    const fileLines = file.split("\n")
    const hasMaxLines = fileLines.length >= NUMBER_OF_LINES_MAX
    if (hasMaxLines) { logFileIndex++ }
}
async function deleteOldLogs() {
    const fileNames = await getLogFileStats()
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
async function log(level, group, message, obj = {}) {
    const logObj = newLogObj(level, group, message, obj)
    const path = getPath()
    await makeDir(PATH_TO_LOG_FOLDER)
    await updateLogFileIndex()
    await appendText(path, JSON.stringify(logObj) + "\n")
    await checkNumberOfLines(path)
    await deleteOldLogs()
    emitter.emit("log", logObj)
}
async function deleteAllLogs() {
    const fileNames = await getLogFileStats()
    fileNames.forEach(async file => {
        await deleteFile(file.path)
    })
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
await updateLogFileIndex()
await deleteOldLogs()
if (process.env.DEV_MODE) await deleteAllLogs()

// Testing
// const logger = new Logger("logger.js")
// let counter = 0
// setInterval(() => {
//     counter++
//     logger.debug("counter", counter)
//     logger.info("counter", counter)
//     logger.error("counter", counter)
// }, 1000)
// emitter.on("log", (logObj) => {
//     console.log(logObj)
// })
