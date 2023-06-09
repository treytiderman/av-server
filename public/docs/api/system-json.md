# time

```json
// [Send]
// get: servers time (ISO format)
{
	"topic": "system/time",
	"event": "get"
}
```

```json
// [Recieve]
// payload: servers time (ISO format)
{
	"topic": "system/time",
	"event": "get",
	"body": "2022-12-26T17:08:20.264Z"
}
// updates: every second
// payload: servers time (ISO format)
{
	"topic": "system/time",
	"event": "update",
	"body": "2022-12-26T17:08:20.264Z"
}
```

# uptime

```json
// [Send]
// get: servers uptime (ISO format)
{
	"topic": "system/uptime",
	"event": "get"
}
```

```json
// [Recieve]
// payload: servers uptime (ISO format)
{
	"topic": "system/uptime",
	"event": "get",
	"body": "2022-12-26T17:08:20.264Z"
}
// updates: every second
// payload: servers uptime (ISO format)
{
	"topic": "system/uptime",
	"event": "update",
	"body": "2022-12-26T17:08:20.264Z"
}
```

# info

```json
// [Send]
// get: servers info
{
	"topic": "system/info",
	"event": "get"
}
```

```json
// [Recieve]
// payload: servers info
{
	"topic": "system/info",
	"event": "get",
	"body": {
		"av-server": "v0.3.0",
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
		"timeISO": "2023-03-31T13:48:18.171Z",
		"uptimeInSec": 497646.42,
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
			"freeBytes": 2348244992,
			"totalBytes": 8219344896,
			"percentage": 28.999999999999996
		},
		"nodeVersion": "v18.15.0",
		"eol": "\n"
	}
}
// updates: every second
// payload: servers info
{
	"topic": "system/uptime",
	"event": "update",
	"body": {
		"av-server": "v0.3.0",
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
		"timeISO": "2023-03-31T13:48:18.171Z",
		"uptimeInSec": 497646.42,
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
			"freeBytes": 2348244992,
			"totalBytes": 8219344896,
			"percentage": 28.999999999999996
		},
		"nodeVersion": "v18.15.0",
		"eol": "\n"
	}
}
```
