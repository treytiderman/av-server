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

- [System_v1](./System_v1.md)
- [user_v1](user_v1.md)
- [Script_v1](./Script_v1.md)
- [tcp_client_v1](tcp_client_v1.md)
- [TCP_Server_v1](./TCP_Server_v1.md)
- [UDP_Client_v1](./UDP_Client_v1.md)
- [UDP_Server_v1](./UDP_Server_v1.md)
- [HTTP_Client_v1](./HTTP_Client_v1.md)
- [HTTP_Server_v1](./HTTP_Server_v1.md)
- [Websocket_Client_v1](./Websocket_Client_v1.md)
- [Websocket_Server_v1](./Websocket_Server_v1.md)
- [Serial_v1](./Serial_v1.md)
