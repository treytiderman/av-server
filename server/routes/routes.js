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
const dhcpServer = require('./dhcpServer');
dhcpServer.path = '/api/dhcp/server/v1'
api.routesAll[dhcpServer.path] = dhcpServer.routes
router.use(dhcpServer.path, dhcpServer.router);

// Router /api/serial - Serial Port
const serialport = require('./serialport')
serialport.path = '/api/serial/v1'
api.routesAll[serialport.path] = serialport.routes
router.use(serialport.path, serialport.router)

// Routes /login
const auth = require('../middleware/auth')
auth.path = '/api/login/v1'
router.use(auth.path, auth.router)
api.routesAll[auth.path] = auth.routes

// Export
exports.router = router