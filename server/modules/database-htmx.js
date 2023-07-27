// Overview: websocket routes for the state.js module
// wss = websocket server
// ws  = websocket client

// Imports
import { Router } from 'express'
import { emitter, receiveEvent, subscribe, sendEvent, sendEventAll, unsubscribe, send, sendAll } from '../tools/websocket-server.js'
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

// Exports
export { router }

// Variables
const router = Router()

router.get('/names', async (req, res) => {
    const response = getDatabaseNames()
    let string = ""
    response.forEach(name => {
        string += `<option value="${name}">${name}</option>`
    })
    res.send(string)
})

router.post('/getDatabase', async (req, res) => {
    try {
        const response = getDatabase(req.body.database)
        let string = JSON.stringify(response, true, 2)
        res.send(string)
    } catch (error) {
        res.send(error)
    }
})

router.get('/', async (req, res) => {
    try {
        const response = getDatabase(req.query.database)
        let string = JSON.stringify(response, true, 2)
        res.send(string)
    } catch (error) {
        res.send(error)
    }
})
router.delete('/', async (req, res) => {
    try {
        const response = deleteDatabase(req.body.database)
        res.send(response)
    } catch (error) {
        res.send(error)
    }
})
router.post('/write', async (req, res) => {
    try {
        const response = resetDatabase(req.body.database)
        let string = JSON.stringify(response, true, 2)
        res.send(string)
    } catch (error) {
        res.send(error)
    }
})
router.put('/reset', async (req, res) => {
    try {
        const response = resetDatabase(req.body.database)
        let string = JSON.stringify(response, true, 2)
        res.send(string)
    } catch (error) {
        res.send(error)
    }
})


