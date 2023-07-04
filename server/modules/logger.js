// Overview: Standard way to create log files
const { appendText, readText, makeDir, getStatsRecursive, deleteFile } = require('./files')
const events = require('events')

// Location: /private/logs/log_date.log
// Log Object: {
//     "timestampISO": timestampISO,
//     "level": level,
//     "group": group,
//     "message": message,
//     "obj": obj,
// }
// Files: One file per day, No more than <NUMBER_OF_FILES_MAX> files
// File: Is split into a new file if files lines greater than <NUMBER_OF_LINES_MAX>

// Variables
const NUMBER_OF_FILES_MAX = 10
const NUMBER_OF_LINES_MAX = 10_000
const OBJ_JSON_LENGTH_MAX = 1_000
const LOG_FOLDER_PATH = "../logs/"
const emitter = new events.EventEmitter()

let logFileIndex = 0

// Functions
function newLogObj(level, group, message, obj) {
    const timestampISO = new Date(Date.now()).toISOString()
    if (JSON.stringify(obj).length > OBJ_JSON_LENGTH_MAX) obj = `length greater than ${OBJ_JSON_LENGTH_MAX} characters`
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
    return LOG_FOLDER_PATH + date + `_${logFileIndex}.log`
} 
async function getLogFileStats() {
    const logFilesStats = await getStatsRecursive(LOG_FOLDER_PATH)
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
    await makeDir(LOG_FOLDER_PATH)
    await updateLogFileIndex()
    await appendText(path, JSON.stringify(logObj) + "\n")
    await checkNumberOfLines(path)
    await deleteOldLogs()
    emitter.emit("log", logObj)
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
makeDir(LOG_FOLDER_PATH)
updateLogFileIndex()
deleteOldLogs()

// Exports
exports.log = log
exports.Logger = Logger
exports.emitter = emitter

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
