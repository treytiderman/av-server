const wsServer = require('../modules/wsServer')

// Module
const tcpClient = require('../modules/tcpClient')

// Client Events
wsServer.emitter.on("/tcp/client/v1", (ws, req) => {
  if (req.event === "open") {
    wsServer.subscribe(ws, `/tcp/client/v1/${req.body.ip}:${req.body.port}`)
    tcpClient.open(
      req.body.ip,
      req.body.port,
      req.body.expectedDelimiter
    )
  }
  else if (req.event === "send") {
    wsServer.subscribe(ws, `/tcp/client/v1/${req.body.ip}:${req.body.port}`)
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
    wsServer.subscribe(ws, `/tcp/client/v1/${req.body.ip}:${req.body.port}`)
    tcpClient.close(
      req.body.ip,
      req.body.port
    )
  }
  else if (req.event === "getClient") {
    wsServer.subscribe(ws, `/tcp/client/v1/${req.body.ip}:${req.body.port}`)
    const client = tcpClient.getClient(
      req.body.ip,
      req.body.port
    )
    wsServer.event(`/tcp/client/v1/${req.body.ip}:${req.body.port}`, "getClient", client)
  }
  else if (req.event === "getClients") {
    wsServer.subscribe(ws, `/tcp/client/v1`)
    const clients = tcpClient.getClients()
    wsServer.event(`/tcp/client/v1`, "getClients", clients)
  }

})

// Module events
tcpClient.emitter.on("open", (address, body) => {
  wsServer.event(`/tcp/client/v1/${address}`, "open", body)
})
tcpClient.emitter.on("send", (address, body) => {
  wsServer.event(`/tcp/client/v1/${address}`, "send", body)
})
tcpClient.emitter.on("receive", (address, body) => {
  wsServer.event(`/tcp/client/v1/${address}`, "receive", body)
})
tcpClient.emitter.on("close", (address, body) => {
  wsServer.event(`/tcp/client/v1/${address}`, "close", body)
})
tcpClient.emitter.on("error", (address, body) => {
  wsServer.event(`/tcp/client/v1/${address}`, "error", body)
})
