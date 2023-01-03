const ws_server = require('./_ws_server')

// If Windows
const os = require("os")
if (os.type() === "Windows_NT") {

  // Module
  const netsh = require("../modules/netsh")

  // Client Events
  ws_server.emitter.on("/network/v1", async (ws, req) => {
    if (req.event === "nics") {
      ws_server.subscribe(ws, `/network/v1`)
      const output = await netsh.getNics()
      ws_server.event(`/network/v1`, "nics", output)
    }
    else if (req.event === "dhcp/ip") {
      ws_server.subscribe(ws, `/network/v1`)
      const output = await netsh.setDhcpIp(req.body.nic)
      ws_server.event(`/network/v1`, "dhcp/ip", {ip: output, nic: req.body.nic})
    }
    else if (req.event === "dhcp/dns") {
      ws_server.subscribe(ws, `/network/v1`)
      const output = await netsh.setDhcpDns(req.body.nic)
      ws_server.event(`/network/v1`, "dhcp/dns", {dns: output, nic: req.body.nic})
    }
    else if (req.event === "dhcp") {
      ws_server.subscribe(ws, `/network/v1`)
      const output = await netsh.setDhcp(req.body.nic)
      ws_server.event(`/network/v1`, "dhcp", {...output, nic: req.body.nic})
    }
    else if (req.event === "static/ip") {
      ws_server.subscribe(ws, `/network/v1`)
      const output = await netsh.setStaticIp(
        req.body.nic,
        req.body.ip,
        req.body.mask,
        req.body.gateway
      )
      ws_server.event(`/network/v1`, "static/ip", {ip: output, nic: req.body.nic})
    }
    else if (req.event === "static/add") {
      ws_server.subscribe(ws, `/network/v1`)
      const output = await netsh.addStaticIp(
        req.body.nic,
        req.body.ip,
        req.body.mask
      )
      ws_server.event(`/network/v1`, "static/add", {ip: output, nic: req.body.nic})
    }
    else if (req.event === "static/dns") {
      ws_server.subscribe(ws, `/network/v1`)
      const output = await netsh.setStaticDns(
        req.body.nic,
        req.body.dns[0],
        req.body.dns[1]
      )
      ws_server.event(`/network/v1`, "static/dns", {dns: output, nic: req.body.nic})
    }
    else if (req.event === "static") {
      ws_server.subscribe(ws, `/network/v1`)
      const output = await netsh.setStatic(
        req.body.nic,
        req.body.ip,
        req.body.mask,
        req.body.gateway,
        req.body.dns[0],
        req.body.dns[1]
      )
      ws_server.event(`/network/v1`, "static", {...output, nic: req.body.nic})
    }
    else if (req.event === "metric") {
      ws_server.subscribe(ws, `/network/v1`)
      const output = await netsh.setStaticMetric(
        req.body.nic,
        req.body.metric
      )
      ws_server.event(`/network/v1`, "metric", output)
    }
    else if (req.event === "metric/auto") {
      ws_server.subscribe(ws, `/network/v1`)
      const output = await netsh.setAutoMetric(req.body.nic)
      ws_server.event(`/network/v1`, "metric/auto", {metric: output, nic: req.body.nic})
    }
  })

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




