// RTSP to Websocket stream for jsmpeg to decode on the frontend
const Stream = require('node-rtsp-stream')

// Variables
let stream
let activeStream = {
  "active": false,
  "rtspUrl": "rtsp://user:okayokay9@192.168.1.21:554/cam/realmonitor?channel=1&subtype=0",
  "wsPort": 9999,
  "frameRate": 20
}

// Functions
function start(rtspUrl, wsPort, frameRate) {
  if (activeStream.active === false) {
    stream = new Stream({
      name: 'cam',
      streamUrl: rtspUrl,
      wsPort: wsPort,
      ffmpegOptions: {
        '-stats': '', // Stats
        '-r': frameRate // Frame Rate
      }
    })
    activeStream = req.body
    activeStream.active = true
    console.log("/start", activeStream)
    res.send("ok")
  }
}
function stop() {
  stream.stop()
  activeStream.active = false
}
function streamInfo() {
  return activeStream
}

// Export
exports.start = start
exports.stop = stop
exports.streamInfo = streamInfo
