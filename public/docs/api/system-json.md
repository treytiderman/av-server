# Topic: system/time

## Event: get / subscribe

```json
// [Send]
// Function: get server time
{
	"topic": "system/time",
	"event": "get"
}

// Function: get server time
// Subscribes Topic: system/time
{
	"topic": "system/time",
	"event": "subscribe"
}
```

```json
// If subscribed: every second
// Body: server time (ISO format)
{
	"topic": "system/time",
	"event": "update",
	"body": "2022-12-26T17:08:20.264Z"
}
```

# Topic: system/uptime

## Event: get / subscribe

```json
// [Send]
// Function: get server uptime
// Subscribes Topic: system/uptime
{
	"topic": "system/uptime",
	"event": "get"
}

// Function: get server uptime
// Subscribes Topic: system/uptime
{
	"topic": "system/uptime",
	"event": "subscribe"
}
```

```json
// [Recieve]
// Body: servers uptime (ms)
{
	"topic": "system/uptime",
	"event": "get",
	"body": "5000"
}

// Updates: every second
// Body: servers uptime (ms)
{
	"topic": "system/uptime",
	"event": "update",
	"body": "6000"
}
```

# Topic: system/info

## Event: get / subscribe

```json
// [Send]
// Function: get servers info
// Subscribes Topic: system/info
{
	"topic": "system/info",
	"event": "get"
}

// Function: get server info
// Subscribes Topic: system/info
{
	"topic": "system/info",
	"event": "subscribe"
}
```

```json
// [Recieve]
// Updates: every second
// Body: servers info object
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
