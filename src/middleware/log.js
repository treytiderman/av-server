// Log to console and file
const fs = require('fs').promises;
function log(text) {
  // Time
  const time = new Date(Date.now()).toLocaleString();
  // Log text
  const line = `${time} | ${text}`;
  // console.log(line);
  fs.appendFile("./src/logs/requests.txt", line + '\n')
}

// Log request information
function logRequestInfo(req) {
  // URL
  log(`${req.method} ${req.protocol}://${req.headers.host}${req.url}`);
  // Query Params
  if (JSON.stringify(req.query) !== '{}') log(`- Params ${JSON.stringify(req.query)}`);
  // Body
  if (JSON.stringify(req.body) !== '{}') log(`- Body ${JSON.stringify(req.body)}`);
}

// Middleware
function middlware(req, res, next) {
  // Run before handling the request
  logRequestInfo(req);
  // Handle requests
  next();
  // Run after handling the request
  
}

// Exports
exports.log = middlware;


