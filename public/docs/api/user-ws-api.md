# Topic: user

## Event: login-with-password

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
	"body": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjg2Nzk4NjIzfQ.-Bwh8JsZ7UzedjhVAPbdTsSJgpvp_W4L1KdyWrsysoQ"
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
// Function: login with username and TOKEN received from "login-with-password"
// Subscribes Topic: "user"
{
	"topic": "user",
	"event": "login-with-token",
	"body": {
		"username": "admin",
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjg2Nzk4NjIzfQ.-Bwh8JsZ7UzedjhVAPbdTsSJgpvp_W4L1KdyWrsysoQ"
	}
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
	// "body": "error login first"
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

## Event: add-group

```json
// [Send]
// Function: add a group
// Group Required: "admins"
// Subscribes Topic: "user"
{
	"topic": "user",
	"event": "add-group",
	"body": "test-group"
}
```

```json
// [Recieve]
// Body: array of all groups
{
	"topic": "user",
	"event": "add-group",
	"body": "ok"
	// "body": "error login first"
}

// If: "add-group" "ok"
// Body: array of all groups
{
	"topic": "user",
	"event": "groups",
	"body": [
		"admins",
		"users",
		"guests",
		"test-group"
	]
}
```

## Event: remove-group

```json
// [Send]
// Function: remove a group
// Group Required: "admins"
// Subscribes Topic: "user"
{
	"topic": "user",
	"event": "remove-group",
	"body": "test-group"
}
```

```json
// [Recieve]
// Body: array of all groups
{
	"topic": "user",
	"event": "remove-group",
	"body": "ok"
	// "body": "error login first"
}

// If: "remove-group" "ok"
// Body: array of all groups
{
	"topic": "user",
	"event": "groups",
	"body": [ "admins", "users", "guests" ]
}

// If: "remove-group" "ok"
// Body: array of all users
{
	"topic": "user",
	"event": "users",
	"body": [
		{
			"username": "admin",
			"groups": [ "admins" ]
		},
		{
			"username": "user",
			"groups": [ "admins" ]
		}
	]
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
			"username": "user",
			"groups": [ "admins" ]
		}
	]
}
```

## Event: add

```json
// [Send]
// Function: create a add user
// Group Required: "admins"
// Subscribes Topic: "user"
{
	"topic": "user",
	"event": "add",
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
	"event": "add",
	"body": "ok"
	// "body": "error username invailed"
	// "body": "error password invailed"
	// "body": "error passwordConfirm does not match password"
	// "body": "error username exists"
	// "body": "error group in groups does not exist"
	// "body": "error not in group admins"
	// "body": "error login first"
}

// If: "add" "ok"
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
			"username": "user",
			"groups": [ "admins" ]
		}
	]
}
```

## Event: add-group-to-user

```json
// [Send]
// Function: add group to user
// Group Required: "admin"
// Subscribes Topic: "user"
{
	"topic": "user",
	"event": "add-group-to-user",
	"body": {
		"username": "user",
		"groupToAdd": "test-group"
	}
}
```

```json
// [Recieve]
// Body: "ok" or "error " + description
// Subscribes Topic: "users"
{
	"topic": "user",
	"event": "add-group-to-user",
	"body": "ok"
	// "body": "error login first"
	// "body": "error not in group admins"
	// "body": "error username does not exist"
	// "body": "error groupToAdd does not exist"
	// "body": "error user already in groupToAdd"
}

// If: "add-group-to-user" "ok"
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
			"username": "user",
			"groups": [ "admins", "test-group" ]
		}
	]
}

// If: group was added to self
// Body: user object of the connection
{
	"topic": "user",
	"event": "who-am-i",
	"body": {
		"username": "user",
		"groups": [ "admins", "test-group" ]
	}
}
```

## Event: remove-group-from-user

```json
// [Send]
// Function: remove group to user
// Group Required: "admin"
// Subscribes Topic: "user"
{
	"topic": "user",
	"event": "remove-group-from-user",
	"body": {
		"username": "user",
		"groupToRemove": "test-group"
	}
}
```

```json
// [Recieve]
// Body: "ok" or "error " + description
// Subscribes Topic: "users"
{
	"topic": "user",
	"event": "remove-group-from-user",
	"body": "ok"
	// "body": "error login first"
	// "body": "error not in group admins"
	// "body": "error username does not exist"
	// "body": "error groupToRemove does not exist"
	// "body": "error user already in groupToRemove"
}

// If: "remove-group-from-user" "ok"
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
			"username": "user",
			"groups": [ "admins" ]
		}
	]
}

// If: group was removed from self
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

## Event: change-user-password

```json
// [Send]
// Function: change user's password
// Group Required: "admin"
// Subscribes Topic: "user"
{
	"topic": "user",
	"event": "change-user-password",
	"body": {
		"username": "user",
		"newPassword": "password2",
		"newPasswordConfirm": "password2"
	}
}
```

```json
// [Recieve]
// Body: "ok" or "error " + description
// Subscribes Topic: "users"
{
	"topic": "user",
	"event": "change-user-password",
	"body": "ok"
	// "body": "error login first"
	// "body": "error not in group admins"
	// "body": "error username doesn't exists"
	// "body": "error newPassword invailed"
	// "body": "error newPasswordConfirm does not match newPassword"
}
```

## Event: remove

```json
// [Send]
// Function: remove user
// Group Required: "admins"
// Subscribes Topic: "user"
{
	"topic": "user",
	"event": "remove",
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
	"event": "remove",
	"body": "ok"
	// "body": "error username does not exist"
	// "body": "error not in group admins"
}

// If: "remove" "ok"
// Body: array of user objects
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

// If: user removed was currently logged in
// Body: user object of the connection
{
	"topic": "user",
	"event": "who-am-i",
	"body": "error login first"
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
