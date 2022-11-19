// Create Express router
const express = require('express')
const router = express.Router()
const routes = {
  'GET /': 'UI Home page',
}

// Routes
router.get('/', async (req, res) => {
  res.redirect(302, '/web/ui')
})
router.get('/help', (req, res) => {
  res.json(routes)
})

// Export
exports.router = router
exports.routes = routes

/* Example

// Add to server.js
// Routes /
const pages = require('./routes/pages')
app.use('/', pages.router)

*/
