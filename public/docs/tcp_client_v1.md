> **Note**
> The tcp_client_v1 API can be used open and send "data" to any reachable tcp server. This "data" can be represented as either HEX or ASCII

```js
const ip = "192.168.1.246"
const port = 23
```

# open

```js
ws.send.event(`tcp_client_v1/${ip}:${port}`, "open", {
    "expectedDelimiter": "\r" // optional
})
```

```js
ws.receive.json(`tcp_client_v1/${ip}:${port}`, "open", body => {
	if (body.error === true) {
		if (body.errorMessage === "connection already open") {}
		else if (body.errorMessage === "connection failed") {}
	}
	else {
		const body_example = {
			"error": false,
			"ip": "192.168.1.246",
			"port": 23,
			"isOpen": true,
			"expectedDelimiter": "\r",
		}
	}
})
```

# send

```js
ws.send.event(`tcp_client_v1/${ip}:${port}`, "send", {
	"data": "MV?",
	"encoding": "ascii", // [ascii, hex]
	"cr": true, // optional
	"lf": false, // optional
})
```

```js
ws.receive.json(`tcp_client_v1/${ip}:${port}`, "send", body => {
	if (body.error === true) {
		if (body.errorMessage === "connection not open") {}
	}
	else {
		const body_example = {
			"error": false,
			"hex": "4d563f0d",
			"ascii": "MV?\r",
			"wasReceived": false,
			"timestampISO": "2022-12-26T17:14:11.935Z",
		}
	}
})
```

# receive

```js
ws.receive.json(`tcp_client_v1/${ip}:${port}`, "receive", body => {
	const body_example = {
		"hex": "4d5632340d",
		"ascii": "MV24\r",
		"wasReceived": true,
		"timestampISO": "2022-12-26T17:14:11.964Z",
	}
})
```

# close

```js
ws.send.event(`tcp_client_v1/${ip}:${port}`, "close")
```

```js
ws.receive.json(`tcp_client_v1/${ip}:${port}`, "close", body => {
	if (body.error === true) {
		if (body.errorMessage === "connection not open") {}
	}
	else {
		const body_example = {
			"error": false,
			"ip": "192.168.1.246",
			"port": 23,
			"isOpen": false,
			"expectedDelimiter": "\r",
		}
	}
})
```

# get

```js
ws.send.event(`tcp_client_v1/${ip}:${port}`, "get")
```

```js
ws.receive.json(`tcp_client_v1/${ip}:${port}`, "get", body => {
	if (body.error === true) {
		if (body.errorMessage === "connection not open") {}
	}
	else {
		const body_example = {
			"error": false,
			"ip": "192.168.1.246",
			"port": 23,
			"isOpen": false,
			"expectedDelimiter": "\r",
		}
	}
})
```

# history

```js
ws.send.event(`tcp_client_v1/${ip}:${port}`, "history")
```

```js
ws.receive.json(`tcp_client_v1/${ip}:${port}`, "history", body => {
	if (body.error === true) {
		if (body.errorMessage === "connection not open") {}
	}
	else {
		const body_example = {
			"error": false,
			"isOpen": false,
			"ip": "192.168.1.246",
			"port": 23,
			"expectedDelimiter": "\r",
			"history": [
				{
					"hex": "4d563f0d",
					"ascii": "MV?\r",
					"wasReceived": false,
					"timestampISO": "2022-12-26T17:19:03.664Z",
				},
				{
					"hex": "4d5632340d",
					"ascii": "MV24\r",
					"wasReceived": true,
					"timestampISO": "2022-12-26T17:19:03.699Z",
				},
				{
					"hex": "4d564d41582039380d",
					"ascii": "MVMAX 98\r",
					"wasReceived": true,
					"timestampISO": "2022-12-26T17:19:03.743Z",
				}
			]
		}
	}
})
```

# subscribe

```js
ws.send.event(`tcp_client_v1/${ip}:${port}`, "subscribe")
```

# unsubscribe

```js
ws.send.event(`tcp_client_v1/${ip}:${port}`, "unsubscribe")
```

# get all

```js
ws.send.event(`tcp_client_v1`, "get")
```

```js
ws.receive.json(`tcp_client_v1`, "get", body => {
	if (body.error === true) {
		if (body.errorMessage === "connection not open") {}
	}
	else {
		const body_example = [
			{
				"error": false,
			    "ip": "192.168.1.246",
			    "port": 23,
				"isOpen": false,
				"expectedDelimiter": "\r",
			},
			{
				"error": false,
			    "ip": "192.168.1.99",
			    "port": 5000,
				"isOpen": false,
				"expectedDelimiter": "\r\n",
			}
		]
	}
})
```

# history all

```js
ws.send.event(`tcp_client_v1`, "history")
```

```js
ws.receive.json(`tcp_client_v1`, "history", body => {
	if (body.error === true) {
		if (body.errorMessage === "connection not open") {}
	}
	else {
		const body_example = [
			{
				"error": false,
				"ip": "192.168.1.246",
				"port": 23,
				"isOpen": false,
				"expectedDelimiter": "\r",
				"history": [
					{
						"hex": "4d563f0d",
						"ascii": "MV?\r",
						"wasReceived": false,
						"timestampISO": "2022-12-26T17:19:03.664Z",
					},
					{
						"hex": "4d5632340d",
						"ascii": "MV24\r",
						"wasReceived": true,
						"timestampISO": "2022-12-26T17:19:03.699Z",
					},
					{
						"hex": "4d564d41582039380d",
						"ascii": "MVMAX 98\r",
						"wasReceived": true,
						"timestampISO": "2022-12-26T17:19:03.743Z",
					},
				]
			},
			{
				"error": false,
			    "ip": "192.168.1.99",
			    "port": 5000,
				"isOpen": false,
				"expectedDelimiter": "\r\n",
				"history": [],
			}
		]
	}
})
```

# subscribe all

```js
ws.send.event(`tcp_client_v1`, "subscribe")
```

# unsubscribe all

```js
ws.send.event(`tcp_client_v1`, "unsubscribe")
```

