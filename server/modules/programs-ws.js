// Overview: websocket routes for the programs.js module
// wss = websocket server
// ws  = websocket client

// Imports
import { emitter, receiveEvent, subscribe, sendEvent, sendEventAll, unsubscribe } from '../tools/websocket-server.js'
import {
    emitter as programEmitter,
    getAvailablePrograms,
    // createAvailableProgram,

    getProgram,
    getProgramWithHistory,
    createProgram,
    startProgram,
    killProgram,
    restartProgram,
    deleteProgram,

    setDirectory,
    setCommand,
    setStartOnBoot,
    setEnviromentVariables,

    getPrograms,
    killPrograms,
    restartPrograms,
    deletePrograms,
} from '../modules/programs.js'
import { isAdmin } from "../modules/users-ws.js";

// Function
function help(ws) {
    subscribe(ws, `program/help`)
    sendEvent(ws, `program/help`, "pub", {
        error: "request not recognized",
        try: [
            {
                "topic": "program/all",
                "event": "get",
            },
            {
                "topic": "program/all",
                "event": "sub",
            },
            {
                "topic": "program/all",
                "event": "kill",
            },
            {
                "topic": "program/all",
                "event": "delete",
            },
            {
                "topic": "program/available",
                "event": "get",
            },
            {
                "topic": "program/available",
                "event": "sub",
            },
            {
                "topic": "program/example-name",
                "event": "get",
            },
            {
                "topic": "program/example-name",
                "event": "sub",
            },
            {
                "topic": "program/example-name",
                "event": "create",
                "body": { "directory": "folder-name", "command": "node main.js", "startOnBoot": false, "env": { "key": "value" } },
            },
            {
                "topic": "program/example-name",
                "event": "create-and-start",
                "body": { "directory": "folder-name", "command": "node main.js", "startOnBoot": false, "env": { "key": "value" } },
            },
            {
                "topic": "program/example-name",
                "event": "create-available",
                "body": { "directory": "folder-name", "startOnBoot": false, "env": { "key": "value" } },
            },
        ]
    })
}

// Events
emitter.on("recieve", async (ws, topic, event, body) => {
    const topicSplit = topic?.split("/")

    // require admin for all endpoints
    if (!isAdmin(ws, topic, event)) {}

    // program/all
    else if (topic && topic === "program/all") {
        subscribe(ws, "program/all")
        if (event === "get") {
            try {
                const programs = getPrograms()
                sendEvent(ws, "program/all", "get", "ok")
                sendEvent(ws, "program/all", "pub", programs)
                unsubscribe(ws, "program/all")
            } catch (error) {
                sendEvent(ws, "program/all", "get", error.message)
                unsubscribe(ws, "program/all")
            }
        }
        else if (event === "sub") {
            try {
                const programs = getPrograms()
                sendEvent(ws, "program/all", "sub", "ok")
                sendEvent(ws, "program/all", "pub", programs)
            } catch (error) {
                sendEvent(ws, "program/all", "sub", error.message)
            }
        }
        else if (event === "kill") {
            try {
                await killPrograms()
                const programs = getPrograms()
                sendEvent(ws, "program/all", "kill", "ok")
                sendEventAll("program/all", "pub", programs)
            } catch (error) {
                sendEvent(ws, "program/all", "kill", error.message)
            }
        }
        else if (event === "restart") {
            try {
                await restartPrograms()
                const programs = getPrograms()
                sendEvent(ws, "program/all", "restart", "ok")
                sendEventAll("program/all", "pub", programs)
            } catch (error) {
                sendEvent(ws, "program/all", "restart", error.message)
            }
        }
        else if (event === "delete") {
            try {
                await deletePrograms()
                const programs = getPrograms()
                sendEvent(ws, "program/all", "delete", "ok")
                sendEventAll("program/all", "pub", programs)
            } catch (error) {
                sendEvent(ws, "program/all", "delete", error.message)
            }
        }
        else { help(ws) }
    }

    // program/available
    else if (topic && topic === "program/available") {
        subscribe(ws, "program/available")
        if (event === "get") {
            try {
                const programs = getAvailablePrograms()
                sendEvent(ws, "program/available", "get", "ok")
                sendEvent(ws, "program/available", "pub", programs)
                unsubscribe(ws, "program/available")
            } catch (error) {
                sendEvent(ws, "program/available", "get", error.message)
                unsubscribe(ws, "program/available")
            }
        }
        else if (event === "sub") {
            try {
                const programs = getAvailablePrograms()
                sendEvent(ws, "program/available", "sub", "ok")
                sendEvent(ws, "program/available", "pub", programs)
            } catch (error) {
                sendEvent(ws, "program/available", "sub", error.message)
            }
        }
        else { help(ws) }
    }

    // program/{name}
    else if (topic && topic.startsWith("program/") && topicSplit.length === 2) {
        const name = topicSplit[1]
        subscribe(ws, `program/${name}`)
        // if (!isAdmin(ws, `program/${name}`)) {
            
        // }
        // else if (event === "get") {
        if (event === "get") {
            try {
                const program = getProgram(name)
                sendEvent(ws, `program/${name}`, "get", "ok")
                sendEvent(ws, `program/${name}`, "pub", program)
                unsubscribe(ws, `program/${name}`)
            } catch (error) {
                sendEvent(ws, `program/${name}`, "get", error.message)
                unsubscribe(ws, `program/${name}`)
            }
        }
        else if (event === "sub") {
            try {
                const program = getProgram(name)
                sendEvent(ws, `program/${name}`, "sub", "ok")
                sendEvent(ws, `program/${name}`, "pub", program)
            } catch (error) {
                sendEvent(ws, `program/${name}`, "sub", error.message)
            }
        }
        else if (event === "create") {
            try {
                await createProgram(name, body.directory, body.command, body.startOnBoot, body.env)
                const program = getProgram(name)
                sendEvent(ws, `program/${name}`, "create", "ok")
                sendEventAll(`program/${name}`, "pub", program)
            } catch (error) {
                sendEvent(ws, `program/${name}`, "create", error.message)
            }
        }
        else if (event === "create-and-start") {
            try {
                await createProgram(name, body.directory, body.command, body.startOnBoot, body.env)
                await startProgram(name)
                const program = getProgram(name)
                sendEvent(ws, `program/${name}`, "create-and-start", "ok")
                sendEventAll(`program/${name}`, "pub", program)
            } catch (error) {
                sendEvent(ws, `program/${name}`, "create-and-start", error.message)
            }
        }
        else if (event === "start") {
            try {
                await startProgram(name)
                sendEvent(ws, `program/${name}`, "start", "ok")
                sendEventAll(`program/${name}`, "pub", program)
            } catch (error) {
                sendEvent(ws, `program/${name}`, "start", error.message)
            }
        }
        else if (event === "kill") {
            try {
                await killProgram(name)
                sendEvent(ws, `program/${name}`, "kill", "ok")
                sendEventAll(`program/${name}`, "pub", program)
            } catch (error) {
                sendEvent(ws, `program/${name}`, "kill", error.message)
            }
        }
        else if (event === "restart") {
            try {
                await restartProgram(name)
                sendEvent(ws, `program/${name}`, "restart", "ok")
                sendEventAll(`program/${name}`, "pub", program)
            } catch (error) {
                sendEvent(ws, `program/${name}`, "restart", error.message)
            }
        }
        else if (event === "delete") {
            try {
                await deleteProgram(name)
                sendEvent(ws, `program/${name}`, "delete", "ok")
                sendEventAll(`program/${name}`, "pub", program)
            } catch (error) {
                sendEvent(ws, `program/${name}`, "delete", error.message)
            }
        }
        else if (event === "set-directory") {
            try {
                await setDirectory(name, body.directory)
                sendEvent(ws, `program/${name}`, "set-directory", "ok")
                sendEventAll(`program/${name}`, "pub", program)
            } catch (error) {
                sendEvent(ws, `program/${name}`, "set-directory", error.message)
            }
        }
        else if (event === "set-command") {
            try {
                await setCommand(name, body.command)
                sendEvent(ws, `program/${name}`, "set-command", "ok")
                sendEventAll(`program/${name}`, "pub", program)
            } catch (error) {
                sendEvent(ws, `program/${name}`, "set-command", error.message)
            }
        }
        else if (event === "set-start-on-boot") {
            try {
                await setStartOnBoot(name, body.startOnBoot)
                sendEvent(ws, `program/${name}`, "set-start-on-boot", "ok")
                sendEventAll(`program/${name}`, "pub", program)
            } catch (error) {
                sendEvent(ws, `program/${name}`, "set-start-on-boot", error.message)
            }
        }
        else if (event === "set-env") {
            try {
                await setEnviromentVariables(name, body.env)
                sendEvent(ws, `program/${name}`, "set-env", "ok")
                sendEventAll(`program/${name}`, "pub", program)
            } catch (error) {
                sendEvent(ws, `program/${name}`, "set-env", error.message)
            }
        }
        else { help(ws) }
    }

    // program/{name}/data
    else if (topic && topic.startsWith("program/") && topicSplit.length === 3 && topicSplit[2] === "data") {
        const name = topicSplit[1]
        subscribe(ws, `program/${name}/data`)
        console.log()
        if (event === "get") {
            try {
                const programWithHistory = getProgramWithHistory(name)
                sendEvent(ws, `program/${name}/data`, "get", "ok")
                sendEvent(ws, `program/${name}/data`, "pub", programWithHistory.data[programWithHistory.data.length - 1])
                unsubscribe(ws, `program/${name}/data`)
            } catch (error) {
                sendEvent(ws, `program/${name}/data`, "get", error.message)
                unsubscribe(ws, `program/${name}/data`)
            }
        }
        else if (event === "sub") {
            try {
                const programWithHistory = getProgramWithHistory(name)
                sendEvent(ws, `program/${name}/data`, "sub", "ok")
                sendEvent(ws, `program/${name}/data`, "pub", programWithHistory.data[programWithHistory.data.length - 1])
            } catch (error) {
                sendEvent(ws, `program/${name}/data`, "sub", error.message)
            }
        }
        // else if (event === "send") {
        //     try {
        //         await sendProgramData(name, data)
        //         const programWithHistory = getProgramWithHistory(name)
        //         sendEvent(ws, `program/${name}/data`, "send", "ok")
        //         sendEvent(ws, `program/${name}/data`, "pub", programWithHistory.data[programWithHistory.data.length - 1])
        //     } catch (error) {
        //         sendEvent(ws, `program/${name}/data`, "send", error.message)
        //     }
        // }
        else { help(ws) }
    }

    // program/{name}/history
    else if (topic && topic.startsWith("program/") && topicSplit.length === 3 && topicSplit[2] === "data") {
        const name = topicSplit[1]
        subscribe(ws, `program/${name}/data`)
        console.log()
        if (event === "get") {
            try {
                const programWithHistory = getProgramWithHistory(name)
                sendEvent(ws, `program/${name}/data`, "get", "ok")
                sendEvent(ws, `program/${name}/data`, "pub", programWithHistory.data)
                unsubscribe(ws, `program/${name}/data`)
            } catch (error) {
                sendEvent(ws, `program/${name}/data`, "get", error.message)
                unsubscribe(ws, `program/${name}/data`)
            }
        }
        else if (event === "sub") {
            try {
                const programWithHistory = getProgramWithHistory(name)
                sendEvent(ws, `program/${name}/data`, "sub", "ok")
                sendEvent(ws, `program/${name}/data`, "pub", programWithHistory.data)
            } catch (error) {
                sendEvent(ws, `program/${name}/data`, "sub", error.message)
            }
        }
        else { help(ws) }
    }
})

programEmitter.on("available", (body) => {
    // console.log("available", body)
    sendEventAll(`program/available`, "pub", body)
})

programEmitter.on("start", (name, body) => {
    // console.log("start", name, body)
    sendEventAll(`program/${name}`, "pub", body)
})

programEmitter.on("data", (name, body) => {
    // console.log("data", name, body)
    sendEventAll(`program/${name}/data`, "pub", body)
    try {
        const programWithHistory = getProgramWithHistory(name)
        sendEventAll(`program/${name}/history`, "pub", programWithHistory.data)
    } catch (error) {}
})

programEmitter.on("error", (name, body) => {
    // console.log("error", name, body)
    sendEventAll(`program/${name}`, "error", body)
})

programEmitter.on("exit", async (name, body) => {
    // console.log("exit", name, body)
    sendEventAll(`program/${name}`, "pub", body)
})