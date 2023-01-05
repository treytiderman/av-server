// Create Express router
const express = require('express')
const router = express.Router()

// Module
const file_system = require('../modules/file_system')

// Routes
router.get('/files/v1', async (req, res) => {
  const files = await file_system.getStats("../public")
  res.json(files)
})



// Export
exports.router = router