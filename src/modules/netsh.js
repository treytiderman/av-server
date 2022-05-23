// Module for running cli commands
const util = require('util');
const exec = util.promisify(require('child_process').exec);



// Classes | Network interface cards
class NIC { 
  constructor(text) {
    this.name = null;
    this.ipIsDhcp = null,
    this.ipAddr = null;
    this.subnet = {
      mask: null,
      slash: null
    }
    this.gateway = null;
    this.dnsIsDhcp = null,
    this.dnsServers = [];
    return this.parse(text);
  }
  parse(text) {
    let lines = text.split("\r\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
  
      if (line.startsWith('Configuration for interface')) {
        let start = line.indexOf('"')+1;
        let stop = line.length-1;
        this.name = line.slice(start, stop).trim();
      }
      else if (line.startsWith('DHCP enabled:')) {
        let split = line.split(": ");
        this.ipIsDhcp = split[1].trim();
      }
      else if (line.startsWith('IP Address:')) {
        let split = line.split(": ");
        this.ipAddr = split[1].trim();
      }
      else if (line.startsWith('Subnet Prefix:')) {
        let split = line.split(": ");
        let start = split[1].indexOf('(mask')+5;
        let stop = split[1].length-1;
        this.subnet.mask = split[1].slice(start, stop).trim();
        start = split[1].indexOf('/')+1;
        stop = split[1].indexOf('(mask')-1;
        this.subnet.slash = split[1].slice(start, stop).trim();
      }
      else if (line.startsWith('Default Gateway:')) {
        let split = line.split(": ");
        this.gateway = split[1].trim();
      }
      else if (line.startsWith('DNS servers configured through DHCP:')) {
        let split = line.split(": ");
        this.dnsServers[0] = split[1].trim();
        for (let j = 1; j < lines.length - i; j++) {
          const line2 = lines[j+i].trim();
          if (line2.startsWith('Register with which suffix:')) break;
          this.dnsServers[j] = line2.trim();
        }
      }
      else if (line.startsWith('Statically Configured DNS Servers:')) {
        let split = line.split(": ");
        this.dnsServers[0] = split[1].trim();
        for (let j = 1; j < lines.length - i; j++) {
          const line2 = lines[j+i].trim();
          if (line2.startsWith('Register with which suffix:')) break;
          this.dnsServers[j] = line2.trim();
        }
      }

    }
    return this;
  }
}
class NICS {
  constructor(text) {
    this.interfaces = [];
    return this.parse(text);
  }
  parse(text) {
    let interfacesText = text.split("\r\n\r\n");
    for (let i = 0; i < interfacesText.length; i++) {
      const interfaceText = interfacesText[i];
      if (interfaceText !== '') {        
        let myNIC = new NIC(interfaceText);
        if (myNIC.name.includes("Loopback") || myNIC.name.includes("Local Area")) { }
        else {this.interfaces.push(myNIC);}
      }
    }
    return this.interfaces;
  }
  
}



// Run a cli command
async function runCmd(cmd) {
  const { stdout, stderr } = await exec(cmd);
  if (stderr) { console.error(`stderr: ${stderr}`); return }
  return stdout
}
// Get all the network interfaces
async function getNics() {
  const cmd = 'netsh interface ipv4 show config';
  const raw = await runCmd(cmd);
  const nics = new NICS(raw)
  return nics;
}
// Set IP to be DHCP
async function setDhcpIp(nic) {
  let cmd = `netsh interface ipv4 set address name="${nic}" source=dhcp`
  return await runCmd(cmd);
}
// Set the DNS servers to DHCP
async function setDhcpDns(nic) {
  let cmd = `netsh interface ipv4 set dns name="${nic}" source=dhcp`
  return await runCmd(cmd);
}
// Set a static IP address
async function setStaticIp(nic, ip, mask, gateway) {
  let cmd = `netsh interface ipv4 set address name="${nic}" static ${ip} ${mask} ${gateway}`
  return await runCmd(cmd);
}
// Set static DNS servers
async function setStaticDns(nic, dns, dns2 = null) {
  let output = [];
  let cmd = `netsh interface ipv4 set dns name="${nic}" static ${dns}`
  if (dns2 !== null) {
    let cmd2 = `netsh interface ipv4 add dns name="${nic}" ${dns2} index=2`
    output[0] = await runCmd(cmd);
    output[1] = await runCmd(cmd2);
    return output
  }
  output[0] = await runCmd(cmd);
  output[1] = null;
  return output
}
// Set DHCP
async function setDhcp(nic) {
  let cmdIp = `netsh interface ipv4 set address name="${nic}" source=dhcp`
  let cmdDns = `netsh interface ipv4 set dns name="${nic}" source=dhcp`
  await runCmd(cmdIp);
  return await runCmd(cmdDns);
}
// Set Static
async function setStatic(nic, ip, mask, gateway, dns, dns2 = null) {
  let output = [];
  let cmdIp = `netsh interface ipv4 set address name="${nic}" static ${ip} ${mask} ${gateway}`
  output[0] = await runCmd(cmdIp);
  let cmdDns1 = `netsh interface ipv4 set dns name="${nic}" static ${dns}`
  if (dns2 !== null) {
    let cmdDns2 = `netsh interface ipv4 add dns name="${nic}" ${dns2} index=2`
    output[1] = await runCmd(cmdDns1);
    output[2] = await runCmd(cmdDns2);
    return output
  }
  output[1] = await runCmd(cmdDns1);
  output[2] = null;
  return output
}



// Testing Functions
// getNics().then(nics => console.log(nics))
// setDhcpIp('Ethernet')
//   .then(output => {
//     console.log(`setDhcpIp: ${output}`)
//     getNics().then(nics => console.log(nics))
//   })
// setDhcpDns('Ethernet')
//   .then(output => {
//     console.log(`setDhcpDns: ${output}`)
//     getNics().then(nics => console.log(nics))
//   })
// setStaticIp('Ethernet', '192.168.1.9', '255.255.255.0', '192.168.1.254')
//   .then(output => {
//     console.log(`setStaticIp: ${output}`)
//     getNics().then(nics => console.log(nics))
//   })
// setStaticDns('Ethernet', '8.8.8.8')
//   .then(output => {
//     console.log(`setStaticDns: ${output}`)
//     getNics().then(nics => console.log(nics))
//   })
// setStaticDns('Ethernet', '8.8.8.8', '8.8.4.4')
//   .then(output => {
//     console.log(`setStaticDns: ${output}`)
//     getNics().then(nics => console.log(nics))
//   })
// setDhcp('Ethernet')
//   .then(output => {
//     console.log(`setDhcp: ${output}`)
//     getNics().then(nics => console.log(nics))
//   })
// setStatic('Ethernet', '192.168.1.9', '255.255.255.0', '192.168.1.254', '8.8.8.8', '8.8.4.4')
//   .then(output => {
//     console.log(`setStatic: ${output}`)
//     getNics().then(nics => console.log(nics))
//   })



// Export
// exports.state = state;
exports.getNics = getNics;
exports.setDhcpIp = setDhcpIp;
exports.setDhcpDns = setDhcpDns;
exports.setStaticIp = setStaticIp;
exports.setStaticDns = setStaticDns;
exports.setDhcp = setDhcp;
exports.setStatic = setStatic;
