const fs = require('fs').promises
const {
    ROLES,
    getUser,
    getToken,
    createUser,
    updateUserPassword,
    updateUserRole,
    defaultUsersFile,
    getUsers,
    deleteUser
} = require('./users')
const { gate } = require('./users-middleware')

// Create Express router
const express = require('express')
const router = express.Router()

// User roles
router.get('/user/roles/v1', async (req, res) => {
    res.json(ROLES)
})

// Get User
router.get('/user/v1', async (req, res) => {
    const user = getUser(req.body?.username)
    res.json(user)
})

// Get All Users
router.get('/users/v1', async (req, res) => {
    const response = getUsers()
    res.json(response)
})

// Get User from token
router.get('/me/v1', gate({ isSelf: true }), async (req, res) => {
    const user = getUser(req.user.username)
    res.json(user)
})

// Login to receive Token
router.post('/login/v1', async (req, res) => {
    const token = getToken(req.body.username, req.body.password)
    if (token === "password incorrect") res.status(400).json("password incorrect")
    else if (token === "username doesn't exists") res.status(400).json("username doesn't exists")
    else res.json(token)
})

// Create User
router.post('/user/v1', gate({ minRole: ROLES.ADMIN }), async (req, res) => {
    const result = createUser(req.body.username, req.body.password, req.body.passwordConfirm, req.body.role)
    if (result === "user created") res.json("user created")
    else if (result === "password does not match passwordConfirm") res.status(400).json("password does not match passwordConfirm")
    else if (result === "username exists") res.status(400).json("username exists")
    else if (result === "role not between 0 and 100") res.status(400).json("role not between 0 and 100")
    else res.status(500).json("unknown error")
})

// Delete User
router.delete('/user/v1', gate({ minRole: ROLES.ADMIN }), async (req, res) => {
    const result = deleteUser(req.body.username, req.body.password)
    if (result === "user deleted") res.json("user created")
    else if (result === "username doesn't exists") res.status(400).json("username doesn't exists")
    else if (result === "password incorrect") res.status(400).json("password incorrect")
    else res.status(500).json("unknown error")
})

// Update User
router.put('/user/v1', gate({ minRole: ROLES.ADMIN }), async (req, res) => {
    const roleResult = updateUserRole(req.body.username, req.body.password, req.body.role)
    const passResult = updateUserPassword(req.body.username, req.body.password, req.body.newPassword, req.body.newPasswordConfirm)
    if (roleResult === "user updated" && passResult === "user updated") res.json("user updated")
    else if (roleResult === "username doesn't exists") res.status(400).json("username doesn't exists")
    else if (roleResult === "password incorrect") res.status(400).json("password incorrect")
    else if (passResult === "newPassword does not match newPasswordConfirm") res.status(400).json("newPassword does not match newPasswordConfirm")
    else res.status(500).json("unknown error")
})

// Export
exports.router = router