// Web (HTTP) server
const http = require('./modules/http')
const app = http.start()
app.use(http.middlware)

// WebSocket server
const ws = require('./modules/ws')
const server = ws.start(app)

// Routes /
const pages = require('./routes/pages')
pages.path = '/'
app.use(pages.path, pages.router)

// Routes /api
const api = require('./routes/api')
api.path = '/api'
api.routesAll[pages.path] = pages.routes
api.routesAll[api.path] = api.routes
app.use(api.path, api.router)

// Routes /test
const tests = require('./routes/tests')
tests.path = '/api/test/v1'
api.routesAll[tests.path] = tests.routes
app.use(tests.path, tests.router)

// Router /api/net - Change computers IP/Network settings
// const net = require(__dirname + '/src/routes/net');
const network = require('./routes/network');
network.path = '/api/network/v1'
api.routesAll[network.path] = network.routes
app.use(network.path, network.router);

// Router /api/dhcp/server - DHCP Server
const dhcpServer = require('./routes/dhcpServer');
dhcpServer.path = '/api/dhcp/server/v1'
api.routesAll[dhcpServer.path] = dhcpServer.routes
app.use(dhcpServer.path, dhcpServer.router);

// Router /api/serial - DHCP Server
const serialport = require('./routes/serialport')
serialport.path = '/api/serial/v1'
api.routesAll[serialport.path] = serialport.routes
app.use(serialport.path, serialport.router)

// Routes /login
const auth = require('./middleware/auth')
auth.path = '/api/login/v1'
app.use(auth.path, auth.router)
api.routesAll[auth.path] = auth.routes

// Get IP addresses
const { networkInterfaces } = require('os')
function getNICs() {
  const nets = networkInterfaces()
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
const os = require("os"); // Comes with node.js
server.listen(port, () => {
  console.log(`\nAV-Tools server is up and running on ${os.type()}.`)
  console.log(`The user interface is available at:`)
  console.log(`http://localhost:${port}`)
  const NICs = getNICs()
  Object.values(NICs).forEach(key => {
    console.log(`http://${key[0]}:${port}`)
  });
})