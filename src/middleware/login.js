// Create Express router
const express = require('express');
const router = express.Router();

// Require FS - File system
const fs = require('fs').promises;



// Require JSON Web Token
const jwt = require('jsonwebtoken');
const secret = '9876543210';
const password = 'password';

// Login
router.get('/', async (req, res) => {
  res.status(200).send( await fs.readFile('./public/html/api/login.html','utf8') );
});
router.post('/', async (req, res) => {
  if (req.body.password !== password) { return res.redirect('/api/login') }
  const toEncode = { 'key': 'value' }
  const token = jwt.sign(toEncode, secret);
  res.json(token);
});



// Check if the request has the jwt
async function auth(req, res, next) {
  // Looks like "Bearer TOKEN"
  const authHeader = req.headers['authorization'];
  // If authHeader true
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) { return res.redirect('/api/login') }
  // Verify the jwt
  jwt.verify(token, secret, (err, wasDecoded) => {
    if (err) { return res.redirect('/api/login') }
    next();
  });
}



// Export
exports.login = router;
exports.auth = auth;