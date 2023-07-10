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
| send		| any		| unsub		|  						|
| recieve	| client	| subs		| subscriptionsArray	|

# Module: /database

| TX/RX		| Topic						| Event				| Body 					|
| ---		| ---						| ---				| ---					|
| send		| /database/{name}			| create			| {defaultData} 		|
| recieve	| /database/{name}			| create			| "ok" or "error..." 	|
| send		| /database/{name}			| read				| 				 		|
| recieve	| /database/{name}			| read				| "ok" or "error..." 	|
| send		| /database/{name}			| write				| 				 		|
| recieve	| /database/{name}			| write				| "ok" or "error..." 	|
| send		| /database/{name}			| delete			| 				 		|
| recieve	| /database/{name}			| delete			| "ok" or "error..." 	|
| send		| /database/{name}			| reset-to-default	| 				 		|
| recieve	| /database/{name}			| reset-to-default	| "ok" or "error..." 	|
| recieve	| /database/{name}			| pub				| databaseJsonObject	|
| send		| /database/{name}/{value}	| sub				| 				 		|
| recieve	| /database/{name}/{value}	| sub				| "ok" or "error..." 	|
| send		| /database/{name}/{value}	| get				| 				 		|
| recieve	| /database/{name}/{value}	| get				| "ok" or "error..." 	|
| send		| /database/{name}/{value}	| set				| 				 		|
| recieve	| /database/{name}/{value}	| set				| "ok" or "error..." 	|
| recieve	| /database/{name}/{value}	| pub				| value					|
| send		| /database					| delete-all		| 				 		|
| recieve	| /database					| delete-all		| "ok" or "error..." 	|

More details: [datebase-js](./datebase-js.md) or [datebase-json](./datebase-json.md)

# Module: /file

| TX/RX		| Topic			| Event				| Body 						|
| ---		| ---			| ---				| ---						|
| send		| /file/{path}	| exists			| 				 			|
| recieve	| /file/{path}	| exists			| true or false		 		|
| send		| /file/{path}	| create-file		| 				 			|
| recieve	| /file/{path}	| create-file		| "ok" or "error..."		|
| send		| /file/{path}	| delete-file		| 				 			|
| recieve	| /file/{path}	| delete-file		| "ok" or "error..."		|
| send		| /file/{path}	| read-text-file	| 				 			|
| recieve	| /file/{path}	| read-text-file	| "ok" or "error..."		|
| send		| /file/{path}	| read-json-file	| 				 			|
| recieve	| /file/{path}	| read-json-file	| "ok" or "error..."		|
| send		| /file/{path}	| write-text-file	| text			 			|
| recieve	| /file/{path}	| write-text-file	| "ok" or "error..."		|
| send		| /file/{path}	| write-json-file	| json			 			|
| recieve	| /file/{path}	| write-json-file	| "ok" or "error..."		|
| send		| /file/{path}	| append-text-file	| text			 			|
| recieve	| /file/{path}	| append-text-file	| "ok" or "error..."		|
| send		| /file/{path}	| get-tree			| 				 			|
| recieve	| /file/{path}	| get-tree			| "ok" or "error..."		|
| send		| /file/{path}	| create-folder		| 				 			|
| recieve	| /file/{path}	| create-folder		| "ok" or "error..."		|
| send		| /file/{path}	| delete-folder		| 				 			|
| recieve	| /file/{path}	| delete-folder		| "ok" or "error..."		|
| send		| /file/{path}	| rename			| newPath					|
| recieve	| /file/{path}	| rename			| "ok" or "error..."		|
| recieve	| /file/{path}	| update-tree		| *PATH_TREE*				|
| recieve	| /file/{path}	| update-text		| text						|
| recieve	| /file/{path}	| update-json		| json						|

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

# Module: /logger
		
| TX/RX		| Topic					| Event						| Body 											|
| ---		| ---					| ---						| ---											|
| send		| /logger/				| log						| {group, level, message, obj}					|
| recieve	| /logger/				| log						| "ok" or "error..." 							|
| send		| /logger/{group}		| history					| 												|
| recieve	| /logger/{group}		| history					| "ok" or "error..." 							|
| recieve	| /logger/{group}		| update-log				| {timestampISO, level, message, obj}			|
| recieve	| /logger/{group}		| update-history			| [{timestampISO, level, message, obj}]			|
| send		| /logger/logs			| get						|  												|
| recieve	| /logger/logs			| get						| "ok" or "error..."					 		|
| send		| /logger/logs			| sub						|  												|
| recieve	| /logger/logs			| sub						| "ok" or "error..."					 		|
| send		| /logger/logs			| delete-all-permanently	| 												|
| recieve	| /logger/logs			| delete-all-permanently	| "ok" or "error..."					 		|
| recieve	| /logger/logs			| pub						| [fileName]							 		|
| send		| /logger/{fileName}	| get						| 												|
| recieve	| /logger/{fileName}	| get						| "ok" or "error..."					 		|
| send		| /logger/{fileName}	| sub						| 												|
| recieve	| /logger/{fileName}	| sub						| "ok" or "error..."					 		|
| send		| /logger/{fileName}	| history					| 												|
| recieve	| /logger/{fileName}	| history					| "ok" or "error..."					 		|
| recieve	| /logger/{fileName}	| pub-log					| [fileName]							 		|
| recieve	| /logger/{fileName}	| history					| "ok" or "error..."					 		|
| recieve	| /logger				| update-log				| {timestampISO, group, level, message, obj}	|
| recieve	| /logger				| update-file				| [{timestampISO, group, level, message, obj}]	|
| recieve	| /logger				| update-files-available	| fileNamesArray								|

More details: [logger-js](./logger-js.md) or [logger-json](./logger-json.md)

# Module: /system

| TX/RX		| Topic					| Event		| Body 					|
| ---		| ---					| ---		| ---					|
| send		| /system/time			| get		| 						|
| recieve	| /system/time			| get		| "ok" or "error..."	|
| send		| /system/time			| sub		|  						|
| recieve	| /system/time			| sub		| "ok" or "error..."	|
| recieve	| /system/time			| pub		| value					|
| send		| /system/time-as-iso	| get		| 						|
| recieve	| /system/time-as-iso	| get		| "ok" or "error..."	|
| send		| /system/time-as-iso	| sub		|  						|
| recieve	| /system/time-as-iso	| sub		| "ok" or "error..."	|
| recieve	| /system/time-as-iso	| pub		| value					|
| send		| /system/uptime		| get		| 						|
| recieve	| /system/uptime		| get		| "ok" or "error..."	|
| send		| /system/uptime		| sub		|  						|
| recieve	| /system/uptime		| sub		| "ok" or "error..."	|
| recieve	| /system/uptime		| pub		| value					|
| send		| /system/info			| get		| 						|
| recieve	| /system/info			| get		| "ok" or "error..."	|
| send		| /system/info			| sub		|  						|
| recieve	| /system/info			| sub		| "ok" or "error..."	|
| recieve	| /system/info			| pub		| value					|

More details: [system-js](./system-js.md) or [system-json](./system-json.md)

# Module: /program

| TX/RX		| Topic					| Event				| Body 											|
| ---		| ---					| ---				| ---											|
| send		| /program/avalable		| get				| 												|
| recieve	| /program/avalable		| get				| "ok" or "error..."							|
| send		| /program/avalable		| sub				| 												|
| recieve	| /program/avalable		| sub				| "ok" or "error..."							|
| recieve	| /program/avalable		| pub				| value											|
| send		| /program/{name}		| start				| {directory, command, startOnBoot, env}		|
| recieve	| /program/{name}		| start				| "ok" or "error..." 							|
| send		| /program/{name}		| start-avaiable	| {folderName, startOnBoot, env}				|
| recieve	| /program/{name}		| start-avaiable	| "ok" or "error..." 							|
| send		| /program/{name}		| start-existing	| 												|
| recieve	| /program/{name}		| start-existing	| "ok" or "error..." 							|
| send		| /program/{name}		| start-on-boot		| isStartOnBoot									|
| recieve	| /program/{name}		| start-on-boot		| "ok" or "error..." 							|
| send		| /program/{name}		| history			| 												|
| recieve	| /program/{name}		| history			| "ok" or "error..." 							|
| send		| /program/{name}		| restart			| 												|
| recieve	| /program/{name}		| restart			| "ok" or "error..." 							|
| send		| /program/{name}		| kill				| 												|
| recieve	| /program/{name}		| kill				| "ok" or "error..." 							|
| send		| /program/{name}		| status			| 					 							|
| recieve	| /program/{name}		| status			| "ok" or "error..." 							|
| recieve	| /program/{name}		| pub-out			| {from, timestampISO, ascii}					|
| recieve	| /program/{name}		| pub-status		| {command, env, startOnBoot, running, pid}		|
| recieve	| /program/{name}		| pub-history		| [{from, timestampISO, ascii}]					|
| send		| /program				| status			| 					 							|
| recieve	| /program				| status			| "ok" or "error..." 							|
| send		| /program				| kill				| 					 							|
| recieve	| /program				| kill				| "ok" or "error..." 							|
| recieve	| /program				| pub-status		| [{command, env, startOnBoot, running, pid}]	|

More details: [program-js](./program-js.md) or [program-json](./program-json.md)

# Module: /user

| TX/RX		| Topic				| Event						| Body 									|
| ---		| ---				| ---						| ---									|
| send		| /user/token		| get						| {username, password}					|
| recieve	| /user/token		| get						| "ok" or "error..."					|
| send		| /user/token		| sub						| 										|
| recieve	| /user/token		| sub						| "ok" or "error..."					|
| recieve	| /user/token		| pub						| token									|
| send		| /user/{username}	| login-with-token			| token									|
| recieve	| /user/{username}	| login-with-token			| "ok" or "error..."					|
| send		| /user/{username}	| logout					| 										|
| recieve	| /user/{username}	| logout					| "ok" or "error..."					|
| send		| /user/{username}	| create					| {password, passwordConfirm, groups}	|
| recieve	| /user/{username}	| create					| "ok" or "error..."					|
| send		| /user/{username}	| delete					| {password, passwordConfirm, groups}	|
| recieve	| /user/{username}	| delete					| "ok" or "error..."					|
| send		| /user/{username}	| add-group					| {groupToAdd}							|
| recieve	| /user/{username}	| add-group					| "ok" or "error..."					|
| send		| /user/{username}	| remove-group				| {groupToRemove}						|
| recieve	| /user/{username}	| remove-group				| "ok" or "error..."					|
| send		| /user/{username}	| change-password			| {newPassword, newPasswordConfirm}		|
| recieve	| /user/{username}	| change-password			| "ok" or "error..."					|
| recieve	| /user/{username}	| pub						| {username, [groups]}					|
| send		| /user/who-am-i	| get						| 										|
| recieve	| /user/who-am-i	| get						| "ok" or "error..."					|
| send		| /user/who-am-i	| sub						| 										|
| recieve	| /user/who-am-i	| sub						| "ok" or "error..."					|
| recieve	| /user/who-am-i	| pub						| {username, [groups]}					|
| send		| /user/users		| get						| 										|
| recieve	| /user/users		| get						| "ok" or "error..."					|
| send		| /user/users		| sub						| 										|
| recieve	| /user/users		| sub						| "ok" or "error..."					|
| recieve	| /user/users		| pub						| [{username, [groups]}]				|
| send		| /user/users		| reset-to-default			| 										|
| recieve	| /user/users		| reset-to-default			| "ok" or "error..."					|
| send		| /user/groups		| get						| 										|
| recieve	| /user/groups		| get						| "ok" or "error..."					|
| send		| /user/groups		| sub						| 										|
| recieve	| /user/groups		| sub						| "ok" or "error..."					|
| send		| /user/groups		| create					| groupToAdd							|
| recieve	| /user/groups		| create					| "ok" or "error..."					|
| send		| /user/groups		| delete					| groupToDelete							|
| recieve	| /user/groups		| delete					| "ok" or "error..."					|
| recieve	| /user/groups		| pub						| value									|

More details: [user-js](./user-js.md) or [user-json](./user-json.md)

# Tool: /tcp-server

/tcp-server/start
/tcp-server/stop
/tcp-server/send
/tcp-server/get-clients

| TX/RX		| Topic							| Event				| Body 										|
| ---		| ---							| ---				| ---										|
| send		| /tcp-client/{ip/host}:{port}	| open				| {expectedDelimiter} 						|
| recieve	| /tcp-client/{ip/host}:{port}	| open				| "ok" or "error..." 						|
| send		| /tcp-client/{ip/host}:{port}	| close				|  											|
| recieve	| /tcp-client/{ip/host}:{port}	| close				| "ok" or "error..." 						|
| send		| /tcp-client/{ip/host}:{port}	| send				| {data, encoding, ?cr, ?lf} 				|
| recieve	| /tcp-client/{ip/host}:{port}	| send				| "ok" or "error..." 						|
| send		| /tcp-client/{ip/host}:{port}	| history			|  											|
| recieve	| /tcp-client/{ip/host}:{port}	| history			| "ok" or "error..."						|
| send		| /tcp-client/{ip/host}:{port}	| status			|  											|
| recieve	| /tcp-client/{ip/host}:{port}	| status			| "ok" or "error..."					 	|
| recieve	| /tcp-client/{ip/host}:{port}	| update-data		| {wasReceived, hex, ascii, timestampISO} 	|
| recieve	| /tcp-client/{ip/host}:{port}	| update-status 	| {ip, port, isOpen, expectedDelimiter} 	|
| recieve	| /tcp-client/{ip/host}:{port}	| update-history	| [{wasReceived, hex, ascii, timestampISO}] |
| send		| /tcp-client					| status-all		|  											|
| recieve	| /tcp-client					| status-all		| "ok" or "error..."					 	|
| recieve	| /tcp-client					| update-status-all | [{ip, port, isOpen, expectedDelimiter}] 	|

More details: [tcp-client-js](./tcp-client-js.md) or [tcp-client-json](./tcp-client-json.md)

# Tool: /tcp-client

| TX/RX		| Topic								| Event				| Body 										|
| ---		| ---								| ---				| ---										|
| send		| /tcp-client/{ip}:{port}			| open				| {expectedDelimiter} 						|
| recieve	| /tcp-client/{ip}:{port}			| open				| "ok" or "error..." 						|
| send		| /tcp-client/{ip}:{port}			| close				|  											|
| recieve	| /tcp-client/{ip}:{port}			| close				| "ok" or "error..." 						|
| send		| /tcp-client/{ip}:{port}			| get				| 											|
| recieve	| /tcp-client/{ip}:{port}			| get				| "ok" or "error..."						|
| send		| /tcp-client/{ip}:{port}			| sub				| 											|
| recieve	| /tcp-client/{ip}:{port}			| sub				| "ok" or "error..."						|
| recieve	| /tcp-client/{ip}:{port}			| pub				| {ip, port, isOpen, expectedDelimiter}		|
| send		| /tcp-client/{ip}:{port}/data		| get				| 											|
| recieve	| /tcp-client/{ip}:{port}/data		| get				| "ok" or "error..."						|
| send		| /tcp-client/{ip}:{port}/data		| send				| {data, encoding, ?cr, ?lf}				|
| recieve	| /tcp-client/{ip}:{port}/data		| send				| "ok" or "error..."						|
| send		| /tcp-client/{ip}:{port}/data		| sub				| 											|
| recieve	| /tcp-client/{ip}:{port}/data		| sub				| "ok" or "error..."						|
| recieve	| /tcp-client/{ip}:{port}/data		| pub				| {wasReceived, hex, ascii, timestampISO} 	|
| send		| /tcp-client/{ip}:{port}/history	| get				| 											|
| recieve	| /tcp-client/{ip}:{port}/history	| get				| "ok" or "error..."						|
| recieve	| /tcp-client/{ip}:{port}/history	| pub				| [{wasReceived, hex, ascii, timestampISO}]	|
| send		| /tcp-client						| get				| 											|
| recieve	| /tcp-client						| get				| "ok" or "error..."						|
| send		| /tcp-client						| sub				| 											|
| recieve	| /tcp-client						| sub				| "ok" or "error..."						|
| send		| /tcp-client						| close-all			| 											|
| recieve	| /tcp-client						| close-all			| "ok" or "error..."						|
| send		| /tcp-client						| delete-all		| 											|
| recieve	| /tcp-client						| delete-all		| "ok" or "error..."						|
| recieve	| /tcp-client						| pub				| [{ip, port, isOpen, expectedDelimiter}] 	|

More details: [tcp-client-js](./tcp-client-js.md) or [tcp-client-json](./tcp-client-json.md)

---

---

---








/serial/open
/serial/close
/serial/send-ascii
/serial/send-hex
/serial/get-port
/serial/get-port-history
/serial/get-available-ports
/serial/get-ports

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