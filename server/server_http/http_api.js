// Create Express router
const express = require('express')
const router = express.Router()

// Module
const fs = require('fs').promises

// Routes
router.get('/', async (req, res) => {
  const file = await fs.readFile('./http/assets/api.html','utf8')
  res.send(file)
})
router.get('/time', async (req, res) => {
  const time = new Date(Date.now()).toISOString()
  res.json(time)
})

// Routes to test with
router.get('/try/headers', async (req, res) => {
  res.status(200).json(req.headers)
})
router.get('/try/query', async (req, res) => {
  res.status(200).json(req.query)
})
router.get('/try/json', async (req, res) => {
  const json = {
    "number": 42,
    "string": "Hello World",
    "bool": true
  }
  res.status(200).json(json)
})
// router.get('/try/download', async (req, res) => {
//   res.status(200).download('../private/logs/example.log')
// })
router.get('/try/:path', async (req, res) => {
  res.status(200).send(req.params.path)
})
router.post('/try/post/json', async (req, res) => {
  res.status(200).json(req.body)
})

// Export
exports.router = router