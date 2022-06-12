// Module for running cli commands
const util = require('util');
const exec = util.promisify(require('child_process').exec);



// Classes | Network interface cards
class NIC { 
  constructor(text) {
    this.name = null;
    this.interfaceMetric = null,
    this.ipIsDhcp = null,
    this.ip = null;
    this.mask = null,
    this.slash = null,
    this.gateway = null;
    this.dnsIsDhcp = null,
    this.dns = [];
    this.ipsAdded = [];
    return this.parse(text);
  }
  parse(text) {
    let lines = text.split("\r\n");
    // console.log('\n');
    let ipCount = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // console.log(line);
  
      if (line.startsWith('Configuration for interface')) {
        let start = line.indexOf('"')+1;
        let stop = line.length-1;
        this.name = line.slice(start, stop).trim();
      }
      else if (line.startsWith('InterfaceMetric:')) {
        let split = line.split(": ");
        this.interfaceMetric = split[1].trim();
      }
      else if (line.startsWith('DHCP enabled:')) {
        let split = line.split(": ");
        this.ipIsDhcp = split[1].trim();
      }
      else if (line.startsWith('IP Address:')) {
        let split = line.split(": ");
        if (this.ip === null) {          
          this.ip = split[1].trim();
        }
        else {
          this.ipsAdded[ipCount] = { "ip": split[1].trim() };
        }
      }
      else if (line.startsWith('Subnet Prefix:')) {
        let split = line.split(": ");
        let start = split[1].indexOf('(mask')+5;
        let stop = split[1].length-1;
        if (this.mask === null) {          
          this.mask = split[1].slice(start, stop).trim();
          start = split[1].indexOf('/')+1;
          stop = split[1].indexOf('(mask')-1;
          this.slash = split[1].slice(start, stop).trim();
        }
        else {
          this.ipsAdded[ipCount].mask = split[1].slice(start, stop).trim();
          ipCount++;
        }
        
      }
      else if (line.startsWith('Default Gateway:')) {
        let split = line.split(": ");
        this.gateway = split[1].trim();
      }
      else if (line.startsWith('DNS servers configured through DHCP:')) {
        let split = line.split(": ");
        this.dns[0] = split[1].trim();
        for (let j = 1; j < lines.length - i; j++) {
          const line2 = lines[j+i].trim();
          if (line2.startsWith('Register with which suffix:')) break;
          this.dns[j] = line2.trim();
        }
      }
      else if (line.startsWith('Statically Configured DNS Servers:')) {
        let split = line.split(": ");
        this.dns[0] = split[1].trim();
        for (let j = 1; j < lines.length - i; j++) {
          const line2 = lines[j+i].trim();
          if (line2.startsWith('Register with which suffix:')) break;
          this.dns[j] = line2.trim();
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
let nicsGlobal = getNics();



// Validation
function isNum(string) {
  if (typeof string != "string") return false;
  return !isNaN(string) && !isNaN(parseFloat(string))
}
function hasWhitespace(string) {
  if (typeof string != "string") return false;
  return /\s/.test(string);
}
function validNic(nicName) {
  let valid = false;
  if (nicName === null) return false
  nicsGlobal.forEach(nic => {
    if (nic.name === nicName) valid = true;
  });
  return valid
}
function validIp(ip) {
  let validI = true;
  if (ip === null) return false
  const split = ip.split(".");
  const periodCount = split.length - 1;
  // Rules
  if (periodCount !== 3) validI = false;
  else {
    // Each octet
    for (let i = 0; i < split.length; i++) {
      // Is number
      if (isNum(split[i]) === false) validI = false;
      // Check for white space
      // else if (hasWhitespace(split[i])) validI = false;
      // Number is in ip range 0-255
      const num = Number(split[i]);
      if (num < 0 || num > 255) validI = false;
    } 
  }
  return validI;
}
function validMask(mask) {
  let validM = true;
  if (mask === null) return false
  const split = mask.split(".");
  const periodCount = split.length - 1;
  // Rules
  if (periodCount !== 3) validM = false;
  else {
    // Each octet
    for (let i = 0; i < split.length; i++) {
      // Is number
      if (isNum(split[i]) === false) validM = false;
      // Check for white space
      // else if (hasWhitespace(split[i])) validM = false;
    }
    // Number is in a subnet mask
    const mask12 = ['255','254','252','248','240','224','192','128','0'];
    const mask3 = ['252','248','240','224','192','128','0'];
    if (split[0] !== '255') validM = false;
    else if (mask12.includes(split[1]) === false) validM = false;
    else if (mask12.includes(split[2]) === false) validM = false;
    else if (mask3.includes(split[3]) === false) validM = false;
    else if (split[3] > split[2]) validM = false;
    else if (split[2] > split[1]) validM = false;
    else if (split[1] > split[0]) validM = false;
  }
  return validM; 
}
function validMetric(metric) {
  let validM = true;
  if (metric === null) return false
  // Is number
  if (isNum(metric) === false) validM = false;
  // Number is in ip range 0-255
  const num = Number(metric);
  if (num < 1 || num > 9999) validM = false;
  return validM;
}



// Run a cli command
async function runCmd(cmd) {
  if (cmd !== 'netsh interface ipv4 show config') console.log(cmd);
  const { stdout, stderr } = await exec(cmd);
  if (stderr) { console.error(`stderr: ${stderr}`); return }
  return stdout
}
// Get all the network interfaces
async function getNics() {
  const cmd = 'netsh interface ipv4 show config';
  const raw = await runCmd(cmd);
  const nics = new NICS(raw)
  nicsGlobal = nics;
  return nics;
}
// DHCP
async function setDhcpIp(nic) {
  if (validNic(nic)) {
    let cmd = `netsh interface ipv4 set address name="${nic}" source=dhcp`
    return await runCmd(cmd);
  }
  return 'failed'
}
async function setDhcpDns(nic) {
  if (validNic(nic)) {
    let cmd = `netsh interface ipv4 set dns name="${nic}" source=dhcp`
    return await runCmd(cmd);
  }
  return 'failed'
}
async function setDhcp(nic) {
  let output = [];
  output[0] = await setDhcpIp(nic);
  output[1] = await setDhcpDns(nic);
  return output;
}
// Static
async function setStaticIp(nic, ip, mask, gateway = null) {
  if (validNic(nic) && validIp(ip) && validMask(mask)) {
    if (validIp(gateway)) {
      let cmd = `netsh interface ipv4 set address name="${nic}" static ${ip} ${mask} ${gateway}`
      return await runCmd(cmd);
    }
    else {
      let cmd = `netsh interface ipv4 set address name="${nic}" static ${ip} ${mask}`
      return await runCmd(cmd);
    }
  }
}
async function addStaticIp(nic, ip, mask) {
  if (validNic(nic) && validIp(ip) && validMask(mask)) {
    let cmd = `netsh interface ipv4 add address name="${nic}" ${ip} ${mask}`
    return await runCmd(cmd);
  }
}
async function setStaticDns(nic, dns, dns2 = null) {
  let output = [null, null];
  if (validNic(nic) && validIp(dns)) {
    let cmd = `netsh interface ipv4 set dns name="${nic}" static ${dns}`
    output[0] = await runCmd(cmd);
    if (validIp(dns2)) {
      let cmd2 = `netsh interface ipv4 add dns name="${nic}" ${dns2} index=2`
      output[1] = await runCmd(cmd2);
    }
  }
  else {
    setDhcpDns(nic);
  }
  return output;
}
async function setStatic(nic, ip, mask, gateway = null, dns = null, dns2 = null) {
  let output = [];
  output[0] = await setStaticIp(nic, ip, mask, gateway);
  output[1] = await setStaticDns(nic, dns, dns2);
  return output
}
// Metric
async function setAutoMetric(nic) {
  await getNics();
  if (validNic(nic)) {
    let cmd = `netsh interface ipv4 set interface ${nic} metric=auto`
    return await runCmd(cmd);
  }
  return 'failed'
}
async function setStaticMetric(nic, metric = '') {
  await getNics();
  if (validNic(nic) && validMetric(metric)) {
    let cmd = `netsh interface ipv4 set interface ${nic} metric=${metric}`
    return await runCmd(cmd);
  }
  return 'failed'
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
// setStaticIp('Ethernet', '192.168.1.9', '255.255.255.0')
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
// setAutoMetric('Ethernet')
//   .then(output => {
//     console.log(`setAutoMetric: ${output}`)
//     getNics().then(nics => console.log(nics))
//   })
// setStaticMetric('Ethernet', '420')
//   .then(output => {
//     console.log(`setStaticMetric: ${output}`)
//     getNics().then(nics => console.log(nics))
//   })



// Export
exports.getNics = getNics;

exports.setDhcpIp = setDhcpIp;
exports.setDhcpDns = setDhcpDns;
exports.setDhcp = setDhcp;

exports.setStaticIp = setStaticIp;
exports.addStaticIp = addStaticIp;
exports.setStaticDns = setStaticDns;
exports.setStatic = setStatic;

exports.setAutoMetric = setAutoMetric;
exports.setStaticMetric = setStaticMetric;
