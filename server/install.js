const os = require("os")
const system = os.type()
if (system === "Windows_NT") {
    const Service = require('node-windows').Service

    const svc = new Service({
        name: 'av-server',
        description: 'control system',
        script: require('path').join(process.cwd(), 'server.js'),
        env: [
            {
                name: "name",
                value: "av-server"
            },
            {
                name: "port",
                value: 4620
            }
        ]
    })

    svc.on('install', () => {
        svc.start()
    })

    svc.on('alreadyinstalled', () => {
        console.log('This service is already installed.')
    })

    svc.on('start', () => {
        console.log(svc.name + ' started!')
        console.log("http://localhost:4620")
    })

    console.log('Installing on Windows')
    svc.install()
}
else if (system === "Darwin") {
    // const Service = require('node-mac').Service // Issues using this
    console.log('Not setup for Mac')
}
else if (system === "Linux") {
    // const Service = require('node-linux').Service
    console.log('Not setup for Linux')
}
else {
    console.log('Unknown OS')
    console.log('Installing as a service is only available for:')
    console.log('Windows_NT (Windows 10, 11)')
    // console.log('Darwin (MacOS)')
    // console.log('Linux (Tested with Fedora 37 and Ubuntu 20.04)')
}
