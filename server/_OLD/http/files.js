// Create Express router
const express = require('express')
const router = express.Router()

// Module
const file_system = require('../core/modules/files')

// All Public Files
router.get('/files/v1', async (req, res) => {
  const files = await file_system.getStatsRecursive("../public")
  res.json(files)
})

// Get a folder
router.post('/files/v1', async (req, res) => {
  const files = await file_system.getStats("../public" + req.body.path)
  res.json(files)
})

// Export
exports.router = router