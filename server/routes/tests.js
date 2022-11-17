// Create Express router
const express = require('express');
const router = express.Router();
const routes = {
  'GET /time': 'current server time',
  'GET /headers': 'headers from your request',
  'GET /query': 'return posted query, example /test/query?num=1&string=string&boolean=true',
  'GET /json': 'return a JSON',
  'GET /download': 'download a text file',
  'GET /:path': 'return path after /test',
  'POST /body': 'return posted body as JSON',
  'AUTH GET /auth': "return success if header 'Authorization: Bearer <TOKEN>' has the correct token",
}

// auth - JWT Based authentication
const auth = require('../middleware/auth');

// Routes
router.get('/time', async (req, res) => {
  const time = new Date(Date.now()).toISOString()
  res.status(200).json(time);
});
router.get('/headers', async (req, res) => {
  res.status(200).json(req.headers);
});
router.get('/query', async (req, res) => {
  res.status(200).json(req.query);
});
router.get('/json', async (req, res) => {
  response = { "number": 42, "string": "Hello World", "bool": true }
  res.status(200).json(response);
});
router.get('/download', async (req, res) => {
  res.status(200).download('../public/logs/example.log');
});
router.get('/auth', auth.middleware, async (req, res) => {
  res.status(200).send('success');
});
router.post('/body', async (req, res) => {
  res.status(200).json(req.body);
});
router.get('/:path', async (req, res) => {
  res.status(200).send(req.params.path);
});

// Export
exports.router = router;
exports.routes = routes;

/* Add to server.js

// Routes /test
const tests = require('./routes/tests');
app.use('/test', tests.router);

*/
