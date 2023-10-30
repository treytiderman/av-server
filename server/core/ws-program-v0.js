// Overview: websocket routes for the system.js module

// Imports
// import {
//     receivePath,
//     sendPath,
//     sendPathIfSub,
//     sendAllPath,
//     sendAllPathIfSub,
//     subscribe,
//     unsubscribe,
// } from './websocket-server.js'
import { 
    emitter, // available, start, error, exit, out

    getAvailablePrograms,
    
    getProgram,
    getProgramWithHistory,
    createProgram,
    startProgram,
    killProgram,
    restartProgram,
    deleteProgram,
    sendProgram,
    
    setDirectory,
    setCommand,
    setStartOnBoot,
    setEnviromentVariables,
    
    getPrograms,
    killPrograms,
    restartPrograms,
    deletePrograms,
} from '../modules/programs.js'
// import { isAdmin } from './ws-users-v0.js'

// system/v0/topic
// receivePath("system/v0/topic/time", async (ws, path, body) => {
//     if (body === "unsub") {
//         unsubscribe(ws, path)
//     } else if (body === "sub") {
//         subscribe(ws, path)
//     }

//     sendPath(ws, path, getTime())
// })

// Updates
// emitter.on("getTime", (data) => {
//     sendAllPathIfSub("system/v0/topic/time", data)
// })
