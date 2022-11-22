// Create Express router
const express = require('express');
const router = express.Router();
const routes = {
  'GET /': 'login.html',
  'POST /': "login with password in the body, example { password: '1qaz!QAZ' }",
}

// Require FS - File system
const fs = require('fs').promises;

// Require JSON Web Token
const jwt = require('jsonwebtoken');
const hashKey = 'monkeybread';
const password = 'okayokay';

// Functions
// Check if the request has the jwt
async function middleware(req, res, next) {
  // Looks like "Bearer TOKEN"
  const authHeader = req.headers['authorization'];
  // If authHeader true
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) { return res.redirect('/api/v1/login') }
  // Verify the jwt
  jwt.verify(token, hashKey, (err, wasDecoded) => {
    if (err) { return res.redirect('/api/v1/login') }
    next();
  });
}

// Login
router.get('/', async (req, res) => {
  res.send( await fs.readFile('../public/web/api/login.html','utf8') );
});
router.post('/', async (req, res) => {
  if (req.body.password !== password) { return res.redirect('/api/v1/login') }
  const toEncode = { 'password': password }
  const token = jwt.sign(toEncode, hashKey);
  res.json(token);
});

// Export
exports.routes = routes;
exports.router = router;
exports.middleware = middleware;

/* Examples

// Routes /login
const auth = require('./middleware/auth');
app.use('/login', auth.router);

// auth - JWT Based authentication
const auth = require('../middleware/auth');
router.get('/auth', auth.middleware, async (req, res) => {
  res.send('success');
});

*/