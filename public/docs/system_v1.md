# time

```js
// Get server time
ws.send.event("system_v1/time", "get")
```

```js
// Subscribe to server time
ws.send.event("system_v1/time", "subscribe")
```

```js
// Unsubscribe from server time
ws.send.event("system_v1/time", "unsubscribe")
```

```js
// Recieve server time
ws.receive.event("system_v1/time", time_iso => {
	const time_example = "2022-12-26T17:08:20.264Z"
})
```

# uptime

```js
// Get server uptime
ws.send.event("system_v1/uptime", "get")
```

```js
// Subscribe to server uptime
ws.send.event("system_v1/uptime", "subscribe")
```

```js
// Unsubscribe from server uptime
ws.send.event("system_v1/uptime", "unsubscribe")
```

```js
// Recieve server uptime
ws.receive.event("system_v1/uptime", uptime_sec => {
	const uptime_example = 600
})
```

# connection

```js
// Get server connection
ws.send.event("system_v1/connection", "get")
```

```js
// Subscribe to server connection
ws.send.event("system_v1/connection", "subscribe")
```

```js
// Unsubscribe from server connection
ws.send.event("system_v1/connection", "unsubscribe")
```

```js
// Recieve server connection
ws.receive.event("system_v1/connection", connection => {
	const connection_example = {
		"status": "open",
		"auth": true,
		"user": {
			"username": "user",
			"role": 50
		}
	}
})
```

# connections

```js
// Get server connection
ws.send.event("system_v1/connections", "get")
```

```js
// Subscribe to server connection
ws.send.event("system_v1/connections", "subscribe")
```

```js
// Unsubscribe from server connection
ws.send.event("system_v1/connections", "unsubscribe")
```

```js
// Recieve server connection
ws.receive.event("system_v1/connections", connection => {
	const connections_example = []
})
```

# info

```js
// Get server info
ws.send.event("system_v1/info", "get")
```

```js
// Subscribe to any change in server info
ws.send.event("system_v1/info", "subscribe")
```

```js
// Unsubscribe from server info
ws.send.event("system_v1/info", "unsubscribe")
```

```js
// Recieve server info
ws.receive.event("system_v1/info", "get", info => {
	const info_example = {
		"av-server_version": "v0.3.0",
		"os": "linux",
		"arch": "x64",
		"hostname": "av-server",
		"nics": [
			{
				"name": "tap0",
				"ip": "10.0.2.100",
				"mask": "255.255.255.0",
				"cidr": "10.0.2.100/24",
				"mac": "76:41:e4:05:b1:86"
			}
		],
		"dns": [
			"10.0.2.3",
			"192.168.1.1"
		],
		"isAdmin": true,
		"time_iso": "2023-03-31T13:48:18.171Z",
		"uptime_sec": 497646.42,
		"user": {
			"uid": 0,
			"gid": 0,
			"username": "root",
			"homedir": "/root",
			"shell": "/bin/ash"
		},
		"__dirname": "/app/server/modules",
		"__filename": "/app/server/modules/v1/system.js",
		"cpu": {
			"cores": 4
		},
		"ram": {
			"free_bytes": 2348244992,
			"total_bytes": 8219344896,
			"percentage": 28.999999999999996
		},
		"node_version": "v18.15.0",
		"eol": "\n"
	}
})
```

# logs

```js
// Get logs
ws.send.event("system_v1/logs")
```

```js
// Receive logs
ws.receive.event("system_v1/logs", body => {
	// TODO
})
```
 
# api

```js
// Get logs
ws.send.event("system_v1/api")
```

```js
// Receive this file
ws.receive.event("system_v1/logs", body => {
	// TODO
})
```
