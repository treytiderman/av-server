<!-- Javascript -->
<script>
  import { get, post } from "../js/helper.js"

  // Components
  import Icon from '../components/Icon.svelte'
  import Terminal from '../components/Terminal.svelte'
  
  // Data
  let data = {
    baudRates: [9600, 14400, 19200, 38400, 57600, 115200],
    serialports: [
      {
        path: "COM3",
      },
      {
        path: "COM4",
      },
    ],
    serialportSelected: {
      path: "COM3",
      isOpen: false,
      baudRate: 9600,
      delimiter: "\r\n",
      tx: [],
      txFail: [],
      rx: [],
      rxRaw: [],
      error: null,
      portObj: "for server use only"
    },
    settings: {
      devicePath: "COM3",
      baudRate: 9600,
      expectedDelimiter: "\\r\\n",
      encodingMode: "ascii",
      isOpen: false,
      placeholder: {
        baudRate: 9600,
        expectedDelimiter: "\\r\\n",
      },
    },
    lines: [
      {
        wasReceived: true,
        timestampISO: '2022-10-16T21:05:38.425Z',
        data: 'No data yet...',
      },
    ],
    sends: [
      {
        value: "ka 01 01\\r",
        placeholder: "ka 01 01\\r",
      },
      {
        value: "ka 01 00\\r",
        placeholder: "\xAA\x11\xFE\x01\x01\x11",
      },
      {
        value: "mc 01 02\\r",
        placeholder: "\x01\x30\x41\x30\x41\x30\x43\x02\x43\x32\x30\x33\x44\x36\x30\x30\x30\x31\x03\x73\x0D",
      },
    ],
  }

  // Functions
  function interfaceChange(event) {
    const selectValue = event.target.value
    data.nicSelected = data.nics.find(nic => nic.name === selectValue)
    console.log("Interface selected changed to", selectValue, data.nicSelected)
  }
  async function openConnection(path, baudRate, delimiter) {
    const body = {
      "path": path,
      "baudRate": baudRate,
      "delimiter": delimiter
    }
    // const openResponse = await post("/api/serial/v1/open", body)
    console.log("Open Connection", body)
  }
  async function closeConnection(path) {
    const body = { "path": path }
    // const openResponse = await post("/api/serial/v1/close", body)
    console.log("Close Connection", body)
  }
  async function toggleConnectionClick() {
    if (data.serialportSelected.isOpen) closeConnection(data.serialportSelected.path)
    else openConnection(data.settings.devicePath, data.settings.baudRate, data.settings.expectedDelimiter)
  }
  async function sendClick(text) {
    const body = {
      "path": data.settings.devicePath,
      "message": text,
      "messageType": data.settings.encodingMode,
      "cr": false,
      "lf": false
    }
    // const sendResponse = await post("/api/serial/v1/send", body)
    console.log("Send", body)
  }
  function updateLineData(port, encodingMode) {
    if (port?.data) {
      let linesFromServer = []
      // Add sends to the array
      if (encodingMode === "hex") {        
        port.data.forEach(data => {
          if (data.error !== "") data.hex += " <- " + data.error
          linesFromServer.push({
            wasReceived: data.wasReceived,
            timestampISO: data.timestampISO,
            data: data.hex,
          })
        })
      }
      else {
        port.data.forEach(data => {
          if (data.error !== "") data.ascii += " <- " + data.error
          linesFromServer.push({
            wasReceived: data.wasReceived,
            timestampISO: data.timestampISO,
            data: data.ascii,
          })
        })
      }
      // Set lines equal to the info from the server
      lines = linesFromServer
    }
  }

  // Terminal lines
  let lines
  $: updateLineData(data.settings.devicePath, data.settings.encodingMode)

  // Component Startup
  import { onMount } from 'svelte';
  let doneLoading = false
  onMount(async () => {

    // Is Online
    // const time = await get("/api/time")
    // console.log(time)

    // Available ports
    // const availablePortsResponse = await get("/api/serial/v1/availablePorts", "http://192.168.1.9:4620")
    // const availablePortsResponse = await get("/api/serial/v1/availablePorts")
    // Remove ports that don't have a serial number
    // availablePortsResponse.forEach(port => {
    //   if (port.serialNumber !== undefined) availablePorts = [...availablePorts, port];
    // })
    // Set the device select to the first available port
    // if (availablePorts.length > 0) devicePath = availablePorts[0].path

    // Device info
    // if (availablePorts.length > 0) {
    //   const body = { "path": devicePath }
    //   port = await post("/api/serial/v1/port", body, "http://192.168.1.9:4620")
    //   port = await post("/api/serial/v1/port", body)
    //   setInterval(async () => {
    //     const body = { "path": devicePath }
    //     port = await post("/api/serial/v1/port", body, "http://192.168.1.9:4620")
    //     port = await post("/api/serial/v1/port", body)
    //   }, 1 * 1000)
    // }

    // Startup complete
    doneLoading = true

  })

  // Debug
  // $: console.log("port", port)
  // $: console.log("lines", lines)

</script>

<!-- HTML -->
<article>

  <!-- Connection Settings -->
  <aside class="grid">
    <h2>Connection Settings</h2>
    <label>
      Device<br>
      <select on:input={interfaceChange} 
        disabled={data.serialportSelected.isOpen}>
        {#each data.serialports as port}
          <option>{port.path}</option>
        {/each}
      </select>
    </label>
    <label>
      Baud Rate<br>
      <select bind:value={data.settings.baudRate} 
        disabled={data.serialportSelected.isOpen}>
        {#each data.baudRates as baudRate}
          <option>{baudRate}</option>
        {/each}
      </select>
    </label>
    <label>
      Expected Delimiter<br>
      <input type="text" bind:value={data.settings.expectedDelimiter}
        placeholder={data.settings.placeholder.expectedDelimiter}
        disabled={data.serialportSelected.isOpen}>
    </label>
    <div>
      Encoding Mode<br>
      <div class="flex even">
        <button class={data.settings.encodingMode === "ascii" ? "" : "dim"}
          on:click={() => data.settings.encodingMode = "ascii"}
          disabled={data.serialportSelected.isOpen}>
          ASCII
        </button>
        <button class={data.settings.encodingMode === "hex" ? "" : "dim"}
          on:click={() => data.settings.encodingMode = "hex"}
          disabled={data.serialportSelected.isOpen}>
          HEX
        </button>
      </div>
    </div>
    {#if data.serialportSelected.isOpen}
      <button class="red" on:click={toggleConnectionClick}>Close</button>
    {:else}
      <button class="green" on:click={toggleConnectionClick}>Open</button>
    {/if}
    <div>
      <span class="dim">Carriage Return [CR] = \r or \x0D</span> <br>
      <span class="dim">Line Feed [LF] = \n or \x0A</span>
    </div>
  </aside>

  <!-- Terminal -->
  <section class="grid">
    <h2>Terminal</h2>
    <Terminal lines={data.lines}/>

    <!-- Sends -->
    <div class="grid">
      {#each data.sends as send}        
        <div class="flex nowrap">
          <input type="text" placeholder={send.placeholder} bind:value={send.value}>
          <button class="green" on:click={sendClick(send.value)}>Send</button>
        </div>
      {/each}
    </div>
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
    min-width: 300px;
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

  input,
  select {
    width: 100%;
  }

</style>