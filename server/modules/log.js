// Log to console and file
const fs = require('fs').promises;
const fss = require('fs');

// Functions
function log(text, folderPath, filename, debug = false) {
  // Time & date
  const timeDate = new Date(Date.now()).toLocaleString();
  const time = timeDate.split(', ')[1];
  const date = timeDate.split(',')[0].replace(/\//ig, "-");
  // If folderPath doesn't exist create it
  if (!fss.existsSync(folderPath)) fss.mkdirSync(folderPath)
  // Log text to the file path
  const line = `${time} > ${text}`;
  const path = `${folderPath}${filename} ${date}.log`;
  fs.appendFile(path, line + '\n')
  // Log text to a log all file
  // *TODO* add spaces so that all filenames are the same length when added to the log everything file
  const allLine = `${time} > ${filename} | ${text}`;
  const allPath = `../public/logs/all ${date}.log`;
  fs.appendFile(allPath, allLine + '\n')
  // Log to Console
  if (debug) console.log(allLine)
}

// Exports
exports.log = log;

/* Examples

function log(text) {
  const logger = require('./log');
  logger.log(text, "./logs/", 'ws');
}

function httpLog(req) {
  const { log } = require('./log');
  // Path
  const path = "./logs/";
  // URL
  log(`${req.method} ${req.protocol}://${req.headers.host}${req.url}`, path, 'http');
  // Query Params
  if (JSON.stringify(req.query) !== '{}') log(`PARAMS ${JSON.stringify(req.query)}`, path, 'http');
  // Body
  if (JSON.stringify(req.body) !== '{}') log(`BODY ${JSON.stringify(req.body)}`, path, 'http');
}

*/