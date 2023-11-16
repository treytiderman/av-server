import { api } from "../../libraries/javascript/api.mjs"

api.uptime(time => {
    console.log("i did it", time)
})
