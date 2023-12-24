// Overview: api wrapper for the database-v1.js module

// Imports
import * as api from '../core/api-v1.js'
import * as pm from './program-v1.js'

// Exports
export { routes }

// Help
const routes = [

    // Available
    { path: "program/v1/available/get/" },
    { path: "program/v1/available/sub/" },
    { path: "program/v1/available/unsub/" },

    // Program
    { path: "program/v1/get/:name/" },
    { path: "program/v1/sub/:name/" },
    { path: "program/v1/unsub/:name/" },
    { path: "program/v1/set-directory/:name/", body: { directory: 9600 } },
    { path: "program/v1/set-command/:name/", body: { command: "\r\n" } },
    { path: "program/v1/set-start-on-boot/:name/", body: { "start-on-boot": "ascii" } },
    { path: "program/v1/set-env/:name/", body: { env: "ascii" } },
    { path: "program/v1/create/:name/", body: { encoding: "ascii" } },
    { path: "program/v1/start/:name/", body: { encoding: "ascii" } },
    { path: "program/v1/send/:name/", body: { encoding: "ascii" } },
    { path: "program/v1/kill/:name/", body: { encoding: "ascii" } },
    { path: "program/v1/restart/:name/", body: { encoding: "ascii" } },
    { path: "program/v1/remove/:name/", body: { encoding: "ascii" } },

    // Data
    { path: "program/v1/data/get/:name/" },
    { path: "program/v1/data/sub/:name/" },
    { path: "program/v1/data/unsub/:name/" },

    // History
    { path: "program/v1/history/get/:name/" },
    // { path: "program/v1/history/sub/:name/" },
    // { path: "program/v1/history/unsub/:name/:key/" },

    // All programs
    { path: "program/v1/all/get/" },
    { path: "program/v1/all/sub/" },
    { path: "program/v1/all/unsub/" },
    { path: "program/v1/all/start/" },
    { path: "program/v1/all/send/", body: { data: "any" } },
    { path: "program/v1/all/kill/" },
    { path: "program/v1/all/restart/" },
    { path: "program/v1/all/remove/" },

    // Reset
    { path: "program/v1/reset-to-default/" },

]
