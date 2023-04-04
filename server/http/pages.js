// Create Express router
const express = require('express')
const router = express.Router()

// Routes
router.get('/', async (req, res) => {
  res.redirect(302, '/web/ui')
})

// Export
exports.router = router