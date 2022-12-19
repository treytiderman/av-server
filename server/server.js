// Web (HTTP) server
const http = require('./modules/http')
const app = http.start()
app.use(http.middlware)

// WebSocket server
const wsServer = require('./modules/wsServer')
const server = wsServer.start(app)

// Get IP addresses
const os = require("os")
function getNICs() {
  const nets = os.networkInterfaces()
  const results = {}
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      // 'IPv4' is in Node <= 17, for 18 it's a number 4 or 6
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
      if (net.family === familyV4Value && !net.internal) {
        if (!results[name]) results[name] = []
        results[name].push(net.address)
      }
    }
  }
  return results
}

// Start web server
const port = 4620
server.listen(port, () => {
  console.log(`\nAV-Tools server is up and running on ${os.type()}.`)
  console.log(`The user interface is available at:`)
  console.log(`http://localhost:${port}`)
  const NICs = getNICs()
  Object.values(NICs).forEach(key => {
    console.log(`http://${key[0]}:${port}`)
  })
  console.log("")
})