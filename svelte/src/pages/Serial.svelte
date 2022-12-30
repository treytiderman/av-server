<!-- Javascript -->
<script>
  import { settings } from "../js/settings.js"
  import { ws } from "../js/ws.js"

  // Components
  import Icon from '../components/Icon.svelte'
  import Terminal from '../components/Terminal.svelte'
  
  // Constants
  const NO_LINES = {
    wasReceived: true,
    timestampISO: '1970-01-01T00:00:00.000Z',
    data: 'No data yet...',
  }
  const HEX_SPACER = $settings.hex_spacer || " "
  
  // Data
  let data = {
    baudRates: [9600, 14400, 19200, 38400, 57600, 115200],
    serialports: [
      {
        path: "COM5",
        isOpen: false,
        baudRate: 9600,
        expectedDelimiter: "\r\n",
        history: [],
        historyRaw: [],
        error: "not a real connection"
      },
      {
        path: "COM6",
        isOpen: false,
        baudRate: 9600,
        expectedDelimiter: "\r\n",
        history: [],
        historyRaw: [],
        error: "not a real connection"
      },
    ],
    serialportSelected: {
      path: "COM5",
      isOpen: false,
      baudRate: 9600,
      expectedDelimiter: "\r\n",
      history: [],
      historyRaw: [],
      error: "not a real connection",
      portObj: "for server use only"
    },
    settings: {
      devicePath: "COM5",
      baudRate: 9600,
      expectedDelimiter: "\\r\\n",
      encodingMode: "ascii",
      isOpen: false,
      placeholder: {
        baudRate: 9600,
        expectedDelimiter: "\\r\\n",
      },
    },
    clearHistory: true,
    feedback: {
      message: "",
      error: "",
      color: "dim"
    },
    lines: [NO_LINES],
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
  function changeDevice(path) {
    data.settings.devicePath = path
    updateSettings()
    updateLines()
  }
  function changeEncoding(mode) {
    data.settings.encodingMode = mode
    updateLines()
  }
  function connectionOpen(path, baudRate, delimiter) {
    const body = {
      "path": path,
      "baudRate": baudRate,
      "expectedDelimiter": delimiter
    }
    ws.send.event("/serial/v1", "open", body)
    console.log("Open Connection", body)
  }
  function updateSettings() {
    data.serialportSelected = data.serialports.find(o => o.path === data.settings.devicePath)
    data.settings.isOpen = data.serialportSelected.isOpen
    data.settings.baudRate = data.serialportSelected.baudRate
    data.settings.expectedDelimiter = data.serialportSelected.expectedDelimiter
  }
  function updateLines() {
    if (data.serialportSelected.history.length > 0) {
      // Add sends to the array
      let linesFromServer = []

      // HEX
      if (data.settings.encodingMode === "hex") {        
        data.serialportSelected.history.forEach(data => {

          // Build HEX string with a spacer
          let hexString = HEX_SPACER !== " " ? HEX_SPACER : ""
          if (data.hex !== "") {
            const hexArray = data.hex.match(/.{1,2}/g)
            hexString += hexArray.join(HEX_SPACER)
          }
          else hexString = ""

          // Add error
          if (data.error !== null) data.hex += " <- " + data.error
          
          // Push to array
          linesFromServer.push({
            wasReceived: data.wasReceived,
            timestampISO: data.timestampISO,
            data: hexString,
          })

        })
      }

      // ASCII
      else {
        data.serialportSelected.history.forEach(data => {

          // Add error
          if (data.error !== null) data.ascii += " <- " + data.error

          // Push to array
          linesFromServer.push({
            wasReceived: data.wasReceived,
            timestampISO: data.timestampISO,
            data: data.ascii,
          })

        })
      }
      // Set lines equal to the info from the server
      data.lines = linesFromServer
    }
    else {
      data.lines = [NO_LINES]
    }
  }
  function connectionClose(path) {
    const body = { "path": path }
    ws.send.event("/serial/v1", "close", body)
    console.log("Close Connection", body)
  }
  function connectionToggle() {
    if (data.serialportSelected.isOpen) connectionClose(data.serialportSelected.path)
    else connectionOpen(data.settings.devicePath, data.settings.baudRate, data.settings.expectedDelimiter)
  }
  function sendClick(text) {
    const body = {
      "path": data.settings.devicePath,
      "data": text,
      "encoding": data.settings.encodingMode,
      "cr": false,
      "lf": false
    }
    if (data.serialportSelected.isOpen) {
      ws.send.event("/serial/v1", "send", body)
      console.log("Send", body)
    }
    else {
      console.log("Send FAILED, client not open", body)
    }
  }
  function clearHistory() {
    data.clearHistory = true
    const i = data.serialports.findIndex(o => o.path === data.serialportSelected.path)
    if (i !== -1) {
      data.serialports[i].history = []
      data.serialports[i].historyRaw = []
      data.serialports = data.serialports
    }
    updateSettings()
    updateLines()
  }
  function getClients() {
    data.clearHistory = false
    ws.send.event("/serial/v1", "ports")
  }

  // Receive server updates
  ws.receive.json(obj => {
    if (obj.name === '/serial/v1') {
      const event = obj.event
      const body = obj.body
      console.log("EVENT", ">", obj.event, obj.body)

      // Received all ports
      if (event === "available") {

        // First time receiving available ports. Replace placeholder data
        if (data.serialports[0].error === "not a real connection") {
          data.serialports = []
          body.forEach(port => {
            data.serialports.push({
              path: port.path,
              isOpen: false,
              baudRate: 9600,
              expectedDelimiter: "\r\n",
              history: [],
              historyRaw: [],
              error: null
            })
          })
          data.settings.devicePath = data.serialports[0].path
          ws.send.event("/serial/v1", "ports")
          updateSettings()
          updateLines()
        }
        else {

          // New device plugged in
          body.forEach(port => {
            const i = data.serialports.findIndex(o => o.path === port.path)
            if (i === -1) {
              data.serialports.push({
                path: port.path,
                isOpen: false,
                baudRate: 9600,
                expectedDelimiter: "\r\n",
                history: [],
                historyRaw: [],
                error: null
              })
              data.serialports = data.serialports
            }
          })

          // Device removed
          data.serialports.forEach(port => {
            const i = body.findIndex(o => o.path === port.path)
            if (i === -1) {
              data.serialports.splice(i, 1)
            }
            data.serialports = data.serialports
          })

          updateSettings()
        }
      }

      // Received "ports" event
      else if (event === "ports") {
        Object.keys(body).forEach(path => {
          const i = data.serialports.findIndex(o => o.path === path)

          // New data for an available port
          if (i > -1) {
            data.serialports[i].path = body[path].path
            data.serialports[i].isOpen = body[path].isOpen
            data.serialports[i].baudRate = body[path].baudRate
            data.serialports[i].expectedDelimiter = body[path].expectedDelimiter
            data.serialports[i].error = body[path].error
            if (!data.clearHistory) {
              data.serialports[i].history = body[path].history
              data.serialports[i].historyRaw = body[path].historyRaw
            }
          }
  
          updateSettings()
          updateLines()
        })
      }

      // Received "open" event
      else if (event === "open") {
  
        // Show UI Feedback
        data.feedback = {
          message: `Port ${body.path} opened`,
          error: body.error,
          color: `green`,
        }

        // Update port to show open
        if (body.isOpen === true && body.error === null) {
          const i = data.serialports.findIndex(o => o.path === body.path)
          if (i > -1) {
            data.serialports[i].isOpen = body.isOpen
            data.serialports[i].baudRate = body.baudRate
            data.serialports[i].error = body.error
            data.serialports[i].expectedDelimiter = body.expectedDelimiter
          }
        }

        updateSettings()
      }

      // Received "close" event
      else if (event === "close") {

        // Show UI Feedback
        data.feedback = {
          message: `Port ${body.path} closed`,
          error: body.error,
          color: `red`,
        }

        // Update port to show closed
        if (body.isOpen === false && body.error === null) {
          const i = data.serialports.findIndex(o => o.path === body.path)
          if (i > -1) {
            data.serialports[i].isOpen = body.isOpen
            data.serialports[i].baudRate = body.baudRate
            data.serialports[i].error = body.error
            data.serialports[i].expectedDelimiter = body.expectedDelimiter
          }
        }

        updateSettings()
      }

      // Received "error" event
      else if (event === "error") {

        // Show UI Feedback
        data.feedback = {
          message: `Client ${address} error`,
          error: body.error,
          color: `red`,
        }

      }

      // Received "send" event
      else if (event === "send") {
        const i = data.serialports.findIndex(o => o.path === body.path)
          if (i > -1) {
            data.serialports[i].history = [...data.serialports[i].history, body]
          }
        updateLines()
      }

      // Received "receive" event
      else if (event === "receive") {
        const i = data.serialports.findIndex(o => o.path === body.path)
          if (i > -1) {
            data.serialports[i].history = [...data.serialports[i].history, body]
          }
        updateLines()
      }

    }
  })

  // Component Startup
  import { onMount } from 'svelte'
  let doneLoading = false
  onMount(async () => {

    // Get all ports
    ws.send.event("/serial/v1", "available")
    // setInterval(() => ws.send.event("/serial/v1", "available"), 2 * 1000);
    

    // Startup complete
    doneLoading = true

  })

  // Debug
  // $: console.log("serialports", data.serialports)
  // $: console.log("serialportSelected", data.serialportSelected)
  // $: console.log("lines", data.lines)

</script>

<!-- HTML -->
<article>

  <!-- Connection Settings -->
  <aside class="grid">
    <h2>Connection Settings</h2>
    <label>
      Device<br>
      <select on:input={event => changeDevice(event.target.value)} class="mono">
        {#each data.serialports as port}
          <option>{port.path}</option>
        {/each}
      </select>
    </label>
    <label>
      Baud Rate<br>
      <select bind:value={data.settings.baudRate} class="mono"
        disabled={data.serialportSelected.isOpen}>
        {#each data.baudRates as baudRate}
          <option>{baudRate}</option>
        {/each}
      </select>
    </label>
    <label>
      Expected Delimiter<br>
      <input type="text" class="mono" bind:value={data.settings.expectedDelimiter}
        placeholder={data.settings.placeholder.expectedDelimiter}
        disabled={data.serialportSelected.isOpen}>
    </label>
    <div>
      Encoding Mode<br>
      <div class="flex even">
        <button class={data.settings.encodingMode === "ascii" ? "" : "dim"}
          on:click={() => changeEncoding("ascii")}>
          ASCII
        </button>
        <button class={data.settings.encodingMode === "hex" ? "" : "dim"}
          on:click={() => changeEncoding("hex")}>
          HEX
        </button>
      </div>
    </div>
    <div>
      History<br>
      <div class="flex even">
        <button on:click={getClients}>
          Pull
        </button>
        <button on:click={clearHistory}>
          Clear
        </button>
      </div>
    </div>
    {#if data.settings.isOpen}
      <button class="red" on:click={connectionToggle}>Close</button>
    {:else}
      <button class="green" on:click={connectionToggle}>Open</button>
    {/if}
    <div>
      <span class="dim">Carriage Return [CR] = \r or \x0D</span> <br>
      <span class="dim">Line Feed [LF] = \n or \x0A</span>
    </div>
    <div>
      <span class={data.feedback.color}>{data.feedback.message}</span> <br>
      <span class={data.feedback.color}>{data.feedback.error || ""}</span>
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
          <input type="text" class="mono" placeholder={send.placeholder} bind:value={send.value}>
          <button class="green"
            on:click={sendClick(send.value)}
            disabled={!data.settings.isOpen}
          >
            Send</button>
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