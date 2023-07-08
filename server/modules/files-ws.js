// Overview: websocket routes for the files.js module
// wss = websocket server
// ws  = websocket client

// Imports
import { receiveEvent, subscribe, sendEvent, unsubscribe } from '../tools/websocket-server.js'
import {
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
} from '../modules/files.js'

// Events
// receiveEvent("system/time", "get", async (ws, body) => {
//     subscribe(ws, "system/time")
//     sendEvent(ws, "system/time", "update", getTimeAsISO())
//     unsubscribe(ws, "system/time")
// })
