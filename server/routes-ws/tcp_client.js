const ws_server = require('../modules/ws_server')

// Module
const tcpClient = require('../modules/tcp_client')

// Client Events
ws_server.emitter.on("/tcp/client/v1", async (ws, req) => {
  if (req.event === "open") {
    ws_server.subscribe(ws, `/tcp/client/v1/${req.body.ip}:${req.body.port}`)
    tcpClient.open(
      req.body.ip,
      req.body.port,
      req.body.expectedDelimiter
    )
  }
  else if (req.event === "send") {
    ws_server.subscribe(ws, `/tcp/client/v1/${req.body.ip}:${req.body.port}`)
    tcpClient.send(
      req.body.ip,
      req.body.port,
      req.body.data,
      req.body.encoding,
      req.body.cr,
      req.body.lf
    )
  }
  else if (req.event === "close") {
    ws_server.subscribe(ws, `/tcp/client/v1/${req.body.ip}:${req.body.port}`)
    tcpClient.close(
      req.body.ip,
      req.body.port
    )
  }
  else if (req.event === "getClient") {
    ws_server.subscribe(ws, `/tcp/client/v1/${req.body.ip}:${req.body.port}`)
    const client = tcpClient.getClient(
      req.body.ip,
      req.body.port
    )
    ws_server.event(`/tcp/client/v1/${req.body.ip}:${req.body.port}`, "getClient", client)
  }
  else if (req.event === "getClients") {
    ws_server.subscribe(ws, `/tcp/client/v1`)
    const clients = tcpClient.getClients()
    ws_server.event(`/tcp/client/v1`, "getClients", clients)
  }
})

// Module events
tcpClient.emitter.on("open", (address, body) => {
  ws_server.event(`/tcp/client/v1/${address}`, "open", body)
  ws_server.event(`/tcp/client/v1`, "open", {...body, address: address})
})
tcpClient.emitter.on("send", (address, body) => {
  ws_server.event(`/tcp/client/v1/${address}`, "send", body)
  ws_server.event(`/tcp/client/v1`, "send", {...body, address: address})
})
tcpClient.emitter.on("receive", (address, body) => {
  ws_server.event(`/tcp/client/v1/${address}`, "receive", body)
  ws_server.event(`/tcp/client/v1`, "receive", {...body, address: address})
})
tcpClient.emitter.on("close", (address, body) => {
  ws_server.event(`/tcp/client/v1/${address}`, "close", body)
  ws_server.event(`/tcp/client/v1`, "close", {...body, address: address})
})
tcpClient.emitter.on("error", (address, body) => {
  ws_server.event(`/tcp/client/v1/${address}`, "error", body)
  ws_server.event(`/tcp/client/v1`, "error", {...body, address: address})
})
