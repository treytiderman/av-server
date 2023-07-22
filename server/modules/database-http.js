// Overview: http routes for the state.js module

// Imports
import { Router } from 'express'
import {
    createDatabase,
    getDatabase,
    writeDatabase,
    deleteDatabase,
    resetDatabase,

    getKeyInDatabase,
    setKeyInDatabase,

    getDatabaseNames,
    deleteDatabases,
} from '../modules/database.js'

// Exports
export { router }

// Variables
const router = Router()

// Routes
router.get('/:name', async (req, res) => {
    try {
        const db = getDatabase(req.params.name)
        res.json(db)
    } catch (error) {
        res.status(404).send(error.message)
    }
})
