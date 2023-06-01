// Create Express router
const express = require('express')
const router = express.Router()

// Module
const fs = require('fs').promises

// Routes
router.get('*', async (req, res) => {
  const file = await fs.readFile('./http/assets/files.html','utf8')
  res.send(file)
})
router.all('*', function (req, res) {
  res.status(404).send("not found")
})

// Export
exports.router = router