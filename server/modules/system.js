// Overview: system info, time, uptime

// Imports
import os from 'os'
import dns from 'dns'
import events from 'events'
import { exec } from 'child_process'
import { Logger } from './logger.js'

// Exports
export {
    isAdmin,
    getTime,
    getTimeAsISO,
    getUptime,
    getNICs,
    getOS,
    getSystemInfo,
    emitter
}

// Constants
const UPDATE_INTERVAL = 1_000

// Variables
const log = new Logger("modules/system.js")
const emitter = new events.EventEmitter()
const startupTime = Date.now()

// Functions
function isAdmin() {
    if (os.type() === "Windows_NT") {
        exec('NET SESSION', function (error, stdout, stderror) {
            if (stderror.length === 0) return true
            else return false
        })
        return false
    }
    else {
        return process.getuid && process.getuid() === 0;
    }
}
function getTime() {
    return Date.now()
}
function getTimeAsISO() {
    return new Date(Date.now()).toISOString()
}
function getUptime() {
    return Date.now() - startupTime
}
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
        pwd: process.env.PWD,
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

// Updater
setInterval(() => {
    emitter.emit('getTime', getTime())
    emitter.emit('getTimeAsISO', getTimeAsISO())
    emitter.emit('getUptime', getUptime())
    emitter.emit('getSystemInfo', getSystemInfo())
}, UPDATE_INTERVAL);

// Startup
log.info("startup -> " + new Date().toLocaleString(), getSystemInfo())
