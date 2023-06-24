// Overview: websocket routes for the files.js module
const {
    // appendText,
    // deleteFile,
    // deleteFolder,
    // exists,
    // getStats,
    // getStatsRaw,
    // getStatsRecursive,
    // makeDir,
    // readJSON,
    // readText,
    // rename,
    // writeJSON,
    // writeText
} = require('./files')

// wss = websocket server
// ws  = websocket client
const wss = require('../tools/websocket-server')

// Events
// wss.receiveEvent("system/time", "get", async (ws, body) => {
//     wss.subscribe(ws, "system/time")
//     wss.sendEvent(ws, "system/time", "update", getTimeAsISO())
//     wss.unsubscribe(ws, "system/time")
// })
