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
                "body": {"directory": "folder-name", "command": "node main.js", "startOnBoot": false, "env": {"key": "value"}},
            },
            {
                "topic": "program/example-name",
                "event": "create-and-start",
                "body": {"directory": "folder-name", "command": "node main.js", "startOnBoot": false, "env": {"key": "value"}},
            },
            {
                "topic": "program/example-name",
                "event": "create-available",
                "body": {"directory": "folder-name", "startOnBoot": false, "env": {"key": "value"}},
            },
        ]
    })
}

// Events
emitter.on("recieve", async (ws, topic, event, body) => {
    const topicSplit = topic?.split("/")

    // program/all
    if (topic && topic === "program/all") {
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
                await killAll()
                const programs = getPrograms()
                sendEvent(ws, "program/all", "kill", "ok")
                sendEventAll("program/all", "pub", programs)
            } catch (error) {
                sendEvent(ws, "program/all", "kill", error.message)
            }
        }
        else if (event === "delete") {
            try {
                await clearPrograms()
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
    if (topic && topic === "program/available") {
        subscribe(ws, "program/available")
        if (event === "get") {
            try {
                const programs = getAvailable()
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
                const programs = getAvailable()
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
                await create(name, body.directory, body.command, body.directory, body.startOnBoot, body.env)
                const program = getProgram(name)
                sendEvent(ws, `program/${name}`, "create", "ok")
                sendEventAll(`program/${name}`, "pub", program)
            } catch (error) {
                sendEvent(ws, `program/${name}`, "create", error.message)
            }
        }
        else if (event === "create-and-start") {
            try {
                await create(name, body.directory, body.command, body.directory, body.startOnBoot, body.env)
                await startExisting(name)
                const program = getProgram(name)
                sendEvent(ws, `program/${name}`, "create-and-start", "ok")
                sendEventAll(`program/${name}`, "pub", program)
            } catch (error) {
                sendEvent(ws, `program/${name}`, "create-and-start", error.message)
            }
        }
        else if (event === "create-avaiable") {
            try {
                await startAvailable(name, body.directory, body.directory, body.startOnBoot, body.env)
                const program = getProgram(name)
                sendEvent(ws, `program/${name}`, "create-avaiable", "ok")
                sendEventAll(`program/${name}`, "pub", program)
            } catch (error) {
                sendEvent(ws, `program/${name}`, "create-avaiable", error.message)
            }
        }
        else if (event === "start") {
            try {
                await startExisting(name)
                sendEvent(ws, `program/${name}`, "start", "ok")
                sendEventAll(`program/${name}`, "pub", program)
            } catch (error) {
                sendEvent(ws, `program/${name}`, "start", error.message)
            }
        }
        else if (event === "kill") {
            try {
                await kill(name)
                sendEvent(ws, `program/${name}`, "kill", "ok")
                sendEventAll(`program/${name}`, "pub", program)
            } catch (error) {
                sendEvent(ws, `program/${name}`, "kill", error.message)
            }
        }
        else if (event === "restart") {
            try {
                await restart(name)
                sendEvent(ws, `program/${name}`, "restart", "ok")
                sendEventAll(`program/${name}`, "pub", program)
            } catch (error) {
                sendEvent(ws, `program/${name}`, "restart", error.message)
            }
        }
        else { help(ws) }
    }

    // // program/{name}/data
    // else if (topic && topic.startsWith("program/") && topicSplit.length === 3 && topicSplit[2] !== "") {
    //     const name = topicSplit[1]
    //     const key = topicSplit[2]
    //     subscribe(ws, `program/${name}/${key}`)
    //     if (event === "get") {
    //         try {
    //             const databaseKeyData = getKeyInDatabase(name, key)
    //             sendEvent(ws, `program/${name}/${key}`, "get", "ok")
    //             sendEvent(ws, `program/${name}/${key}`, "pub", databaseKeyData)
    //             unsubscribe(ws, `program/${name}/${key}`)
    //         } catch (error) {
    //             sendEvent(ws, `program/${name}/${key}`, "get", error.message)
    //             unsubscribe(ws, `program/${name}/${key}`)
    //         }
    //     }
    //     else if (event === "sub") {
    //         try {
    //             const databaseKeyData = getKeyInDatabase(name, key)
    //             sendEvent(ws, `program/${name}/${key}`, "sub", "ok")
    //             sendEvent(ws, `program/${name}/${key}`, "pub", databaseKeyData)
    //         } catch (error) {
    //             sendEvent(ws, `program/${name}/${key}`, "sub", error.message)
    //         }
    //     }
    //     else if (event === "send") {
    //         try {
    //             await setKeyInDatabase(name, key, body)
    //             sendEvent(ws, `program/${name}/${key}`, "send", "ok")
    //             const databaseData = getDatabase(name)
    //             sendEventAll(`program/${name}/${key}`, "pub", databaseData)
    //         } catch (error) {
    //             sendEvent(ws, `program/${name}/${key}`, "send", error.message)
    //         }
    //     }
    //     else { help(ws) }
    // }
})

programEmitter.on("available", (body) => {
    // console.log("available", body)
})

programEmitter.on("start", (name, body) => {
    // console.log("start", name, body)
    // if (name === "p72" && body.startsWith("error") === false) pass = false
})

programEmitter.on("out", (name, body) => {
    // console.log("out", name, body)
    // if (name === "p1" && body.ascii.includes("NodeJS") === false) pass = false
    // if (name === "p3" && body.ascii.includes("Python") === false) pass = false
})

programEmitter.on("error", (name, body) => {
    // console.log("error", name, body)
})

programEmitter.on("exit", async (name, body) => {
    // console.log("exit", name, body)
    // if (name === "p1" && body !== "ok") pass = false
})