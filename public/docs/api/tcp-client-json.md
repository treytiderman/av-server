# open

```json
// [Send]
// function: tell the server to open a tcp connection
// minimum role: ADMIN (99)
{
	"topic": "tcp-client/192.168.1.246:23",
	"event": "open",
	"body": {
		"expectedDelimiter": "\r" // optional default ["\r"]
	}
}
```

```json
// [Recieve]
// ok: returns ok
// error: returns "error " + description
{
	"topic": "tcp-client/192.168.1.246:23",
	"event": "open",
	"body": "ok"
	// "body": "error connection already open"
	// "body": "error connection failed"
	// "body": "error role from whoami is less than 99"
}
// updates: if open ok
// payload: status the tcp connection
{
	"topic": "tcp-client/192.168.1.246:23",
	"event": "status",
	"body": {
		"ip": "192.168.1.246",
		"port": 23,
		"isOpen": true,
		"expectedDelimiter": "\r"
	}
}
```

# send

```json
// [Send]
// function: send some data to the tcp connection
// minimum role: ADMIN (99)
{
	"topic": "tcp-client/192.168.1.246:23",
	"event": "send",
	"body": {
		"data": "MV?",
		"encoding": "ascii", // ["ascii", "hex"]
		"cr": true, // optional default [false]
		"lf": false // optional default [false]
	}
}
```

```json
// [Recieve]
// ok: returns ok
// error: returns "error " + description
{
	"topic": "tcp-client/192.168.1.246:23",
	"event": "send",
	"body": "ok"
	// "body": "error connection not open"
	// "body": "error role from whoami is less than 99"
}
// updates: if send ok
// payload: data object sent or received
{
	"topic": "tcp-client/192.168.1.246:23",
	"event": "data",
	"body": {
		"hex": "4d563f0d",
		"ascii": "MV?\r",
		"wasReceived": false,
		"timestampISO": "2022-12-26T17:14:11.935Z"
	}
}
```

# data

```json
// [Recieve]
// updates: anytime data is sent or received on the tcp connection
// payload: data object sent or received
{
	"topic": "tcp-client/192.168.1.246:23",
	"event": "data",
	"body": {
		"hex": "4d5632340d",
		"ascii": "MV24\r",
		"wasReceived": true,
		"timestampISO": "2022-12-26T17:14:11.964Z"
	}
}
```

# close

```json
// [Send]
// function: close the tcp connection
// minimum role: ADMIN (99)
{
	"topic": "tcp-client/192.168.1.246:23",
	"event": "close"
}
```

```json
// [Recieve]
// ok: returns ok
// error: returns "error " + description
{
	"topic": "tcp-client/192.168.1.246:23",
	"event": "close",
	"body": "ok"
	// "body": "error connection not open"
	// "body": "error role from whoami is less than 99"
}
// updates: if close ok
// payload: status the tcp connection
{
	"topic": "tcp-client/192.168.1.246:23",
	"event": "status",
	"body": {
		"ip": "192.168.1.246",
		"port": 23,
		"isOpen": false,
		"expectedDelimiter": "\r",
	}
}
```

# status

```json
// [Send]
// get: status the tcp connection
{
	"topic": "tcp-client/192.168.1.246:23",
	"event": "status"
}
```

```json
// [Recieve]
// payload: status the tcp connection
// error: returns "error " + description
{
	"topic": "tcp-client/192.168.1.246:23",
	"event": "status",
	"body": {
		"ip": "192.168.1.246",
		"port": 23,
		"isOpen": false,
		"expectedDelimiter": "\r",
	}
	// "body": "error connection not defined"
}
```

# history

```json
// [Send]
// get: all data history
{
	"topic": "tcp-client/192.168.1.246:23",
	"event": "data-history"
}
```

```json
// [Recieve]
// payload: array of data objects
// error: returns "error " + description
{
	"topic": "tcp-client/192.168.1.246:23",
	"event": "data-history",
	"body": [
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
	// "body": "error connection not defined"
}
```

# status-all

```json
// [Send]
// get: status of all connections
{
	"topic": "tcp-client",
	"event": "status-all"
}
```

```json
// [Recieve]
// payload: array of status objects
{
	"topic": "tcp-client",
	"event": "status-all",
	"body": [
		{
			"ip": "192.168.1.246",
			"port": 23,
			"isOpen": false,
			"expectedDelimiter": "\r",
		},
		{
			"ip": "192.168.1.99",
			"port": 5000,
			"isOpen": true,
			"expectedDelimiter": "\r\n",
		}
	]
}
```
