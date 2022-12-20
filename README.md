# AV-Tools

Download a release to the right

Demo: [link](https://trey.app/svelte/#/av-tools/network)

## Versions

nodejs  18.12.1

npm     8.19.2

## Tools

Network v1.1
- [x] Set IP address of the computer
- [x] Save presets to recall
- [ ] Custom routing
- Windows: Running as administrator is required

DHCP v1
- [x] Start a DHCP server hosted on your computer and view the ip addresses it hands out
- Make sure port 53 traffic isn't blocked by your firewall or virus protection software

Serial v1
- [x] Open an available serial port and send / receive data from it
- [ ] Other send methods, Device saving, Visca tool
- Linux: The USER needs added to the dialout group to open serial connections

```
sudo gpasswd --add ${USER} dialout
sudo reboot
```

## Download App

Get app under releases (to the right on desktop)

# Run source code

First clone the github repo

## Server | AV-Tools

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

## Client | Web UI made with Svelte

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

## Build | Electron App (for the OS you are on)

1. Run the following commands in the `./server` folder
2. Build the electron installer with
```
npm run electron-build
```
