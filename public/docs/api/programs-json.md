# Topic: programs/available

## Event: available

```json
// [Send]
// Function: get available programs in the ./private/programs folder
// Subscribes Topic: programs
{
	"topic": "programs",
	"event": "available"
}
```

```json
// [Recieve]
// Body: object of available programs
{
	"topic": "programs",
	"event": "available",
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
```

## Event: kill-all

```json
// [Send]
// Function: kill all running programs
// Subscribes Topic: programs
{
	"topic": "programs",
	"event": "kill-all"
}
```

## Event: status-all

```json
// [Send]
// Function: get all defined programs
// Subscribes Topic: programs
{
	"topic": "programs",
	"event": "status-all"
}
```

```json
// Body: program state object
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

# Topic: programs/NAME

## Event: start

```json
// [Send]
// Function: status the tcp connection
// Subscribes Topic: programs/program-name
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
// Body: "ok" or "error " + description
{
	"topic": "programs/program-name",
	"event": "start",
	"body": "ok"
	// "body": "error program already running"
	// "body": "error env expects an object"
}

// If: "start" "ok"
// Body: program state object
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

// Body: data sent to standard out or error (stdout, stderr)
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

## Event: start-available

```json
// [Send]
// Function: status the tcp connection
// Subscribes Topic: programs/program-name
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
// Body: "ok" or "error " + description
{
	"topic": "programs/program-name",
	"event": "start",
	"body": "ok"
	// "body": "error program already running"
	// "body": "error programFolderName does not exist"
}
// If: "start" "ok"
// Body: data sent to standard out or error (stdout, stderr)
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

## Event: data-history

```json
// [Send]
// Function: get all standard out or standard error (stdout, stderr)
// Subscribes Topic: programs/program-name
{
	"topic": "programs/program-name",
	"event": "data-history"
}
```

```json
// [Recieve]
// Body: array of data sent to standard out or error (stdout, stderr) or "error " + description
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
	// "body": "error program-name doesn't exist"
}
```

## Event: kill

```json
// [Send]
// Function: kill the program
// Subscribes Topic: programs/program-name
{
	"topic": "programs/program-name",
	"event": "kill"
}
```

```json
// [Recieve]
// Body: "ok" or "error " + description
{
	"topic": "programs/program-name",
	"event": "kill",
	"body": "ok"
	// "body": "error program-name doesn't exist"
	// "body": "error program was not running"
}
```

## Event: status

```json
// [Send]
// Function: get status of program
// Subscribes Topic: programs/program-name
{
	"topic": "programs/program-name",
	"event": "status"
}
```

```json
// Body: program state object or "error " + description
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
	// "body": "error program-name doesn't exist"
}
```
