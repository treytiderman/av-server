const ws_server = require('../websocket/ws_server')

// Module
const auth = require('../core/modules/auth')

// Client Events
ws_server.emitter.on("/user/v1", async (ws, req) => {
    if (req.event === "login") {
        ws_server.subscribe(ws, "/user/v1")

        // Username exists
        const user = auth.users.find(user => user.username === req.body.username)
        if (user) {

            // Correct | Save user to the connection
            if (auth.isHashedPassword(req.body.password, user.password.hash, user.password.salt)) {
                const token = auth.generateJWT({ username: user.username })
                ws.auth = true
                ws.user = user
                ws_server.event(ws, "/user/v1", "token", token)
                ws_server.event(ws, "/user/v1", "login", "success")
                ws_server.event(ws, "/user/v1", "user", {
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
    else if (req.event === "token") {
        // console.log("token", req.body)
        ws_server.subscribe(ws, "/user/v1")
        auth.verifyJWT(req.body, (error, jwtJson) => {

            // Bad Token
            if (error) {
                // console.log("bad token unknown user")
                ws.auth = false
                ws_server.event(ws, "/user/v1", "token", "bad token")
            }

            // Verified Token
            else {


                /* Get user and add to request
                Q: Couldn't the jwt username be changed?
                A: Yes, but they would also need the secret to do that */
                const user = auth.users.find(user => user.username === jwtJson.username)

                // Good Token
                if (user) {
                    // console.log("good token", user)
                    ws.auth = true
                    ws.user = user
                    // console.log("/user/v1", "token", true)
                    ws_server.event(ws, "/user/v1", "token", "good token")
                    ws_server.event(ws, "/user/v1", "user", {
                        username: user.username,
                        role: user.role
                    })
                }

                // Bad Verified Token
                else {
                    // console.log("verifyJWT, can't find user", user)
                    ws.auth = false
                    ws_server.event(ws, "/user/v1", "token", "bad token")
                }

            }
        })
    }
    else if (req.event === "logout") {
        ws.auth = false
        ws_server.event(ws, "/user/v1", "logout", true)
    }
})






