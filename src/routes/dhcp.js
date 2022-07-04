// Create Express router
const express = require('express');
const router = express.Router();

// Controls
const dhcp = require("../modules/dhcp");

// Routes
router.get('/clients', (req, res) => {
  res.json(dhcp.state.clients);
});
router.get('/serverRunning', (req, res) => {
  res.json(dhcp.state.running);
});
router.get('/serverOptions', (req, res) => {
  res.json(dhcp.options);
});
router.get('/start', (req, res) => {
  const output = dhcp.start(dhcp.state.options)
  res.status(200).json(output);
});
router.get('/stop', (req, res) => {
  const output = dhcp.stop()
  res.status(200).json(output);
});
router.post('/serverOptions', (req, res) => {
  const options = JSON.parse(req.body);
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
  res.status(200).json(output);
});

// Export
exports.router = router;
