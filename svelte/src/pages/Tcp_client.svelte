<!-- Javascript -->
<script>
  import { validIPv4, validPort } from "../js/helper.js"
  import { settings } from "../js/settings.js"
  import { ws } from "../js/ws.js"

  // Components
  import Icon from '../components/Icon.svelte'
  import Terminal from '../components/Terminal.svelte'

  // Constants
  const NEW_CONNECTION = {
    isOpen: false,
    ip: "192.168.1.246",
    port: 23,
    address: "New Connection",
    expectedDelimiter: "\\r",
    history: [],
    error: "not a real connection"
  }
  const NO_LINES = {
    wasReceived: true,
    timestampISO: '1970-01-01T00:00:00.000Z',
    data: 'No data yet...',
  }
  const HEX_SPACER = $settings.hex_spacer || " "

  // Data
  $: data = {
    clearHistory: true,
    clientSelected: NEW_CONNECTION,
    clients: [
      {
        isOpen: false,
        ip: "192.168.1.1",
        port: 23,
        address: "New Connection",
        expectedDelimiter: "\\r\\n",
        history: [],
        error: "not a real connection"
      },
      {
        isOpen: false,
        ip: "192.168.1.9",
        port: 5000,
        address: "192.168.1.9:5000",
        expectedDelimiter: "\\r\\n",
        history: [],
        error: "not a real connection"
      },
      {
        isOpen: true,
        ip: "192.168.1.246",
        port: 23,
        address: "192.168.1.246:23",
        expectedDelimiter: "\\r",
        history: [
          {
            "wasReceived": false,
            "timestampISO": "2022-12-24T13:37:26.915Z",
            "hex": "4d563f0d",
            "ascii": "MV?\r",
            "buffer": {
              "type": "Buffer",
              "data": [77,86,63,13]
            },
            "error": null,
            "address": "192.168.1.246:23"
          },
          {
            "wasReceived": true,
            "timestampISO": "2022-12-24T13:37:26.949Z",
            "hex": "4d5634300d",
            "ascii": "MV40\r",
            "buffer": {
              "type": "Buffer",
              "data": [77,86,52,48,13]
            },
            "error": null,
            "address": "192.168.1.246:23"
          },
          {
            "wasReceived": true,
            "timestampISO": "2022-12-24T13:37:26.997Z",
            "hex": "4d564d41582039380d",
            "ascii": "MVMAX 98\r",
            "buffer": {
              "type": "Buffer",
              "data": [77,86,77,65,88,32,57,56,13]
            },
            "error": null,
            "address": "192.168.1.246:23"
          }
        ],
        error: "not a real connection"
      }
    ],
    feedback: {
      message: "",
      error: "",
      color: "dim"
    },
    opened: "",
    settings: {
      client: "New Connection",
      isOpen: false,
      ip: "192.168.1.42",
      port: 5000,
      expectedDelimiter: "\\r\\n",
      encodingMode: "ascii",
      placeholder: {
        ip: "192.168.1.9",
        port: 23,
        expectedDelimiter: "\\r\\n",
      },
    },
    lines: [NO_LINES],
    sends: [
      {
        value: "MV?\\r",
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
  function changeClient(client) {
    data.settings.client = client
    updateSettings()
    updateLines()
  }
  function changeEncoding(mode) {
    data.settings.encodingMode = mode
    updateLines()
  }
  function updateSettings() {
    if (data.settings.client === "New Connection") {
      data.clientSelected = NEW_CONNECTION
      data.settings.isOpen = false
      console.log("Interface selected updated to", "New Connection")
    }
    else {
      const newClient = data.clients.find(client => client.address === data.settings.client)
      data.clientSelected = newClient
      data.settings.ip = newClient.ip
      data.settings.port = newClient.port
      data.settings.expectedDelimiter = newClient.expectedDelimiter
      data.settings.isOpen = newClient.isOpen
      console.log("Interface selected updated to", data.settings)
    }
  }
  function updateLines() {
    if (data.clientSelected.history.length > 0) {
      // Add sends to the array
      let linesFromServer = []

      // HEX
      if (data.settings.encodingMode === "hex") {        
        data.clientSelected.history.forEach(data => {

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
        data.clientSelected.history.forEach(data => {

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
  function connectionToggle() {
    if (data.settings.isOpen) connectionClose()
    else {
      data.opened = `${data.settings.ip}:${data.settings.port}`
      connectionOpen()
    }
  }
  function connectionOpen() {
    const body = {
      "ip": data.settings.ip,
      "port": data.settings.port,
      "expectedDelimiter": data.settings.expectedDelimiter,
    }
    ws.send.event("/tcp/client/v1", "open", body)
    console.log("Open Connection", body)
  }
  function connectionClose() {
    const body = {
      "ip": data.settings.ip,
      "port": data.settings.port,
    }
    ws.send.event("/tcp/client/v1", "close", body)
    console.log("Close Connection", body)
  }
  function sendMessage(message) {
    const body = {
      "ip": data.settings.ip,
      "port": data.settings.port,
      "data": message,
      "encoding": data.settings.encodingMode,
      "cr": false,
      "lf": false
    }
    if (data.clientSelected.isOpen) {
      ws.send.event("/tcp/client/v1", "send", body)
      console.log("Send", body)
    }
    else {
      console.log("Send FAILED, client not open", body)
    }
  }
  function clearHistory() {
    data.clearHistory = true
    const client = data.clients.find(findClient => findClient.address === data.clientSelected.address)
    client.history = []
    updateLines()
  }
  function getClients() {
    data.clearHistory = false
    ws.send.event("/tcp/client/v1", "getClients")
  }

  // Receive server updates
  ws.send.subscribe("/tcp/client/v1")
  ws.receive.json(obj => {
    if (obj.name === '/tcp/client/v1') {
      const bodyIsArray = Array.isArray(obj.body)
      const addresses = bodyIsArray ? obj.body.map(client => client.address) : false
      const address = obj.body?.address || addresses
      const event = obj.event
      const body = obj.body
      console.log("EVENT", event, "ADDRESS(S)", address, "BODY", body)

      // Received all TCP clients
      if (event === "getClients") {

        // First time receiving updated TCP Clients. Replace placeholder data
        if (data.clients[1].error === "not a real connection") {
          data.clients = [ NEW_CONNECTION ]
          body.forEach(client => {
            if (data.clearHistory) client.history = []
            data.clients = [...data.clients, client]
          })
        }

        // Received updated TCP Clients
        else {
          body.forEach(newClient => {
            const client = data.clients.find(findClient => newClient.address === findClient.address)
            if (client === undefined) {
              if (data.clearHistory) client.history = []
              data.clients = [...data.clients, newClient]
            }
            else {
              client.isOpen = newClient.isOpen
              client.ip = newClient.ip
              client.port = newClient.port
              client.error = newClient.error
              client.expectedDelimiter = newClient.expectedDelimiter
              client.history = []
              if (!data.clearHistory) client.history = newClient.history ?? []
            }
          })
          updateSettings()
          updateLines()
        }

      }

      // Received "open" event
      else if (event === "open") {
  
        // Show UI Feedback
        data.feedback = {
          message: `Client ${address} opened`,
          error: body.error,
          color: `green`,
        }

        if (body.isOpen === true && body.error === null) {

          // Update client with body data
          const client = data.clients.find(findClient => findClient.address === body.address)
          if (client === undefined) {
            if (data.clearHistory) body.history = []
            data.clients = [...data.clients, body]
          }
          else {
            client.isOpen = body.isOpen
            client.ip = body.ip
            client.port = body.port
            client.error = body.error
            client.expectedDelimiter = body.expectedDelimiter
            client.history = []
            if (!data.clearHistory) client.history = body.history ?? []
          }

          // This web page tried to open this client and should switch to it
          if (body.address === data.opened) changeClient(body.address)
        }
      }

      // Received "close" event
      else if (event === "close") {

        // Show UI Feedback
        data.feedback = {
          message: `Client ${address} closed`,
          error: body.error,
          color: `red`,
        }

        if (body.isOpen === false && body.error === null) {

          // Update client with body data
          const client = data.clients.find(findClient => findClient.address === body.address)
          if (client === undefined) {
            if (data.clearHistory) body.history = []
            data.clients = [...data.clients, body]
          }
          else {
            client.isOpen = body.isOpen
            client.ip = body.ip
            client.port = body.port
            client.error = body.error
            client.expectedDelimiter = body.expectedDelimiter
            client.history = []
            if (!data.clearHistory) client.history = body.history ?? []
          }
          changeClient(data.clientSelected.address)
        }
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
        const client = data.clients.find(findClient => findClient.address === body.address)
        if (client === undefined) ws.send.event("/tcp/client/v1", "getClients")
        else client.history = [...client.history, body]
        updateLines()
      }

      // Received "receive" event
      else if (event === "receive") {
        const client = data.clients.find(findClient => findClient.address === body.address)
        if (client === undefined) ws.send.event("/tcp/client/v1", "getClients")
        else client.history = [...client.history, body]
        updateLines()
      }

    }
  })

  // Component Startup
  import { onMount } from 'svelte'
  let doneLoading = false
  onMount(async () => {

    // Get all TCP clients
    ws.send.event("/tcp/client/v1", "getClients")

    // Startup complete
    doneLoading = true

  })

  // Debug
  // $: console.log("clients", data.clients)
  // $: console.log("clientSelected", data.clientSelected)
  // $: console.log("lines", data.lines)


</script>

<!-- HTML -->
<article>

  <!-- Settings -->
  <aside class="grid">
    <h2>Settings</h2>
    <label>
      Clients <br>
      <select on:input={event => changeClient(event.target.value)} class="mono" bind:value={data.settings.client}>
        <!-- <option>New Connection</option> -->
        {#each data.clients as client}
          <!-- {#if client.isOpen} -->
            <option>{client.address}</option>
          <!-- {/if} -->
        {/each}
      </select>
    </label>
    <label>
      IP Address <br>
      <input type="text" class="fill mono"
        class:error={!validIPv4(data.settings.ip) && data.settings.ip !== ""}
        on:keyup={event => { if (event.key === "p") data.settings.ip = data.settings.placeholder.ip }}
        bind:value={data.settings.ip} placeholder={data.settings.placeholder.ip}
        disabled={data.settings.isOpen}>
      {#if !validIPv4(data.settings.ip) && data.settings.ip !== ""}
        <div class="flex error-message">
          <Icon name="circle-exclamation"/>
          <small>{validIPv4(data.settings.ip, true)}</small>
        </div>
      {/if}
    </label>
    <label>
      Port <br>
      <input type="number" class="fill mono"
        class:error={!validPort(data.settings.port) && data.settings.port !== ""}
        on:keyup={event => { if (event.key === "p") data.settings.port = data.settings.placeholder.port }}
        bind:value={data.settings.port} placeholder={data.settings.placeholder.port}
        disabled={data.settings.isOpen}>
      {#if !validPort(data.settings.port) && data.settings.port !== ""}
        <div class="flex error-message">
          <Icon name="circle-exclamation"/>
          <small>{validPort(data.settings.port, true)}</small>
        </div>
      {/if}
    </label>
    <label>
      Expected Delimiter<br>
      <input type="text" class="fill mono" bind:value={data.settings.expectedDelimiter}
        placeholder={data.settings.placeholder.expectedDelimiter}
        disabled={data.settings.isOpen}>
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
      <button class="green"
        on:click={connectionToggle}
        disabled={!(validIPv4(data.settings.ip) && validPort(data.settings.port))}
      >
        Open
      </button>
    {/if}
    <div class="dim">
      <span>Carriage Return [CR] = \r or \x0D</span> <br>
      <span>Line Feed [LF] = \n or \x0A</span>
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
            on:click={() => sendMessage(send.value)}
            disabled={!data.settings.isOpen}
          >
            Send
          </button>
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

  select,
  input {
    width: 100%;
  }

</style>