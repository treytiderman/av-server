// Create Express router
const express = require('express');
const router = express.Router();
const routes = {
  'GET /': 'api.html',
  'GET /routes': 'JSON of all public http(s) routes',
  'GET /files': 'JSON of all publicly available files',
}
let routesAll = {}

// Require FS - File system
const fs = require('fs').promises;

// Functions
async function getClientFiles(folder) {
  const path = `../public${folder.name}`
  const files = await fs.readdir(path);
  for (const file of files) {
    const stat = await fs.stat(`${path}/${file}`);
    // Is directory
    if (stat.isDirectory()) {
      let folder2 = {
        name: `${folder.name}/${file}`,
        files: [],
        folders: []
      }
      await getClientFiles(folder2);
      folder.folders.push(folder2);
    }
    else {
      folder.files.push(file);
    }
  }
}

// Routes
router.get('/', async (req, res) => {
  res.send( await fs.readFile('./routes/api.html','utf8') );
});
router.get('/routes', async (req, res) => {
  res.json(routesAll);
});
router.get('/files', async (req, res) => {
  let folder = {
    name: '',
    files: [],
    folders: []
  }
  await getClientFiles(folder);
  res.json(folder);
});

// Export
exports.router = router;
exports.routes = routes;
exports.routesAll = routesAll;

/* Example

// Add to server.js
// Routes /api
const api = require('./routes/api');
app.use('/api', api.router);

// Add all routes to api.routesAll
api.routesAll['/'] = pages.routes;
api.routesAll['/api'] = api.routes;
api.routesAll['/test'] = tests.routes;
api.routesAll['/login'] = auth.routes;

*/
