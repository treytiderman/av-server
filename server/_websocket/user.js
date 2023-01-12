const ws_server = require('./_ws_server')

// Module
const auth = require('../modules/auth')

// Client Events
ws_server.emitter.on("/user/v1", async (ws, req) => {
  if (req.event === "login") {
    ws_server.subscribe(ws, "/user/v1")
    
    // Username exists
    const user = auth.users.find(user => user.username === req.body.username)
    if (user) {
      
      // Correct | Save user to the connection
      if (auth.isHashedPassword(req.body.password, user.password.hash, user.password.salt)) {
        ws.auth = true
        ws.user = user
        ws_server.event(ws, "/user/v1", "login", {
          username: user.username,
          role: user.role
        })
      }

      // Password incorrect
      // else ws_server.event(ws, "/user/v1", "login", "password incorrect")
      else ws_server.event(ws, "/user/v1", "login", "username or password incorrect")

    }

    // Else
    // else ws_server.event(ws, "/user/v1", "login", "username doesn't exists")
    else ws_server.event(ws, "/user/v1", "login", "username or password incorrect")

  }
  else if (req.event === "logout") {
    if (ws.auth === true) {
      ws.auth = false
      ws_server.event(ws, "/user/v1", "logout", true)
    }
  }
})






