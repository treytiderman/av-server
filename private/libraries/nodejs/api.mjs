// Overview: get all av-server modules and tools

// Imports
import { stdio } from "./stdio.mjs";

// // Api
import * as logger_v0 from "./api-logger-v0.mjs";
import * as programs_v0 from "./api-programs-v0.mjs";
import * as system_v0 from "./api-system-v0.mjs";
import * as tcpClient_v0 from "./api-tcp-client-v0.mjs";
import * as user_v0 from "./api-user-v0.mjs";

// Functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Exports
export const api = {
    stdio: stdio,
    sleep: sleep,
    logger: { v0: logger_v0 },
    programs: { v0: programs_v0 },
    system: { v0: system_v0 },
    tcpClient: { v0: tcpClient_v0 },
    user: { v0: user_v0 },
}
