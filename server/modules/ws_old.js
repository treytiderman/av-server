const WebSocket = require('ws');
let wss;
let wsMemory = [
  {
    name: 'wsMemory',
    data: 'holds all the data'
  }
]

// Functions
function log(text) {
  const logger = require('./log');
  logger.log(text, "../public/logs/", 'ws');
}
function isSubscibed(subscriptions, name) {
  let is = false;
  subscriptions.forEach(subscription => {
    if (subscription === name) {
      is = true;
    }
  });
  return is;
}
function wsMemoryGet(name) {
  let obj = wsMemory.find(obj => obj.name === name);
  return obj;
}
function wsMemorySet(name, data) {
  // Check if the name exists in the wsMemory
  let exists = false;
  wsMemory.forEach((obj) => {
    if (obj.name === name) {
      exists = true;
      obj.data = data;
    }
  })
  // If it doesn't append it to the wsMemory
  if (!exists) {
    const obj = { name: name, data: data }
    wsMemory.push(obj)
  }
  // Update all the subscribed clients
  wss.clients.forEach((ws) => publish(ws, 'wsMemory', wsMemory));
}
function publish(ws, name, data) {
  if (ws.readyState === WebSocket.OPEN && isSubscibed(ws.subscriptions, name)) {
    const obj = { name: name, data: data }
    ws.send(JSON.stringify(obj));
  }
}
function publishOne(ws, name, data) {
  wsMemorySet(name, data);
  publish(ws, name, data)
}
function publishAll(name, data) {
  if (wss.clients.size > 0) log(`SENT ALL ${name}: ${data}`);
  wsMemorySet(name, data);
  wss.clients.forEach((ws) => publish(ws, name, data));
}
function newConnection(ws, req) {
  // New connection
  // log(req.url);
  const ip = req.socket.remoteAddress.split('f:')[1];
  const totalClients = wss.clients.size
  log(`NEW CONNECTION @ ${ip} Totaling ${totalClients} client(s)`);
  ws.subscriptions = [];
  wsMemorySet('connected', true);
  // Recived message from client
  ws.on('message', (data) => {
    log(`RECEIVED: ${data}`);
    // Message expected as an objects with two properties 
    // EX: { name: 'hi', data: {} }
    const obj = JSON.parse(data);
    if (obj.data === 'subscribe') {
      ws.subscriptions.push(obj.name);
      const value = wsMemoryGet(obj.name);
      if (value) publish(ws, obj.name, value.data)
      else publish(ws, obj.name, 'not in memory')
    }
  });
  // Uptime
  let count = 0;
  setInterval(() => {
    count++;
    publishOne(ws, 'uptime', count)
  }, 1000);
}
function start(app) {
  const server = require('http').createServer(app);
  wss = new WebSocket.Server({ server: server });
  wss.on('connection', newConnection);
  return server;
}

// Global uptime
let globalCount = 0;
setInterval(() => {
  globalCount++;
  publishAll('serverUptime', globalCount)
}, 1000);

// Export
exports.start = start;
exports.publishAll = publishAll;

/* Examples

// express - Web server
const http = require('./modules/http');
const app = http.start();
app.use(http.middlware);

// ws - WebSockets
const ws = require('./modules/ws');
const server = ws.start(app);

*/