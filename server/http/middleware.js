// Log HTTP Requests
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
function logRequests(req, res, next) {
  log(req)
  next()
}

/* Request Checking
1. Is localhost? req.isLocalhost = true || false
2. Has Token? req.token = token || "no token" || "bad token"
3. What User? req.user { username, role }
4. Auth level? req.user.role = 0 though 99
5. Is self or ADMIN? req.isSelf = true || false */
const auth = require('../modules/auth')
function checkLocalhost(req) {
  const ip = req.headers.host.split(':')[0]
  if (ip === `localhost`) return true
  else return false
}
function getToken(req) {
  // Grab Token from authorization header "Authorization: Bearer <TOKEN>"
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  return token ?? "no token"
}
function checkRequest(req, res, next) {

  // Is localhost?
  req.isLocalhost = checkLocalhost(req)

  // Get Token
  req.token = getToken(req)

  // Verify Token
  if (req.token !== "no token") {
    auth.verifyJWT(req.token, (error, jwtJson) => {
  
      // Bad Token
      if (error) req.token = "bad token"
  
      // Verified Token
      else {
  
        /* Get user and add to request
        Q: Couldn't the jwt username be changed?
        A: Yes, but they would also need the secret to do that */
        const user = auth.users.find(user => user.username === jwtJson.username)

        // Good Token
        if (user) req.user = user
  
        // jwt username is the same as the request body username
        req.isSelf = req.user.username === req.body.username
  
      }
    })
  }

  // Continue
  next()

}
function gate(require = {}) {
  return (req, res, next) => {
    require.localhost = require.localhost ?? false
    require.role_min = require.role_min ?? null
    require.self = require.self ?? false
    require.token = require.role_min !== null || require.self

    // Debug
    // console.log("\nrequire", require)
    // console.log("req", {
    //   role: req.user?.role,
    //   localhost: req.isLocalhost,
    //   self: req.isSelf,
    //   token: req.token,
    // })

    // Request required to come from localhost?
    if (require.localhost && req.isLocalhost === false) {
      return res.status(401).json("not autherized, localhost only")
    }

    // Request requires a token / user?
    else if (require.token) {

      // No / Bad Token
      if (req.token === "no token" || req.token === "bad token") {
        return res.status(401).json(`not autherized, ${req.token}, login needed`)
      }
  
      // User is valid
      else if (req.user === undefined) {
        return res.status(401).json("not autherized, user doesn't exist")
      }
      
      // Users role is less than the minimum role level required
      else if (req.user.role < require.role_min) {
        return res.status(401).json("not autherized, role / auth level to low")
      }
      
      // User is not the requested user or an ADMIN
      else if (require.self && req.isSelf === false) {

        // Admins don't have to follow this rule
        if (req.user.role !== auth.ROLES.ADMIN) {
          return res.status(401).json("not autherized, you are not the requested user or an ADMIN")
        }
      }

    }

    // Passed all checks
    next()
  }
}

// Render Markdown To HTML Page
const { readText } = require('../modules/file_system')
const { markdown2htmlPage } = require('../modules/markdown')
async function renderMarkdown(req, res, next) {
  if (req.url.endsWith(".md")) {
    const text = await readText(`../public${req.url}`)
    const css = await readText(`../server/http/assets/markdown.css`)
    const html = await markdown2htmlPage(text, css, req.url)
    res.send(html)
  }
  else next()
}

// Export
exports.logRequests = logRequests
exports.checkRequest = checkRequest
exports.gate = gate
exports.renderMarkdown = renderMarkdown