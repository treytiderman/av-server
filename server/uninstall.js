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
    // let Service = require('node-mac').Service
}
else if (system === "Linux") {
    // let Service = require('node-linux').Service
}
else {
    console.log('Unknown OS')
    console.log('Installing as a service is only available for:')
    console.log('Windows_NT (Windows 10, 11)')
    console.log('Darwin (MacOS)')
    console.log('Linux (Tested with Fedora 37 and Ubuntu 20.04)')
}
