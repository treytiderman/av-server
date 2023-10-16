# API Overview

# Structure

```js
// Example function
// Send
{
	"path": "user/v0/func/login",
	"body": {
		username: "username",
		password: "password",
	}
}
// Recieve
{
	"path": "user/v0/func/login",
	"body": "ok"
}

// Example topic
// Send
{
	"path": "user/v0/topic/groups",
	"body": "sub"
}
// Recieve every update
{
	"path": "user/v0/topic/groups",
	"body": ["admin"]
}
```

# Module: database

| Admin	| Path									| Send (body)					| Recieve (body)								|
| ---	| ---									| ---							| ---											|
|	y	| database/v0/topic/all	 				| "get" or "sub" or "unsub"		| [names]										|
|	y	| database/v0/topic/{name}	 			| "get" or "sub" or "unsub"		| {jsonObject}									|
|	y	| database/v0/topic/{name}/{key}		| "get" or "sub" or "unsub"		| value											|
|	y	| database/v0/func/all-delete			| 								| "ok" or "error..."							|
|	y	| database/v0/func/all-reset-to-default	| 								| "ok" or "error..."							|
|	y	| database/v0/func/db-create			| {name, defaultObj}			| "ok" or "error..."							|
|	y	| database/v0/func/db-write-to-file		| 								| "ok" or "error..."							|
|	y	| database/v0/func/db-delete			| 								| "ok" or "error..."							|
|	y	| database/v0/func/db-reset-to-default	| 								| "ok" or "error..."							|
|	y	| database/v0/func/key-set				| {key, value}					| "ok" or "error..."							|
|	y	| database/v0/func/key-set-and-write	| {key, value}					| "ok" or "error..."							|
|	y	| database/v0/func/key-delete			| {key}							| "ok" or "error..."							|

More details: [datebase-js](./datebase-js.md) or [datebase-json](./datebase-json.md)

# Module: file-system

| Admin	| Path									| Send (body)					| Recieve (body)								|
| ---	| ---									| ---							| ---											|
|	y	| file-system/v0/topic/{path}			| "get" or "sub" or "unsub"		| PATH_TREE										|
|	y	| file-system/v0/topic/text/{path}		| "get" or "sub" or "unsub"		| text											|
|	y	| file-system/v0/topic/json/{path}		| "get" or "sub" or "unsub"		| jsonObject									|
|	y	| file-system/v0/func/path-exists		| path							| "ok" or "error..."							|
|	y	| file-system/v0/func/path-rename		| {path, newPath}				| "ok" or "error..."							|
|	y	| file-system/v0/func/text-create		| {path, text}					| "ok" or "error..."							|
|	y	| file-system/v0/func/text-set			| {path, text}					| "ok" or "error..."							|
|	y	| file-system/v0/func/text-append		| {path, text}					| "ok" or "error..."							|
|	y	| file-system/v0/func/text-delete		| {path}						| "ok" or "error..."							|
|	y	| file-system/v0/func/folder-create		| {path}						| "ok" or "error..."							|
|	y	| file-system/v0/func/folder-delete		| {path}						| "ok" or "error..."							|

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
		
| Admin	| Path								| Send (body)				| Recieve (body)								|
| ---	| ---								| ---						| ---											|
|	y	| logger/v0/topic/logs	 			| "get" or "sub" or "unsub"	| {timestamp, group, level, message, obj}		|
|	y	| logger/v0/topic/logs/history 		| "get" or "sub" or "unsub"	| [{timestamp, group, level, message, obj}]		|
|	y	| logger/v0/func/debug				| {group, message, obj}		| "ok" or "error..."							|
|	y	| logger/v0/func/info				| {group, message, obj}		| "ok" or "error..."							|
|	y	| logger/v0/func/error				| {group, message, obj}		| "ok" or "error..."							|
|	y	| logger/v0/func/delete-logs		| {group, message, obj}		| "ok" or "error..."							|

More details: [logger-js](./logger-js.md) or [logger-json](./logger-json.md)

# Module: program
		
| Admin	| Path								| Send (body)									| Recieve (body)								|
| ---	| ---								| ---											| ---											|
|	y	| program/v0/topic/avalable			| "get" or "sub" or "unsub"						| [{path, files, program, args, env}]			|
|	y	| program/v0/topic/programs			| "get" or "sub" or "unsub"						| [{command, env, startOnBoot, running, pid}]	|
|	y	| program/v0/topic/{name}			| "get" or "sub" or "unsub"						| {command, env, startOnBoot, running, pid}		|
|	y	| program/v0/topic/{name}/data		| "get" or "sub" or "unsub"						| {from, timestamp, ascii}						|
|	y	| program/v0/topic/{name}/history	| "get" or "sub" or "unsub"						| [{from, timestamp, ascii}]					|
|	y	| program/v0/func/create			| {name, directory, command, startOnBoot, env}	| "ok" or "error..."							|
|	y	| program/v0/func/create-avaiable	| {name, directory, startOnBoot, env}			| "ok" or "error..."							|
|	y	| program/v0/func/create-and-start	| {name, directory, command, startOnBoot, env}	| "ok" or "error..."							|
|	y	| program/v0/func/start				| name											| "ok" or "error..."							|
|	y	| program/v0/func/kill				| name											| "ok" or "error..."							|
|	y	| program/v0/func/restart			| name											| "ok" or "error..."							|
|	y	| program/v0/func/delete			| name											| "ok" or "error..."							|
|	y	| program/v0/func/set-start-on-boot	| true or false									| "ok" or "error..."							|
|	y	| program/v0/func/set-directory		| directory										| "ok" or "error..."							|
|	y	| program/v0/func/set-command		| command										| "ok" or "error..."							|
|	y	| program/v0/func/set-env			| {key: value}									| "ok" or "error..."							|
|	y	| program/v0/func/all-start			| 												| "ok" or "error..."							|
|	y	| program/v0/func/all-kill			| 												| "ok" or "error..."							|
|	y	| program/v0/func/all-restart		| 												| "ok" or "error..."							|
|	y	| program/v0/func/all-delete		| 												| "ok" or "error..."							|

More details: [program-js](./program-js.md) or [program-json](./program-json.md)

# Module: system

| Admin	| Path					| Send (body)					| Recieve (body)	|
| ---	| ---					| ---							| ---				|
|		| system/v0/time	 	| "get" or "sub" or "unsub"		| value				|
|		| system/v0/time-as-iso	| "get" or "sub" or "unsub"		| value				|
|		| system/v0/uptime	 	| "get" or "sub" or "unsub"		| value				|
|	y	| system/v0/info		| "get" or "sub" or "unsub"		| value				|

More details: [system-js](./system-js.md) or [system-json](./system-json.md)

# Module: user

| Admin	| Path									| Send (body)										| Recieve (body)			|
| ---	| ---									| ---												| ---						|
|		| user/v0/topic/token 					| "get" or "sub" or "unsub"							| token						|
|	y	| user/v0/topic/groups 					| "get" or "sub" or "unsub"							| [groups]					|
|	y	| user/v0/topic/users 					| "get" or "sub" or "unsub"							| [{username, [groups]}]	|
|		| user/v0/topic/who-am-i 				| "get" or "sub" or "unsub"							| {username, [groups]}		|
|		| user/v0/func/login					| {username, password}								| "ok" or "error..."		|
|		| user/v0/func/login-with-token			| {username, token}									| "ok" or "error..."		|
|		| user/v0/func/logout					| 													| "ok" or "error..."		|
|	y	| user/v0/func/group-create				| group												| "ok" or "error..."		|
|	y	| user/v0/func/group-delete				| group												| "ok" or "error..."		|
|	y	| user/v0/func/user-create				| {username, password, passwordConfirm, [groups]}	| "ok" or "error..."		|
|	y	| user/v0/func/user-delete				| username											| "ok" or "error..."		|
|	y	| user/v0/func/user-add-group			| {username, group}									| "ok" or "error..."		|
|	y	| user/v0/func/user-remove-group		| {username, group}									| "ok" or "error..."		|
|	y	| user/v0/func/user-change-password		| {username, newPassword, newPasswordConfirm}		| "ok" or "error..."		|
|	y	| user/v0/func/reset-to-default			| 													| "ok" or "error..."		|

More details: [user-js](./user-js.md) or [user-json](./user-json.md)

# Tool: tcp-client

| Admin	| Path									| Send (body)					| Recieve (body)							|
| ---	| ---									| ---							| ---										|
|	y	| tcp-client/v0/topic/{address}			| "get" or "sub" or "unsub"		| {address, isOpen, delimiter}				|
|	y	| tcp-client/v0/topic/{address}/data	| "get" or "sub" or "unsub"		| {wasReceived, hex, ascii, timestamp}		|
|	y	| tcp-client/v0/topic/{address}/history	| "get" or "sub" or "unsub"		| [{wasReceived, hex, ascii, timestamp}]	|
|	y	| tcp-client/v0/topic/all-clients		| "get" or "sub" or "unsub"		| [{address, isOpen, delimiter}]			|
|	y	| tcp-client/v0/func/open				| {address, delimiter}			| "ok" or "error..."						|
|	y	| tcp-client/v0/func/close				| address						| "ok" or "error..."						|
|	y	| tcp-client/v0/func/delete				| address						| "ok" or "error..."						|
|	y	| tcp-client/v0/func/send				| {address, data, encoding}		| "ok" or "error..."						|
|	y	| tcp-client/v0/func/all-open			| 								| "ok" or "error..."						|
|	y	| tcp-client/v0/func/all-close			| 								| "ok" or "error..."						|
|	y	| tcp-client/v0/func/all-delete			| 								| "ok" or "error..."						|

| Admin	| Path with filters									| Send (body)					| Recieve (body)					|
| ---	| ---												| ---							| ---								|
|	y	| tcp-client/v0/topic/{address}/data?encoding=hex	| "get" or "sub" or "unsub"		| {wasReceived, data, timestamp}	|
|	y	| tcp-client/v0/topic/{address}/history?length=1000	| "get" or "sub" or "unsub"		| [{wasReceived, data, timestamp}]	|

encoding = "ascii" | "hex" | "raw"

More details: [tcp-client-js](./tcp-client-js.md) or [tcp-client-json](./tcp-client-json.md)

# Tool: serial-port

| Admin	| Path									| Send (body)					| Recieve (body)							|
| ---	| ---									| ---							| ---										|
|	y	| serial-port/v0/topic/available		| "get" or "sub" or "unsub"		| [ports]									|
|	y	| serial-port/v0/topic/{port}			| "get" or "sub" or "unsub"		| {port, isOpen, baudRate, delimiter}		|
|	y	| serial-port/v0/topic/{port}/data		| "get" or "sub" or "unsub"		| {wasReceived, hex, ascii, timestamp}		|
|	y	| serial-port/v0/topic/{port}/history	| "get" or "sub" or "unsub"		| [{wasReceived, hex, ascii, timestamp}]	|
|	y	| serial-port/v0/topic/all-ports		| "get" or "sub" or "unsub"		| [{port, isOpen, baudRate, delimiter}]		|
|	y	| serial-port/v0/func/open				| {port, baudRate, delimiter}	| "ok" or "error..."						|
|	y	| serial-port/v0/func/close				| port							| "ok" or "error..."						|
|	y	| serial-port/v0/func/delete			| port							| "ok" or "error..."						|
|	y	| serial-port/v0/func/send				| {port, data, encoding}		| "ok" or "error..."						|
|	y	| serial-port/v0/func/all-open			| 								| "ok" or "error..."						|
|	y	| serial-port/v0/func/all-close			| 								| "ok" or "error..."						|
|	y	| serial-port/v0/func/all-delete		| 								| "ok" or "error..."						|

encoding = "ascii" | "hex" | "raw"

More details: [serial-port-js](./serial-port-js.md) or [serial-port-json](./serial-port-json.md)
