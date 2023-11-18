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
    // setInterval(() => {
    //     api.tcpClient.v0.send(address, CMD.volumeStatus + EOL, ENCODING)
    // }, 4000);
}
