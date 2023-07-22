# API Overview

# Structure

```js
// Structure
{
	"topic": "path",
	"event": "event_name",
	"body": "JSON string, array, or object"
}

// Example send
{
	"topic": "/tcp-client/192.168.1.246:23",
	"event": "open",
	"body": {
	    "expectedDelimiter": "\r"
	}
}

// Example recieve
{
	"topic": "/tcp-client/192.168.1.246:23",
	"event": "open",
	"body": "error client already open"
}
```

# Subscribe to Topic

| TX/RX		| Topic		| Event		| Body 					|
| --------- | --------- | --------- | --------------------- |
| send		| any		| sub		|  						|
| recieve	| client	| subs		| subscriptionsArray	|
| send		| any		| unsub		|  						|

# Module: database

| TX/RX		| Admin	| Topic					| Event				| Body 					|
| ---		| ---	| ---					| ---				| ---					|
| send		|	y	| database/all			| get or sub		| 				 		|
| recieve	|	y	| database/all			| get or sub		| "ok" or "error..." 	|
| recieve	|	y	| database/all			| pub				| [name]				|
| send		|	y	| database/all			| delete			| 				 		|
| recieve	|	y	| database/all			| delete			| "ok" or "error..." 	|
| send		|	y	| database/{name}		| get or sub		| 				 		|
| recieve	|	y	| database/{name}		| get or sub		| "ok" or "error..." 	|
| recieve	|	y	| database/{name}		| pub				| {jsonObject}			|
| send		|	y	| database/{name}		| create			| {?defaultJsonObject}	|
| recieve	|	y	| database/{name}		| create			| "ok" or "error..." 	|
| send		|	y	| database/{name}		| write-to-file		| 				 		|
| recieve	|	y	| database/{name}		| write-to-file		| "ok" or "error..." 	|
| send		|	y	| database/{name}		| delete			| 				 		|
| recieve	|	y	| database/{name}		| delete			| "ok" or "error..." 	|
| send		|	y	| database/{name}		| reset-to-default	| 				 		|
| recieve	|	y	| database/{name}		| reset-to-default	| "ok" or "error..." 	|
| send		|	y	| database/{name}/{key}	| get or sub		| 				 		|
| recieve	|	y	| database/{name}/{key}	| get or sub		| "ok" or "error..." 	|
| recieve	|	y	| database/{name}/{key}	| pub				| value					|
| send		|	y	| database/{name}/{key}	| set				| value					|
| recieve	|	y	| database/{name}/{key}	| set				| "ok" or "error..." 	|
| send		|	y	| database/{name}/{key}	| set-and-write		| value					|
| recieve	|	y	| database/{name}/{key}	| set-and-write		| "ok" or "error..." 	|
| send		|	y	| database/{name}/{key}	| delete			| 						|
| recieve	|	y	| database/{name}/{key}	| delete			| "ok" or "error..." 	|

More details: [datebase-js](./datebase-js.md) or [datebase-json](./datebase-json.md)

# Module: file-system

| TX/RX		| Admin	| Topic							| Event				| Body 						|
| ---		| ---	| ---							| ---				| ---						|
| send		|	y	| file-system/{path}			| get				| 				 			|
| recieve	|	y	| file-system/{path}			| get				| "ok" or "error..."		|
| recieve	|	y	| file-system/{path}			| pub				| *PATH_TREE*				|
| send		|	y	| file-system/{path}			| exists			| 				 			|
| recieve	|	y	| file-system/{path}			| exists			| true or false		 		|
| send		|	y	| file-system/{path}			| rename			| newPath		 			|
| recieve	|	y	| file-system/{path}			| rename			| "ok" or "error..."		|
| send		|	y	| file-system/text-file/{path}	| get				| 				 			|
| recieve	|	y	| file-system/text-file/{path}	| get				| "ok" or "error..."		|
| recieve	|	y	| file-system/text-file/{path}	| pub				| text						|
| send		|	y	| file-system/text-file/{path}	| create			| 				 			|
| recieve	|	y	| file-system/text-file/{path}	| create			| "ok" or "error..."		|
| send		|	y	| file-system/text-file/{path}	| set				| text			 			|
| recieve	|	y	| file-system/text-file/{path}	| set				| "ok" or "error..."		|
| send		|	y	| file-system/text-file/{path}	| append			| text			 			|
| recieve	|	y	| file-system/text-file/{path}	| append			| "ok" or "error..."		|
| send		|	y	| file-system/text-file/{path}	| delete			| 				 			|
| recieve	|	y	| file-system/text-file/{path}	| delete			| "ok" or "error..."		|
| send		|	y	| file-system/folder/{path}		| get				| 				 			|
| recieve	|	y	| file-system/folder/{path}		| get				| "ok" or "error..."		|
| recieve	|	y	| file-system/folder/{path}		| pub				| *PATH_TREE*				|
| send		|	y	| file-system/folder/{path}		| create			| 				 			|
| recieve	|	y	| file-system/folder/{path}		| create			| "ok" or "error..."		|
| send		|	y	| file-system/folder/{path}		| delete			| 				 			|
| recieve	|	y	| file-system/folder/{path}		| delete			| "ok" or "error..."		|

```json
// Structures
PATH_TREE = {
	"path": "string",
	"path_folder": "string",
	"path_up": "string",
	"file_name": "string",
	"folder_name": "string",
	"isFile": "boolean",
	"isFolder": "boolean",
	"size_bytes": "string",
	"created_iso": "string",
	"accessed_iso": "string",
	"modified_iso": "string",
	"changed_status_iso": "string",
	"contains_files": [],
	"contains_folders": []
}
```

More details: [file-js](./file-js.md) or [file-json](./file-json.md)

# Module: logger
		
| TX/RX		| Admin	| Topic						| Event						| Body 											|
| ---		| ---	| ---						| ---						| ---											|
| send		|	y	| logger/log				| get or sub				| 												|
| recieve	|	y	| logger/log				| get or sub				| "ok" or "error..."							|
| recieve	|	y	| logger/log				| pub						| {timestampISO, group, level, message, obj}	|
| send		|	y	| logger/log				| set						| {group, level, message, obj}					|
| recieve	|	y	| logger/log				| set						| "ok" or "error..."							|
| send		|	y	| logger/log/history		| get or sub				| historyLength									|
| recieve	|	y	| logger/log/history		| get or sub				| "ok" or "error..."							|
| recieve	|	y	| logger/log/history		| pub						| [{timestampISO, group, level, message, obj}]	|
| send		|	y	| logger/{group}			| get or sub				| 												|
| recieve	|	y	| logger/{group}			| get or sub				| "ok" or "error..."							|
| recieve	|	y	| logger/{group}			| pub						| {timestampISO, level, message, obj}			|
| send		|	y	| logger/{group}			| set						| {level, message, obj}							|
| recieve	|	y	| logger/{group}			| set						| "ok" or "error..."							|
| send		|	y	| logger/{group}/history	| get or sub				| historyLength									|
| recieve	|	y	| logger/{group}/history	| get or sub				| "ok" or "error..."							|
| recieve	|	y	| logger/{group}/history	| pub						| [{timestampISO, level, message, obj}]			|
 
More details: [logger-js](./logger-js.md) or [logger-json](./logger-json.md)

# Module: program

| TX/RX		| Admin	| Topic						| Event				| Body 											|
| ---		| ---	| ---						| ---				| ---											|
| send		|	y	| program/all				| get or sub		| 					 							|
| recieve	|	y	| program/all				| get or sub		| "ok" or "error..." 							|
| recieve	|	y	| program/all				| pub				| [{command, env, startOnBoot, running, pid}]	|
| send		|	y	| program/all				| kill				| 					 							|
| recieve	|	y	| program/all				| kill				| "ok" or "error..." 							|
| send		|	y	| program/all				| delete			| 					 							|
| recieve	|	y	| program/all				| delete			| "ok" or "error..." 							|
| send		|	y	| program/avalable			| get or sub		| 												|
| recieve	|	y	| program/avalable			| get or sub		| "ok" or "error..."							|
| recieve	|	y	| program/avalable			| pub				| [{path, files, program, args, env}]			|
| send		|	y	| program/{name}			| get or sub		| 												|
| recieve	|	y	| program/{name}			| get or sub		| "ok" or "error..." 							|
| recieve	|	y	| program/{name}			| pub				| {command, env, startOnBoot, running, pid}		|
| send		|	y	| program/{name}			| create			| {directory, command, startOnBoot, env}		|
| recieve	|	y	| program/{name}			| create			| "ok" or "error..." 							|
| send		|	y	| program/{name}			| create-and-start	| {directory, command, startOnBoot, env}		|
| recieve	|	y	| program/{name}			| create-and-start	| "ok" or "error..." 							|
| send		|	y	| program/{name}			| create-avaiable	| {folderName, startOnBoot, env}				|
| recieve	|	y	| program/{name}			| create-avaiable	| "ok" or "error..." 							|
| send		|	y	| program/{name}			| set-startOnBoot	| true or false									|
| recieve	|	y	| program/{name}			| set-startOnBoot	| "ok" or "error..." 							|
| send		|	y	| program/{name}			| start				| 												|
| recieve	|	y	| program/{name}			| start				| "ok" or "error..." 							|
| send		|	y	| program/{name}			| kill				| 												|
| recieve	|	y	| program/{name}			| kill				| "ok" or "error..." 							|
| send		|	y	| program/{name}			| restart			| 												|
| recieve	|	y	| program/{name}			| restart			| "ok" or "error..." 							|
| send		|	y	| program/{name}			| delete			| 												|
| recieve	|	y	| program/{name}			| delete			| "ok" or "error..." 							|
| send		|	y	| program/{name}/data		| get or sub		| 												|
| recieve	|	y	| program/{name}/data		| get or sub		| "ok" or "error..." 							|
| send		|	y	| program/{name}/data		| send				| text											|
| recieve	|	y	| program/{name}/data		| send				| "ok" or "error..." 							|
| recieve	|	y	| program/{name}/data		| pub				| {from, timestampISO, ascii}					|
| send		|	y	| program/{name}/history	| get or sub		| historyLength									|
| recieve	|	y	| program/{name}/history	| get or sub		| "ok" or "error..." 							|
| recieve	|	y	| program/{name}/history	| pub				| [{from, timestampISO, ascii}]					|

More details: [program-js](./program-js.md) or [program-json](./program-json.md)

# Module: system

| TX/RX		| Admin	| Topic					| Event			| Body 					|
| ---		| ---	| ---					| ---			| ---					|
| send		|		| system/time			| get or sub	| 						|
| recieve	|		| system/time			| get or sub	| "ok" or "error..."	|
| recieve	|		| system/time			| pub			| value					|
| send		|		| system/time-as-iso	| get or sub	| 						|
| recieve	|		| system/time-as-iso	| get or sub	| "ok" or "error..."	|
| recieve	|		| system/time-as-iso	| pub			| value					|
| send		|		| system/uptime			| get or sub	| 						|
| recieve	|		| system/uptime			| get or sub	| "ok" or "error..."	|
| recieve	|		| system/uptime			| pub			| value					|
| send		|	y	| system/info			| get or sub	| 						|
| recieve	|	y	| system/info			| get or sub	| "ok" or "error..."	|
| recieve	|	y	| system/info			| pub			| value					|

More details: [system-js](./system-js.md) or [system-json](./system-json.md)

# Module: user

| TX/RX		| Admin	| Topic				| Event						| Body 									|
| ---		| ---	| ---				| ---						| ---									|
| send		|		| user/token		| get or sub				| 										|
| recieve	|		| user/token		| get or sub				| "ok" or "error..."					|
| recieve	|		| user/token		| pub						| token									|
| send		|		| user/token		| login						| {username, password}					|
| recieve	|		| user/token		| login						| "ok" or "error..."					|
| send		|		| user/users		| get or sub				| 										|
| recieve	|		| user/users		| get or sub				| "ok" or "error..."					|
| recieve	|		| user/users		| pub						| [{username, [groups]}]				|
| send		|	y	| user/users		| reset-to-default			| 										|
| recieve	|	y	| user/users		| reset-to-default			| "ok" or "error..."					|
| send		|		| user/groups		| get or sub				| 										|
| recieve	|		| user/groups		| get or sub				| "ok" or "error..."					|
| recieve	|		| user/groups		| pub						| value									|
| send		|	y	| user/groups		| create					| groupToAdd							|
| recieve	|	y	| user/groups		| create					| "ok" or "error..."					|
| send		|	y	| user/groups		| delete					| groupToDelete							|
| recieve	|	y	| user/groups		| delete					| "ok" or "error..."					|
| send		|		| user/who-am-i		| get or sub				| 										|
| recieve	|		| user/who-am-i		| get or sub				| "ok" or "error..."					|
| recieve	|		| user/who-am-i		| pub						| {username, [groups]}					|
| send		|		| user/{username}	| get or sub				| 										|
| recieve	|		| user/{username}	| get or sub				| "ok" or "error..."					|
| recieve	|		| user/{username}	| pub						| {username, [groups]}					|
| send		|		| user/{username}	| login-with-token			| token									|
| recieve	|		| user/{username}	| login-with-token			| "ok" or "error..."					|
| send		|		| user/{username}	| logout					| 										|
| recieve	|		| user/{username}	| logout					| "ok" or "error..."					|
| send		|	y	| user/{username}	| create					| {password, passwordConfirm, groups}	|
| recieve	|	y	| user/{username}	| create					| "ok" or "error..."					|
| send		|	y	| user/{username}	| delete					| {password, passwordConfirm, groups}	|
| recieve	|	y	| user/{username}	| delete					| "ok" or "error..."					|
| send		|	y	| user/{username}	| add-group					| {groupToAdd}							|
| recieve	|	y	| user/{username}	| add-group					| "ok" or "error..."					|
| send		|	y	| user/{username}	| remove-group				| {groupToRemove}						|
| recieve	|	y	| user/{username}	| remove-group				| "ok" or "error..."					|
| send		|	y	| user/{username}	| change-password			| {newPassword, newPasswordConfirm}		|
| recieve	|	y	| user/{username}	| change-password			| "ok" or "error..."					|

More details: [user-js](./user-js.md) or [user-json](./user-json.md)

# Tool: tcp-client

| TX/RX		| Admin	| Topic								| Event				| Body 										|
| ---		| ---	| ---								| ---				| ---										|
| send		|	y	| tcp-client/{ip}:{port}			| get or sub		| 											|
| recieve	|	y	| tcp-client/{ip}:{port}			| get or sub		| "ok" or "error..."						|
| recieve	|	y	| tcp-client/{ip}:{port}			| pub				| {ip, port, isOpen, ?expectedDelimiter}	|
| send		|	y	| tcp-client/{ip}:{port}			| open				| {?expectedDelimiter} 						|
| recieve	|	y	| tcp-client/{ip}:{port}			| open				| "ok" or "error..." 						|
| send		|	y	| tcp-client/{ip}:{port}			| close				|  											|
| recieve	|	y	| tcp-client/{ip}:{port}			| close				| "ok" or "error..." 						|
| send		|	y	| tcp-client/{ip}:{port}			| delete			|  											|
| recieve	|	y	| tcp-client/{ip}:{port}			| delete			| "ok" or "error..." 						|
| send		|	y	| tcp-client/{ip}:{port}/data		| get or sub		| 											|
| recieve	|	y	| tcp-client/{ip}:{port}/data		| get or sub		| "ok" or "error..."						|
| recieve	|	y	| tcp-client/{ip}:{port}/data		| pub				| {wasReceived, hex, ascii, timestampISO} 	|
| send		|	y	| tcp-client/{ip}:{port}/data		| send				| {data, encoding, ?cr, ?lf}				|
| recieve	|	y	| tcp-client/{ip}:{port}/data		| send				| "ok" or "error..."						|
| send		|	y	| tcp-client/{ip}:{port}/history	| get				| historyLength								|
| recieve	|	y	| tcp-client/{ip}:{port}/history	| get				| "ok" or "error..."						|
| recieve	|	y	| tcp-client/{ip}:{port}/history	| pub				| [{wasReceived, hex, ascii, timestampISO}]	|
| send		|	y	| tcp-client/all					| get or sub		| 											|
| recieve	|	y	| tcp-client/all					| get or sub		| "ok" or "error..."						|
| recieve	|	y	| tcp-client/all					| pub				| [{ip, port, isOpen, ?expectedDelimiter}] 	|
| send		|	y	| tcp-client/all					| open				| 											|
| recieve	|	y	| tcp-client/all					| open				| "ok" or "error..."						|
| send		|	y	| tcp-client/all					| close				| 											|
| recieve	|	y	| tcp-client/all					| close				| "ok" or "error..."						|
| send		|	y	| tcp-client/all					| delete			| 											|
| recieve	|	y	| tcp-client/all					| delete			| "ok" or "error..."						|

More details: [tcp-client-js](./tcp-client-js.md) or [tcp-client-json](./tcp-client-json.md)

# Tool: serial-port

| TX/RX		| Admin	| Topic								| Event				| Body 										|
| ---		| ---	| ---								| ---				| ---										|
| send		|	y	| serial-port/avalable				| get or sub		| 											|
| recieve	|	y	| serial-port/avalable				| get or sub		| "ok" or "error..."						|
| recieve	|	y	| serial-port/avalable				| pub				| value										|
| send		|	y	| serial-port/{port}				| get or sub		| 											|
| recieve	|	y	| serial-port/{port}				| get or sub		| "ok" or "error..."						|
| recieve	|	y	| serial-port/{port}				| pub				| {ip, port, isOpen, expectedDelimiter}		|
| send		|	y	| serial-port/{port}				| open				| {baudRate, delimiter} 					|
| recieve	|	y	| serial-port/{port}				| open				| "ok" or "error..." 						|
| send		|	y	| serial-port/{port}				| close				|  											|
| recieve	|	y	| serial-port/{port}				| close				| "ok" or "error..." 						|
| send		|	y	| serial-port/{port}				| delete			|  											|
| recieve	|	y	| serial-port/{port}				| delete			| "ok" or "error..." 						|
| send		|	y	| serial-port/{port}/data			| get or sub		| 											|
| recieve	|	y	| serial-port/{port}/data			| get or sub		| "ok" or "error..."						|
| recieve	|	y	| serial-port/{port}/data			| pub				| {wasReceived, hex, ascii, timestampISO} 	|
| send		|	y	| serial-port/{port}/data			| send				| {data, encoding, ?cr, ?lf}				|
| recieve	|	y	| serial-port/{port}/data			| send				| "ok" or "error..."						|
| send		|	y	| serial-port/{port}/history		| get				| historyLength								|
| recieve	|	y	| serial-port/{port}/history		| get				| "ok" or "error..."						|
| recieve	|	y	| serial-port/{port}/history		| pub				| [{wasReceived, hex, ascii, timestampISO}]	|
| send		|	y	| serial-port/all					| get or sub		| 											|
| recieve	|	y	| serial-port/all					| get or sub		| "ok" or "error..."						|
| recieve	|	y	| serial-port/all					| pub				| [{ip, port, isOpen, expectedDelimiter}] 	|
| send		|	y	| serial-port/all					| close				| 											|
| recieve	|	y	| serial-port/all					| close				| "ok" or "error..."						|
| send		|	y	| serial-port/all					| delete			| 											|
| recieve	|	y	| serial-port/all					| delete			| "ok" or "error..."						|

More details: [serial-port-js](./serial-port-js.md) or [serial-port-json](./serial-port-json.md)

---

---

---

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
	"event": "sub",
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