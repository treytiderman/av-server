// Require
const dhcpd = require('dhcp');
const { testMany } = require('./tests');

// Variables
let clients = [];
let server;
let serverRunning = false;
let serverOptions = {
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
  leasePeriod: 120, // sec
  renewalTime: 60,
  rebindingTime: 120,
  
  // timeServer: null,
  // nameServer: null,
  hostname: 'yo-dhcp-server-here',
  domainName: "lan",
}

// Functions
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

function setServer(ip) {
  if (validIPv4(ip)) serverOptions.server = ip;
}
function setRange(start, stop) {
  if (validIPv4(start) && validIPv4(stop)) serverOptions.range = [start, stop];
}
function setMask(mask) {
  if (validMask(mask)) serverOptions.netmask = mask;
}
function setGateway(gateway) {
  if (validIPv4(gateway)) serverOptions.router = [gateway];
}
function setDns(dns1, dns2) {
  if (validIPv4(dns1) && validIPv4(dns2)) serverOptions.dns = [dns1, dns2];
  else if (validIPv4(dns1)) serverOptions.dns = [dns1]
}
function setleasePeriod(time) {
  if (validleasePeriod(time)) {
    serverOptions.leasePeriod = time;
    serverOptions.renewalTime = time/2;
    serverOptions.rebindingTime = time;
  }
}

function setServerOptions(ip, rangeStart, rangeEnd, mask, gateway, dns1, dns2, leasePeriod) {
  if (serverRunning) { return 'STOP DHCP SERVER FIRST' }
  if (validIPv4(ip) && 
      validIPv4(rangeStart) && validIPv4(rangeEnd) &&
      validMask(mask) &&
      validIPv4(gateway) &&
      validIPv4(dns1) && validIPv4(dns2) &&
      validleasePeriod(leasePeriod)) {
    serverOptions.server = ip;
    serverOptions.range = [rangeStart, rangeEnd];
    serverOptions.netmask = mask;
    serverOptions.router = [gateway];
    serverOptions.dns = [dns1, dns2];
    serverOptions.leasePeriod = leasePeriod;
    serverOptions.renewalTime = leasePeriod/2;
    serverOptions.rebindingTime = leasePeriod;
    return 'OPTIONS SET';
  }
  return 'OPTIONS FAILED VALIDATION';
}

function parseState(state) {
  let c = [];
  console.log('\nDHCP client list updated...');
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
function start(options = serverOptions) {
  if (serverRunning) return true;
  server = dhcpd.createServer(options);
  server.on('message', (data) => {
    // console.log("message:");
    // console.log(data);
  });
  server.on('bound', (state) => {
    clients = parseState(state);
  });
  server.on("error", (err, data) => {
    // console.log("error:");
    // console.log(err, data);
  });
  server.on("listening", (sock) => {
    serverRunning = true;

    var address = sock.address();
    console.log("\nDHCP Server Started");
    console.log('- listening on: ' + address.address + ':' + address.port);
    console.log('- server ip:', options.server);
    console.log('- range:', options.range);
    console.log('- netmask:', options.netmask);
    console.log('- gateway:', options.router[0]);
    console.log('- dns:', options.dns);
    console.log('- leasePeriod:', options.leasePeriod);

  });
  server.on("close", () => {
    serverRunning = false;
    console.log("DHCP Server Stopped");
  });
  server.listen();
  return true;
}
function stop() {
  server.close();
  return false;
}

// Testing
function runTests() {
  testMany(stringIsNum, [
    { result:  true,  params: ['1'] },
    { result:  true,  params: ['0'] },
    { result:  true,  params: ['-1'] },
    { result:  true,  params: ['256'] },
    { result:  true,  params: ['9999'] },
    { result:  true,  params: ['9999999999999999999999999999999999999999999999'] },
    { result:  true,  params: ['0.00000000000000000000000000000000000000000001'] },
    { result:  true,  params: ['0.1'] },
    { result:  true,  params: ['1.0'] },
    { result: false,  params: [1] },
    { result: false,  params: [0] },
    { result: false,  params: [true] },
    { result: false,  params: [] },
    { result: false,  params: [' '] },
    { result: false,  params: [''] },
    { result: false,  params: ['0.1.0'] },
  ]);
  testMany(stringHasWhitespace, [
    { result:  true,  params: [' '] },
    { result:  true,  params: ['v v'] },
    { result: false,  params: [''] },
    { result: false,  params: ['0'] },
    { result: false,  params: ['OKAY'] },
    { result: false,  params: ['_'] },
    { result: false,  params: [true] },
    { result: false,  params: [0] },
    { result: false,  params: [42] },
    { result: false,  params: ['42', 'd d'] },
  ]);
  testMany(validIPv4, [
    { result:  true,  params: ['192.168.1.1'] },
    { result:  true,  params: ['192.168.1.199'] },
    { result:  true,  params: ['0.0.0.0'] },
    { result:  true,  params: ['255.255.255.255'] },
    { result: false,  params: [' 192.168.1.1'] },
    { result: false,  params: ['192.168.1. 1'] },
    { result: false,  params: ['192.168.256.1'] },
    { result: false,  params: ['192.168..1'] },
    { result: false,  params: ['192.168. .1'] },
    { result: false,  params: ['192.168. 1 .1'] },
    { result: false,  params: ['192.168.1.1.1'] },
    { result: false,  params: ['192.168.t.1'] },
    { result: false,  params: [''] },
    { result: false,  params: [undefined] },
    { result: false,  params: [null] },
  ]);
  testMany(validMask, [
    { result:  true,  params: ['255.255.255.0'] },
    { result:  true,  params: ['255.255.0.0'] },
    { result:  true,  params: ['255.0.0.0'] },
    { result: false,  params: ['255.255.255.255'] },
    { result: false,  params: ['255.255.256.0'] },
    { result: false,  params: ['255.255.t.0'] },
    { result: false,  params: ['255.0.255.0'] },
    { result: false,  params: ['255.128.255.0'] },
    { result: false,  params: [' 255.0.0.0'] },
    { result: false,  params: ['255.0. 0.0'] },
  ]);
  testMany(validleasePeriod, [
    { result:  true,  params: [60] },
    { result:  true,  params: [2**32-3] },
    { result: false,  params: [0] },
    { result: false,  params: ['3600'] },
    { result: false,  params: [false] },
    { result: false,  params: ['Toast'] },
    { result: false,  params: [2**32] },
  ]);
}
// runTests();

// Export
exports.start = start;
exports.stop = stop;

exports.setServerOptions = setServerOptions;

exports.clients = clients;
exports.serverRunning = serverRunning;
exports.serverOptions = serverOptions;

exports.runTests = runTests;
