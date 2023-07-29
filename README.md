# av-server v0.4.0

[Download](https://github.com/TreyTiderman/av-server/releases/tag/v0.4) or check out the [Demo UI](https://trey.app/av-server)

## Goals

- Quickest path to functional control system
    - This is for controling a room or home. Not much going on... 
    - Intended concurrent users would be 0 to maybe a 100 (made this number up)
- Simple tools for testing and troubleshooting control systems
- Live changes to code or UI happen instantly
- API is easy to use and consistant
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

## Features

- Web UI
    - Provide easy access to the API
    - See source code at [here](https://github.com/TreyTiderman/av-server-ui)
- Api
    - [Api Documentation](./docs/api/api.md)
    - Interact with the API in the following ways
        - websocket
        - http
        - tcp
        - ipc / cli / sockets?
    - Api modules (system managment)
        - files
        - logger
        - programs
        - state
        - system
        - users
    - Api tools
        - http-client
        - http-server
        - serial (com ports, rs232, rs485 / dmx)
        - tcp-client
        - tcp-server
        - udp-client
        - udp-server
        - websocket-client
        - websocket-server
    - Api extentions (ideas for add on modules)
        - netsh (set Network info on windows)
        - av-touch-panel (https://github.com/treytiderman/av-touchpanel)
        - dhcp-server
        - ssh-client
        - telnet-client
        - raspberry-pi-hw
        - rstp-to-ws
        - mdns-client
        - mqqt
- HTTP Server
    - Any files put in the `./public` directory will be served
- HTTPS / WSS (encrypt all data between the server and clients)
- Help
    - How to run on startup?
    - How to use the web server?
    - How to use the API?
- Ideas
    - Rewrite in Rust? Tauri is nice
    - Linux Cockpit integration
    - Node-RED programs

# Source Code

## Clone

```
cd ~/
git clone https://github.com/treytiderman/av-server.git
```

## Install as a service (Windows 10, 11)

1. Run the following commands in the `/av-server/server` folder
2. Create the service with

```
npm install
npm run service-install
```

3. Uninstall service when needed

```
npm run service-uninstall
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
