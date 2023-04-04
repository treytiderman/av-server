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

# Events v1

### [system_v1](./system_v1.md)
### [user_v1](user_v1.md)
### [script_v1](./script_v1.md)
### [tcp_client_v1](tcp_client_v1.md)
### [tcp_server_v1](./tcp_server_v1.md)
### [udp_client_v1](./udp_client_v1.md)
### [udp_server_v1](./udp_server_v1.md)
### [http_client_v1](./http_client_v1.md)
### [http_server_v1](./http_server_v1.md)
### [websocket_client_v1](./websocket_client_v1.md)
### [websocket_server_v1](./websocket_server_v1.md)
### [serial_v1](./serial_v1.md)

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
ws.send.json({
	"topic": "user_v1",
	"event": "login",
	"body": {
		"username": "admin",
		"password": "admin"
	}
})

// Send event
ws.send.event("user_v1", "login", {
	"username": "admin",
	"password": "admin"
})

// Receive json
ws.receive.json(json => {
	if (json.topic === "user_v1" && json.event === "login") {
		if (body.error === true) {
			// Login failed
		}
		else {
			// Login success
		}
	}
})

// Receive event
ws.receive.event("user_v1", "login", body => {
	if (body.error === true) {
		// Login failed
	 }
	else {
		// Login success
	}
})
```