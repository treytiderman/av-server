// Require Express - Web server
const express = require('express');
const app = express();

// Process request body (req.body) for urlencoded, json, and plain text bodys
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.text());

// Public folder, auto handle routes to /css/base.css for example
app.use(express.static(__dirname + '/public'));

// Require fs - File system
const fs = require('fs').promises;

// Require exec - run 
// Is app is running as admin?
const exec = require('child_process').exec;
let isAdmin = "not admin";
exec('NET SESSION', function(err,so,se) {
  isAdmin = se.length === 0 ? "admin" : "not admin";
});

// Middleware
const { log } = require('./src/middleware/log');
app.use(log);

let localhostConnectionOnly = true;
function checkIfLocalhost(req, res, next) {
  // Connect from anywhere
  if (localhostConnectionOnly === false) {
    next();
  }
  // If localhost
  else if (req.headers.host === `localhost:${port}`) {
    next();
  }
  // External connection
  else {
    res.send('Connections are only allowed via localhost');
  }
}
app.use(checkIfLocalhost);



// Router /
app.get('/', async (req, res) => {
  if (isAdmin === 'admin') res.send( await fs.readFile(__dirname + '/public/html/ip.html','utf8') );
  else res.send('Please run this app as administrator');
});
app.get('/ip', async (req, res) => {
  res.send( await fs.readFile(__dirname + '/public/html/ip.html','utf8') );
});
app.get('/dhcp', async (req, res) => {
  res.send( await fs.readFile(__dirname + '/public/html/dhcp.html','utf8') );
});
app.get('/api', async (req, res) => {
  res.status(200).send( await fs.readFile(__dirname + '/public/html/api/test.html','utf8') )
});

// Page to install PWA
app.get('/install', async (req, res) => {
  res.send( await fs.readFile(__dirname + '/public/install.html','utf8') )
});



// Router /login
const { auth, login } = require(__dirname + '/src/middleware/login');
app.use('/api/login', login);

// Router /api/net - Change computers IP/Network settings
const net = require(__dirname + '/src/routes/net');
app.use('/api/net', net.router);

// Router /api/dhcp - DHCP Server
const dhcp = require(__dirname + '/src/routes/dhcp');
app.use('/api/dhcp', dhcp.router);

// // Middleware - All routes below require authorization header
// app.use(auth);

// // Router /api/test - test routes
// const { test } = require(__dirname + '/src/routes/test');
// app.use('/api/test', test);



// Start web server
const port = 6420;
app.listen(port, () => {
  console.log(`AV-Tools server`)
  console.log(`>> this hosts the web pages available at: http://localhost:${port} \n`)
})

// Require Open
const open = require('open');
// open(`http://localhost:${port}`);
