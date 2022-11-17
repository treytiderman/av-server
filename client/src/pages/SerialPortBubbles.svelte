<!-- Javascript -->
<script>

  // Components
  import Icon from '../components/Icon.svelte'

  // Variables
  const baudRates = [9600, 14400, 19200, 38400, 57600, 115200]
  let connectionOpen = false
  let connectionHex = false
  let terminalElement
  let terminalElementWidth
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

  let testSends = false
  let testSpeed = 50
  setInterval(() => {
    if (testSends) {
      scrollToBottomTerminal()
      lines.push({
        rx: lines.length%4,
        ISOtimestamp: new Date(Date.now()).toISOString(),
        data: lines.length * 89 * 53
      })
      lines = lines
      if (lines.length > 1000) lines.shift()
    }
  }, testSpeed)

  // setTimeout(() => testSends = true , 1000 )
  // setTimeout(() => testSends = false, 4000 )
  // setTimeout(() => testSends = true , 10000)
  // setTimeout(() => testSends = false, 14000)
  // setTimeout(() => testSends = true , 20000)
  // setTimeout(() => testSends = false, 24000)

  // Functions
  function scrollToBottomTerminal() {
    let currentScrollHeight = terminalElement.scrollTop + terminalElement.offsetHeight + 10
    let totalScrollHeight = terminalElement.scrollHeight
    if (currentScrollHeight >= totalScrollHeight) {
      setTimeout(() => terminalElement.scrollTop = terminalElement?.scrollHeight, 5)
    }
  }

  $: timeColFormat = terminalElementWidth > 600 ? "time" : "timeShort"
  $: timeColWidth = terminalElementWidth > 600 ? "6.75rem" : "3.25rem"
  function timePress() {
    if (timeColFormat === "datetime") {
      timeColFormat = "time"
      timeColWidth = "6.75rem"
    }
    else if (timeColFormat === "time") {
      timeColFormat = "timeShort"
      timeColWidth = "3.25rem"
    }
    else {
      timeColFormat = "datetime"
      timeColWidth = "12rem"
    }
  }

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
        Encoding Mode<br>
        <div>
          <button class="connection-ascii" style="{connectionHex ? "background-color: transparent;" : ""}" on:click={() => connectionHex = false}>Ascii</button>
          <button class="connection-hex" style="{connectionHex ? "" : "background-color: transparent;"}" on:click={() => connectionHex = true}>Hex</button>
        </div>
      </div>
      <!-- <div> -->
        {#if connectionOpen}
          <button class="connection-close" on:click={() => connectionOpen = !connectionOpen}>Close</button>
        {:else}
          <button class="connection-open" on:click={() => connectionOpen = !connectionOpen}>Open</button>
        {/if}
      <!-- </div> -->
    </div>
  </aside>

  <!-- Terminal -->
  <article>
    <h4>Terminal</h4>
    <div class="terminal"
      bind:this={terminalElement}
      bind:offsetWidth={terminalElementWidth}
      style="--col1-width: {timeColWidth}"
    >

      <!-- Header -->
      <div class="terminal-header">
        <div class="terminal-col1"><Icon name="up-down" size=.8 style="display: inline;"/></div>
        <button class="terminal-col2 textButton" on:click={timePress}>
          {timeColFormat === "datetime" ? "Date Time" : "Time"}
        </button>
        <div class="terminal-col3">
          Sent <Icon name="up-long" size=.8 style="color: var(--color-bg-green); display: inline;"/> / 
          Received <Icon name="down-long" size=.8 style="color: var(--color-bg-blue); display: inline;"/>
        </div>
      </div>

      <!-- Lines -->
      <div class="terminal-lines">
        {#each lines as line}
          <div class="terminal-line">

            <!-- Col1 -->
            {#if line.wasReceived}
              <div class="terminal-col1"><Icon name="down-long" size=.8 style="color: var(--color-bg-blue); display: inline;"/></div>
            {:else}
              <div class="terminal-col1"><Icon name="up-long" size=.8 style="color: var(--color-bg-green); display: inline;"/></div>
            {/if}

            <!-- Col2 -->
            <div class="terminal-col2">
              {#if timeColFormat === "datetime"}
                <span class="timestamp-date">{line.ISOtimestamp.split('T')[0]}</span>
                <span class="timestamp-time">{line.ISOtimestamp.split('T')[1].split('Z')[0]}</span>
              {:else if timeColFormat === "time"}
                <span class="timestamp-time">{line.ISOtimestamp.split('T')[1].split('Z')[0]}</span>
              {:else}
                <span class="timestamp-time">{line.ISOtimestamp.split('T')[1].slice(3).split('.')[0]}</span>
              {/if}
            </div>

            <!-- Col3 -->
            <div class="terminal-col3">
              <pre>{line.data}</pre>
            </div>

          </div>
        {/each}
        
      </div>
    </div>

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

  </article>

  <div class="notes">
    <div>Caridge Return (CR) = \r or \x0D</div>
    <div>Line Feed (LF) = \n or \x0A</div>
  </div>

</section>

<!-- CSS -->
<style>
  section {
    padding: var(--gap);
    max-width: 1200px;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap);
    align-items: flex-start;
  }

  /* Connection Settings */
  aside {
    padding: var(--gap);
    border-radius: var(--radius-2);
    background-color: var(--color-header);
    display: grid;
    align-items: flex-start;
    gap: var(--gap);
  }
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
  .connection-hex,
  .connection-ascii {
    border: var(--border);
    border-color: var(--color-bg-secondary);
  }

  /* Terminal */
  article {
    padding: var(--gap);
    border-radius: var(--radius-2);
    background-color: var(--color-header);
    display: grid;
    gap: var(--gap);
    flex-grow: 1;
  }
  .terminal {
    background-color: black;
    font-family: var(--font-mono);
    font-size: .8rem;
    display: grid;
    overflow: auto;
  }
  .terminal-header {
    display: flex;
    color: var(--color-text);
    padding: var(--pad);
    padding-bottom: calc(var(--pad)/2);
    border-bottom: var(--border);
    border-color: var(--color-border-bright);
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: black;
  }
  .terminal-lines {
    /* background-color: red; */
    padding: var(--pad);
    padding-top: calc(var(--pad)/2);
    padding-bottom: var(--pad);
    height: 40vh;
    max-height: 40vh;
  }
  .terminal-line {
    display: flex;
    flex-wrap: nowrap;
  }
  .terminal-line:hover {
    background-color: var(--color-header);
    filter: var(--filter-brightness-hover);
  }
  .terminal-col1 {
    min-width: 1.5rem;
  }
  .terminal-col2 {
    min-width: var(--col1-width);
  }
  pre {
    white-space: pre-wrap;
    white-space: pre;
  }
  .timestamp-date,
  .timestamp-time {
    color: var(--color-text-dim);
  }
  .textButton {
    padding: 0;
    background-color: transparent;
    text-align: left;
    color: currentColor;
  }

  /* Sends */
  .sends {
    display: grid;
    gap: var(--gap)
  }
  .sends div {
    display: flex;
    gap: var(--gap)
  }
  .sends div input {
    flex-grow: 1;
  }
  
  .notes {
    width: 100%;
    color: var(--color-text-dim);
  }

  /* .hide {display: none;} */
</style>