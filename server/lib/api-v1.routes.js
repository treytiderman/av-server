// Overview: import api routes

// Imports
import * as api_v1 from './api-v1.js'
import * as database_v1 from "./database-v1.routes.js";
import * as logger_v0 from "./logger-v0.routes.js";
// import * as program_v1 from "./program-v1.routes.js";
// import * as serial_v1 from "./serial-v1.routes.js";
import * as system_v1 from "./system-v1.routes.js";
// import * as tcp_client_v1 from "./tcp-client-v1.routes.js";
import * as user_v1 from "./user-v1.routes.js";

// State
const routes = {
    database_v1: database_v1.routes,
    logger_v0: logger_v0.routes,
    // program_v1: program_v1.routes,
    // serial_v1: serial_v1.routes,
    system_v1: system_v1.routes,
    // tcp_client_v1: tcp_client_v1.routes,
    user_v1: user_v1.routes,
}

api_v1.receive("help", async (client, path) => client.send(path, routes))
api_v1.receive("help/", async (client, path) => client.send(path, routes))
