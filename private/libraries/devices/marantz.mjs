// Device: Marantz NR1506

// Imports
import { api } from "../../libraries/nodejs/api.mjs"

// Exports
export {
    CMD,
    connect,
    volumeUp,
    volumeDown,
    volumeSet,
    volumePoll,
}

// Constants
const POLL_INTERVAL = 5_000
const ENCODING = "ascii"
const EOL = "\r"
const CMD = {
    "powerOn": "PWON",
    "powerOff": "PWSTANDBY",
    "powerStatus": "PW?",
    "volumeUp": "MVUP",
    "volumeDown": "MVDOWN",
    "volumeSet40": "MV40",
    "volumeStatus": "MV?",
    "muteOn": "MUON",
    "muteOff": "MUOFF",
    "muteStatus": "MU?",
    "inputGame": "SIGAME",
    "inputBluetooth": "SIBT",
    "inputTV": "SITV",
    "inputCD": "SICD",
    "inputDVD": "SIDVD",
    "inputBluray": "SIBD",
    "inputInternetMusic": "SINET",
    "inputAux": "SIAUX1",
    "inputStatus": "SI?",
    "internetMusicPlay": "NS9A",
    "internetMusicPause": "NS9B",
    "internetMusicSkip": "NS9D",
    "internetMusicBack": "NS9E",
    "internetMusicStatus": "NSA",
    "internetMusicStatus2": "NSE",
}

// Functions
function connect(address, callback) {
    setTimeout(async () => {
        api.tcpClient.v0.open(address, ENCODING)
        api.tcpClient.v0.subClient(address, res => {
            if (res.isOpen) callback(res)
        })
    }, 10);
}

function powerOn(address) {
    api.tcpClient.v0.send(address, CMD.powerOn + EOL, ENCODING)
}
function powerOff(address) {
    api.tcpClient.v0.send(address, CMD.powerOff + EOL, ENCODING)
}
function powerStatus(address, callback) {
    api.tcpClient.v0.subData(address, res => {
        if (res.wasReceived && res.data.startsWith("PW")) {
            let power = Number(res.data.trim().replace("PW", ""))
            if (!power) return
            callback(power)
        }
    })
    setInterval(() => {
        api.tcpClient.v0.send(address, CMD.powerStatus + EOL, ENCODING)
    }, POLL_INTERVAL);
}

function volumeUp(address) {
    api.tcpClient.v0.send(address, CMD.volumeUp + EOL, ENCODING)
}
function volumeDown(address) {
    api.tcpClient.v0.send(address, CMD.volumeDown + EOL, ENCODING)
}
function volumeSet(address, number) {
    api.tcpClient.v0.send(address, "MV" + number + EOL, ENCODING)
}
function volumePoll(address, callback) {
    api.tcpClient.v0.subData(address, res => {
        if (res.wasReceived && res.data.startsWith("MV")) {
            let volume = Number(res.data.trim().replace("MV", ""))
            if (!volume) return
            if (volume > 100) volume = volume/10
            callback(volume)
        }
    })
    setInterval(() => {
        api.tcpClient.v0.send(address, CMD.volumeStatus + EOL, ENCODING)
    }, POLL_INTERVAL);
}

function muteOn(address) {
    api.tcpClient.v0.send(address, CMD.muteOn + EOL, ENCODING)
}
function muteOff(address) {
    api.tcpClient.v0.send(address, CMD.muteOff + EOL, ENCODING)
}
function mutePoll(address, callback) {
    api.tcpClient.v0.subData(address, res => {
        if (res.wasReceived && res.data.startsWith("MU")) {
            let mute = Number(res.data.trim().replace("MU", ""))
            if (!mute) return
            callback(mute)
        }
    })
    // setInterval(() => {
    //     api.tcpClient.v0.send(address, CMD.muteStatus + EOL, ENCODING)
    // }, POLL_INTERVAL);
}
