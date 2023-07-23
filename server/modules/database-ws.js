// Overview: websocket routes for the state.js module
// wss = websocket server
// ws  = websocket client

// Imports
import { emitter, receiveEvent, subscribe, sendEvent, sendEventAll, unsubscribe } from '../tools/websocket-server.js'
import {
    createDatabase,
    getDatabase,
    writeDatabase,
    deleteDatabase,
    resetDatabase,

    getKeyInDatabase,
    setKeyInDatabase,
    setAndWriteKeyInDatabase,
    deleteKeyInDatabase,

    getDatabaseNames,
    deleteDatabases,
} from '../modules/database.js'

// Function
function help(ws) {
    subscribe(ws, `database/help`)
    sendEvent(ws, `database/help`, "pub", {
        error: "request not recognized",
        try: [
            {
                "topic": "database/all",
                "event": "get",
            },
            {
                "topic": "database/all",
                "event": "sub",
            },
            {
                "topic": "database/all",
                "event": "delete",
            },
            {
                "topic": "database/example-name",
                "event": "get",
            },
            {
                "topic": "database/example-name",
                "event": "sub",
            },
            {
                "topic": "database/example-name",
                "event": "create",
                "body": { "default": "values" },
            },
            {
                "topic": "database/example-name",
                "event": "write-to-file"
            },
            {
                "topic": "database/example-name",
                "event": "delete"
            },
            {
                "topic": "database/example-name",
                "event": "reset-to-default"
            },
            {
                "topic": "database/example-name/example-key",
                "event": "get"
            },
            {
                "topic": "database/example-name/example-key",
                "event": "sub"
            },
            {
                "topic": "database/example-name/example-key",
                "event": "set",
                "body": "value"
            },
            {
                "topic": "database/example-name/example-key",
                "event": "set-and-write",
                "body": "value"
            },
            {
                "topic": "database/example-name/example-key",
                "event": "delete"
            },
        ]
    })
}

// Events
emitter.on("recieve", async (ws, topic, event, body) => {
    const topicSplit = topic?.split("/")

    // database/all
    if (topic && topic === "database/all") {
        subscribe(ws, "database/all")
        if (event === "get") {
            try {
                const databaseList = getDatabaseNames()
                sendEvent(ws, "database/all", "get", "ok")
                sendEvent(ws, "database/all", "pub", databaseList)
                unsubscribe(ws, "database/all")
            } catch (error) {
                sendEvent(ws, "database/all", "get", error.message)
                unsubscribe(ws, "database/all")
            }
        }
        else if (event === "sub") {
            try {
                const databaseList = getDatabaseNames()
                sendEvent(ws, "database/all", "sub", "ok")
                sendEvent(ws, "database/all", "pub", databaseList)
            } catch (error) {
                sendEvent(ws, "database/all", "sub", error.message)
            }
        }
        else if (event === "delete") {
            try {
                await deleteDatabases()
                const databaseList = getDatabaseNames()
                sendEvent(ws, "database/all", "delete", "ok")
                sendEventAll("database/all", "pub", databaseList)
            } catch (error) {
                sendEvent(ws, "database/all", "delete", error.message)
            }
        }
        else { help(ws) }
    }

    // database/{name}
    else if (topic && topic.startsWith("database/") && topicSplit.length === 2) {
        const name = topicSplit[1]
        subscribe(ws, `database/${name}`)
        if (event === "get") {
            try {
                const databaseData = getDatabase(name)
                sendEvent(ws, `database/${name}`, "get", "ok")
                sendEvent(ws, `database/${name}`, "pub", databaseData)
                unsubscribe(ws, `database/${name}`)
            } catch (error) {
                sendEvent(ws, `database/${name}`, "get", error.message)
                unsubscribe(ws, `database/${name}`)
            }
        }
        else if (event === "sub") {
            try {
                const databaseData = getDatabase(name)
                sendEvent(ws, `database/${name}`, "sub", "ok")
                sendEvent(ws, `database/${name}`, "pub", databaseData)
            } catch (error) {
                sendEvent(ws, `database/${name}`, "sub", error.message)
            }
        }
        else if (event === "create") {
            try {
                await createDatabase(name, body)
                const databaseData = getDatabase(name)
                sendEvent(ws, `database/${name}`, "create", "ok")
                sendEventAll(`database/${name}`, "pub", databaseData)
            } catch (error) {
                sendEvent(ws, `database/${name}`, "create", error.message)
            }
        }
        else if (event === "write-to-file") {
            try {
                await writeDatabase(name)
                const databaseData = getDatabase(name)
                sendEvent(ws, `database/${name}`, "write-to-file", "ok")
                sendEventAll(`database/${name}`, "pub", databaseData)
            } catch (error) {
                sendEvent(ws, `database/${name}`, "write-to-file", error.message)
            }
        }
        else if (event === "delete") {
            try {
                await deleteDatabase(name)
                sendEvent(ws, `database/${name}`, "delete", "ok")
                sendEventAll(`database/${name}`, "pub", {})
            } catch (error) {
                sendEvent(ws, `database/${name}`, "delete", error.message)
            }
        }
        else if (event === "reset-to-default") {
            try {
                await resetDatabase(name)
                const databaseData = getDatabase(name)
                sendEvent(ws, `database/${name}`, "reset-to-default", "ok")
                sendEventAll(`database/${name}`, "pub", databaseData)
            } catch (error) {
                sendEvent(ws, `database/${name}`, "reset-to-default", error.message)
            }
        }
        else { help(ws) }
    }

    // database/{name}/{key}
    else if (topic && topic.startsWith("database/") && topicSplit.length === 3 && topicSplit[2] !== "") {
        const name = topicSplit[1]
        const key = topicSplit[2]
        subscribe(ws, `database/${name}/${key}`)
        if (event === "get") {
            try {
                const databaseKeyData = getKeyInDatabase(name, key)
                sendEvent(ws, `database/${name}/${key}`, "get", "ok")
                sendEvent(ws, `database/${name}/${key}`, "pub", databaseKeyData)
                unsubscribe(ws, `database/${name}/${key}`)
            } catch (error) {
                sendEvent(ws, `database/${name}/${key}`, "get", error.message)
                unsubscribe(ws, `database/${name}/${key}`)
            }
        }
        else if (event === "sub") {
            try {
                const databaseKeyData = getKeyInDatabase(name, key)
                sendEvent(ws, `database/${name}/${key}`, "sub", "ok")
                sendEvent(ws, `database/${name}/${key}`, "pub", databaseKeyData)
            } catch (error) {
                sendEvent(ws, `database/${name}/${key}`, "sub", error.message)
            }
        }
        else if (event === "set") {
            try {
                await setKeyInDatabase(name, key, body)
                sendEvent(ws, `database/${name}/${key}`, "set", "ok")
                const databaseData = getDatabase(name)
                sendEventAll(`database/${name}/${key}`, "pub", databaseData)
            } catch (error) {
                sendEvent(ws, `database/${name}/${key}`, "set", error.message)
            }
        }
        else if (event === "set-and-write") {
            try {
                await setAndWriteKeyInDatabase(name, key, body)
                sendEvent(ws, `database/${name}/${key}`, "set-and-write", "ok")
                const databaseData = getDatabase(name)
                sendEventAll(`database/${name}/${key}`, "pub", databaseData)
            } catch (error) {
                sendEvent(ws, `database/${name}/${key}`, "set-and-write", error.message)
            }
        }
        else if (event === "delete") {
            try {
                await deleteKeyInDatabase(name, key)
                sendEvent(ws, `database/${name}/${key}`, "delete", "ok")
                const databaseData = getDatabase(name)
                sendEventAll(`database/${name}/${key}`, "pub", databaseData)
            } catch (error) {
                sendEvent(ws, `database/${name}/${key}`, "delete", error.message)
            }
        }
        else { help(ws) }
    }
})
