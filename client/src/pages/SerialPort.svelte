<!-- Javascript -->
<script>
  import { get, post } from "../js/helper.js"

  // Components
  import Icon from '../components/Icon.svelte'
  import Terminal from '../components/Terminal.svelte'

  // Component Startup
  import { onMount } from 'svelte';
  let availablePorts = []
  let port = { isOpen: false }
  let doneLoading = false
  onMount(async () => {

    // Available ports
    const availablePortsResponse = await get("/api/serial/v1/availablePorts", "http://192.168.1.154:4620")
    // Remove ports that don't have a serial number
    availablePortsResponse.forEach(port => {
      if (port.serialNumber !== undefined) availablePorts = [...availablePorts, port];
    })
    // Set the device select to the first available port
    if (availablePorts.length > 0) devicePath = availablePorts[0].path

    // Device info
    if (availablePorts.length > 0) {
      const body = { "path": devicePath }
      port = await post("/api/serial/v1/port", body, "http://192.168.1.154:4620")
      setInterval(async () => {
        const body = { "path": devicePath }
        port = await post("/api/serial/v1/port", body, "http://192.168.1.154:4620")
      }, 1 * 1000)
    }

    // Startup complete
    doneLoading = true

  })

  // Connection Settings
  const baudRates = [9600, 14400, 19200, 38400, 57600, 115200]
  let devicePath
  let baudRate
  let expectedDelimiter = "\\r\\n"
  let encodingMode = "ascii"
  // let settings = {
  //   devicePath,
  //   baudRate: 9600,
  //   expectedDelimiter: "\\r\\n",
  //   encodingMode: "ascii",
  //   connectionIsOpen: false,
  // }
  async function openConnection(path, baudRate, delimiter) {
    const body = {
      "path": path,
      "baudRate": baudRate,
      "delimiter": delimiter
    }
    const openResponse = await post("/api/serial/v1/open", body, "http://192.168.1.154:4620")
  }
  async function closeConnection(path) {
    const body = { "path": path }
    const openResponse = await post("/api/serial/v1/close", body, "http://192.168.1.154:4620")
  }
  async function toggleConnectionClick() {
    if (port.isOpen) closeConnection(devicePath)
    else openConnection(devicePath, baudRate, expectedDelimiter)
  }

  // Sending
  let send1 = "ka 01 01\\r"
  let send2 = "ka 01 00\\r"
  let send3 = "mc 01 02\\r"
  async function sendClick(text) {
    const body = {
      "path": devicePath,
      "message": text,
      "messageType": encodingMode,
      "cr": false,
      "lf": false
    }
    const sendResponse = await post("/api/serial/v1/send", body, "http://192.168.1.154:4620")
  }
  
  // Terminal lines
  let lines
  $: updateLineData(port, encodingMode)
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

  // Debug
  $: console.log("port", port)
  // $: console.log("lines", lines)

</script>

<!-- HTML -->
<section>

  <!-- Connection Settings -->
  <aside>
    <h4>Connection Settings</h4>
    {#if availablePorts.length === 0 && doneLoading}
      <div>
        <Icon name="circle-exclamation" size=1 color="var(--color-bg-red)"/>
        <span style="color: var(--color-bg-red);">Plugin a USB serial device to get started</span>
      </div>
    {/if}
    <div class="connection-options">
      <label>
        Device<br>
        <select bind:value={devicePath}>
          {#if availablePorts.length === 0 && doneLoading}
            <option>COM1</option>
            <option>COM3</option>
            <option>/dev/ttyUSB0</option>
          {/if}
          {#each availablePorts as port}
            <option>{port.path}</option>
          {/each}
        </select>
      </label>
      <label>
        Baud Rate<br>
        <select bind:value={baudRate}>
          {#each baudRates as baudRate}
            <option>{baudRate}</option>
          {/each}
        </select>
      </label>
      <label>
        Expected Delimiter<br>
        <input type="text" placeholder="\r\n" bind:value={expectedDelimiter}>
      </label>
      <div>
        History<br>
        <div class="connection-ascii-hex">
          <button>Recall</button>
          <button>Hide</button>
        </div>
      </div>
      <div>
        Encoding Mode<br>
        <div class="connection-ascii-hex">
          <button class="connection-ascii" style="{encodingMode === "hex" ? "background-color: var(--color-bg-2);" : "color: var(--color-text-bright);"}" on:click={() => encodingMode = "ascii"}>ASCII</button>
          <button class="connection-hex" style="{encodingMode === "ascii" ? "background-color: var(--color-bg-2);" : "color: var(--color-text-bright);"}" on:click={() => encodingMode = "hex"}>HEX</button>
        </div>
      </div>
      {#if port.isOpen}
        <button class="connection-close" on:click={toggleConnectionClick}>Close</button>
      {:else}
        <button class="connection-open" on:click={toggleConnectionClick}>Open</button>
      {/if}
    </div>
    <div class="notes">
      <div>Caridge Return (CR) = \r or \x0D</div>
      <div>Line Feed (LF) = \n or \x0A</div>
    </div>
  </aside>

  <!-- Terminal -->
  <article>
    <h4>Terminal</h4>
    <Terminal lines={lines}/>

    <!-- Sends -->
    <div class="sends">
      <div>
        <input type="text" placeholder="fa 01 01\r" bind:value={send1}>
        <button on:click={sendClick(send1)}>Send</button>
      </div>
      <div>
        <input type="text" placeholder="\xAA\x11\xFE\x01\x01\x11" bind:value={send2}>
        <button on:click={sendClick(send2)}>Send</button>
      </div>
      <div>
        <input type="text" placeholder="\x01\x30\x41\x30\x41\x30\x43\x02\x43\x32\x30\x33\x44\x36\x30\x30\x30\x31\x03\x73\x0D" bind:value={send3}>
        <button on:click={sendClick(send3)}>Send</button>
      </div>
    </div>
  </article>

</section>

<!-- CSS -->
<style>
  section {
    /* padding: var(--gap); */
    /* max-width: 1200px; */
    margin: auto;
    display: grid;
    grid-template-columns: auto 1fr;
    flex-wrap: wrap;
    height: 100%;
    /* gap: var(--gap); */
    align-items: flex-start;
  }
  aside {
    padding: var(--gap);
    border-color: var(--color-header);
    display: grid;
    align-content: flex-start;
    height: 100%;
    gap: var(--gap);
  }
  article {
    padding: var(--gap);
    display: grid;
    align-content: flex-start;
    width: 100%;
    height: 100%;
    gap: var(--gap);
  }
  /* If width is less than 960px */
  @media (max-width: 960px) {
    section {
      grid-template-columns: 1fr;
    }
    aside {
      border-bottom: var(--border);
    }
  }
  /* If width is greater than 960px */
  @media (min-width: 960px) {
    aside {
      border-right: var(--border);
    }
  }

  /* Connection Settings */
  .connection-options {
    display: grid;
    gap: var(--gap);
    max-width: 400px;
  }
  .connection-open {
    color: var(--color-text-green);
    background-color: var(--color-bg-green);
  }
  .connection-close {
    color: var(--color-text-red);
    background-color: var(--color-bg-red);
  }
  .connection-ascii-hex {
    display: flex;
    width: 100%;
    gap: var(--gap);
  }
  .connection-ascii-hex > * {
    flex: 1 0 0%;
  }
  .connection-hex,
  .connection-ascii {
    color: var(--color-text-dim);
  }

  /* Sends */
  .sends {
    display: grid;
    gap: var(--gap);
    width: 100%;
  }
  .sends div {
    display: flex;
    gap: var(--gap);
  }
  .sends div button {
    background-color: var(--color-bg-green);
    color: var(--color-text-green);
  }
  
  .notes {
    color: var(--color-text-dim);
  }

  input,
  select {
    width: 100%;
  }

  /* .hide {display: none;} */
</style>