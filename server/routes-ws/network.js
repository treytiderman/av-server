const ws_server = require('../modules/ws_server')

// If Windows
const os = require("os")
if (os.type() === "Windows_NT") {

  // Module
  const netsh = require("../modules/netsh")

  // Client Events
  ws_server.emitter.on("/network/v1", async (ws, req) => {
    if (req.event === "nics") {
      ws_server.subscribe(ws, `/network/v1`)
      const nics = await netsh.getNics()
      ws_server.event(`/network/v1`, "nics", nics)
    }
    else if (req.event === "dhcp/ip") {
      ws_server.subscribe(ws, `/network/v1`)
      const output = await network.setDhcpIp(req.body.nic)
      ws_server.event(`/network/v1`, "dhcp/ip", output)
    }
    else if (req.event === "dhcp/dns") {
      ws_server.subscribe(ws, `/network/v1`)
      const output = await network.setDhcpDns(req.body.nic)
      ws_server.event(`/network/v1`, "dhcp/dns", output)
    }
    else if (req.event === "dhcp") {
      ws_server.subscribe(ws, `/network/v1`)
      const output = await network.setDhcp(req.body.nic)
      ws_server.event(`/network/v1`, "dhcp", output)
    }
    else if (req.event === "static/ip") {
      ws_server.subscribe(ws, `/network/v1`)
      const output = await network.setstaticIp(
        req.body.nic,
        req.body.ip,
        req.body.mask,
        req.body.gateway
      )
      ws_server.event(`/network/v1`, "static/ip", output)
    }
    else if (req.event === "static/add") {
      ws_server.subscribe(ws, `/network/v1`)
      const output = await network.addStaticIp(
        req.body.nic,
        req.body.ip,
        req.body.mask
      )
      ws_server.event(`/network/v1`, "static/add", output)
    }
    else if (req.event === "static/dns") {
      ws_server.subscribe(ws, `/network/v1`)
      const output = await network.setstaticDns(
        req.body.nic,
        req.body.dns[0],
        req.body.dns[1]
      )
      ws_server.event(`/network/v1`, "static/dns", output)
    }
    else if (req.event === "static") {
      ws_server.subscribe(ws, `/network/v1`)
      const output = await network.setstatic(
        req.body.nic,
        req.body.ip,
        req.body.mask,
        req.body.gateway,
        req.body.dns[0],
        req.body.dns[1]
      )
      ws_server.event(`/network/v1`, "static", output)
    }
    else if (req.event === "metric") {
      ws_server.subscribe(ws, `/network/v1`)
      const nics = await netsh.setStaticMetric(
        req.body.nic,
        req.body.metric
      )
      ws_server.event(`/network/v1`, "metric", nics)
    }
    else if (req.event === "metric/auto") {
      ws_server.subscribe(ws, `/network/v1`)
      const nics = await netsh.setAutoMetric(req.body.nic)
      ws_server.event(`/network/v1`, "metric/auto", nics)
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




