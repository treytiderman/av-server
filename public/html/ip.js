// #region Global state

let serverData = {
  nics: [
    {
      "name": "Fake NIC",
      "interfaceMetric": "xx",
      "ipIsDhcp": false,
      "ip": "xxx.xxx.xxx.xxx",
      "mask": "xxx.xxx.xxx.xxx",
      "gateway": "xxx.xxx.xxx.xxx",
      "dnsIsDhcp": false,
      "dns": [
        'xxx.xxx.xxx.xxx',
        'xxx.xxx.xxx.xxx'
      ],
      "ipsAdded": [
        {
          "ip": 'xxx.xxx.xxx.xxx',
          "mask": 'xxx.xxx.xxx.xxx'
        }
      ]
    },
    {
      "name": "Fake WiFi",
      "interfaceMetric": "75",
      "ipIsDhcp": true,
      "ip": "10.0.1.69",
      "mask": "255.255.0.0",
      "gateway": "10.0.1.1",
      "dnsIsDhcp": true,
      "dns": [
        '10.0.1.5',
        '10.0.1.7'
      ],
      "ipsAdded": []
    },
    {
      "name": "Fake Ethernet",
      "interfaceMetric": "25",
      "ipIsDhcp": false,
      "ip": "192.168.1.9",
      "mask": "255.255.255.0",
      "gateway": "192.168.1.254",
      "dnsIsDhcp": false,
      "dns": [
        "192.168.1.1"
      ],
      "ipsAdded": [
        {
          "ip": "169.254.0.9",
          "mask": "255.255.0.0"
        },
        {
          "ip": "192.168.2.9",
          "mask": "255.255.255.0"
        },
        {
          "ip": "192.168.3.9",
          "mask": "255.255.255.0"
        }
      ]
    }
  ]
}
let clientData = {
  "nicSelected": "Fake NIC",
  "presetSelected": "DHCP",
  "presets": [
    {
      "name": "0",
      "ipIsDhcp": false,
      "ip": "192.168.0.9",
      "mask": "255.255.255.0",
      "gateway": "192.168.0.1",
      "dnsIsDhcp": false,
      "dns": [
        "192.168.0.1",
        "1.1.1.1"
      ]
    },
    {
      "name": "1",
      "ipIsDhcp": false,
      "ip": "192.168.1.9",
      "mask": "255.255.255.0",
      "gateway": "192.168.1.1",
      "dnsIsDhcp": false,
      "dns": [
        "192.168.1.1",
        "1.1.1.1"
      ]
    },
    {
      "name": "2",
      "ipIsDhcp": false,
      "ip": "192.168.2.9",
      "mask": "255.255.255.0",
      "gateway": "192.168.2.1",
      "dnsIsDhcp": false,
      "dns": [
        "192.168.2.1",
        "1.1.1.1"
      ]
    },
    {
      "name": "3",
      "ipIsDhcp": false,
      "ip": "192.168.3.9",
      "mask": "255.255.255.0",
      "gateway": "192.168.3.1",
      "dnsIsDhcp": false,
      "dns": [
        "192.168.3.1",
        "1.1.1.1"
      ]
    },
    {
      "name": "4",
      "ipIsDhcp": false,
      "ip": "192.168.1.9",
      "mask": "255.255.0.0",
      "gateway": "192.168.0.1",
      "dnsIsDhcp": false,
      "dns": [
        "192.168.0.1",
        "1.1.1.1"
      ]
    },
    {
      "name": "10",
      "ipIsDhcp": false,
      "ip": "10.0.0.9",
      "mask": "255.0.0.0",
      "gateway": "10.0.0.1",
      "dnsIsDhcp": false,
      "dns": [
        "10.0.0.1",
        "1.1.1.1"
      ]
    },
    {
      "name": "169",
      "ipIsDhcp": false,
      "ip": "169.254.0.9",
      "mask": "255.255.0.0",
      "gateway": "",
      "dnsIsDhcp": false,
      "dns": []
    },
    {
      "name": "172",
      "ipIsDhcp": false,
      "ip": "172.22.0.9",
      "mask": "255.255.0.0",
      "gateway": "172.22.0.2",
      "dnsIsDhcp": false,
      "dns": [
        "172.22.0.2",
        "1.1.1.1"
      ]
    }
  ]
}
const setIpTimer = 6000;

// #endregion

// #region Select Interface

// Elements
const nicSelect = document.getElementById('nicSelect');
const nicInfo = document.getElementById('nicInfo');
const nicEdit = document.getElementById('nicEdit');

// Functions
function updateNicSelect() {
  const nics = serverData.nics;
  // Remove old interfaces
  const options = nicSelect.options;
  for (let i = options.length; i >= 0; i--) nicSelect.remove(i);
  // Add new interfaces
  for (let i = 0; i < nics.length; i++) {
    let option = document.createElement("option");
    option.text = nics[i].name;
    options.add(option, i);
  }
  nicSelect.value = clientData.nicSelected;
}
function getNicByNicName(nics, nicName) {
  for (let i = 0; i < nics.length; i++) {
    if (nics[i].name === nicName) return nics[i];
  }
  return nics[0];
}
function updateNicSelected() {
  // Get the children of nicInfo and the selected NIC
  const child = nicInfo.children;
  const nic = getNicByNicName(serverData.nics, nicSelect.value);
  // Set each line
  child[0].innerText = nic.ip || '';
  child[1].innerText = `Mask: ${nic.mask || ''}`;
  // Show added IPs if this nic has multiple IPs
  child[2].innerHTML = '';
  if (nic.ipsAdded.length > 0) {    
    nic.ipsAdded.forEach(ipAdded => {
      const ipSpan = document.createElement('span');
      ipSpan.innerText = ipAdded.ip || '';
      ipSpan.classList = 'w70-t';
      child[2].appendChild(ipSpan);
      const maskSpan = document.createElement('span');
      maskSpan.innerText = `Mask: ${ipAdded.mask || ''}`;
      maskSpan.classList = 'w50-t t-sm mb-1';
      child[2].appendChild(maskSpan);
    });
  }
  child[3].innerText = `Gate: ${nic.gateway || ''}`;
  child[4].innerText = `DNS1: ${nic.dns[0] || ''}`;
  child[5].innerText = `DNS2: ${nic.dns[1] || ''}`;
  child[6].innerText = `Metric: ${nic.interfaceMetric || ''}`;
  // Add tool
  const tooltip = document.createElement('aside');
  tooltip.innerHTML = `
  Interface Metric / Priority <br> 
  <small>Which interface gets to the internet?</small> <br> <br>
  Click to edit `
  child[6].appendChild(tooltip);
}

// Events
nicSelect.addEventListener("change", () => {
  clientData.nicSelected = nicSelect.value;
  updateNicSelected();
  updateClientData();
});
nicEdit.addEventListener("click", () => {
  const nic = getNicByNicName(serverData.nics, clientData.nicSelected)
  setFb('ipAddr', 'none');
  setFb('subnetMask', 'none');
  setFb('gateway', 'none');
  setFb('dns1', 'none');
  setFb('dns2', 'none');
  ipAddr.value = nic.ip || '';
  subnetMask.value = nic.mask || '';
  gateway.value = nic.gateway || '';
  dns1.value = nic.dns[0] || '';
  dns2.value = nic.dns[1] || '';
})

// #endregion

// #region Then Preset

// Elements
const presetSet = document.getElementById('presetSet');
const presetAdd = document.getElementById('presetAdd');
const presetRemove = document.getElementById('presetRemove');
const presetCards = document.getElementById('presetCards');

// Functions
function disableAfterPost() {
  // Feedback for waiting
  showLoadingOverlay('nicInfo', setIpTimer);
  disable('presetSet', setIpTimer);
  disable('presetAdd', setIpTimer);
  disable('setIpBtn', setIpTimer);
}
function selectPresetButton(element) {
  const presets = [...presetCards.children];
  presets.forEach(preset => preset.classList = 'preset');
  element.classList = 'preset selected';
}
function createPresetButton(preset) {
  const button = document.createElement('button');
  button.classList = 'preset';
  button.id = `${preset.name}`;
  button.addEventListener('click', event => {
    clientData.presetSelected = preset.name;
    updateUI();
  })
  const spanIp = document.createElement('span');
  spanIp.innerText = `${preset.ip || ''}`;
  spanIp.classList = '';
  button.appendChild(spanIp);
  const spanMask = document.createElement('span');
  spanMask.innerText = `Mask: ${preset.mask || ''}`;
  spanMask.classList = 'w50-t t-sm';
  button.appendChild(spanMask);
  const spanGateway = document.createElement('span');
  spanGateway.innerText = `Gate: ${preset.gateway || ''}`;
  spanGateway.classList = 'w50-t t-sm';
  button.appendChild(spanGateway);
  const spanDns1 = document.createElement('span');
  spanDns1.innerText = `DNS1:  ${preset.dns[0] || ''}`;
  spanDns1.classList = 'w50-t t-sm';
  button.appendChild(spanDns1);
  const spanDns2 = document.createElement('span');
  spanDns2.innerText = `DNS2: ${preset.dns[1] || ''}`;
  spanDns2.classList = 'w50-t t-sm';
  button.appendChild(spanDns2);
  return button
}
function createDhcpButton() {
  const button = document.createElement('button');
  button.classList = 'preset';
  button.id = `presetDhcp`;
  button.addEventListener('click', event => {
    clientData.presetSelected = "DHCP";
    updateUI();
  })
  const spanIp = document.createElement('span');
  spanIp.innerHTML = `DHCP <br>`;
  spanIp.classList = '';
  button.appendChild(spanIp);
  const spanMask = document.createElement('span');
  spanMask.innerText = `Request an address`;
  spanMask.classList = 'w50-t t-sm';
  spanIp.appendChild(spanMask);
  return button
}
function createNewPresetButton() {
  const button = document.createElement('button');
  button.classList = 'preset w10-bdr w50-t';
  button.id = `presetNew`;
  button.addEventListener('click', event => {
    dialogOpen('popupNetworkSettings')
  })
  const spanIp = document.createElement('span');
  spanIp.innerHTML = `New Preset... <br>`;
  spanIp.classList = '';
  button.appendChild(spanIp);
  const spanMask = document.createElement('span');
  spanMask.innerText = `Create a new preset`;
  spanMask.classList = 'w50-t t-sm';
  spanIp.appendChild(spanMask);
  return button
}
function updatePresetButtons() {
  // Remove all presets
  presetCards.innerHTML = '';
  // Add DHCP preset
  const presetDhcp = createDhcpButton();
  presetCards.appendChild(presetDhcp);
  // Add back each preset
  clientData.presets.forEach(preset => {
    const ui = createPresetButton(preset);
    // Check if this preset is selected
    if (clientData.presetSelected === "DHCP") {
      selectPresetButton(presetDhcp);
    }
    else if (clientData.presetSelected === preset.name) {
      selectPresetButton(ui);
    }
    presetCards.appendChild(ui);
  });
  // Add DHCP preset
  const presetNew = createNewPresetButton();
  presetCards.appendChild(presetNew);
}
function removePresetButton() {
  // Return a new array without the selected preset
  const newArray = clientData.presets.filter(preset => {
    return preset.name !== clientData.presetSelected;
  })
  clientData.presets = newArray;
  clientData.presetSelected = "DHCP"
  updateUI();
}
function getSelectedPreset() {
  let selectedPreset = {};
  clientData.presets.forEach(preset => {
    if (preset.name === clientData.presetSelected) selectedPreset = preset
  });
  return selectedPreset;
}
function postSelectedPreset() {
  disableAfterPost();
  // Do the thing
  if (clientData.presetSelected === "DHCP") {
    let obj = { "nic": clientData.nicSelected }
    console.log('/api/net/dhcp', obj);
    post('/api/net/dhcp', obj);
  }
  else {
    const selectedPreset = getSelectedPreset();
    selectedPreset.nic = clientData.nicSelected
    console.log('/api/net/static', selectedPreset);
    post('/api/net/static', selectedPreset);
  }
}
function postSelectedPresetAdd() {
  disableAfterPost();
  // Do the thing
  if (clientData.presetSelected === "DHCP") {
    // Do nothing
  }
  else {
    const selectedPreset = getSelectedPreset();
    selectedPreset.nic = clientData.nicSelected
    console.log('/api/net/static/add', selectedPreset);
    post('/api/net/static/add', selectedPreset);
  }
}

// Events
presetSet.addEventListener('click', event => {
  postSelectedPreset();
})
presetAdd.addEventListener('click', event => {
  postSelectedPresetAdd();
})
presetRemove.addEventListener('click', event => {
  removePresetButton();
})

// #endregion

// #region Popup Network Settings

// Elements
const popupNetworkSettings = document.getElementById('presetSet');
const ipAddr = document.getElementById('ipAddr');
const subnetMask = document.getElementById('subnetMask');
const gateway = document.getElementById('gateway');
const dns1 = document.getElementById('dns1');
const dns2 = document.getElementById('dns2');
const setIpBtn = document.getElementById('setIpBtn');
const savePresetBtn = document.getElementById('savePresetBtn');

// Functions
function isNum(string) {
  if (typeof string != "string") return false;
  return !isNaN(string) && !isNaN(parseFloat(string))
}
function hasWhitespace(string) {
  if (typeof string != "string") return false;
  return /\s/.test(string);
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
function validateIp(id, required = false) {
  const element = document.getElementById(id);
  element.value = element.value.replaceAll('\t', '.');
  if (required && element.value === '') {
    setFb(id, 'error');
    return false;
  }
  else if (!required && element.value === '') {
    setFb(id, 'none');
    return true;
  }
  else if (validIp(element.value) === false) {
    setFb(id, 'error');
    return false;
  }
  else {
    element.value = element.value.replaceAll(' ', '');
    setFb(id, 'confirm');
    return true;
  }
}
function validateMask(id, required = false) {
  const element = document.getElementById(id);
  element.value = element.value.replaceAll('\t', '.');
  if (required && element.value === '') setFb(id, 'error');
  else if (!required && element.value === '') setFb(id, 'none');
  else if (validMask(element.value) === false) setFb(id, 'error');
  else {
    element.value = element.value.replaceAll(' ', '');
    setFb(id, 'confirm')
    return true;
  }
  return false;
}
function validPreset() {
  let validPre = true;
  if (validateIp(ipAddr.id, true) === false) validPre = false;
  if (validateMask(subnetMask.id, true) === false) validPre = false;
  if (validateIp(gateway.id) === false) validPre = false;
  if (validateIp(dns1.id) === false) validPre = false;
  if (validateIp(dns2.id) === false) validPre = false;
  return validPre;
}
function addPreset() {
  let preset = {
    "name": `${Date.now()}`,
    "ipIsDhcp": false,
    "ip": ipAddr.value,
    "mask": subnetMask.value,
    "gateway": gateway.value,
    "dnsIsDhcp": false,
    "dns": [
      dns1.value,
      dns2.value
    ]
  }
  clientData.presets.push(preset);
  updateUI();
  dialogClose('popupNetworkSettings')
}
function postPresetForm() {
  // Do the thing
  let preset = {
    "nic": clientData.nicSelected,
    "name": Date.now(),
    "ipIsDhcp": false,
    "ip": ipAddr.value,
    "mask": subnetMask.value,
    "gateway": gateway.value,
    "dnsIsDhcp": false,
    "dns": [
      dns1.value,
      dns2.value
    ]
  }
  if (validPreset()) {
    disableAfterPost();
    console.log('/api/net/static', preset);
    post('/api/net/static', preset);
    dialogClose('popupNetworkSettings');
  }
}

// Events
ipAddr.addEventListener('input', event => {
  validateIp(ipAddr.id, true);
})
subnetMask.addEventListener('input', event => {
  validateMask(subnetMask.id, true);
})
gateway.addEventListener('input', event => {
  validateIp(gateway.id);
})
dns1.addEventListener('input', event => {
  validateIp(dns1.id);
})
dns2.addEventListener('input', event => {
  validateIp(dns2.id);
})
setIpBtn.addEventListener('click', event => {
  postPresetForm();
})
savePresetBtn.addEventListener('click', event => {
  if (validPreset()) addPreset();
})

// #endregion

// #region Popup Gateway Priority / Interface Metric

// Elements
const interfaceMetricPopup = document.getElementById('interfaceMetricPopup');
const interfaceMetricName = document.getElementById('interfaceMetricName');
const interfaceMetricValue = document.getElementById('interfaceMetricValue');
const interfaceMetricSet = document.getElementById('interfaceMetricSet');

// Functions
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
function validateMetric(id) {
  const element = document.getElementById(id);
  if (element.value === '') {
    setFb(id, 'none');
    return true;
  }
  else if (validMetric(element.value) === false) {
    setFb(id, 'error');
    return false;
  }
  else {
    setFb(id, 'confirm');
    return true;
  }
}
function updateInterfaceMetric() {
  const nic = getNicByNicName(serverData.nics, clientData.nicSelected)
  if (interfaceMetricName.innerText !== nic.name) {
    interfaceMetricName.innerText = nic.name;
    interfaceMetricValue.value = nic.interfaceMetric;
    interfaceMetricValue.placeholder = nic.interfaceMetric;
  }
}
function postInterfaceMetric() {
  if (validateMetric(interfaceMetricValue.id)) {
    if (interfaceMetricValue.value === '') {
      let obj = {
        "nic": clientData.nicSelected,
      }
      console.log('/api/net/metric/auto', obj);
      post('/api/net/metric/auto', obj);
    }
    else {
      let obj = {
        "nic": clientData.nicSelected,
        "metric": interfaceMetricValue.value
      }
      console.log('/api/net/metric', obj);
      post('/api/net/metric', obj);
    }
    dialogClose('interfaceMetricPopup');
  }
}

// Events
interfaceMetricValue.addEventListener('input', event => {
  validateMetric(interfaceMetricValue.id)
})
interfaceMetricSet.addEventListener('click', event => {
  postInterfaceMetric();
})

// #endregion

// #region Update

// Variables
const updateRate = 1000;
// const updateRate = 2000000;

// Functions
function getClientData() {
  const clientDataLS = localStorage.getItem('clientData');
  if (clientDataLS === null) {
    localStorage.setItem('clientData', JSON.stringify(clientData))
  }
  else {
    clientData = JSON.parse(clientDataLS);
    clientData.presetSelected = "DHCP";
  }
}
function updateClientData() {
  localStorage.setItem('clientData', JSON.stringify(clientData))
}
function updateUI() {
  updateClientData();
  updatePresetButtons();
  updateInterfaceMetric();
}
async function updateServerData() {
  const newData = await get('/api/net/nics');
  // If failed to get new data
  if (newData === undefined) {
    createToast('Failed to reach server', 'error', false, updateRate-100);
    return true;
  }
  // If new data is different
  else if (newData !== serverData.nics) {
    serverData.nics = newData;
    return true;
  }
  return false;
}
async function update() {
  if (!document.hidden) {
    updateUI();
    if (await updateServerData()) {
      updateNicSelect();
      updateNicSelected();
    }
  }
}
async function startUp() {
  getClientData();
  await update();
  document.getElementById('nicSelect').focus();
  setInterval(() => update(), updateRate);
} 

// #endregion

startUp();
