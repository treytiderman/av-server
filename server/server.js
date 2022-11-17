// Web (HTTP) server
const http = require('./modules/http')
const app = http.start()
app.use(http.middlware)

// WebSocket server
const ws = require('./modules/ws')
const server = ws.start(app)

// Routes /
const pages = require('./routes/pages')
app.use('/', pages.router)

// Routes /api
const api = require('./routes/api')
app.use('/api/v1', api.router)

// Routes /test
const tests = require('./routes/tests')
app.use('/api/v1/test', tests.router)

// Routes /login
const auth = require('./middleware/auth')
app.use('/api/v1/login', auth.router)

// Add all routes to api.routesAll
api.routesAll['/'] = pages.routes
api.routesAll['/api/v1'] = api.routes
api.routesAll['/api/v1/test'] = tests.routes
api.routesAll['/api/v1/login'] = auth.routes

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
server.listen(port, () => {
  console.log(`\nAV-Tools server is up and running. The user interface is available at:`)
  console.log(`http://localhost:${port}`)
  const NICs = getNICs()
  Object.values(NICs).forEach(key => {
    console.log(`http://${key[0]}:${port}`)
  });
})