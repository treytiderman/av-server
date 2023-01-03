const ws_server = require('./_ws_server')

// Module
const dhcp_server = require('../modules/dhcp_server')

// Client Events
ws_server.emitter.on("/dhcp/server/v1", async (ws, req) => {
  if (req.event === "clients") {
    ws_server.subscribe(ws, `/dhcp/server/v1`)
    ws_server.event(`/dhcp/server/v1`, "clients", dhcp_server.state.clients)
  }
  else if (req.event === "running") {
    ws_server.subscribe(ws, `/dhcp/server/v1`)
    console.log("dhcp_server.state.running", dhcp_server.state.running)
    ws_server.event(`/dhcp/server/v1`, "running", dhcp_server.state.running)
  }
  else if (req.event === "getOptions") {
    ws_server.subscribe(ws, `/dhcp/server/v1`)
    ws_server.event(`/dhcp/server/v1`, "options", dhcp_server.state.options)
  }
  else if (req.event === "state") {
    ws_server.subscribe(ws, `/dhcp/server/v1`)
    ws_server.event(`/dhcp/server/v1`, "state", dhcp_server.state)
  }
  else if (req.event === "start") {
    ws_server.subscribe(ws, `/dhcp/server/v1`)
    const output = dhcp_server.start()
    ws_server.event(`/dhcp/server/v1`, "start", output)
  }
  else if (req.event === "stop") {
    ws_server.subscribe(ws, `/dhcp/server/v1`)
    const output = dhcp_server.stop()
    ws_server.event(`/dhcp/server/v1`, "stop", output)
  }
  else if (req.event === "options") {
    ws_server.subscribe(ws, `/dhcp/server/v1`)
    const output = dhcp_server.setOptions(
      req.body.ip,
      req.body.rangeStart,
      req.body.rangeEnd,
      req.body.mask,
      req.body.gateway,
      req.body.dns1,
      req.body.dns2,
      req.body.leasePeriod
    )
    ws_server.event(`/dhcp/server/v1`, "options", output)
  }
})

// Module events
dhcp_server.emitter.on("clients", (body) => {
  ws_server.event(`/dhcp/server/v1`, "clients", body)
})
dhcp_server.emitter.on("listening", (body) => {
  ws_server.event(`/dhcp/server/v1`, "listening", body)
})
dhcp_server.emitter.on("close", (body) => {
  ws_server.event(`/dhcp/server/v1`, "close", body)
})
dhcp_server.emitter.on("error", (body) => {
  ws_server.event(`/dhcp/server/v1`, "message", body)
})
// dhcp_server.emitter.on("message", (body) => {
//   ws_server.event(`/dhcp/server/v1`, "message", body)
// })
