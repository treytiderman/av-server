const logger = require('../modules/logger')

function log(req) {
  const path = "../private/logs/"

  // URL
  logger.log(`${req.method} ${req.protocol}://${req.headers.host}${req.url}`, path, 'http')

  // Query Params
  if (JSON.stringify(req.query) !== '{}') {
    logger.log(`PARAMS ${JSON.stringify(req.query)}`, path, 'http')
  }

  // Body
  if (JSON.stringify(req.body) !== '{}') {
    logger.log(`BODY ${JSON.stringify(req.body)}`, path, 'http')
  }

}
function isLocalhost(req) {
  const ip = req.headers.host.split(':')[0]
  if (ip === `localhost`) return true
  else return false
}
function mw_log(req, res, next) {
  req.localhost = isLocalhost(req)
  log(req)
  next()
}

// Exports
exports.mw_log = mw_log