import { api } from "../../libraries/nodejs/api.mjs"
import * as marantz from "../../libraries/devices/marantz.mjs"

const address = "192.168.1.32:23"
marantz.connect(address, async (res) => {
    console.log(res.address, "is open:", res.isOpen)

    marantz.volumePoll(address, vol => {
        console.log("vol is now", vol);
    })

    await api.sleep(500)
    marantz.volumeUp(address)

    await api.sleep(500)
    marantz.volumeDown(address)
})
