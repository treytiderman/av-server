// Create Express router
const express = require('express')
const router = express.Router()

// Routes
router.get('/', async (req, res) => {
  res.redirect(302, '/av-server-ui')
})

// Export
exports.router = router