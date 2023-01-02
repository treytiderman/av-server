// HTTP Server
// const http = require('./modules/http_server')
const http = require('./_http/_http_server')
const http_server = http.start()

// WebSocket Server
const ws = require('./modules/ws_server')
const server = ws.start(http_server)

// Get System Info
const system = require("./modules/system")
const systemInfo = system.getSystemInfo()

// Start Server
const port = process.env.port || 4620
server.listen(port, () => {
  console.log(`\nAV-Tools server is up and running on ${systemInfo.os}`)
  console.log(`The user interface is available at:`)
  console.log(`- http://${systemInfo.hostname}:${port}`)
  console.log(`- http://localhost:${port}`)
  systemInfo.nics.forEach(nic => {
    console.log(`- http://${nic.ip}:${port}`)
  });
  console.log("")
})