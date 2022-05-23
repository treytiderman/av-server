// Elements
const selectNic = document.getElementById('selectNic');
const nicInfo = document.getElementById('nicInfo');
const setIpBtn = document.getElementById('setIpBtn');
const addPresetBtn = document.getElementById('addPresetBtn');
const savePresetBtn = document.getElementById('savePresetBtn');
const presetCards = document.getElementById('presetCards');
const ipIsDhcp = document.getElementById('ipIsDhcp');
const ipIsStatic = document.getElementById('ipIsStatic');
const ipAddr = document.getElementById('ipAddr');
const subnetMask = document.getElementById('subnetMask');
const gateway = document.getElementById('gateway');
const setDhcp = document.getElementById('setDhcp');
const dnsIsDhcp = document.getElementById('dnsIsDhcp');
const dnsIsStatic = document.getElementById('dnsIsStatic');
const dns1 = document.getElementById('dns1');
const dns2 = document.getElementById('dns2');



// Classes
class Preset {
  constructor() {
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
  }
  // constructor(info) {
  //   this.name = null || info.name;
  //   this.ipIsDhcp = null || info.ipIsDhcp,
  //   this.ipAddr = null || info.ipAddr;
  //   this.subnet = {
  //     mask: null || info.subnet.mask,
  //     slash: null || info.subnet.slash
  //   }
  //   this.gateway = null || info.gateway;
  //   this.dnsIsDhcp = null || info.dnsIsDhcp,
  //   this.dnsServers = [] || info.dnsServers;
  // }
}



// Validate Preset **TODO**
function validatePreset(preset) {
  return preset
}

// Validate IP | xxx.xxx.xxx.xxx where xxx >= 0 and xxx <= 254 **TODO**
function validateIp(ip) {
  return ip
}



// Create a preset card
function uiPreset(preset) {
  const div = document.createElement('div');
  const input = document.createElement('input');
  input.type = 'radio';
  input.name = 'radioSet1';
  input.id = `${preset.name}`;
  input.classList = 'button';
  input.addEventListener('click', e => {
    let obj = PRESETS.find(o => o.name === preset.name);
    obj.nic = selectNic.value;
    post('/net/static', obj);
  })
  div.appendChild(input);
  const label = document.createElement('label');
  label.htmlFor = `${preset.name}`;
  label.classList = 'flex';
  div.appendChild(label);

  const divSpans = document.createElement('div');
  divSpans.classList = 'grid gap-0';
  divSpans.style.gap = 0
  label.appendChild(divSpans);
  const spanIp = document.createElement('span');
  spanIp.innerText = `${preset.ipAddr}`;
  spanIp.classList = '';
  divSpans.appendChild(spanIp);
  const spanMask = document.createElement('span');
  spanMask.innerText = `Mask: ${preset.subnet.mask}`;
  spanMask.classList = 'w50-t t-sm';
  divSpans.appendChild(spanMask);
  const spanGateway = document.createElement('span');
  spanGateway.innerText = `Gate: ${preset.gateway}`;
  spanGateway.classList = 'w50-t t-sm';
  divSpans.appendChild(spanGateway);
  const spanDns1 = document.createElement('span');
  spanDns1.innerText = `DNS1:  ${preset.dnsServers[0]}`;
  spanDns1.classList = 'w50-t t-sm';
  divSpans.appendChild(spanDns1);
  const spanDns2 = document.createElement('span');
  spanDns2.innerText = `DNS2: ${preset.dnsServers[1]}`;
  spanDns2.classList = 'w50-t t-sm';
  divSpans.appendChild(spanDns2);

  const aDelete = document.createElement('a');
  aDelete.classList = 'w50-t right hover-red';
  aDelete.addEventListener('click', () => {
    for (var i = PRESETS.length - 1; i >= 0; --i) {
      if (PRESETS[i].name === preset.name) {
        PRESETS.splice(i,1);
      }
    }
    uiPresetCards(PRESETS);
  })
  const iDelete = document.createElement('i');
  iDelete.classList = 'fa fa-trash';
  aDelete.appendChild(iDelete);
  label.appendChild(aDelete);

  return div
}

// Create the preset cards
function uiPresetCards(presets) {
  presetCards.innerHTML = '';
  for (let i = 0; i < presets.length; i++) {
    const preset = presets[i];
    const ui = uiPreset(preset);
    presetCards.appendChild(ui);
  }
  localStorage.setItem('PRESETS', JSON.stringify(presets))
}

// Update NIC info
function uiNicInfo(nics, nicName = 'Ethernet') {
  const options = selectNic.options;
  for (let i = options.length; i >= 0; i--) {
    selectNic.remove(i);
  }
  let index = 0;
  for (let i = 0; i < nics.length; i++) {
    let option = document.createElement("option");
    option.text = nics[i].name;
    options.add(option, i);
    if (nics[i].name === nicName) {index = i}
  }
  let lines = nicInfo.children;
  const nic = nics[index];
  selectNic.value = nic.name;
  lines[0].innerText = nic.ipAddr;
  lines[1].innerText = `Mask: ${nic.subnet.mask}`;
  lines[2].innerText = `Gate: ${nic.gateway}`;
  lines[3].innerText = `DNS1: ${nic.dnsServers[0]}`;
  lines[4].innerText = `DNS2: ${nic.dnsServers[1]}`;
}




// Save Preset
savePresetBtn.addEventListener('click', () => {
  let preset = new Preset();

  // IP?
  preset.ipIsDhcp = false;
  preset.ipAddr = ipAddr.value;
  preset.subnet.mask = subnetMask.value;
  preset.gateway = gateway.value;

  // DNS?
  preset.dnsIsDhcp = false;
  preset.dnsServers.push(dns1.value);
  preset.dnsServers.push(dns2.value);

  preset.name = Date.now();
  PRESETS.push(validatePreset(preset));
  uiPresetCards(PRESETS);

})


// Nics
function updateNics(name) {
  get('/net/nics')
    .then( nics => {
      uiNicInfo(nics, name);
    })
}
selectNic.addEventListener("change", () => {
  updateNics(selectNic.value);
  localStorage.setItem('defaultNic', selectNic.value)
});
setInterval(() => {
  if (!document.hidden) {
    updateNics(selectNic.value);
  }
}, 1000);
let defaultNic = localStorage.getItem('defaultNic');
if (defaultNic === null) {
  defaultNic = selectNic.value;
  localStorage.setItem('defaultNic', defaultNic)
}
updateNics(defaultNic);


// Presets
let ls = JSON.parse(localStorage.getItem('PRESETS'));
if (ls === null) {
  let presets = [
    {
      "name": 69,
      "ipIsDhcp": false,
      "ipAddr": "192.168.1.69",
      "subnet": {
        "mask": "255.255.255.0",
        "slash": null
      },
      "gateway": "192.168.1.1",
      "dnsIsDhcp": false,
      "dnsServers": [
        "192.168.1.1",
        "1.1.1.1"
      ]
    }
  ]
  ls = presets;
  localStorage.setItem('PRESETS', JSON.stringify(presets))
}
uiPresetCards(ls);
let PRESETS = ls;


setIpBtn.addEventListener('click', () => {
  let preset = new Preset();

  // IP?
  preset.ipIsDhcp = false;
  preset.ipAddr = ipAddr.value;
  preset.subnet.mask = subnetMask.value;
  preset.gateway = gateway.value;

  // DNS?
  preset.dnsIsDhcp = false;
  preset.dnsServers.push(dns1.value);
  preset.dnsServers.push(dns2.value);

  preset.name = Date.now();
  preset.nic = selectNic.value;
  post('/net/static', preset);
  uiPresetCards(PRESETS);

})

addPresetBtn.addEventListener('click', () => {

  get('/net/nics').then( nics => {
    let index = 0;
    for (let i = 0; i < nics.length; i++) {
      if (nics[i].name === selectNic.value) {index = i}
    }
    const nic = nics[index];

    // IP
    ipAddr.value = nic.ipAddr;
    subnetMask.value = nic.subnet.mask;
    gateway.value = nic.gateway;

    // DNS
    dns1.value = nic.dnsServers[0];
    dns2.value = nic.dnsServers[1];

  })

})

// DHCP Preset
setDhcp.addEventListener('click', () => {
  let obj = {nic: selectNic.value}
  post('/net/dhcp', obj);
})

