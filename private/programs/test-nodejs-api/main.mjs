import { stdio } from "../../libraries/js/stdio.mjs"

stdio.receive.text(text => {
    stdio.send.text(`text rx: ${text}`);
})
