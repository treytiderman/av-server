<!-- Javascript -->
<script>
  import { validIPv4, validMask, validLeasePeriod } from "../js/helper.js"
  import { ws } from "../js/ws.js"

  // Import Components
  import Icon from '../components/Icon.svelte'

  // Data
  const data = {
    running: false,
    value: {
      ip: "192.168.1.9",
      mask: "255.255.255.0",
      gateway: "192.168.1.1",
      dns: ["192.168.1.1", "1.1.1.1"],
      rangeStart: "192.168.1.100",
      rangeEnd: "192.168.1.199",
      leasePeriod_sec: 3600,
    },
    placeholder: {
      ip: "192.168.1.9",
      mask: "255.255.255.0",
      gateway: "192.168.1.1",
      dns: ["192.168.1.1", "1.1.1.1"],
      rangeStart: "192.168.1.100",
      rangeEnd: "192.168.1.199",
      leasePeriod_sec: 3600,
    },
    clientsViewMode: "cards",
    clients: [
      {
        ip: "xxx.xxx.xxx.xxx",
        mac: "FF:FF:FF:FF:FF:FF",
        expires: "When lease expires"
      },
      {
        ip: "192.168.1.110",
        mac: "00:D8:61:1A:8E:7B",
        expires: "Expires 6/26/2022, 9:53:42 AM"
      },
      {
        ip: "192.168.1.112",
        mac: "00:D8:61:1A:8E:7B",
        expires: "Address offered"
      },
    ],
  }

  // Functions
  function changeClientsViewMode() {
    if      (data.clientsViewMode === "cards")  data.clientsViewMode = "table"
    else if (data.clientsViewMode === "table")  data.clientsViewMode = "cards"
    else                                        data.clientsViewMode = "table"
    console.log("Clients View Mode Changed to", data.clientsViewMode)
  }
  function startDhcpServer() {
    const options = {
      ip: data.value.ip,
      mask: data.value.mask,
      gateway: data.value.gateway,
      dns1: data.value.dns[0],
      dns2: data.value.dns[1],
      rangeStart: data.value.rangeStart,
      rangeEnd: data.value.rangeEnd,
      leasePeriod: Number(data.value.leasePeriod_sec),
    }
    ws.send.event("/dhcp/server/v1", "options", options)
    console.log("DHCP Server options sent", options)
    setTimeout(() => {
      ws.send.event("/dhcp/server/v1", "start")
      console.log("DHCP Server Started")
    }, 100);
  }
  function stopDhcpServer() {
    ws.send.event("/dhcp/server/v1", "stop")
    ws.send.event("/dhcp/server/v1", "clients")
    console.log("DHCP Server Stopped")
  }
  function stringISOtoDateTime(string, leasePeriod) {
    const time = new Date(string)
    const expireTime = new Date(time.getTime() + leasePeriod * 1000)
    return expireTime.toLocaleString()
  }

  ws.receive.json(obj => {
    if (obj.name === '/dhcp/server/v1') {
      const event = obj.event
      const body = obj.body
      console.log("EVENT", ">", obj.event, obj.body)
  
      // Received all clients
      if (event === "clients") {
        data.clients = []
        body.forEach(client => {
          const newClient = {
            ip: client.address,
            mac: client.mac.replace(/-/g, ":"),
            expires: stringISOtoDateTime(client.bindTime, client.leasePeriod),
          }
          data.clients = [...data.clients, newClient]
        })
      }

      else if (event === "listening") {
        data.running = body
      }

      else if (event === "running") {
        data.running = body
      }

      else if (event === "close") {
        data.running = body
      }

    }
  })

  // Component Startup
  import { onMount } from 'svelte'
  onMount(async () => {

    // Get DHCP clients
    ws.send.event("/dhcp/server/v1", "clients")
    ws.send.event("/dhcp/server/v1", "running")

    // If the width of the screen is greater than 1200 show the presets in table form
    if (document.documentElement.offsetWidth > 1200) {
      data.clientsViewMode = "table"
    }

  })

</script>

<!-- HTML -->
<article>
  <aside class="grid">
    <h2>Server Settings</h2>

    <!-- On / Off -->
    <div class="flex even">
      <button class="dim" class:green={data.running}
        disabled={!(
          validIPv4(data.value.ip) &&
          validIPv4(data.value.rangeStart) &&
          validIPv4(data.value.rangeEnd) &&
          validMask(data.value.mask) &&
          validIPv4(data.value.gateway) &&
          validIPv4(data.value.dns[0]) &&
          validIPv4(data.value.dns[1]) &&
          validLeasePeriod(data.value.leasePeriod_sec)
        )}
        on:click={startDhcpServer}>
        {data.running ? "Running..." : "Start"}
      </button>
      <button class="dim" class:red={!data.running}
        on:click={stopDhcpServer}>
        {data.running ? "Stop" : "Off"}
      </button>
    </div>

    <!-- Settings -->
    <div class="grid">
      <div class="flex even break-md">
        <label>
          Server's static IP <br>
          <input type="text" class="fill mono"
            class:error={!validIPv4(data.value.ip) && data.value.ip !== ""}
            on:keyup={event => { if (event.key === "p") data.value.ip = data.placeholder.ip }}
            bind:value={data.value.ip} placeholder={data.placeholder.ip}>
          {#if !validIPv4(data.value.ip) && data.value.ip !== ""}
            <div class="flex error-message">
              <Icon name="circle-exclamation"/>
              <small>{validIPv4(data.value.ip, true)}</small>
            </div>
          {/if}
        </label>
        <label>
          Lease Period (sec) <br>
          <input type="number" class="fill mono"
            class:error={!validLeasePeriod(data.value.leasePeriod_sec) && data.value.leasePeriod_sec !== null}
            on:keyup={event => { if (event.key === "p") data.value.leasePeriod_sec = data.placeholder.leasePeriod_sec }}
            bind:value={data.value.leasePeriod_sec} placeholder={data.placeholder.leasePeriod_sec}>
          {#if !validLeasePeriod(data.value.leasePeriod_sec) && data.value.leasePeriod_sec !== null}
            <div class="flex error-message">
              <Icon name="circle-exclamation"/>
              <small>{validLeasePeriod(data.value.leasePeriod_sec, true)}</small>
            </div>
          {/if}
        </label>
      </div>
      <div class="flex even break-md">
        <label>
          Range Start <br>
          <input type="text" class="fill mono"
            class:error={!validIPv4(data.value.rangeStart) && data.value.rangeStart !== null}
            on:keyup={event => { if (event.key === "p") data.value.rangeStart = data.placeholder.rangeStart }}
            bind:value={data.value.rangeStart} placeholder={data.placeholder.rangeStart}>
          {#if !validIPv4(data.value.rangeStart) && data.value.rangeStart !== null}
            <div class="flex error-message">
              <Icon name="circle-exclamation"/>
              <small>{validIPv4(data.value.rangeStart, true)}</small>
            </div>
          {/if}
        </label>
        <label>
          Range End <br>
          <input type="text" class="fill mono"
            class:error={!validIPv4(data.value.rangeEnd) && data.value.rangeEnd !== null}
            on:keyup={event => { if (event.key === "p") data.value.rangeEnd = data.placeholder.rangeEnd }}
            bind:value={data.value.rangeEnd} placeholder={data.placeholder.rangeEnd}>
          {#if !validIPv4(data.value.rangeEnd) && data.value.rangeEnd !== null}
            <div class="flex error-message">
              <Icon name="circle-exclamation"/>
              <small>{validIPv4(data.value.rangeEnd, true)}</small>
            </div>
          {/if}
        </label>
      </div>
      <div class="flex even break-md">
        <label>
          Subnet Mask <br>
          <input type="text" class="fill mono"
            class:error={!validMask(data.value.mask) && data.value.mask !== null}
            on:keyup={event => { if (event.key === "p") data.value.mask = data.placeholder.mask }}
            bind:value={data.value.mask} placeholder={data.placeholder.mask}>
          {#if !validMask(data.value.mask) && data.value.mask !== null}
            <div class="flex error-message">
              <Icon name="circle-exclamation"/>
              <small>{validMask(data.value.mask, true)}</small>
            </div>
          {/if}
        </label>
        <label>
          Gateway <br>
          <input type="text" class="fill mono" 
            class:error={!validIPv4(data.value.gateway) && data.value.gateway !== null}
            on:keyup={event => { if (event.key === "p") data.value.gateway = data.placeholder.gateway }}
            bind:value={data.value.gateway} placeholder={data.placeholder.gateway}>
          {#if !validIPv4(data.value.gateway) && data.value.gateway !== null}
            <div class="flex error-message">
              <Icon name="circle-exclamation"/>
              <small>{validIPv4(data.value.gateway, true)}</small>
            </div>
          {/if}
        </label>
      </div>
      <div class="flex even break-md">
        <label>
          DNS 1 <br>
          <input type="text" class="fill mono" 
            class:error={!validIPv4(data.value.dns[0]) && data.value.dns[0] !== null}
            on:keyup={event => { if (event.key === "p") data.value.dns[0] = data.placeholder.dns[0] }}
            bind:value={data.value.dns[0]} placeholder={data.placeholder.dns[0]}>
          {#if !validIPv4(data.value.dns[0]) && data.value.dns[0] !== null}
            <div class="flex error-message">
              <Icon name="circle-exclamation"/>
              <small>{validIPv4(data.value.dns[0], true)}</small>
            </div>
          {/if}
        </label>
        <label>
          DNS 2 <br>
          <input type="text" class="fill mono" 
            class:error={!validIPv4(data.value.dns[1]) && data.value.dns[1] !== null}
            on:keyup={event => { if (event.key === "p") data.value.dns[1] = data.placeholder.dns[1] }}
            bind:value={data.value.dns[1]} placeholder={data.placeholder.dns[1]}>
          {#if !validIPv4(data.value.dns[1]) && data.value.dns[1] !== null}
            <div class="flex error-message">
              <Icon name="circle-exclamation"/>
              <small>{validIPv4(data.value.dns[1], true)}</small>
            </div>
          {/if}
        </label>
      </div> 
    </div>

  </aside>
  <section class="grid">
    <h2>
      <button on:click={(changeClientsViewMode)}>
        Client Addresses
        <Icon name="arrows-rotate" size=.8 style="display: inline;" color="var(--color-text-dim)"/>
      </button>
    </h2>
    <div class="flex mono {data.clientsViewMode}">
      {#if data.clientsViewMode === "table"}        
        <div>
          <span>IP Address</span>
          <span>Mac Address</span>
          <span>Expires</span>
        </div>
      {/if}
      {#each data.clients as client}
        <div class="grid">
          <span>{client.ip}</span>
          <span>{client.mac}</span>
          <span>{client.expires}</span>
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
    width: 30rem;
    flex-grow: 0;
    flex-shrink: 0;
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
      width: auto;
      padding: var(--gap);
      border-right: none;
      border-bottom: var(--border);
      border-color: var(--color-border-section);
    }
  }
    
  h2 button {
    display: flex;
    gap: var(--pad);
    padding: 0;
    background-color: transparent;
    border-radius: 0;
  }
  
  /* Cards */
  .cards > div {
    padding: var(--gap);
    border-radius: var(--radius);
    background-color: var(--color-bg-section);
    gap: 0;
  }
  .cards > div > span:first-child {
    color: var(--color-text-bright);
    font-size: 1.2rem;
  }

  /* Table */
  .table {
    display: grid;
    align-content: flex-start;
    overflow: auto;
    gap: 0;
  }
  .table > div {
    display: flex;
    gap: var(--gap);
    padding: var(--pad);
    text-align: left;
    position: relative;
    background-color: var(--color-bg);
    color: var(--color-text);
    width: fit-content;
  }
  .table > div:nth-child(1) {
    color: var(--color-text-bright);
    border-radius: 0;
    border-bottom: var(--border);
    margin-bottom: .25rem;
  }
  .table > div span:nth-child(1) {
    width: 10rem;
  }
  .table > div span:nth-child(2) {
    width: 11rem;
  }
  .table > div span:nth-child(3) {
    width: 18rem;
  }
  @media (hover: hover) {
    .table div:hover:not(:first-child) {
      background-color: var(--color-bg-section);
    }
  }

</style>