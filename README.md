# av-server v0.4.0

[Download](https://github.com/TreyTiderman/av-server/releases/tag/v0.4) or check out the [Demo UI](https://trey.app/av-server)

## Goals

- AV control system
- Simple tools for testing and troubleshooting
- Changes to code or UI happen instantly
- API is easy to use and open ended
- Run on any device and any OS
    - Linux
        - Podman / Docker container
        - Source Code with Node JS
    - Windows
        - Podman / Docker container in WSL2
        - Source Code with Node JS
            - Install as a service (node-windows)
    - Mac
        - Podman / Docker container
        - Source Code with Node JS

## Core

- [ ] Web UI
    - [ ] Provide easy tools for testing and troubleshooting
    - See source code at [here](https://github.com/TreyTiderman/av-server-ui)
- [ ] API v1
    - [Docs](./public/docs/api/api.md)
    - [ ] WebSocket
    - [ ] TCP
    - Tools
        - [ ] TCP Client v1
        - [ ] WS Client v1
- [x] HTTP Server
    - Any files put in the `./public` directory will be served
- [ ] Auth / User accounts / Permissions
- [ ] Multicast Discovery
    - [ ] mDNS?
- [ ] Choose what services are bound to which network interface
- [ ] Encrypt all data between the server and clients
- [ ] Help sections
    - [ ] How to run on startup
    - [ ] How to use the web server
    - [ ] How to use the API

```
"dependencies": {
    "cors": "^2.8.5",
    "dhcp": "^0.2.20",
    "express": "^4.18.1",
    "jsonwebtoken": "^8.5.1",
    "node-rtsp-stream": "^0.0.9",
    "node-windows": "^1.0.0-beta.8",
    "open": "^8.4.0",
    "serialport": "^10.4.0",
    "showdown": "^2.1.0",
    "ws": "^8.8.0"
},
"devDependencies": {
    "nodemon": "^2.0.15"
}
```

# Source Code

## Clone

```
cd ~/
git clone https://github.com/treytiderman/av-server.git
```

## Run

1. Run the following commands in the `/av-server/server` folder
2. Install project dependencies (package.json) with

```
cd ~/av-server/server
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

5. Go to http://SERVER_IP:4620, Example http://192.168.1.1:4620

## Podman

1. Run the following commands in the `/av-server` folder
2. Build the image

```
podman build . -t av-server
```

3. Remove the current running container if it exists

```
podman stop av-server
podman rm av-server
```

4. Then to run the image

```
podman run -d --name av-server --hostname av-server -p 4620:4620 -v $(pwd)/public:/app/public:Z -v $(pwd)/private:/app/private:Z av-server
```

5. Start / Restart / Stop / Remove

```
podman start av-server
```

```
podman restart av-server
```

```
podman stop av-server
```

```
podman rm av-server
```

### Run on system startup / Restart if fails

Generate service, enable, and start

```
mkdir -p ~/.config/systemd/user/
podman generate systemd --new -t 1 \
	--name av-server \
	--restart-policy=always \
	--container-prefix="" \
	--separator="" \
	> ~/.config/systemd/user/av-server.service
systemctl --user daemon-reload
systemctl --user enable av-server.service
systemctl --user start av-server.service
```

Restart

```
systemctl --user restart av-server.service
```

Disable

```
systemctl --user disable av-server.service
```

### Install as a service (Windows 10, 11)

1. Run the following commands in the `/av-server/server` folder
2. Create the service with

```
npm run service-install
```

3. Uninstall service when needed

```
npm run service-uninstall
```
