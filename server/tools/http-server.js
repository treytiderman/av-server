// Overview: express web server

// Imports
import express from 'express'
import cors from 'cors'

import { router } from '../core/http-routes.js'
import { getSystemInfo } from '../modules/system.js'

// Exports
export {
    create,
    startupConsoleLog,
}

// Functions
function create() {
    const app = express()
    app.set('json spaces', 2)

    // Allow requests that didn't originate from this server
    app.use(cors({ origin: true }))

    // Process request body (req.body) for urlencoded, json, and plain text bodys
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(express.text())

    // API
    app.use(router)

    return app
}
function startupConsoleLog(port) {
    const systemInfo = getSystemInfo()
    console.log(`user interface available at:`)
    console.log(`- http://localhost:${port}`)
    systemInfo.nics.forEach(nic => {
        console.log(`- http://${nic.ip}:${port}`)
    })
    console.log(`- http://${systemInfo.hostname}:${port}`)
    console.log("")
}
