const ws = require("./_ws_server")

// Modules
const system = require("../modules/system")

// Global uptime
let globalCount = 0
setInterval(() => {
  globalCount++
  ws.publish("uptime", globalCount)
  ws.publish("time", new Date(Date.now()).toISOString())
  ws.publish("system", system.getSystemInfo())
}, 1000)
