import { verifyJWT } from './auth.js'
import {
    getUser,
    getUsers,
    resetUsersToDefault,
    getGroups,
    addGroup,
    removeGroup,
    getToken,
    addUser,
    removeUser,
    addGroupToUser,
    removeGroupFromUser,
    changeUserPassword
} from './users.js'

// Create Express router
import express from 'express'
const router = express.Router()

// Export
export { router, checkRequest, gate }

// Functions
function checkReqIsLocalhost(req) {
    const ip = req.headers.host.split(':')[0]
    if (ip === `localhost`) return true
    else return false
}
function getTokenFromHeader(req) {
    // Grab Token from authorization header "Authorization: Bearer <TOKEN>"
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    return token ?? "no token"
}

// Request checking middleware
// Is localhost? req.isLocalhost = true || false
// Has Token? req.token = token || "no token" || "bad token"
// What User? req.user { username, groups }
// Admin? req.isAdmin = in group "admins"
// Is self? req.isSelf = true || false
function checkRequest(req, res, next) {
    req.user = {}
    req.token = getTokenFromHeader(req)
    req.isSelf = false
    req.isAdmin = false
    req.isLocalhost = checkReqIsLocalhost(req)

    if (req.token !== "no token") {
        verifyJWT(req.token, (error, jwtJson) => {
            if (error) req.token = "bad token"
            else {
                const user = getUser(jwtJson.username)
                if (user) {
                    req.user = user
                    req.isSelf = req.user.username === req.body.username
                    req.isAdmin = req.user.groups.some(group => group === "admins")
                }
            }
        })
    }
    next()
}

// Gatekeep middleware for endpoints
function gate(require = {
    token: false,
    isSelf: false,
    isAdmin: false,
    isLocalhost: false,
    requiredGroup: false,
}) {
    return (req, res, next) => {
        if (require.token && (req.token === "no token" || req.token === "bad token")) {
            return res.status(401).json(`error ${req.token}, login needed`)
        }
        if (require.isSelf && req.isSelf === false) {
            return res.status(401).json("error not self, token must be for username specified")
        }
        if (require.isAdmin && req.isAdmin === false) {
            return res.status(401).json("error not in group admins")
        }
        if (require.isLocalhost && req.isLocalhost === false) {
            return res.status(401).json("error localhost only")
        }
        if (require.requiredGroup !== false && req.user.groups.some(group => group === require.requiredGroup)) {
            return res.status(401).json("error not in group " + require.requiredGroup)
        }
        next() // Passed all checks
    }
}

// Routes
router.get('/get-token', async (req, res) => {
    const response = getToken(req.body.username, req.body.password)
    if (response === "error password incorrect") res.json("error username or password incorrect")
    else if (response === "error username doesn't exists") res.json("error username or password incorrect")
    else res.json(response)
})
router.get('/who-am-i', gate({token: true}), async (req, res) => {
    res.json(req.user)
})

router.get('/groups', async (req, res) => {
    const response = await getGroups()
    res.json(response)
})
router.get('/add-group', gate({isAdmin: true}), async (req, res) => {
    const response = await addGroup(req.body.groupToAdd)
    res.json(response)
})
router.get('/remove-group', gate({isAdmin: true}), async (req, res) => {
    const response = await removeGroup(req.body.groupToRemove)
    res.json(response)
})

router.get('/users', async (req, res) => {
    const response = getUsers()
    res.json(response)
})
router.get('/add', gate({isAdmin: true}), async (req, res) => {
    const response = await addUser(req.body.username, req.body.password, req.body.passwordConfirm, req.body.groups)
    res.json(response)
})
router.get('/add-group-to-user', gate({isAdmin: true}), async (req, res) => {
    const response = await addGroupToUser(req.body.username, req.body.groupToAdd)
    res.json(response)
})
router.get('/remove-group-from-user', gate({isAdmin: true}), async (req, res) => {
    const response = await removeGroupFromUser(req.body.username, req.body.groupToRemove)
    res.json(response)
})
router.get('/change-user-password', gate({isAdmin: true}), async (req, res) => {
    const response = await changeUserPassword(req.body.username, req.body.newPassword, req.body.newPasswordConfirm)
    res.json(response)
})
router.get('/remove', gate({isAdmin: true}), async (req, res) => {
    const response = await removeUser(req.body.username)
    res.json(response)
})

router.get('/reset-users-to-default', gate({isAdmin: true}), async (req, res) => {
    await resetUsersToDefault()
    res.json("ok")
})
