const ws_server = require('../modules/ws_server')

// Module
const serialport = require('../modules/serialport')

// Function calls
ws_server.emitter.on("/serial/v1/available", async (ws, req) => {
  // Subscribe to the client
  ws_server.subscribe(ws, `/serial/v1/available`)
  // Module function call
  const output = await serialport.getAvailablePorts()
  ws_server.set(`/serial/v1/available`, output)
})
ws_server.emitter.on("/serial/v1/open", (ws, req) => {
  // Subscribe to the client
  ws_server.subscribe(ws, `/serial/v1/port/${req.body.path}`)
  // Module function call
  serialport.open(
    req.body.path,
    req.body.baudRate,
    req.body.delimiter
  )
})
ws_server.emitter.on("/serial/v1/send", (ws, req) => {
  // Subscribe to the client
  ws_server.subscribe(ws, `/serial/v1/client/${req.body.ip}:${req.body.port}`)
  // Module function call
  serialport.send(
    req.body.ip,
    req.body.port,
    req.body.data,
    req.body.encoding,
    req.body.cr,
    req.body.lf
  )
})
ws_server.emitter.on("/serial/v1/close", (ws, req) => {
  // Subscribe to the client
  ws_server.subscribe(ws, `/serial/v1/client/${req.body.ip}:${req.body.port}`)
  // Module function call
  serialport.close(
    req.body.ip,
    req.body.port
  )
})

// For Websocket store
// serialport.emitter.on("client", (address, obj) => {
//   ws_server.set(`/serial/v1/client/${address}`, obj)

//   // Also set the "clients" key
//   const clients = serialport.getTcpClients()
//   ws_server.set(`/serial/v1/clients`, clients)
// })