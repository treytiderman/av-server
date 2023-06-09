# Topic: "user"

## Event: "login-with-password"

```json
// [Send]
// Function: get a token with username and password
// Subscribes Topic: user
{
	"topic": "user",
	"event": "login-with-password",
	"body": {
		"username": "admin",
		"password": "admin"
	}
}
```

```json
// [Recieve]
// Body: TOKEN (jsonwebtoken) or "error " + description
{
	"topic": "user",
	"event": "login-with-password",
	"body": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjg1ODI4MTUwfQ.nE-RHN62HgLsIpjydRejeBsfP3V0u2tCZMjbbp_77Is"
	// "body": "error username or password incorrect"
}

// If: login-with-password ok
// Body: user object of the connection
{
	"topic": "user",
	"event": "who-am-i",
	"body": {
		"username": "admin",
		"groups": [ "admins" ]
	}
}
```

## Event: login-with-token

```json
// [Send]
// Function: login with TOKEN received from "login-with-password"
// Subscribes Topic: "user"
{
	"topic": "user",
	"event": "login-with-token",
	"body": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjg1ODI4MTUwfQ.nE-RHN62HgLsIpjydRejeBsfP3V0u2tCZMjbbp_77Is"
}
```

```json
// [Recieve]
// Body: "ok" or "error " + description
{
	"topic": "user",
	"event": "login-with-token",
	"body": "ok"
	// "body": "error bad token"
}

// If: "login-with-token" ok
// Body: user object of the connection
{
	"topic": "user",
	"event": "who-am-i",
	"body": {
		"username": "admin",
		"groups": [ "admins" ]
	}
}
```

## Event: who-am-i

```json
// [Send]
// Function: get user object of the connection
// Subscribes Topic: "user"
{
	"topic": "user",
	"event": "who-am-i"
}
```

```json
// [Recieve]
// Body: user object of the connection or "error " + description
{
	"topic": "user",
	"event": "who-am-i",
	"body": {
		"username": "admin",
		"groups": [ "admins" ]
	}
	// "body": "error not logged in"
}
```

## Event: logout

```json
// [Send]
// Function: logs out, lose access to privlaged api calls
// Subscribes Topic: "user"
{
	"topic": "user",
	"event": "logout"
}
```

```json
// [Recieve]
// Body: "ok"
{
	"topic": "user",
	"event": "logout",
	"body": "ok",
}
```

## Event: groups

```json
// [Send]
// Function: get array of all groups
// Subscribes Topic: "user"
{
	"topic": "user",
	"event": "groups"
}
```

```json
// [Recieve]
// Body: array of all groups
{
	"topic": "user",
	"event": "groups",
	"body": [ "admins", "users", "guests" ]
}
```

## Event: users

```json
// [Send]
// Function: get all users
// Subscribes Topic: "user"
{
	"topic": "user",
	"event": "users"
}
```

```json
// [Recieve]
// Body: array of user objects
{
	"topic": "user",
	"event": "users",
	"body": [
		{
			"username": "admin",
			"groups": [ "admins" ]
		},
		{
			"username": "guest",
			"groups": [ "guests" ]
		}
	]
}
```

## Event: new

```json
// [Send]
// Function: create a new user
// Group Required: "admins"
// Subscribes Topic: "user"
{
	"topic": "user",
	"event": "new",
	"body": {
		"username": "user",
		"password": "password",
		"passwordConfirm": "password",
		"groups": [ "admins" ]
	}
}
```

```json
// [Recieve]
// Body: "ok" or "error " + description
{
	"topic": "user",
	"event": "new",
	"body": "ok"
	// "body": "error username exists"
	// "body": "error username invailed"
	// "body": "error password invailed"
	// "body": "error passwordConfirm does not match password"
	// "body": "error group group_example does not exist"
	// "body": "error not in group admins"
}

// If: "new" "ok"
// Body: user object of the connection
{
	"topic": "user",
	"event": "who-am-i",
	"body": {
		"username": "user",
		"groups": [ "admins" ]
	}
}
```

## Event: update

```json
// [Send]
// Function: update a user
// Group Required: "user" or "admin"
// Subscribes Topic: "user"
{
	"topic": "user",
	"event": "update",
	"body": {
		"username": "user",
		"newPassword": "password2", // optional
		"newPasswordConfirm": "password2", // optional if no newPassword is given
		"newGroups": [ "users" ] // optional
	}
}
```

```json
// [Recieve]
// Body: "ok" or "error " + description
// Subscribes Topic: "users"
{
	"topic": "user",
	"event": "update",
	"body": "ok"
	// "body": "error username does not exist"
	// "body": "error newPassword invailed"
	// "body": "error newPasswordConfirm does not match newPassword"
	// "body": "error newGroup group_example does not exist"
	// "body": "error users can not join group admins"
	// "body": "error not in group users or admins"
}

// If: "update" "ok"
// Body: user object of the connection
{
	"topic": "user",
	"event": "who-am-i",
	"body": {
		"username": "user",
		"role": 50
	}
}
```

## Event: delete

```json
// [Send]
// Function: delete user
// Group Required: "admins"
// Subscribes Topic: "user"
{
	"topic": "user",
	"event": "delete",
	"body": {
		"username": "user"
	}
}
```

```json
// [Recieve]
// Body: "ok" or "error " + description
{
	"topic": "user",
	"event": "delete",
	"body": "ok"
	// "body": "error username does not exist"
	// "body": "error not in group admins"
}
```

## Event: factory-reset-users

```json
// [Send]
// Function: reset to default admin, admin
// Group Required: "admins"
// Subscribes Topic: "user"
{
	"topic": "user",
	"event": "factory-reset-users"
}
```

```json
// [Recieve]
// Body: "ok" or "error " + description
{
	"topic": "user",
	"event": "factory-reset-users",
	"body": "ok"
	// "body": "error not in group admins"
}

// If: "factory-reset-users" "ok"
// Body: array of users objects
{
	"topic": "user",
	"event": "users",
	"body": [
		{
			"username": "admin",
			"groups": [ "admins" ]
		}
	]
}
```
