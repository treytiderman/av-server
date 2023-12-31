// Overview: api wrapper for the database-v1.js module

// Imports
import * as api from '../modules/api.js'
// import * as db from '../modules/database-v1.js'

// Exports
export { routes }

// Help
const routes = [

    // Port
    { path: "tcp/client/v1/get/:address/" },
    { path: "tcp/client/v1/sub/:address/" },
    { path: "tcp/client/v1/unsub/:address/" },
    { path: "tcp/client/v1/open/:address/", body: { encoding: "ascii" } },
    { path: "tcp/client/v1/send/:address/", body: { data: "data", encoding: "ascii" } },
    { path: "tcp/client/v1/reconnect/:address/", body: { data: "data", encoding: "ascii" } },
    { path: "tcp/client/v1/close/:address/" },
    { path: "tcp/client/v1/remove/:address/" },
    { path: "tcp/client/v1/set-encoding/:address/", body: { encoding: "ascii" } },

    // Data
    { path: "tcp/client/v1/data/get/:address/" },
    { path: "tcp/client/v1/data/sub/:address/" },
    { path: "tcp/client/v1/data/unsub/:address/" },

    // History
    { path: "tcp/client/v1/history/get/:address/" },
    { path: "tcp/client/v1/history/sub/:address/" },
    { path: "tcp/client/v1/history/unsub/:address/" },

    // All Ports
    { path: "tcp/client/v1/all/get/" },
    { path: "tcp/client/v1/all/sub/" },
    { path: "tcp/client/v1/all/unsub/" },
    { path: "tcp/client/v1/all/open/" },
    { path: "tcp/client/v1/all/close/" },
    { path: "tcp/client/v1/all/remove/" },

]
