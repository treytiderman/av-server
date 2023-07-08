// Overview: http routes for the state.js module

// Imports
import { getDatabase, saveDatabase, resetDatabase, deleteDatabase } from './db.js'
import { Router } from 'express'

// Exports
export { router }

// Variables
const router = Router()

// Routes
// router.get('/groups', async (req, res) => {
//     const response = await getGroups()
//     res.json(response)
// })
