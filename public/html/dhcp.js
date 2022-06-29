// #region Global state

let serverData = {
  serverRunning: false,
  clients: [
    {
      address: 'xxx.xxx.xxx.xxx',
      leasePeriod: 3600,
      server: 'xxx.xxx.xxx.xxx',
      state: 'BOUND',
      bindTime: '2999-01-01T05:00:00.000Z',
      mac: 'AA-BB-CC-DD-EE-FF'
    },
    {
      address: 'xxx.xxx.xxx.xxx',
      leasePeriod: 3600,
      server: 'xxx.xxx.xxx.xxx',
      state: 'OFFERED',
      mac: '00-00-00-00-00-00'
    }
  ]
}
let clientData = {
  options: {
    ip: "192.168.1.9",
    rangeStart: "192.168.1.100",
    rangeEnd: "192.168.1.199",
    mask: "255.255.255.0",
    gateway: "192.168.1.254",
    dns1: "192.168.1.1",
    dns2: "1.1.1.1",
    leasePeriod: 120
  }
}

// #endregion

// #region Settings

// Elements
const serverStart = document.getElementById('serverStart');
const serverStop = document.getElementById('serverStop');

const serverIp = document.getElementById('serverIp');
const rangeStart = document.getElementById('rangeStart');
const rangeEnd = document.getElementById('rangeEnd');
const mask = document.getElementById('mask');
const gateway = document.getElementById('gateway');
const dns1 = document.getElementById('dns1');
const dns2 = document.getElementById('dns2');
const leasePeriod = document.getElementById('leasePeriod');

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

// Functions
function updateServerSettings() {
  // Convert string to number
  const leasePeriodNum = Number(leasePeriod.value);
  // Gather new option values
  const options = {
    ip: serverIp.value,
    rangeStart: rangeStart.value,
    rangeEnd: rangeEnd.value,
    mask: mask.value,
    gateway: gateway.value,
    dns1: dns1.value,
    dns2: dns2.value,
    leasePeriod: leasePeriodNum,
  }
  // Options are valid so save them to memory
  if (validateSettings(options) === 'OPTIONS VALID') {
    clientData.options = options;
    // Save clientData to local storage
    localStorage.setItem(document.location.href, JSON.stringify(clientData));
  }
}
function updateServerStatus(serverRunning) {
  if (serverRunning) {
    serverStart.classList = 'g10 g30-bdr g50-t'
    serverStart.innerText = 'Start Server?'
    serverStop.classList = 'r30'
    serverStop.innerText = 'Server stopped'
    enableElements(['serverIp','rangeStart','rangeEnd','mask','gateway','dns1','dns2','leasePeriod']);
  }
  else {
    serverStart.classList = 'g30'
    serverStart.innerText = 'Server Running...'
    serverStop.classList = 'r10 r30-bdr r50-t'
    serverStop.innerText = 'Stop server?'
    disableElements(['serverIp','rangeStart','rangeEnd','mask','gateway','dns1','dns2','leasePeriod']);
  }
}
function validateSettings(options) {
  if (validIPv4(options.ip) === false) return 'OPTION ip FAILED VALIDATION';
  if (validIPv4(options.rangeStart) === false) return 'OPTION rangeStart FAILED VALIDATION';
  if (validIPv4(options.rangeEnd) === false) return 'OPTION rangeEnd FAILED VALIDATION';
  if (validMask(options.mask) === false) return 'OPTION mask FAILED VALIDATION';
  if (validIPv4(options.gateway) === false) return 'OPTION gateway FAILED VALIDATION';
  if (validIPv4(options.dns1) === false) return 'OPTION dns1 FAILED VALIDATION';
  if (validIPv4(options.dns2) === false) return 'OPTION dns2 FAILED VALIDATION';
  if (validleasePeriod(options.leasePeriod) === false) return 'OPTION leasePeriod FAILED VALIDATION';
  return 'OPTIONS VALID';
}

// Events
serverStart.addEventListener("click", async () => {
  updateServerSettings();
  updateClientDataUI();
  console.log(validateSettings(clientData.options));
  if (validateSettings(clientData.options) === 'OPTIONS VALID') {
    const response = await post('/api/dhcp/serverOptions', clientData.options);
    if (response === 'OPTIONS SET') {
      serverData.serverRunning = await get('/api/dhcp/start');
      updateServerStatus(serverData.serverRunning);
    }
  }
});
serverStop.addEventListener("click", async () => {
  serverData.serverRunning = await get('/api/dhcp/stop');
  updateServerStatus(serverData.serverRunning);
});

// #endregion

// #region Clients

// Elements
const clientsDiv = document.getElementById('clientsDiv');

// Functions
function stringISOtoDateTime(string, leasePeriod) {
  const time = new Date(string);
  const expireTime = new Date(time.getTime() + leasePeriod * 1000);
  return expireTime.toLocaleString();
}
function createClientDiv(client) {
  const div = document.createElement('div');
  div.classList = 'w30-bdr grid pad radius gap-0 relative';
  const spanIp = document.createElement('span');
  spanIp.innerText = `${client.address || ''}`;
  spanIp.classList = 'w90-t';
  div.appendChild(spanIp);
  const spanMac = document.createElement('span');
  spanMac.innerText = `MAC: ${client.mac || ''}`;
  spanMac.classList = 'w50-t t-sm';
  div.appendChild(spanMac);
  if (client.state === 'BOUND') {
    const spanExpires = document.createElement('span');
    const string = stringISOtoDateTime(client.bindTime, client.leasePeriod)
    spanExpires.innerText = `EXP: ${string || ''}`;
    spanExpires.classList = 'w50-t t-sm';
    div.appendChild(spanExpires);
  }
  else if (client.state === 'OFFERED') {
    const spanOffered = document.createElement('span');
    spanOffered.classList = 'w50-t t-sm';
    spanOffered.innerText = `Address offered`;
    spanIp.classList = 'w50-t';
    div.appendChild(spanOffered);
  }
  return div
}
function updateClients(clients) {
  clientsDiv.innerHTML = '';
  clients.forEach(client => {
    const div = createClientDiv(client);
    clientsDiv.appendChild(div)
  });
}

// #endregion

// #region Update Loop

// Variables
let updateRate = 1000;
updateRate = 100000;

// Functions
async function updateOnStartUp() {
  updateServerSettings()
}
async function updateClientDataUI() {
  // Set local data
  localStorage.setItem(document.location.href, JSON.stringify(clientData))
}
async function updateServerDataUI() {
  updateClients(serverData.clients);
}
async function update() {
  if (!document.hidden) {
    // Update ui elements that only need local/client data
    updateClientDataUI();
    // Update ui elements that require server data
    const newServerData = {
      clients: await get('/api/dhcp/clients'),
      serverRunning: await get('/api/dhcp/serverRunning'),
    }
    getServerData(newServerData);
    updateServerDataUI();
  }
}

// Constant Functions
async function getServerData(newData) {
  Object.keys(newData).forEach(key => {
    // If failed to get new data
    if (newData[key] === 'REQUEST FAILED') {
      // createToast(`Failed to get ${key}`, 'error', false, updateRate-100);
      // console.log(`FAILED TO GET ${key}`);
    }
    // Save the newData to local object serverData
    else {
      serverData[key] = newData[key];
    }
  });
  return 'OK';
}
async function startUp() {
  // Load client data from local storage
  const clientDataLS = localStorage.getItem(document.location.href);
  // If there is no local data, set it
  if (clientDataLS === null) localStorage.setItem(document.location.href, JSON.stringify(clientData))
  else clientData = JSON.parse(clientDataLS);
  // Start the update loop
  updateOnStartUp();
  await update();
  setInterval(() => update(), updateRate);
} 
startUp();

// #endregion
