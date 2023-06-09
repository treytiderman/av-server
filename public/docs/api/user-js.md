```js
// Require library
const userApi = require("userApi")
```

# loginWithPassword

```js
// Login and get a token
let loginToken
userApi.loginWithPassword("admin", "admin")

userApi.onloginWithPassword(token, err) => {
	if (err) {
		// err = "error username or password incorrect"
	}
	else {
		loginToken = token
	}
})
```

# token

```js
// Send auth token, received from login, to access api
ws.sendEvent("user", "token", token)
```

```js
// Token error or successful auth
ws.receiveEvent("user", "token", body => {
	// Bad token
	if (body.error === true) {}
	// Good token
	else {}
})
```

# logout

```js
// Lose access to the api
ws.sendEvent("user", "logout")
```

```js
// Confirms logout
ws.receiveEvent("user", "logout", body => {
	// Logout success
})
```

# roles

```js
// Get roles that users can be
ws.sendEvent("user", "roles")
```

```js
// Receive roles
ws.receiveEvent("user", "roles", roles => {
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
ws.sendEvent("user", "get")
```

```js
// Receive current user
ws.receiveEvent("user", "get", user => {
	const user_example = {
		username: "admin",
	    role: 99,
	}
})
```

# new

```js
// Create new user
ws.sendEvent("user", "new", {
	username: "test",
	password: "test",
	passwordConfirm: "test",
	role: 99,
})
```

```js
// Receive errors or the new user
ws.receiveEvent("user", "new", body => {
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
ws.sendEvent("user", "update", {
	username: "test",
	password: "test",
	passwordNew: "test", // Optional
	passwordNewConfirm: "test", // Optional
	role: 99, // Optional
})
```

```js
// Receive errors or updated user
ws.receiveEvent("user", "update", body => {
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
ws.sendEvent("user", "delete", {
	username: "test",
	password: "test"
})
```

```js
// Receive errors or updated user
ws.receiveEvent("user", "delete", body => {
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
ws.sendEvent("user/all", "get")
```

```js
// Get all users
ws.sendEvent("user/all", "get")
```

```js
// Receive errors or updated user
ws.receiveEvent("user", "all", body => {
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
