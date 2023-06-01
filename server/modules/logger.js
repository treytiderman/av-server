const { appendText, readText, makeDir, getStatsRecursive, deleteFile } = require('./files')

// Overview
// Location: /private/logs/log_date.log
// Syntax: Timestamp ISO <DELIMITER> Group <DELIMITER> Message <DELIMITER> Obj to be JSON.stringify
// Files: One file per day, No more than <NUMBER_OF_FILES_MAX> files
// File: No longer than <NUMBER_OF_LINES_MAX> lines

// Variables
const DELIMITER = " >> "
const NUMBER_OF_FILES_MAX = 10
const NUMBER_OF_LINES_MAX = 10_000
const LOG_FOLDER_PATH = "../private/logs/"

let logFileIndex = 0

// Functions
function formatLine(group, message, obj = "") {
    const timestampISO = new Date(Date.now()).toISOString()
    const objJSON = JSON.stringify(obj)
    return timestampISO + DELIMITER + group + DELIMITER + message + DELIMITER + objJSON + "\n"
}
function formatPath() {
    const timeDate = new Date(Date.now()).toISOString()
    const date = timeDate.split('T')[0]
    return LOG_FOLDER_PATH + date + `_${logFileIndex}.log`
}
async function log(group, message, obj = "") {
    const line = formatLine(group, message, obj)
    const path = formatPath()
    await makeDir(LOG_FOLDER_PATH)
    await updateLogFileIndex()
    await appendText(path, line)
    await checkNumberOfLines(path)
    await deleteOldLogs()
}
async function deleteOldLogs() {
    const logFilesStats = await getStatsRecursive(LOG_FOLDER_PATH)
    const numberOfFiles = logFilesStats.contains_files.length
    if (numberOfFiles > NUMBER_OF_FILES_MAX) {
        // Works if logFilesStats.contains_files is always in alphabetical order
        const deletePath = logFilesStats.contains_files[0].path
        await deleteFile(deletePath)
    }
}
async function updateLogFileIndex() {
    const timeDate = new Date(Date.now()).toISOString()
    const date = timeDate.split('T')[0]
    const logFilesStats = await getStatsRecursive(LOG_FOLDER_PATH)
    logFilesStats.contains_files.forEach(async (file) => {
        const fromToday = file.file_name.startsWith(date)
        if (fromToday) {
            const indexFromFile = file.file_name.replace(date + "_", "").replace(".log", "")
            if (logFileIndex < indexFromFile) { logFileIndex = indexFromFile }
        }
    })
}
async function checkNumberOfLines(path) {
    const file = await readText(path) || ""
    const fileLines = file.split("\n")
    const fileLinesLength = fileLines.length
    const hasMaxLines = fileLinesLength > NUMBER_OF_LINES_MAX
    if (hasMaxLines) { logFileIndex++ }
}

// Startup
makeDir(LOG_FOLDER_PATH)
updateLogFileIndex()
deleteOldLogs()

// Exports
exports.log = log

// Testing

// let val = 0
// log("log test", LOG_FOLDER_PATH, val)

// setInterval(() => {
//     val++
//     log("log test", formatPath(), val)
// }, 1_000)
