# available

```json
// [Send]
// get: status the tcp connection
{
	"topic": "programs/available",
	"event": "get"
}
```

```json
// [Recieve]
// payload: object of available programs
{
	"topic": "programs/available",
	"event": "get",
	"body": {
		"test-nodejs-express": {
			"path": "../private/programs/test-nodejs-express",
			"files": [ ".env", "main.js", "package-lock.json", "package.json" ],
			"program": "node",
			"args": "../private/programs/test-nodejs-express/main.js",
			"env": { "port": "8626", "name": "living room" }
		},
		"test-python-log": {
			"path": "../private/programs/test-python-log",
			"files": [ "main.py" ],
			"program": "python",
			"args": "../private/programs/test-python-log/main.py",
			"env": {}
		}
	}
}
// update: if changed
{
	"topic": "programs/available",
	"event": "update",
	"body": {
		"test-nodejs-log": {
			"path": "../private/programs/test-nodejs-log",
			"files": [ "main.js" ],
			"program": "node",
			"args": "../private/programs/test-nodejs-log/main.js",
			"env": {}
		}
	}
}
```

# start

```json
// [Send]
// function: status the tcp connection
{
	"topic": "programs/program-name",
	"event": "start",
	"body": {
		"program": "node",
		"args": "../private/programs/test-nodejs-express/main.js",
		"env": { "port": "8626" }
	}
}
```

```json
// [Recieve]
// ok: returns ok if the program started up
// error: returns "error " + description
{
	"topic": "programs/program-name",
	"event": "start",
	"body": "ok"
	// "body": "error program already running"
}
// payload: program state object
{
	"topic": "programs/program-name",
	"event": "status",
	"body": {
		"program": "node",
		"args": "../private/programs/test-nodejs-express/main.js",
		"env": { "port": "8626" },
		"pid": 3455370,
		"running": true
	}
}
// payload: data sent to standard out or error (stdout, stderr)
{
	"topic": "programs/program-name",
	"event": "data",
	"body": {
		"from": "stdout",
		"timestampISO": "2023-06-04T17:21:55.480Z",
		"ascii": "Hello from Nodejs\n"
    }
}
```

# start-available

```json
// [Send]
// function: status the tcp connection
{
	"topic": "programs/program-name",
	"event": "start-available",
	"body": {
		"programFolderName": "test-nodejs-express",
	}
}
```

```json
// [Recieve]
// ok: returns ok if the program started up
// error: returns "error " + description
{
	"topic": "programs/program-name",
	"event": "start",
	"body": "ok"
	// "body": "error program already running"
}
// payload: data sent to standard out or error (stdout, stderr)
{
	"topic": "programs/program-name",
	"event": "data",
	"body": {
		"from": "stdout",
		"timestampISO": "2023-06-04T17:21:55.480Z",
		"ascii": "Hello from Nodejs\n"
    }
}
```

# data-history

```json
// [Send]
// get: all outputs
{
	"topic": "programs/program-name",
	"event": "data-history"
}
```

```json
// [Recieve]
// payload: array of data sent to standard out or error (stdout, stderr)
{
	"topic": "programs/program-name",
	"event": "data-history",
	"body": [
		{
			"from": "stdout",
			"timestampISO": "2023-06-04T17:21:55.480Z",
			"ascii": "Hello from Nodejs\n"
	    },
		{
			"from": "stdout",
			"timestampISO": "2023-06-04T17:23:12.400Z",
			"ascii": "Thing is complete\n"
	    },
		{
			"from": "stderr",
			"timestampISO": "2023-06-05T17:23:12.400Z",
			"ascii": "Oh no\n"
	    }
    ]
}
```

# kill

```json
// [Send]
// ok: returns ok if the program started up
// error: returns "error " + description
{
	"topic": "programs/program-name",
	"event": "kill"
}
```

```json
// [Recieve]
// payload: array of data sent to standard out or error (stdout, stderr)
{
	"topic": "programs/program-name",
	"event": "kill",
	"body": "ok"
	// "body": "error program was not running"
}
```

# status

```json
// [Send]
// get: 
{
	"topic": "programs/program-name",
	"event": "status"
}
```

```json
// payload: program state object
{
	"topic": "programs/program-name",
	"event": "status",
	"body": {
		"program": "node",
		"args": "../private/programs/test-nodejs-express/main.js",
		"env": { "port": "8626" },
		"pid": 3455370,
		"running": false
	}
}
```

# kill-all

```json
// [Send]
// get: 
{
	"topic": "programs",
	"event": "kill-all"
}
```

# status-all

```json
// [Send]
// get: 
{
	"topic": "programs",
	"event": "status-all"
}
```

```json
// payload: program state object
{
	"topic": "programs",
	"event": "status-all",
	"body": {
		"program-name": {
			"program": "node",
			"args": "../private/programs/test-nodejs-express/main.js",
			"env": { "port": "8626" },
			"pid": 3455370,
			"running": false
		}
	}
}
```
