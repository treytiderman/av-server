// Overview: http routes for the files.js module

// Imports
import express from 'express'
import {
    // appendText,
    // deleteFile,
    // deleteFolder,
    // exists,
    // getStats,
    // getStatsRaw,
    // getStatsRecursive,
    // makeDir,
    // readJSON,
    // readText,
    // rename,
    // writeJSON,
    // writeText
} from '../modules/files.js'

// Exports
export { router }

// Variables
const router = express.Router()

// Routes
// router.get('/groups', async (req, res) => {
//     const response = await getGroups()
//     res.json(response)
// })
