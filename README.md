# AV-Tools v0.3

[Download](https://github.com/TreyTiderman/AV-Tools/releases/tag/v0.2) or check out the [Demo UI](https://trey.app/av-tools)

### Goals
- Simple tools for testing AV control systems
- Run as its own control system
- API is general and open ended so that the frontend or backend can do the scripting
- Run on Windows, Linux, and Mac
  - Electron
  - Docker container (favorite)
  - Direct with Node JS
  - PKG (not working with "serialport")
  - Tauri if backend was rewritten in rust (overkill)

## Tools

I refer to the computer that this application is running on "the server"

### Server v0.3
- [x] HTTP Server
  - Any files put in the `./public` directory will be served
- [ ] Auth / User accounts / Permissions
- [x] HTTP API v0 | [Docs](./public/docs/api/http.md)
- [x] WebSocket API v0 | [Docs](./public/docs/api/ws.md)
- [ ] TCP API
- [ ] UDP API
- [ ] Multicast API?
- [ ] Choose what services are bound to which of the servers NICs
- [ ] Encrypt all data between the server and clients?

Dependencies
```
nodejs  18.12.1
npm     8.19.2
```
```
"cors": "^2.8.5",
"express": "^4.18.1",
"jsonwebtoken": "^8.5.1",
"ws": "^8.8.0"
```

### Network v2

- [x] Set IP address of the server
- [x] Add IP addresses to the server
- [x] Save presets local presets to recall
- [ ] Custom routing for multiple nics
- Platforms
  - [x] Windows
  - [ ] Mac
  - [ ] Linux

Notes
- Windows requires running the app as administrator

Dependencies
```
NONE
```

### DHCP Server v2
- [x] Start a DHCP server hosted on your computer
- [ ] View the ip addresses it hands out
- [ ] Choose the order IPs are handed out
- [ ] Set reserved IPs by Mac Address

Notes
- Make sure port 53 traffic isn't blocked by your firewall or virus protection software

Dependencies
```
"dhcp": "^0.2.20"
```

### Serial (RS232/RS485/DMX) v1
- [x] Open an available serial port and send / receive data from it
- Connection Views
  - [x] Log + 3 Simple send commands
  - [ ] Terminal Tool / Telnet / SSH style
  - [ ] Visca tool
  - [ ] DMX tool
  - [ ] Device specific builder?

Notes
- Linux: The USER needs added to the dialout group to open serial connections

```
sudo gpasswd --add ${USER} dialout
sudo reboot
```

Dependencies
```
"serialport": "^10.4.0",
```

### TCP Client v1

- [ ] Open tcp connections to any device on the network
- Connection Views
  - [x] Log + 3 Simple send commands
  - [ ] Terminal Tool / Telnet / SSH style
  - [ ] Visca tool
  - [ ] Device specific builder?

Dependencies
```
NONE
```

### Restream to Web v0

Currently that means the RTSP stream gets transcoded with FFMPEG then streamed out via WebSocket to be decoded by [JSMpeg](https://github.com/phoboslab/jsmpeg) on the frontend. This is the lowest latency option I have found (<1sec). HLS always will have latencies >1sec practically >6sec

- [x] View WebSocket streams with JSMpeg
  - [ ] Audio
- [ ] Start/Stop the transcoding and WebSocket server
- [ ] Bundle FFMPEG with the app
- [ ] Support other input streams RTMP, NDI, Multicast?
- [ ] Support other output streams HLS, MPEG2, MPEG-DASH?

Dependencies
```
"node-rtsp-stream": "^0.0.9",
```

### Road map Ideas
- HTTP Server
- TCP Server
- UDP Client / Server
- Websocket Client / Server
- IR TX / RX
- QR code generator
- Video/Audio/Image Player
- Test patterns
  - Standard patterns
  - Vertical Sync testing
  - Clock
- Help sections
  - How to run on startup
  - How to use the web server
  - How to use the API

# Run source code

First clone the github repo [link](https://github.com/TreyTiderman/AV-Tools)

### Server | AV-Tools

1. Run the following commands in the `./server` folder
2. Install project dependencies (package.json) with
```
npm install
```
3. Then to start the server (server.js) with
```
npm run start
```
4. Or in development mode (Reloads every file change) with
```
npm run dev
```
5. Go to http://SERVER_IP:4620
    - Example: http://192.168.1.1:4620

#### Kill the process

```
sudo netstat -lpn |grep :'<SERVER_PORT>'
kill -9 <NODE_PROCESS>
```

```
sudo netstat -lpn |grep :'6969'
kill -9 1029825
```

### Client | Web UI with Svelte

1. Run the following commands in the `./client` folder
2. Install project dependencies (package.json) with
```
npm install
```
3. Then to start the bundler Vite (Updates live) with
```
npm run dev
```
4. Go to http://SERVER_IP:5173
    - Example: http://192.168.1.1:5173
5. Build a bundle and put it in the public folder `./public/svelte` with
```
npm run build
```
6. Build and Preview the bundle if needed with
```
npm run preview
```

### Docker

1. Run the following commands in the `./` folder
2. Build the image
    - Folder to build: "PATH"
    - Tag: "-t NAME_OF_TAG"
```
sudo docker build . -t AV-Tools
```
3. Remove the current running container if it exists
    - Image Name: "NAME"
```
sudo docker rm AV-Tools
```
4. Then to run the image
    - Detach: "-d" (run in background)
    - Port: "-p SERVER_PORT:CONTAINER_PORT"
    - Volume: "-v SERVER_DIRECTORY:CONTAINER_DIRECTORY"
    - Image Name: "NAME"
```
sudo docker run -d -p 4620:4620 -v $(pwd)/public:/app/public --restart unless-stopped --name AV-Tools AV-Tools
```
5. Stop / Start / Restart when needed
    - Image Name: "NAME"
```
sudo docker stop AV-Tools
```
```
sudo docker start AV-Tools
```
```
sudo docker restart AV-Tools
```

### Electron App (for the OS you are on)

1. Run the following commands in the `./server` folder
2. Build the electron installer with
```
npm run electron-build
```
