// Log HTTP Requests
const logger = require('./logger')
function log(req) {
  const url = `${req.method} ${req.protocol}://${req.headers.host}${req.url}`
  logger.log("server_http", url, req.body)
}
function logRequests(req, res, next) {
  log(req)
  next()
}

// Export
exports.logRequests = logRequests