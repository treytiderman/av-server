import { stdio } from "../../libraries/nodejs/stdio.mjs"

stdio.receive.text(text => {
    stdio.send.text(`echo: ${text}`);
})
