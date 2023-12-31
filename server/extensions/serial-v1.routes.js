// Overview: api wrapper for the database-v1.js module

// Imports
import * as api from '../modules/api.js'
// import * as db from './database-v1.js'

// Exports
export { routes }

// Help
const routes = [

    // Available
    { path: "port/v1/available/get/" },
    { path: "port/v1/available/sub/" },
    { path: "port/v1/available/unsub/" },

    // Port
    { path: "port/v1/get/:path/" },
    { path: "port/v1/sub/:path/" },
    { path: "port/v1/unsub/:path/" },
    { path: "port/v1/open/:path/", body: { encoding: "ascii" } },
    { path: "port/v1/send/:path/", body: { encoding: "ascii" } },
    { path: "port/v1/close/:path/" },
    { path: "port/v1/remove/:path/" },
    { path: "port/v1/set-baudrate/:path/", body: { baudrate: 9600 } },
    { path: "port/v1/set-delimiter/:path/", body: { delimiter: "\r\n" } },
    { path: "port/v1/set-encoding/:path/", body: { encoding: "ascii" } },

    // Data
    { path: "port/v1/data/get/:name/" },
    { path: "port/v1/data/sub/:name/" },
    { path: "port/v1/data/unsub/:name/" },

    // History
    { path: "port/v1/history/get/:name/" },
    { path: "port/v1/history/sub/:name/" },
    { path: "port/v1/history/unsub/:name/" },

    // All Ports
    { path: "port/v1/all/get/" },
    { path: "port/v1/all/sub/" },
    { path: "port/v1/all/unsub/" },
    { path: "port/v1/all/send/", body: { data: "any" } },
    { path: "port/v1/all/close/" },
    { path: "port/v1/all/remove/" },

]
