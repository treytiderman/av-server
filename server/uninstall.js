const os = require("os")
const system = os.type()
if (system === "Windows_NT") {
    const Service = require('node-windows').Service

    const svc = new Service({
        name:'av-server',
        script: require('path').join(process.cwd(),'server.js')
    })
    
    svc.on('uninstall', () => {
        console.log('Uninstall complete.')
        console.log('The service exists: ', svc.exists)
    })
    
    svc.uninstall()
}
else if (system === "Darwin") {
    // Issues
    // const Service = require('node-mac').Service // Issues using this
    console.log('Not setup for Mac')
}
else if (system === "Linux") {
    // let Service = require('node-linux').Service
    console.log('Not setup for Linux')
}
else {
    console.log('Unknown OS')
    console.log('Installing as a service is only available for:')
    console.log('Windows_NT (Windows 10, 11)')
}
