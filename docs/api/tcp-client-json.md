# Topic: tcp-client/IP:PORT

## Event: open

```json
// [Send]
// Function: open a tcp connection on the server
// Group Required: "admins"
// Subscribes Topic: tcp-client/192.168.1.246:23
{
	"topic": "tcp-client/192.168.1.246:23",
	"event": "open",
	"body": {
		"expectedDelimiter": "\r" // optional, default "\r"
	}
}
```

```json
// [Recieve]
// Body: "ok" or "error " + description
{
	"topic": "tcp-client/192.168.1.246:23",
	"event": "open",
	"body": "ok"
	// "body": "error connection already open"
	// "body": "error connection failed"
	// "body": "error not in group admins"
}
// If: "open" "ok"
// Body: status the tcp connection
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

## Event: send

```json
// [Send]
// Function: send some data to the tcp connection
// Group Required: "admins"
// Subscribes Topic: tcp-client/192.168.1.246:23
{
	"topic": "tcp-client/192.168.1.246:23",
	"event": "send",
	"body": {
		"data": "MV?",
		"encoding": "ascii", // ["ascii", "hex"]
		"cr": true, // optional, default false
		"lf": false // optional, default false
	}
}
```

```json
// [Recieve]
// Body: "ok" or "error " + description
{
	"topic": "tcp-client/192.168.1.246:23",
	"event": "send",
	"body": "ok"
	// "body": "error connection not open"
	// "body": "error role from whoami is less than 99"
}
// If: "send" "ok"
// Body: data object sent or received
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

## Event: data

```json
// [Recieve]
// Updates: anytime data is sent or received on the tcp connection
// Body: data object sent or received
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

## Event: close

```json
// [Send]
// Function: close the tcp connection
// Group Required: "admins"
// Subscribes Topic: tcp-client/192.168.1.246:23
{
	"topic": "tcp-client/192.168.1.246:23",
	"event": "close"
}
```

```json
// [Recieve]
// Body: "ok" or "error " + description
{
	"topic": "tcp-client/192.168.1.246:23",
	"event": "close",
	"body": "ok"
	// "body": "error connection not open"
	// "body": "error role from whoami is less than 99"
}
// If: "close" "ok"
// Body: status the tcp connection
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

## Event: status

```json
// [Send]
// Function: get status the tcp connection
// Subscribes Topic: tcp-client/192.168.1.246:23
{
	"topic": "tcp-client/192.168.1.246:23",
	"event": "status"
}
```

```json
// [Recieve]
// Body: status the tcp connection
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

## Event: history

```json
// [Send]
// Function: get all data history
// Subscribes Topic: tcp-client/192.168.1.246:23
{
	"topic": "tcp-client/192.168.1.246:23",
	"event": "data-history"
}
```

```json
// [Recieve]
// Body: array of data objects
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

# Topic: tcp-client

## Event: status-all

```json
// [Send]
// Function: get status of all connections
// Subscribes Topic: tcp-client
{
	"topic": "tcp-client",
	"event": "status-all"
}
```

```json
// [Recieve]
// Body: array of status objects
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
