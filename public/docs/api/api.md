# Import Library

```js
// Import websocket library
import ws from "./js/ws.js"
```

# Connect

```js
// Connect to a websocket server
ws.connect()
```

```js
// Connect to a specific websocket server
ws.connect({
	ip: "192.168.1.1", // Optional
	port: 4620, // Optional
})
```

# JSON Objects

[system](./system-json.md)

[user](./user-json.md)

[programs](./programs-json.md)

[tcp-client](tcp-client-json.md)

[serial](./serial-json.md)

# Keywords

crud
- create (post)
- read (get)
- update (put)
- delete (delete)

crud
- new
- add
- change
- remove

events
- get
- sub
- pub

# Topics

[system](./system-json.md)

[user](./user-json.md)

[script](./script-json.md)

[tcp-client](tcp-client-json.md)

[tcp-server](./tcp-server-json.md)

[udp-client](./udp-client-json.md)

[udp-server](./udp-server-json.md)

[http-client](./http-client-json.md)

[http-server](./http-server-json.md)

[websocket-client](./websocket-client-json.md)

[websocket-server](./websocket-server-json.md)

[serial](./serial-json.md)

# Structure

```js
// Structure
{
	"topic": "path",
	"event": "event_name",
	"body": "string, array, or object",
}

// Example
{
	"topic": "tcp_client_v1",
	"event": "subscribe",
	"body": {
	    "ip": "192.168.1.246",
	    "port": 23
	},
})

// Send json
ws.sendJson({
	"topic": "user",
	"event": "login",
	"body": {
		"username": "admin",
		"password": "admin"
	}
})

// Send event
ws.sendEvent("user", "login", {
	"username": "admin",
	"password": "admin"
})

// Receive json
ws.receiveJson(json => {
	if (json.topic === "user" && json.event === "login") {
		if (body.error === true) {
			// Login failed
		}
		else {
			// Login success
		}
	}
})

// Receive event
ws.receiveEvent("user", "login", body => {
	if (body.error === true) {
		// Login failed
	 }
	else {
		// Login success
	}
})
```