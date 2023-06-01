const os = require("os")
const dns = require("dns")
const exec = require('child_process').exec
const { log } = require("./logger")

// Functions
function getNICs() {
    const results = []
    const nets = os.networkInterfaces()
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
            if (net.family === familyV4Value && !net.internal) {
                results.push({
                    name: name,
                    ip: net.address,
                    mask: net.netmask,
                    cidr: net.cidr,
                    mac: net.mac,
                })
            }
        }
    }
    return results
}
function getOS() {
    const system = os.type()
    if (system === "Windows_NT") return "windows"
    else if (system === "Darwin") return "mac"
    else if (system === "Linux") return "linux"
    else return "unknown"
}
function isAdmin() {
    if (os.type() === "Windows_NT") {
        exec('NET SESSION', function (err, so, se) {
            if (se.length === 0) return true
            else return false
        })
        return false
    }
    else {
        return process.getuid && process.getuid() === 0;
    }
}
function getSystemInfo() {
    return {
        os: getOS(),
        arch: os.arch(),
        hostname: os.hostname(),
        nics: getNICs(),
        dns: dns.getServers(),
        isAdmin: isAdmin(),
        time_iso: new Date(),
        uptime_sec: os.uptime(),
        user: os.userInfo(),
        __dirname: __dirname,
        __filename: __filename,
        cpu: {
            cores: os.cpus().length,
        },
        ram: {
            free_bytes: os.freemem(),
            total_bytes: os.totalmem(),
            percentage: (os.freemem() / os.totalmem()).toFixed(2) * 100,
        },
        node_version: process.version,
        eol: os.EOL,
    }
}
function isPythonInstalled() {

}

// Startup
log("system", "startup")

// Exports
exports.getNICs = getNICs
exports.getOS = getOS
exports.isAdmin = isAdmin
exports.getSystemInfo = getSystemInfo

// Testing
// console.log(getSystemInfo())
