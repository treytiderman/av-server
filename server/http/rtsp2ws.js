// Create Express router
const express = require('express')
const router = express.Router()

// Module | RTSP to Websocket stream for jsmpeg to decode on the frontend
const rtsp2ws = require('../modules/rtsp2ws')

// Routes
router.get('/stream', async (req, res) => {
  const output = rtsp2ws.streamInfo()
  res.status(200).send(output)
})
router.get('/stop', async (req, res) => {
  rtsp2ws.stop()
  res.status(200).send("ok")
})
router.post('/start', async (req, res) => {
  rtsp2ws.start(req.body.rtspUrl, req.body.wsPort, req.body.frameRate)
  res.status(200).json(req.body)
})

// Export
exports.router = router
