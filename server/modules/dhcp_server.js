// Require
const dhcpd = require('dhcp');
const events = require('events')

// Variables
const emitter = new events.EventEmitter()
let server;
let serverState = {
  running: false,
  options: {
    // System settings
    range: [
      "192.168.1.100", "192.168.1.200"
    ],
  
    // forceOptions: ['hostname'], // Options that need to be sent, even if they were not requested
    // static: {
    //  "F4:BE:EC:BA:42:BE": "192.168.1.49"
    // },
  
    // Option settings
    netmask: '255.255.255.0',
    router: ['192.168.1.1'],
    dns: ["192.168.1.1", "1.1.1.1"],
    server: '192.168.1.9', // This is us
    leaseTime: 120, // sec
    renewalTime: 60,
    rebindingTime: 120,
    
    // timeServer: null,
    // nameServer: null,
    hostname: 'yo-dhcp-server-here',
    domainName: "lan",
  },
  clients: []
}

// Helper Functions
function stringIsNum(string) {
  if (typeof string != "string") return false;
  return !isNaN(string) && !isNaN(parseFloat(string))
}
function stringHasWhitespace(string) {
  if (typeof string != "string") return false;
  return /\s/.test(string);
}
function validIPv4(ip) {
  let validI = true;
  if (ip === null || ip === undefined) return false;
  const split = ip.split(".");
  const periodCount = split.length - 1;
  // Rules
  if (periodCount !== 3) validI = false;
  else {
    // Each octet
    for (let i = 0; i < split.length; i++) {
      // Is number
      if (stringIsNum(split[i]) === false) validI = false;
      // Check for white space
      else if (stringHasWhitespace(split[i])) validI = false;
      // Number is in ip range 0-255
      const num = Number(split[i]);
      if (num < 0 || num > 255) validI = false;
    } 
  }
  return validI;
}
function validMask(mask) {
  let validM = true;
  if (mask === null || mask === undefined) return false;
  const split = mask.split(".");
  const periodCount = split.length - 1;
  // Rules
  if (periodCount !== 3) validM = false;
  else {
    // Each octet
    for (let i = 0; i < split.length; i++) {
      // Is number
      if (stringIsNum(split[i]) === false) validM = false;
      // Check for white space
      else if (stringHasWhitespace(split[i])) validM = false;
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
function validleasePeriod(time) {
  // leasePeriod is a unsigned 32bit int
  if (typeof time != "number") return false;
  if (time === null || time === undefined) return false
  if (time > 0 && time < 2 ** 32 - 2) return true;
  return false;
}

// Set Server Options
function setServer(ip) {
  if (validIPv4(ip)) serverState.options.server = ip;
}
function setRange(start, stop) {
  if (validIPv4(start) && validIPv4(stop)) serverState.options.range = [start, stop];
}
function setMask(mask) {
  if (validMask(mask)) serverState.options.netmask = mask;
}
function setGateway(gateway) {
  if (validIPv4(gateway)) serverState.options.router = [gateway];
}
function setDns(dns1, dns2) {
  if (validIPv4(dns1) && validIPv4(dns2)) serverState.options.dns = [dns1, dns2];
  else if (validIPv4(dns1)) serverState.options.dns = [dns1]
}
function setleasePeriod(time) {
  if (validleasePeriod(time)) {
    serverState.options.leaseTime = time;
    serverState.options.renewalTime = time/2;
    serverState.options.rebindingTime = time;
  }
}
function setOptions(ip, rangeStart, rangeEnd, mask, gateway, dns1, dns2, leasePeriod) {
  if (serverState.running) { return 'STOP DHCP SERVER FIRST' }
  if (validIPv4(ip) && 
      validIPv4(rangeStart) && validIPv4(rangeEnd) &&
      validMask(mask) &&
      validIPv4(gateway) &&
      validIPv4(dns1) && validIPv4(dns2) &&
      validleasePeriod(leasePeriod)) {
    serverState.options.server = ip;
    serverState.options.range = [rangeStart, rangeEnd];
    serverState.options.netmask = mask;
    serverState.options.router = [gateway];
    serverState.options.dns = [dns1, dns2];
    serverState.options.leaseTime = leasePeriod;
    serverState.options.renewalTime = leasePeriod/2;
    serverState.options.rebindingTime = leasePeriod;
    return 'OPTIONS SET';
  }
  return 'OPTIONS FAILED VALIDATION';
}

// Start and Stop the Server
function parseState(state) {
  let c = [];
  console.log('DHCP client list updated...');
  for (let i = 0; i < Object.keys(state).length; i++) {
    const mac = Object.keys(state)[i];
    let client = Object.values(state)[i];
    client.mac = mac;
    c[i] = client;
    if (client.bindTime !== null) {
      console.log('- IP address', client.address, 'given to', client.mac, 'at', client.bindTime.toLocaleString());
    }
    else if (client.state === 'OFFERED') {
      console.log('- IP address', client.address, 'offered to', client.mac);
    }
  }
  return c;
}
function start(options = serverState.options) {
  if (serverState.running) return false;
  server = dhcpd.createServer(options);
  server.on('message', (data) => {
    // console.log("message:");
    // console.log(data);
    // Emit event
    emitter.emit('message', serverState.data)
  });
  server.on('bound', (state) => {
    serverState.clients = parseState(state);
    // Emit event
    emitter.emit('clients', serverState.clients)
  });
  server.on("error", (err, data) => {
    // console.log("error:");
    // console.log(err, data);
    
    // Emit event
    emitter.emit('error', err)
  });
  server.on("listening", (sock) => {
    serverState.running = true;

    var address = sock.address();
    console.log("DHCP Server Started");
    console.log('- listening on: ' + address.address + ':' + address.port);
    console.log('- server ip:', options.server);
    console.log('- range:', options.range);
    console.log('- netmask:', options.netmask);
    console.log('- gateway:', options.router[0]);
    console.log('- dns:', options.dns);
    console.log('- leasePeriod:', options.leaseTime);

    // Emit event
    emitter.emit('listening', serverState.running)

  });
  server.on("close", () => {
    serverState.running = false;
    console.log("DHCP Server Stopped");

    // Emit event
    emitter.emit('close', serverState.running)
  });
  server.listen(67, options.server);
  return true;
}
function stop() {
  if (serverState.running === false) return false;
  server.close();
  serverState.running = false;
  serverState.clients = [];
  return true;
}

// Export
exports.emitter = emitter
exports.state = serverState;
exports.start = start;
exports.stop = stop;
exports.setOptions = setOptions;