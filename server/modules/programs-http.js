// Overview: http routes for the programs.js module

// Imports
import express from 'express'
import {
    // getAvailable,
    // getDataHistory,
    // getProgram,
    // getPrograms,
    // kill,
    // killAll,
    // restart,
    // start,
    // startAvailable
} from '../modules/programs.js'

// Exports
export { router }

// Variables
const router = express.Router()

// Routes
// router.get('/groups', async (req, res) => {
//     const response = await getGroups()
//     res.json(response)
// })
