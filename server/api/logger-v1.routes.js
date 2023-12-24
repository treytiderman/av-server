// Overview: api wrapper for the database-v1.js module

// Imports
import * as api from '../modules/api.js'
// import * as db from '../modules/database-v1.js'

// Exports
export { routes }

// Help
const routes = [

    // Logs
    { path: "log/v1/get/" },
    { path: "log/v1/sub/" },
    { path: "log/v1/unsub/" },
    { path: "log/v1/clear/" },
    { path: "log/v1/debug/", body: { group: "group", message: "message", obj: {} } },
    { path: "log/v1/info/", body: { group: "group", message: "message", obj: {} } },
    { path: "log/v1/warn/", body: { group: "group", message: "message", obj: {} } },
    { path: "log/v1/error/", body: { group: "group", message: "message", obj: {} } },

    // History
    { path: "log/v1/history/get/" },
    { path: "log/v1/history/sub/" },
    { path: "log/v1/history/unsub/" },

    // Group
    // { path: "log/v1/group/get/:group/" },
    // { path: "log/v1/group/sub/:group/" },
    // { path: "log/v1/group/unsub/:group/" },

    // Group History
    // { path: "log/v1/group/history/get/" },
    // { path: "log/v1/group/history/sub/" },
    // { path: "log/v1/group/history/unsub/" },

]
