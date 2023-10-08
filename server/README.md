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
