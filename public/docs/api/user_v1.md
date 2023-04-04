[back](./api.md)

# login

```js
// Login to get auth token
ws.send.event("user_v1", "login", {
	"username": "admin",
	"password": "admin"
})
```

```js
// Login error or recieve auth token
let token
ws.receive.event("user_v1", "login", body => {
	// Login failed
	if (body.error === true) {}
	// Login success
	else {
		token = body.token
	}
})
```

# token

```js
// Send auth token, received from login, to access api
ws.send.event("user_v1", "token", token)
```

```js
// Token error or successful auth
ws.receive.event("user_v1", "token", body => {
	// Bad token
	if (body.error === true) {}
	// Good token
	else {}
})
```

# logout

```js
// Lose access to the api
ws.send.event("user_v1", "logout")
```

```js
// Confirms logout
ws.receive.event("user_v1", "logout", body => {
	// Logout success
})
```

# roles

```js
// Get roles that users can be
ws.send.event("user_v1", "roles")
```

```js
// Receive roles
ws.receive.event("user_v1", "roles", roles => {
	const roles_example = {
        ADMIN: 99,
        USER: 50,
        ANY: 1,
    }
})
```

# get

```js
// Get current user
ws.send.event("user_v1", "get")
```

```js
// Receive current user
ws.receive.event("user_v1", "get", user => {
	const user_example = {
		username: "admin",
	    role: 99,
	}
})
```

# new

```js
// Create new user
ws.send.event("user_v1", "new", {
	username: "test",
	password: "test",
	passwordConfirm: "test",
	role: 99,
})
```

```js
// Receive errors or the new user
ws.receive.event("user_v1", "new", body => {
	if (body.error === ture) {
		if (body.errorMessage === "requested role greater than user's role") {}
		else if (body.errorMessage === "passwords does not match") {}
		else if (body.errorMessage === "username exists") {}
	}
	else {
		const user = body.user
		const user_example = {
			username: "admin",
			role: 99,
		}
	}
})
```

# update

```js
// Update user
ws.send.event("user_v1", "update", {
	username: "test",
	password: "test",
	passwordNew: "test", // Optional
	passwordNewConfirm: "test", // Optional
	role: 99, // Optional
})
```

```js
// Receive errors or updated user
ws.receive.event("user_v1", "update", body => {
	if (body.error === ture) {
		if (body.errorMessage === "requested role greater than user's role") {}
		else if (body.errorMessage === "passwords does not match") {}
		else if (body.errorMessage === "username doesn't exists") {}
		else if (body.errorMessage === "passwords incorrect") {}
	}
	else {
		const user = body.user
		const user_example = {
			username: "admin",
			role: 99,
		}
	}
})
```

# delete

```js
// Update user
ws.send.event("user_v1", "delete", {
	username: "test",
	password: "test"
})
```

```js
// Receive errors or updated user
ws.receive.event("user_v1", "delete", body => {
	if (body.error === ture) {
		if (body.errorMessage === "username doesn't exists") {}
		else if (body.errorMessage === "passwords incorrect") {}
	}
	else {
		// User deleted
	}
})
```

# all

```js
// Get all users
ws.send.event("user_v1/all", "get")
```

```js
// Get all users
ws.send.event("user_v1/all", "get")
```

```js
// Receive errors or updated user
ws.receive.event("user_v1", "all", body => {
	if (body.error === ture) {
		if (body.errorMessage === "role to low") {}
	}
	else {
		const users = body.users
		const users_example = [
			{
				username: "admin",
				role: 99,
			},
			{
				username: "user",
				role: 50,
			},
			{
				username: "guest",
				role: 1,
			},
		]
	}
})
```
