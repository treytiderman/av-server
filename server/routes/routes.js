// Create Express router
const express = require('express')
const router = express.Router()

// Routes /
const pages = require('./pages')
pages.path = '/'
router.use(pages.path, pages.router)

// Routes /api
const api = require('./api')
api.path = '/api'
api.routesAll[pages.path] = pages.routes
api.routesAll[api.path] = api.routes
router.use(api.path, api.router)

// Routes /test
const tests = require('./tests')
tests.path = '/api/test/v1'
api.routesAll[tests.path] = tests.routes
router.use(tests.path, tests.router)

// Router /api/net - Change computers IP/Network settings
const network = require('./network');
network.path = '/api/network/v1'
api.routesAll[network.path] = network.routes
router.use(network.path, network.router);

// Router /api/dhcp/server - DHCP Server
const dhcp_server = require('./dhcp_server');
dhcp_server.path = '/api/dhcp/server/v1'
api.routesAll[dhcp_server.path] = dhcp_server.routes
router.use(dhcp_server.path, dhcp_server.router);

// Router /api/serial - Serial Port
const serial = require('./serial')
serial.path = '/api/serial/v1'
api.routesAll[serial.path] = serial.routes
router.use(serial.path, serial.router)

// Routes /login
const auth = require('../middleware/auth')
auth.path = '/api/login/v1'
router.use(auth.path, auth.router)
api.routesAll[auth.path] = auth.routes

// Export
exports.router = router