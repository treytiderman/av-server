// Overview: http routes for the programs.js module

// Imports
import express from 'express'
import {
    // emitter,
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

// Exports
export { router }

// Variables
const router = express.Router()

// Routes
// router.get('/available', async (req, res) => {
//     const response = getAvailable()
//     res.json(response)
// })
// router.post('/program', async (req, res) => {
//     const response = getProgram(req.body.name)
//     res.json(response)
// })
// router.post('/program-with-history', async (req, res) => {
//     const response = getProgramWithHistory(req.body.name)
//     res.json(response)
// })
// router.get('/programs', async (req, res) => {
//     const response = getPrograms()
//     res.json(response)
// })
// router.get('/clear-programs', async (req, res) => {
//     const response = await clearPrograms()
//     res.json(response)
// })
// router.post('/start', async (req, res) => {
//     const response = await start(
//         req.body.name,
//         req.body.directory,
//         req.body.command,
//         req.body.startOnBoot,
//     )
//     res.json(response)
// })
// router.post('/start-available', async (req, res) => {
//     const response = await startAvailable(req.body.name, req.body.folderName)
//     res.json(response)
// })
// router.post('/start-existing', async (req, res) => {
//     const response = await startExisting(req.body.name)
//     res.json(response)
// })
// router.post('/kill', async (req, res) => {
//     const response = await kill(req.body.name)
//     res.json(response)
// })
// router.post('/restart', async (req, res) => {
//     const response = await restart(req.body.name)
//     res.json(response)
// })
// router.get('/killAll', async (req, res) => {
//     const response = await killAll()
//     res.json(response)
// })
