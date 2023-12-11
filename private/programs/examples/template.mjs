import { api } from "../../libraries/nodejs/api.mjs"

api.user.v0.login("admin", "admin", (res) => {
    api.tcpClient.v0.open("192.168.1.9:23", "ascii")
    api.tcpClient.v0.subClient("192.168.1.9:23", res => {
        if (res.isOpen) {
            api.tcpClient.v0.send("192.168.1.9:23", "I can talk\n", "ascii")
        }
    })
    api.tcpClient.v0.subData("192.168.1.9:23", res => {
        if (res.wasReceived) {
            api.tcpClient.v0.send("192.168.1.9:23", "echo: " + res.data + "\n", "ascii")
        }
    })
})
