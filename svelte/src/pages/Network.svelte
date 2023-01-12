<!-- Javascript -->
<script>
  import { sortArrayByObjKey } from "../js/helper.js"
  import { ws } from "../js/ws.js"

  // Components
  import Icon from '../components/Icon.svelte'
  import Dialog from '../components/Dialog.svelte'
  import SetIP from '../components/SetIP.svelte'

  // Data
  let data = {
    "nics": [
      {
        "name": "Fake NIC",
        "interfaceMetric": "xx",
        "ipIsDhcp": false,
        "ip": "xxx.xxx.xxx.xxx",
        "mask": "xxx.xxx.xxx.xxx",
        "gateway": "xxx.xxx.xxx.xxx",
        "ipsAdded": [
          {
            "ip": 'xxx.xxx.xxx.xxx',
            "mask": 'xxx.xxx.xxx.xxx'
          }
        ],
        "dnsIsDhcp": false,
        "dns": [
          'xxx.xxx.xxx.xxx',
          'xxx.xxx.xxx.xxx'
        ],
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
    ],
    "nicSelected": {
      "name": "Fake NIC",
      "interfaceMetric": "xx",
      "ipIsDhcp": false,
      "ip": "xxx.xxx.xxx.xxx",
      "mask": "xxx.xxx.xxx.xxx",
      "gateway": "xxx.xxx.xxx.xxx",
      "ipsAdded": [
        {
          "ip": 'xxx.xxx.xxx.xxx',
          "mask": 'xxx.xxx.xxx.xxx'
        }
      ],
      "dnsIsDhcp": false,
      "dns": [
        'xxx.xxx.xxx.xxx',
        'xxx.xxx.xxx.xxx'
      ],
    },
    "setIp": {
      "show": false,
      "value": {
        "ip": "",
        "mask": "",
        "gateway": "",
        "dns": ["", ""],
      },
      "placeholder": {
        "ip": "192.168.1.2",
        "mask": "255.255.255.0",
        "gateway": "192.168.1.1",
        "dns": ["192.168.1.1", "1.1.1.1"],
      }
    },
    "presetDHCP": {
      "name": "DHCP",
      "ipIsDhcp": true,
      "dnsIsDhcp": true,
    },
    "presetSelected": {
      "name": "DHCP",
      "ipIsDhcp": true,
      "dnsIsDhcp": true,
    },
    "presetViewMode": "buttons",
    "presets": [
      {
        "name": "00",
        "ipIsDhcp": false,
        "ip": "192.168.0.9",
        "mask": "255.255.0.0",
        "gateway": "192.168.0.1",
        "dnsIsDhcp": false,
        "dns": [
          "192.168.0.1",
          "1.1.1.1"
        ]
      },
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

  // Functions
  function interfaceChange(event) {
    const selectValue = event.target.value
    data.nicSelected = data.nics.find(nic => nic.name === selectValue)
    console.log("Interface selected changed to", selectValue, data.nicSelected)
  }
  function presetActionNew() {
    // Set the placeholders of the SetIP form to the selected nic
    if (data.presetSelected.ipIsDhcp) {
      data.setIp.placeholder = {
        "ip": data.nicSelected.ip || "192.168.1.2",
        "mask": data.nicSelected.mask || "255.255.255.0",
        "gateway": data.nicSelected.gateway || "192.168.1.1",
      }
      data.setIp.placeholder.dns = [
        data.nicSelected.dns[0] || "192.168.1.1",
        data.nicSelected.dns[1] || "1.1.1.1",
      ]
      console.log("Open Popup to create a preset with the selected interface as the placeholders", data.setIp.placeholder)
    }
    // Set the placeholders of the SetIP form to the selected preset
    else {
      data.setIp.placeholder = {
        "ip": data.presetSelected.ip || "192.168.1.2",
        "mask": data.presetSelected.mask || "255.255.255.0",
        "gateway": data.presetSelected.gateway || "192.168.1.1",
      }
      data.setIp.placeholder.dns = [
        data.presetSelected.dns[0] || "192.168.1.1",
        data.presetSelected.dns[1] || "1.1.1.1",
      ]
      console.log("Open Popup to create a preset with the selected preset as the placeholders", data.setIp.placeholder)
    }
    // Show the SetIP form
    data.setIp.show = true
  }
  function presetActionSet() {
    if (data.presetSelected.name === "DHCP") {
      console.log(`Set ${data.nicSelected.name} to DHCP`)
      const body = { "nic": data.nicSelected.name }
      ws.send.event("/network/v1", "dhcp", body)
    }
    else {
      console.log(`Set ${data.nicSelected.name} to`, data.presetSelected)
      const body = {
        "nic": data.nicSelected.name,
        "ip": data.presetSelected.ip,
        "mask": data.presetSelected.mask,
        "gateway": data.presetSelected.gateway,
        "dns": data.presetSelected.dns
      }
      ws.send.event("/network/v1", "static", body)
    }
  }
  function presetActionAdd() {
    if (data.presetSelected.name === "DHCP") {
      console.log(`CAN NOT add DHCP to ${data.nicSelected.name}`)
    }
    else {
      console.log(`Add ${data.nicSelected.name} to`, data.presetSelected)
      const body = {
        "nic": data.nicSelected.name,
        "ip": data.presetSelected.ip,
        "mask": data.presetSelected.mask,
        "gateway": data.presetSelected.gateway,
        "dns": data.presetSelected.dns
      }
      ws.send.event("/network/v1", "static/add", body)
    }
  }
  function presetActionRemove() {
    data.presets = data.presets.filter(preset => preset.name !== data.presetSelected.name)
    data.presetSelected = data.presetDHCP
    savePresetsToLocalStorage()
    console.log("Remove selected preset from list", data.presetSelected)
  }
  function setIp_save(event) {
    const preset = JSON.parse(JSON.stringify(event.detail));
    preset.name = Date.now()
    preset.ipIsDhcp = false
    preset.dnsIsDhcp = false
    data.presets = [...data.presets, preset]
    data.setIp.show = false
    savePresetsToLocalStorage()
    console.log("SetIP popup saved new preset", preset)
  }
  function setIp_set(event) {
    const preset = {...event.detail, name: Date.now()}
    data.setIp.show = false
    console.log(`SetIP popup set ${data.nicSelected.name} to`, preset)
    const body = {
      "nic": data.nicSelected.name,
      "ip": preset.ip,
      "mask": preset.mask,
      "gateway": preset.gateway,
      "dns": preset.dns
    }
    ws.send.event("/network/v1", "static", body)
  }
  function presetChange(preset) {
    data.presetSelected = preset
    console.log("Selected preset changed to", data.presetSelected)
  }
  function presetChangeToDHCP() {
    data.presetSelected = data.presetDHCP
    console.log("Selected preset changed to DHCP", data.presetSelected)
  }
  function changePresetViewMode() {
    if (data.presetViewMode === "buttons") data.presetViewMode = "table"
    else if (data.presetViewMode === "table") data.presetViewMode = "buttons"
    else data.presetViewMode = "table"
    console.log("Preset View Mode Changed to", data.presetViewMode)
  }
  function sortBy(key) {
    data.presets = sortArrayByObjKey(data.presets, key)
    savePresetsToLocalStorage()
  }
  function getPresetsFromLocalStorage() {
    const networkPresetsLS = localStorage.getItem("networkPresets")
    if (networkPresetsLS === null || networkPresetsLS === "") {
      console.log("No presets in local storage. Using the default presets")
      return
    }
    const presets = JSON.parse(networkPresetsLS)
    if (presets.length === 0) {
      console.log("No presets in local storage. Using the default presets")
    }
    else {
      data.presets = presets
      console.log("Retrieved presets from local storage")
      console.table(presets)
    }
  }
  function savePresetsToLocalStorage() {
    localStorage.setItem("networkPresets", JSON.stringify(data.presets))
    console.log("Presets saved to local storage", data.presets)
  }

  // Receive server updates
  ws.send.subscribe("/network/v1")
  ws.receive.json(obj => {
    if (obj.name === '/network/v1') {
      const event = obj.event
      const body = obj.body
      console.log("EVENT", ">", obj.event, obj.body)

      // Received all nics
      if (event === "nics") {
        data.nics = body

        // First time receiving data
        if (data.nicSelected.name === "Fake NIC") {
          data.nicSelected = data.nics[0]
        }

        // Every other time
        else {
          data.nicSelected = data.nics.find(f => f.name === data.nicSelected.name)
        }

      }

    }
  })

  // Component Startup
  import { onMount, onDestroy } from 'svelte';
  let interval
  onMount(async () => {

    // Get all TCP clients
    ws.send.event("/network/v1", "nics")
    interval = setInterval(() => ws.send.event("/network/v1", "nics"), 1 * 1000);

    // Get the presets the client has saved in local storage
    getPresetsFromLocalStorage()

    // If the width of the screen is greater than 1200 show the presets in table form
    if (document.documentElement.offsetWidth > 1200) {
      data.presetViewMode = "table"
    }

  })
  onDestroy(async () => {
    clearInterval(interval)
  })

  // Debug
  // $: console.log("nics", data.nics)
  // $: console.log("nicSelected", data.nicSelected)
  // $: console.log("lines", data.lines)

</script>

<!-- HTML -->
<Dialog title="Create Network Preset" show={data.setIp.show} on:close={() => data.setIp.show = false}>
  <SetIP data={data.setIp} on:save={setIp_save} on:set={setIp_set}/>
</Dialog>
<article>

  <!-- Server Interfaces -->
  <aside class="grid">
    <h2>Server Interfaces</h2>

    <!-- NIC Select -->
    <label>
      Interface <br>
      <select on:input={interfaceChange}>
        {#each data.nics as nic}
          <option>{nic.name}</option>
        {/each}
      </select>
    </label>

    <!-- NIC Info -->
    <div class="nicInfo">
      <h3>{data.nicSelected.ip ?? "..."}</h3>
      <div>
        <div>Mask:</div>
        <div>{data.nicSelected.mask}</div>
      </div>
      <div>
        <div>Gate:</div>
        <div>{data.nicSelected.gateway ?? "None"}</div>
      </div>
      <br>
      {#if data.nicSelected.ipsAdded.length > 0}
        {#each  data.nicSelected.ipsAdded as ipAdd}
          <div class="flex bright">
            <div>+ IP:</div>
            <div>{ipAdd.ip}</div>
          </div>
          <div>
            <div>Mask:</div>
            <div>{ipAdd.mask}</div>
          </div>
          <br>
        {/each}
      {/if}
      {#if data.nicSelected.dns.length > 0}
        {#each data.nicSelected.dns as dns, i}
          <div>
            <div>DNS{i+1}:</div>
            <div>{dns}</div>
          </div>
        {/each}
      {/if}
      <br>
      <div>
        <div>DHCP:</div>
        <div>{data.nicSelected.ipIsDhcp}</div>
      </div>
      <div>
        <div>Metric:</div>
        <div>{data.nicSelected.interfaceMetric}</div>
      </div>
    </div>

  </aside>

  <!-- Preset Actions + Presets -->
  <section class="grid">

    <!-- Preset Actions -->
    <h2>Preset Actions</h2>
    <div class="flex">
      <button on:click={presetActionNew} class="flex cyan">
        New 
        <Icon name="square-plus" size=1/>
      </button>
      <button on:click={presetActionSet} class="flex green">
        Set 
        <Icon name="check" size=1/>
      </button>
      <button on:click={presetActionAdd} class="flex yellow">
        Add 
        <Icon name="plus" size=1/>
      </button>
      <button on:click={presetActionRemove} class="flex red">
        Remove
        <Icon name="trash" size=1/>
      </button>
    </div>

    <!-- Presets -->
    <h2>
      <button on:click={changePresetViewMode}>
        Select Preset
        <Icon name="arrows-rotate" size=.8 inline color="var(--color-text-dim)"/>
      </button>
    </h2>
    
    <!-- Preset Buttons View -->
    {#if data.presetViewMode === "buttons"}
      <div class="presetButtons">
        <button
          on:click={() => presetChangeToDHCP()}
          class={"DHCP" === data.presetSelected.name ? "presetSelected" : ""}
        >
          <h3>DHCP</h3>
          <span>Request an address</span>
          {#if "DHCP" === data.presetSelected.name}              
            <div class="checkmark">
              <Icon name="check"/>
            </div>
          {/if}
        </button>
        {#each data.presets as preset}
          <button
            on:click={() => presetChange(preset)}
            class={preset.name === data.presetSelected.name ? "presetSelected" : ""}
          >
            <h3>{preset.ip}</h3>
            <span>Mask: {preset.mask}</span>
            {#if preset.gateway}
              <span>Gate: {preset.gateway}</span>
            {/if}
            {#if preset.dns.length > 0}
              {#each preset.dns as dns, i}
                {#if preset.dns[i]}
                  <div>DNS{i+1}: {dns}</div>
                {/if}
              {/each}
            {/if}
            {#if preset.name === data.presetSelected.name}              
              <div class="checkmark">
                <Icon name="check"/>
              </div>
            {/if}
          </button>
        {/each}
      </div>

    <!-- Preset Table View -->
    {:else if data.presetViewMode === "table"}
      <div class="presetTable">
        <div>
          <span><button on:click={() => sortBy("ip")}>IP</button></span>
          <span><button on:click={() => sortBy("mask")}>Mask</button></span>
          <span><button on:click={() => sortBy("gateway")}>Gateway</button></span>
          <span><button on:click={() => sortBy("dns")}>DNS1</button></span>
          <span><button on:click={() => sortBy("dns")}>DNS2</button></span>
        </div>
        <button
          on:click={() => presetChangeToDHCP()}
          class={"DHCP" === data.presetSelected.name ? "presetSelected" : ""}
        >
          <span>DHCP</span>
          <span>-</span>
          <span>-</span>
          <span>-</span>
          <span>-</span>
          {#if "DHCP" === data.presetSelected.name}              
            <div class="checkmark">
              <Icon name="square-check"/>
            </div>
          {:else}
            <div class="checkmark">
              <Icon name="square-outline"/>
            </div>
          {/if}
        </button>
        {#each data.presets as preset}
          <button
            on:click={() => presetChange(preset)}
            class={preset.name === data.presetSelected.name ? "presetSelected" : ""}
          >
            <span>{preset.ip}</span>
            <span>{preset.mask}</span>
            <span>{preset.gateway || "-"}</span>
            <span>{preset.dns[0] || "-"}</span>
            <span>{preset.dns[1] || "-"}</span>
            {#if preset.name === data.presetSelected.name}              
              <div class="checkmark">
                <Icon name="square-check"/>
              </div>
            {:else}
              <div class="checkmark">
                <Icon name="square-outline"/>
              </div>
            {/if}
          </button>
        {/each}
      </div>
    {/if}

  </section>

</article>

<!-- CSS -->
<style>

  /* Sidebar */
  article {
    height: 100%;
    overflow: auto;
    display: flex;
  }
  aside {
    min-width: 15rem;
    padding: var(--gap);
    border-right: var(--border);
    border-color: var(--color-border-section);
  }
  section {
    flex-grow: 1;
    padding: var(--gap);
  }
  @media (max-width: 60rem) {
    article { 
      display: flex;
      flex-direction: column;
    }
    aside {
      padding: var(--gap);
      border-right: none;
      border-bottom: var(--border);
      border-color: var(--color-border-section);
    }
  }

  /* Nic Info */
  .nicInfo {
    display: grid;
    align-content: flex-start;
    font-family: var(--font-mono);
    font-size: 0.9rem;
  }
  .nicInfo div.bright {
    color: var(--color-text-bright);
  }
  .nicInfo div {
    display: flex;
    gap: var(--pad);
  }

  /* Presets */
  h2 button {
    display: flex;
    gap: var(--pad);
    padding: 0;
    background-color: transparent;
    border-radius: 0;
  }

  /* Preset Buttons */
  .presetButtons {
    display: flex;
    gap: var(--gap);
    font-family: var(--font-mono);
    font-size: 0.9rem;
    flex-wrap: wrap;
    overflow: auto;
  }
  .presetButtons button {
    width: 250px;
    text-align: left;
    display: grid;
    align-content: flex-start;
    padding: var(--pad);
    background-color: var(--color-bg-section);
    color: var(--color-text-dim);
    position: relative;
  }
  .presetButtons .presetSelected {
    color: var(--color-text-purple);
    background-color: var(--color-bg-purple);
    
    color: var(--color-text-input);
    background-color: var(--color-bg-input);
  }
  .presetButtons .presetSelected span:first-child {
    color: var(--color-text-purple);
    color: var(--color-text-bright);
  }
  .presetButtons .presetSelected .checkmark {
    position: absolute;
    top: var(--pad);
    right: var(--pad);
    color: var(--color-text-purple);
    color: var(--color-text-bright);
    font-size: 1.2rem;
  }

  /* Preset Table */
  .presetTable {
    display: grid;
    align-content: flex-start;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    overflow: auto;
  }
  .presetTable button {
    display: flex;
    gap: var(--gap);
    text-align: left;
    position: relative;
    background-color: var(--color-bg);
    color: var(--color-text);
    width: fit-content;
  }
  .presetTable > div:first-child {
    display: flex;
    gap: var(--gap);
    position: relative;
    background-color: var(--color-bg);
    width: fit-content;
    color: var(--color-text-bright);
    padding-bottom  : .25rem;
    border-bottom: var(--border);
    margin-bottom: .25rem;
    padding-right: 2rem;

    z-index: 1;
    position: sticky;
    top: 0;
  }
  .presetTable * span:nth-child(1) {
    margin-left: 2rem;
  }
  .presetTable * span {
    width: 8rem;
  }
  .presetTable .presetSelected {
    color: var(--color-text-input);
    background-color: var(--color-bg-input);
  }
  .presetTable .presetSelected .checkmark {
    position: absolute;
    top: var(--pad);
    left: var(--pad);
    font-size: 1.2rem;
  }
  .presetTable button:not(.presetSelected) .checkmark {
    position: absolute;
    top: var(--pad);
    left: var(--pad);
    font-size: 1.2rem;
    color: var(--color-text-dim);
  }
  @media (hover: hover) {
    .presetTable button:hover {
      background-color: var(--color-bg-section);
    }
    .presetTable button:hover {
      background-color: var(--color-bg-section);
    }
    .presetTable .presetSelected:hover {
      background-color: var(--color-bg-input);
    }
  }

</style>