// Overview: http routes for the logger.js module

// Imports
import express from 'express'
import { log, PATH_TO_LOG_FOLDER } from '../modules/logger.js'
import { gate } from '../modules/users-http.js'
import { getStats, readText } from '../modules/files.js'

// Exports
export { router }

// Variables
const router = express.Router()

// Routes
// router.get('/files-available', gate({isAdmin: true}), async (req, res) => {
router.get('/files-available', async (req, res) => {
    const response = await getStats(PATH_TO_LOG_FOLDER)
    const fileNames = response.contains_files.map(file => { return file.file_name })
    res.json(fileNames)
})
// router.post('/file', gate({isAdmin: true}), async (req, res) => {
router.post('/file', async (req, res) => {
    const response = await readText(PATH_TO_LOG_FOLDER + req.body.file)
    res.json(response)
})
// router.post('/', gate({isAdmin: true}), async (req, res) => {
router.post('/', async (req, res) => {
    const response = await log(req.body.group, req.body.message, req.body.obj)
    res.json(response)
})

