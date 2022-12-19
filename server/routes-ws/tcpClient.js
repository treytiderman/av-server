const wsServer = require('../modules/wsServer')

// Module
const tcpClient = require('../modules/tcpClient')

wsServer.set('dataTest', 'function worked')

wsServer.emitter.on("close", (ws, req) => {
  ws.terminate()
})
