// Create Express router
const express = require('express');
const router = express.Router();

// Controls
const netsh = require("../modules/netsh");



// Routes
router.get('/nics', async (req, res) => {
  const nics = await netsh.getNics();
  res.json(nics);
});
router.post('/static', async (req, res) => {
  const preset = JSON.parse(req.body);
  const output = await netsh.setStatic(
    preset.nic,
    preset.ipAddr,
    preset.subnet['mask'],
    preset.gateway,
    preset.dnsServers[0],
    preset.dnsServers[1]
  )
  res.status(200).json(output);
});
router.post('/static/ip', async (req, res) => {
  const preset = JSON.parse(req.body);
  const output = await netsh.setStaticIp(
    preset.nic,
    preset.ipAddr,
    preset.subnet.mask,
    preset.gateway
  )
  res.status(200).json(output);
});
router.post('/static/dns', async (req, res) => {
  const preset = JSON.parse(req.body);
  const output = await netsh.setStaticDns(
    preset.nic,
    preset.dnsServers[0],
    preset.dnsServers[1]
  )
  res.status(200).json(output);
});
router.post('/dhcp', async (req, res) => {
  const preset = JSON.parse(req.body);
  const output = await netsh.setDhcp(preset.nic);
  res.status(200).json(output);
});
router.post('/dhcp/ip', async (req, res) => {
  const preset = JSON.parse(req.body);
  const output = await netsh.setDhcpIp(preset.nic);
  res.status(200).json(output);
});
router.post('/dhcp/dns', async (req, res) => {
  const preset = JSON.parse(req.body);
  const output = await netsh.setDhcpDns(preset.nic);
  res.status(200).json(output);
});



// Export
exports.router = router;