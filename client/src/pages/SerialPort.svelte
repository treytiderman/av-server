<!-- Javascript -->
<script>

  // Components
  import Icon from '../components/Icon.svelte'
  import Terminal from '../components/Terminal.svelte'

  // Variables
  const baudRates = [9600, 14400, 19200, 38400, 57600, 115200]
  let connectionOpen = false
  let connectionHex = false

  let txTests = [
    {
      timestamp: '2022-10-16T21:05:38.425Z',
      message: 'PWR',
      messageType: 'ascii',
      cr: true,
      lf: true,
      messageToSend: 'PWR\r\n',
      buffer: "<Buffer 50 57 52 0d 0a>"
    },
    {
      timestamp: '2022-10-16T21:05:38.536Z',
      message: 'OFF',
      messageType: 'ascii',
      cr: true,
      lf: true,
      messageToSend: 'OFF\r\n',
      buffer: "<Buffer 4f 46 46 0d 0a>"
    }
  ]
  let rxTests = [
    {
      buffer: "<Buffer 50 57 52>",
      timestamp: '2022-10-16T21:05:38.447Z',
      ascii: 'OFF',
      hex: '505752'
    },
    {
      buffer: "<Buffer 4f 46 46>",
      timestamp: '2022-10-16T21:05:38.543Z',
      ascii: 'OK',
      hex: '4f4646',
      hex2: '4f 46 46',
      hex3: '\x4f\x46\x46',
      hex4: '0x4f0x460x46'
    }
  ]
  let lines = [
    {
      wasReceived: false,
      ISOtimestamp: '2022-10-16T21:05:38.425Z',
      data: '{"boolean": true, "string": "Yes", "number": 200}',
    },
    {
      wasReceived: true,
      ISOtimestamp: '2022-10-16T21:05:38.447Z',
      data: 'OFF',
    },
    {
      wasReceived: false,
      ISOtimestamp: '2022-10-16T21:05:38.425Z',
      data: '\x4f\x46\x46',
    },
    {
      wasReceived: true,
      ISOtimestamp: '2022-10-16T21:05:38.536Z',
      data: 'OFF\r\n',
    },
    {
      wasReceived: true,
      ISOtimestamp: '2022-10-16T21:05:38.543Z',
      data: 'OK',
    },
  ]

</script>

<!-- HTML -->
<section>

  <!-- Connection Settings -->
  <aside>
    <h4>Connection Settings</h4>
    <div class="connection-options">
      <label>
        Device<br>
        <select>
          <option>Communications Port (COM1)</option>
          <option>USB Serial Port (COM3)</option>
          <option>USB Serial Port (COM4)</option>
        </select>
      </label>
      <label>
        Baud Rate<br>
        <select>
          {#each baudRates as baudRate}
            <option>{baudRate}</option>
          {/each}
        </select>
      </label>
      <label>
        Expected Delimiter<br>
        <input type="text" placeholder="\r\n" value="\r\n">
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
          <button class="connection-ascii" style="{connectionHex ? "background-color: var(--color-bg-2);" : "color: var(--color-text);"}" on:click={() => connectionHex = false}>ASCII</button>
          <button class="connection-hex" style="{connectionHex ? "color: var(--color-text);" : "background-color: var(--color-bg-2);"}" on:click={() => connectionHex = true}>HEX</button>
          <!-- <button class="connection-hex" style="{connectionHex ? "color: var(--color-text);" : "background-color: var(--color-bg-2);"}" on:click={() => connectionHex = true}>DMX</button> -->
        </div>
      </div>
      {#if connectionOpen}
        <button class="connection-close" on:click={() => connectionOpen = !connectionOpen}>Close</button>
      {:else}
        <button class="connection-open" on:click={() => connectionOpen = !connectionOpen}>Open</button>
      {/if}
    </div>
  </aside>

  <!-- Terminal -->
  <article>
    <h4>Terminal</h4>
    <Terminal lines={lines}/>

    <!-- Sends -->
    <div class="sends">
      <div>
        <input type="text" placeholder="fa 01 01\r">
        <button>Send</button>
      </div>
      <div>
        <input type="text" placeholder="\xAA\x11\xFE\x01\x01\x11">
        <button>Send</button>
      </div>
      <div>
        <input type="text" placeholder="\x01\x30\x41\x30\x41\x30\x43\x02\x43\x32\x30\x33\x44\x36\x30\x30\x30\x31\x03\x73\x0D">
        <button>Send</button>
      </div>
    </div>

    <div class="notes">
      <div>Caridge Return (CR) = \r or \x0D</div>
      <div>Line Feed (LF) = \n or \x0A</div>
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
  article {
    padding: var(--gap);
    display: grid;
    align-content: flex-start;
    width: 100%;
    height: 100%;
    gap: var(--gap);
  }
  aside {
    padding: var(--gap);
    border-color: var(--color-header);
    display: grid;
    align-content: flex-start;
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