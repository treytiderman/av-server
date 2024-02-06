# Run source code

First clone the github repo [link](https://github.com/TreyTiderman/av-server)

## Dependancies

- nodejs v20+
- npm

## Server

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

5. Or in development mode for windows (Reloads every file change) with

```
npm run windows-dev
```

6. Go to http://SERVER_IP:4620, Example: http://192.168.1.1:4620

Default login:

```
username: admin
password: admin
```

### Install as a service (Windows)

1. Run the following commands in the `./server` folder

2. Create the service with

```
npm run windows-install-service
```

3. Uninstall service

```
npm run windows-uninstall-service
```

## Kill the process

```
sudo netstat -lpn |grep :'<SERVER_PORT>'
kill -9 <NODE_PROCESS>
```

```
sudo netstat -lpn |grep :'4620'
kill -9 1029825
```
