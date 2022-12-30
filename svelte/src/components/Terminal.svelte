<!-- Javascript -->
<script>
  import { dateObjToDate, dateObjToTime, dateObjToTimeSec } from "../js/helper";

  // Components
  import Icon from './Icon.svelte'

  // Exports
  export let showCRLF = true
  // export let hexSpaces = true
  export let addTestData = false
  export let lines = [
    {
      wasReceived: false,
      timestampISO: '2022-10-16T21:05:38.425Z',
      data: '{"boolean": true, "string": "Yes", "number": 200}',
    },
    {
      wasReceived: true,
      timestampISO: '2022-10-16T21:05:38.447Z',
      data: 'OFF',
    },
    {
      wasReceived: false,
      timestampISO: '2022-10-16T21:05:38.425Z',
      data: '\x4f\x46\x46',
    },
    {
      wasReceived: true,
      timestampISO: '2022-10-16T21:05:38.536Z',
      data: 'Weeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee Weeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee!!!',
    },
    {
      wasReceived: true,
      timestampISO: '2022-10-16T21:05:38.543Z',
      data: 'OK',
    },
  ]

  // Variables
  let terminalElementWidth
  
  // Time Column
  $: timeColFormat = terminalElementWidth > 600 ? "time" : "timeShort"
  $: timeColWidth = terminalElementWidth > 600 ? "6.25rem" : "5rem"
  function timePress() {
    if (timeColFormat === "datetime") {
      timeColFormat = "time"
      timeColWidth = "6.25rem"
    }
    else if (timeColFormat === "time") {
      timeColFormat = "timeShort"
      timeColWidth = "5rem"
    }
    else {
      timeColFormat = "datetime"
      timeColWidth = "11.5rem"
    }
  }

  // Max lines in the Terminal
  let maxLines = 1000
  $: if (lines.length > maxLines) lines.shift()

  // Scroll to the bottom of the Terminal if the scroll bar is at the bottom everytime "lines" updates
  let terminalElement
  function scrollToBottomOfElement(element) {
    let currentScrollHeight = element?.scrollTop + element?.offsetHeight + 10
    let totalScrollHeight = element?.scrollHeight
    // If the scroll bar is at the bottom
    if (currentScrollHeight >= totalScrollHeight) {
      element.scrollTop += 100
      setTimeout(() => element.scrollTop += 100, 5)
    }
  }
  $: if (lines) scrollToBottomOfElement(terminalElement)
  
  // Unescape the delimiter if needed
  $: if (showCRLF) escapeCRLF(lines)
  function escapeCRLF(lines) {
    lines.forEach(line => {
      line.data = String(line.data).replace(/\r/g, "\\r")
      line.data = String(line.data).replace(/\n/g, "\\n")
    })
  }

  // Test Received Data
  if (addTestData) {
    let testSends = false
    setInterval(() => {
      if (testSends) {
        lines.push({
          wasReceived: lines.length%4,
          timestampISO: new Date(Date.now()).toISOString(),
          data: lines.length * 89 * 53,
        })
        lines = lines
      }
    }, 100)
    setInterval(() => testSends = !testSends , 4 * 1000 )
  }

</script>

<!-- HTML -->
<section
  class="terminal"
  style="--col2-width: {timeColWidth}"
  bind:this={terminalElement}
  bind:offsetWidth={terminalElementWidth}
>

  <!-- Header -->
  <div class="terminal-header">
    <div class="terminal-col1"><Icon name="up-down" size=.8 style="display: inline;"/></div>
    <button class="terminal-col2 textButton" on:click={timePress}>
      {timeColFormat === "datetime" ? "Date Time" : "Time"}
      <Icon name="arrows-rotate" size=.8 style="display: inline;" color="var(--color-text-dim)"/>
    </button>
    <pre class="terminal-col3">Sent <Icon name="up-long" size=.8 style="display: inline;" color="var(--color-bg-green)"/> / Received <Icon name="down-long" size=.8 style="display: inline;" color="var(--color-bg-blue)"/></pre>
  </div>

  <!-- Lines -->
  <div class="terminal-lines">
    {#each lines as line}
      <div class="terminal-line textButton">

        <!-- Col1 -->
        {#if line.wasReceived}
          <div class="terminal-col1">
            <Icon name="down-long" size=.8 style="display: inline;" color="var(--color-bg-blue)"/>
          </div>
        {:else}
          <div class="terminal-col1">
            <Icon name="up-long" size=.8 style="display: inline;" color="var(--color-bg-green)"/>
          </div>
        {/if}

        <!-- Col2 -->
        <div class="terminal-col2">
          {#if timeColFormat === "datetime"}
            <span>{dateObjToDate(new Date(line.timestampISO))}</span>
            <span>{dateObjToTimeSec(new Date(line.timestampISO))}</span>
          {:else if timeColFormat === "time"}
            <span>{dateObjToTimeSec(new Date(line.timestampISO))}</span>
          {:else}
            <span>{dateObjToTime(new Date(line.timestampISO))}</span>
          {/if}
        </div>

        <!-- Col3 -->
        <div class="terminal-col3">
          <pre>{line.data}</pre>
        </div>

      </div>
    {/each}
    
  </div>
</section>

<!-- CSS -->
<style>
  section {
    padding: 0;
    max-height: 100vh;
  }
  @media (max-width: 60rem) {
    section {
      padding: 0;
      max-height: 40vh;
    }
  }
  .terminal {
    background-color: var(--color-bg);
    /* border: var(--border); */
    /* border-color: var(--color-border); */
    font-family: var(--font-mono);
    font-size: .8rem;
    display: grid;
    align-content: flex-start;
    overflow: auto;
    /* resize: both; */
  }

  /* Header */
  .terminal-header {
    display: flex;
    align-items: flex-start;
    color: var(--color-text);
    padding: var(--pad);
    border-bottom: var(--border);
    position: sticky;
    top: 0;
    background-color: var(--color-bg);
    z-index: 1;
    max-height: 2.5rem;
  }

  /* Lines */
  .terminal-lines {
    padding: var(--pad);
    padding-top: var(--pad);
    padding-bottom: var(--pad);
    min-height: 10rem;
    /* max-height: 40vh; */
  }
  .terminal-line {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
  }
  .terminal-line:hover,
  .terminal-line:active,
  .terminal-line:focus {
    background-color: var(--color-bg-header);
    filter: var(--filter-brightness-hover);
  }

  /* Columns */
  .terminal-col1 {
    min-width: 1.5rem;
  }
  .terminal-col2 {
    min-width: var(--col2-width);
    color: var(--color-text-dim);
  }
  .terminal-col2 {
    min-width: var(--col2-width);
    color: var(--color-text-dim);
  }

  .textButton {
    padding: 0;
    background-color: transparent;
    text-align: left;
    color: currentColor;
    border-radius: 0;
  }

</style>