/* Request Checking
1. Is localhost? req.isLocalhost = true || false
2. Has Token? req.token = token || "no token" || "bad token"
3. What User? req.user { username, role }
4. Auth level? req.user.role = 0 though 99
5. Is self or ADMIN? req.isSelf = true || false */
const { getUser, verifyJWT } = require('./users')
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
    req.isLocalhost = checkLocalhost(req)
    req.token = getToken(req)
    if (req.token !== "no token") {
        verifyJWT(req.token, (error, jwtJson) => {
            if (error) req.token = "bad token"
            else {
                const user = getUser(jwtJson.username)
                if (user) req.user = user
                req.isSelf = req.user.username === req.body.username
            }
        })
    }
    next()
}
function gate(require = {
    isLocalhost: false,
    requiredGroup: "admin",
    isSelf: false,
    token: false,
}) {
    return (req, res, next) => {
        require.isLocalhost ?? false
        require.requiredGroup = require.requiredGroup ?? null
        require.isSelf = require.isSelf ?? false
        require.token = require.requiredGroup !== null || require.isSelf

        // Request required to come from localhost?
        if (require.isLocalhost && req.isLocalhost === false) {
            return res.status(401).json("error not autherized, localhost only")
        }

        // Request requires a token / user?
        else if (require.token) {

            // No / Bad Token
            if (req.token === "no token" || req.token === "bad token") {
                return res.status(401).json(`errornot autherized, ${req.token}, login needed`)
            }

            // User is valid
            else if (req.user === undefined) {
                return res.status(401).json("error not autherized, user doesn't exist")
            }

            // Users role is less than the minimum role level required
            else if (req.user.groups.some(group => group === require.requiredGroup)) {
                return res.status(401).json("error not in group " + require.requiredGroup)
            }

            // User is not the requested user or an ADMIN
            else if (require.isSelf && req.isSelf === false) {

                // Admins don't have to follow this rule
                if (req.user.groups.some(group => group === "admins")) {
                    return res.status(401).json("error not in group admins")
                }
            }

        }

        // Passed all checks
        next()
    }
}

// Export
exports.checkRequest = checkRequest
exports.gate = gate
