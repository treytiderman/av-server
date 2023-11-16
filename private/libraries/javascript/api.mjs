// Overview: get all av-server modules and tools

// Imports
import { stdio } from "./stdio.mjs";

// // Api
// import { v0 as logger_v0 } from "../js/api-logger-v0.js";
// import { v0 as system_v0 } from "../js/api-system-v0.js";
// import { v0 as tcpClient_v0 } from "../js/api-tcp-client-v0.js";
// import { v0 as user_v0 } from "../js/api-user-v0.js";

// // Exports
export const api = {
    uptime,
}

function uptime(callback = () => { }) {
    stdio.send.path("/system/v0/topic/uptime/", "get")
    stdio.receiveOnce.path("/system/v0/topic/uptime/", (response) => callback(response))
}
