// Create Express router
const express = require('express');
const router = express.Router();



// Test Routes
router.get('/time', async (req, res) => {
  const time = new Date(Date.now()).toISOString()
  res.status(200).json(time);
});
router.get('/headers', async (req, res) => {
  res.status(200).json(req.headers);
});
router.post('/body', async (req, res) => {
  res.status(200).json(req.body);
});
router.post('/query', async (req, res) => {
  res.status(200).json(req.query);
});
router.get('/json', async (req, res) => {
  response = { "number": 42, "string": "Hello World", "bool": true }
  res.status(200).json(response);
});
router.get('/log', async (req, res) => {
  res.status(200).download('./src/logs/test.txt');
});
router.get('/:path', async (req, res) => {
  res.status(200).send(req.params.path);
});



// Export
exports.test = router;