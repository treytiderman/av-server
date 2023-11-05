import { stdio } from "../../libraries/javascript/stdio.mjs"

stdio.receive.text(text => {
    stdio.send.text(`echo: ${text}`);
})
