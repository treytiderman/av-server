// Create Express router
const express = require('express')
const router = express.Router()

// Module
const fs = require('fs').promises

// Functions
async function getClientFiles(folder) {
  const path = `../public${folder.path}`
  const files = await fs.readdir(path)
  for (const file of files) {
    const stat = await fs.stat(`${path}/${file}`)
    // Is directory
    if (stat.isDirectory()) {
      let folder2 = {
        path: `${folder.path}${file}/`,
        files: [],
        folders: []
      }
      await getClientFiles(folder2)
      folder.folders.push(folder2)
    }
    else {
      folder.files.push(file)
    }
  }
}

// Routes
router.get('/', async (req, res) => {
  const file = await fs.readFile('./_http/assets/api.html','utf8')
  res.send(file)
})
router.get('/time', async (req, res) => {
  const time = new Date(Date.now()).toISOString()
  res.json(time)
})
router.get('/files', async (req, res) => {
  let folder = {
    path: '/',
    files: [],
    folders: []
  }
  await getClientFiles(folder)
  res.json(folder)
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
router.get('/try/download', async (req, res) => {
  res.status(200).download('../public/logs/example.log')
})
router.get('/try/:path', async (req, res) => {
  res.status(200).send(req.params.path)
})
router.post('/try/post/json', async (req, res) => {
  res.status(200).json(req.body)
})

// Export
exports.router = router