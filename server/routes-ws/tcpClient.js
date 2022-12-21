const wsServer = require('../modules/wsServer')

// Module
const tcpClient = require('../modules/tcpClient')

// Function calls
wsServer.emitter.on("/tcp/client/v1/open", (ws, req) => {
  // Subscribe to the client
  wsServer.subscribe(ws, `/tcp/client/v1/client/${req.body.ip}:${req.body.port}`)
  // Module function call
  tcpClient.open(
    req.body.ip,
    req.body.port,
    req.body.expectedDelimiter
  )
})
wsServer.emitter.on("/tcp/client/v1/send", (ws, req) => {
  // Subscribe to the client
  wsServer.subscribe(ws, `/tcp/client/v1/client/${req.body.ip}:${req.body.port}`)
  // Module function call
  tcpClient.send(
    req.body.ip,
    req.body.port,
    req.body.data,
    req.body.encoding,
    req.body.cr,
    req.body.lf
  )
})
wsServer.emitter.on("/tcp/client/v1/close", (ws, req) => {
  // Subscribe to the client
  wsServer.subscribe(ws, `/tcp/client/v1/client/${req.body.ip}:${req.body.port}`)
  // Module function call
  tcpClient.close(
    req.body.ip,
    req.body.port
  )
})

// For Websocket store
tcpClient.emitter.on("client", (address, obj) => {
  wsServer.set(`/tcp/client/v1/client/${address}`, obj)

  // Also set the "clients" key
  const clients = tcpClient.getTcpClients()
  wsServer.set(`/tcp/client/v1/clients`, clients)
})