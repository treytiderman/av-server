// Create Express router
const express = require('express')
const router = express.Router()
const routes = {
  // "/nics": {
  //   "method": "GET",
  //   "description": "JSON of all the servers network interfaces (NIC)"
  // },
  // "/dhcp": {
  //   "method": "POST",
  //   "description": "Set a NIC to a DHCP",
  //   "body": { "nic": "Ethernet" }
  // },
  'GET /clients': '',
  'GET /serverRunning': '',
  'GET /serverOptions': '',
  'GET /start': '',
  'GET /stop': '',
  'GET /serverOptions': '',
}

// Module
const dhcp = require("../core/modules/dhcp_server")

// Routes
router.get('/', (req, res) => {
  res.json(routes)
})
router.get('/help', (req, res) => {
  res.json(routes)
})
router.get('/clients', (req, res) => {
  res.json(dhcp.state.clients)
})
router.get('/serverRunning', (req, res) => {
  res.json(dhcp.state.running)
})
router.get('/serverOptions', (req, res) => {
  res.json(dhcp.options)
})
router.get('/start', (req, res) => {
  const output = dhcp.start()
  res.status(200).json(output)
})
router.get('/stop', (req, res) => {
  const output = dhcp.stop()
  res.status(200).json(output)
})
router.post('/serverOptions', (req, res) => {
  const options = JSON.parse(req.body)
  const output = dhcp.setOptions(
    options.ip,
    options.rangeStart,
    options.rangeEnd,
    options.mask,
    options.gateway,
    options.dns1,
    options.dns2,
    options.leasePeriod
  )
  res.status(200).json(output)
})

// Export
exports.router = router
exports.routes = routes