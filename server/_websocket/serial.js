const ws_server = require('../modules/ws_server')

// Module
const serial = require('../modules/serial')

// Client Events
ws_server.emitter.on("/serial/v1", async (ws, req) => {
  if (req.event === "open") {
    ws_server.subscribe(ws, `/serial/v1/${req.body.path}`)
    serial.open(
      req.body.path,
      req.body.baudRate,
      req.body.expectedDelimiter
    )
  }
  else if (req.event === "send") {
    ws_server.subscribe(ws, `/serial/v1/${req.body.path}`)
    serial.send(
      req.body.path,
      req.body.data,
      req.body.encoding,
      req.body.cr,
      req.body.lf
    )
  }
  else if (req.event === "close") {
    ws_server.subscribe(ws, `/serial/v1/${req.body.path}`)
    serial.close(
      req.body.path
    )
  }
  else if (req.event === "available") {
    ws_server.subscribe(ws, `/serial/v1`)
    const ports = await serial.getAvailablePorts()
    ws_server.event(`/serial/v1`, "available", ports)
  }
  else if (req.event === "ports") {
    ws_server.subscribe(ws, `/serial/v1`)
    const ports = serial.getPorts()
    ws_server.event(`/serial/v1`, "ports", ports)
  }
  else if (req.event === "port") {
    ws_server.subscribe(ws, `/serial/v1/${req.body.path}`)
    const port = serial.getPort(
      req.body.path
    )
    ws_server.event(`/serial/v1/${req.body.path}`, "port", port)
  }
})

// Module events
serial.emitter.on("open", (path, body) => {
  ws_server.event(`/serial/v1/${path}`, "open", body)
  ws_server.event(`/serial/v1`, "open", {...body, path: path})
})
serial.emitter.on("send", (path, body) => {
  ws_server.event(`/serial/v1/${path}`, "send", body)
  ws_server.event(`/serial/v1`, "send", {...body, path: path})
})
serial.emitter.on("receive", (path, body) => {
  ws_server.event(`/serial/v1/${path}`, "receive", body)
  ws_server.event(`/serial/v1`, "receive", {...body, path: path})
})
serial.emitter.on("receiveRaw", (path, body) => {
  ws_server.event(`/serial/v1/${path}`, "receiveRaw", body)
  ws_server.event(`/serial/v1`, "receiveRaw", {...body, path: path})
})
serial.emitter.on("close", (path, body) => {
  ws_server.event(`/serial/v1/${path}`, "close", body)
  ws_server.event(`/serial/v1`, "close", {...body, path: path})
})
serial.emitter.on("error", (path, body) => {
  ws_server.event(`/serial/v1/${path}`, "error", body)
  ws_server.event(`/serial/v1`, "error", {...body, path: path})
})
