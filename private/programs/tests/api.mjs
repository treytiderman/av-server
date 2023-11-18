import { api } from "../../libraries/nodejs/api.mjs"

let time
let uptime
let timeAsIso
let info

// api.system.v0.subTime(res => {
//     time = res
//     // console.log(`info rx time: ${time} uptime: ${uptime}`);
// })

// api.system.v0.subUptime(res => {
//     uptime = res
// })

// api.system.v0.subTimeAsIso(res => {
//     timeAsIso = res
// })

api.system.v0.subInfo(res => {
    info = res
    // console.log(res);
})
