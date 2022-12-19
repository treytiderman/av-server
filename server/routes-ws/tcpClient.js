const wsServer = require('../modules/wsServer')

// Module
const tcpClient = require('../modules/tcpClient')

// Requests to module
wsServer.emitter.on("/tcp/v1/client/open", (ws, req) => {
  const exampleData = {
    ip: "192.168.1.246",
    port: "23",
  }
  tcpClient.open(req.data.ip, req.data.port)
})
wsServer.emitter.on("/tcp/v1/client/send", (ws, req) => {
  const exampleData = {
    ip: "192.168.1.246",
    port: "23",
    message: "PWON\r",
  }
  tcpClient.send(req.data.ip, req.data.port, req.data.message)
})
wsServer.emitter.on("/tcp/v1/client/close", (ws, req) => {
  const exampleData = {
    ip: "192.168.1.246",
    port: "23",
  }
  tcpClient.close(req.data.ip, req.data.ip)
})

// Module emitting
tcpClient.emitter.on("/tcp/v1/client/rx", rxObj => {
  wsServer.set('/tcp/v1/client/rx', rxObj)
})
