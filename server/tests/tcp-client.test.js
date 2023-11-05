// Imports
// import * as api from '../modules/api.js'

// Functions
export async function test() {
    let pass = true
    let response = {}

    // Tests
    response = false
    if (response) pass = false

    return pass
}

// setTimeout(() => {
//     const address = "192.168.1.9:23"

//     close(address)
//     console.log("removeAll()", removeAll());

//     console.log("try open", address);
//     open(address, "ascii", () => {
//         const history = getHistory(address)
//         console.log("history", history);
//         console.log("data", history[history.length - 1]);
//         send(address, "hello")
//     })

//     // Events: "open", "error", "close", "receive", "send"
//     emitter.on("open", (address) => {
//         console.log("open", address);
//         console.log("client", getClient(address));
//     })
//     emitter.on("error", (address, error) => {
//         console.log("error", address, "->", error);
//     })
//     emitter.on("close", (address) => {
//         console.log("close");
//         console.log("client", getClients(address));
//         const history = getHistory(address)
//         console.log("history", history);
//         console.log("data", history[history.length - 1]);
//     })
//     emitter.on("receive", (address, data) => {
//         console.log("receive", address, "->", data);
//     })
//     emitter.on("send", (address, data) => {
//         console.log("send", address, "->", data);
//     })

//     // setTimeout(() => {
//     //     console.log("closeAll()", closeAll());
//     // }, 1000);

//     // setTimeout(() => {
//     //     console.log("openAll()", openAll());
//     // }, 1200);

//     // setTimeout(() => {
//     //     console.log("removeAll()", removeAll());
//     //     console.log("closeAll()", closeAll());
//     //     console.log("close(address)", close(address));
//     //     console.log("removeAll()", removeAll());
//     //     console.log("openAll()", openAll());
//     // }, 2000);

// }, 1000);

// setTimeout(() => {
//     const address = "192.168.1.32:23"

//     console.log("try open", address);
//     open(address, "ascii", () => {
//         send(address, "MVDOWN\r")
//     })

//     // Events: "open", "error", "close", "receive", "send"
//     emitter.on("open", (address) => {
//         console.log("open", address);
//         console.log("client", getClient(address));
//     })
//     emitter.on("error", (address, error) => {
//         console.log("error", address, "->", error);
//     })
//     emitter.on("close", (address) => {
//         console.log("close");
//     })
//     emitter.on("receive", (address, data) => {
//         console.log("receive", address, "->", data);
//     })
//     emitter.on("send", (address, data) => {
//         console.log("send", address, "->", data);
//     })

// }, 1000);