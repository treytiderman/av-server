// Overview: http routes for the state.js module

// Imports
import { createDatabase, writeDatabase, resetDatabase, deleteDatabase } from './database.js'
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
