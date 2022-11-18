// Create Express router
const express = require('express');
const router = express.Router();
const routes = {
  "/nics": {
    "method": "GET",
    "description": "Return a JSON of all the servers network interfaces (NICs)"
  },
  "/dhcp": {
    "method": "POST",
    "description": "Set a NIC to DHCP IP address + DHCP DNS servers",
    "body (example)": { "nic": "Ethernet" }
  },
  "/dhcp/ip": {
    "method": "POST",
    "description": "Set a NIC to DHCP IP address",
    "body (example)": { "nic": "Ethernet" }
  },
  "/dhcp/dns": {
    "method": "POST",
    "description": "Set a NIC to DHCP DNS servers",
    "body (example)": { "nic": "Ethernet" }
  },
  "/static": {
    "method": "POST",
    "description": "Set a NIC to a static IP address + static DNS servers",
    "body (example)": {
      "nic": "Ethernet",
      "ip": "192.168.1.9",
      "mask": "255.255.255.0",
    },
    "body (optional)": {
      "gateway": "192.168.1.1",
      "dns": [ "192.168.1.1", "8.8.8.8" ]
    }
  },
  'POST /static/ip': '',
  'POST /static/dns': '',
  'POST /metric': '',
  'POST /metric/auto': '',
}

// If Windows
const os = require("os")
if (os.type() === "Windows_NT") {

  // Module
  const netsh = require("../modules/netsh");

  // Routes
  router.get('/nics', async (req, res) => {
    const nics = await netsh.getNics();
    res.json(nics);
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
  router.post('/dhcp', async (req, res) => {
    const preset = JSON.parse(req.body);
    const output = await netsh.setDhcp(preset.nic);
    res.status(200).json(output);
  });

  router.post('/static/ip', async (req, res) => {
    const preset = JSON.parse(req.body);
    const output = await netsh.setStaticIp(
      preset.nic,
      preset.ip,
      preset.mask,
      preset.gateway
    )
    res.status(200).json(output);
  });
  router.post('/static/dns', async (req, res) => {
    const preset = JSON.parse(req.body);
    const output = await netsh.setStaticDns(
      preset.nic,
      preset.dns[0],
      preset.dns[1]
    )
    res.status(200).json(output);
  });
  router.post('/static/add', async (req, res) => {
    const preset = JSON.parse(req.body);
    const output = await netsh.addStaticIp(
      preset.nic,
      preset.ip,
      preset.mask,
    )
    res.status(200).json(output);
  });
  router.post('/static', async (req, res) => {
    const preset = JSON.parse(req.body);
    const output = await netsh.setStatic(
      preset.nic,
      preset.ip,
      preset.mask,
      preset.gateway,
      preset.dns[0],
      preset.dns[1]
    )
    res.status(200).json(output);
  });

  router.post('/metric/auto', async (req, res) => {
    const preset = JSON.parse(req.body);
    const output = await netsh.setAutoMetric(preset.nic);
    res.status(200).json(output);
  });
  router.post('/metric', async (req, res) => {
    const preset = JSON.parse(req.body);
    const output = await netsh.setStaticMetric(
      preset.nic,
      preset.metric,
    )
    res.status(200).json(output);
  });

}

// If Linux
else if (os.type() === "Linux") {

}

// If MacOS
else if (os.type() === "Darwin") {

}

// Else?
else {

}

// Export
exports.router = router;
exports.routes = routes;