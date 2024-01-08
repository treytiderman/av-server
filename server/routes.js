// Overview: import api routes

// Modules
import * as api_v1 from "./modules/api-v1.js"
import * as database_v1 from "./modules/database-v1.routes.js";
import * as logger_v0 from "./modules/logger-v0.routes.js";
import * as system_v1 from "./modules/system-v1.routes.js";
import * as user_v1 from "./modules/user-v1.routes.js";

// Extensions
import * as program_v1 from "./extensions/program-v1.routes.js";
import * as serial_v1 from "./extensions/serial-v1.routes.js";
import * as tcp_client_v1 from "./extensions/tcp-client-v1.routes.js";

// Help
const help = {
    help: [ { path: "help", body: {} } ],
    database_v1: database_v1.routes,
    logger_v0: logger_v0.routes,
    system_v1: system_v1.routes,
    user_v1: user_v1.routes,
    program_v1: program_v1.routes,
    serial_v1: serial_v1.routes,
    tcp_client_v1: tcp_client_v1.routes,
}

// Route
api_v1.receive("help", async (client, path, body, params) => {
    client.send(path, help)
})