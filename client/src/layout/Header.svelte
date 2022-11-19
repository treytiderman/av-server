<!-- Javascript -->
<script>
  import { get, dateObjToTime, dateObjToDate } from "../js/helper.js"

  // Custom events
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // Components 
  import Icon from '../components/Icon.svelte'

  // Exports
  export let title = "Title"
  let date
  let time
  let onlineWithServer = false
  let headerWidth

  // Component Startup
  import { onMount } from 'svelte';
  onMount(async () => {
    let timeISO = await get("/api/test/v1/time", "http://192.168.1.1:4620")
    if (timeISO !== null) {
      let timeDate = new Date(timeISO)
      date = dateObjToDate(timeDate)
      time = dateObjToTime(timeDate)
      onlineWithServer = true
    }
    else {
      time = ""
      date = "Not online with server"
    }

    setInterval(async () => {
      let timeISO = await get("/api/test/v1/time", "http://192.168.1.1:4620")
      if (timeISO !== null) {
        let timeDate = new Date(timeISO)
        date = dateObjToDate(timeDate)
        time = dateObjToTime(timeDate)
        onlineWithServer = true
      }
      else {
        time = ""
        date = "Not online with server"
      }
    }, 10 * 1000)
  })

  let theme = "dark"
  $: document.querySelector("body").classList = theme

</script>

<!-- HTML -->
<header bind:offsetWidth={headerWidth}>
  <button on:click={() => dispatch('nav')}>
    <Icon name="bars" size=1.75 />
  </button>
  <h4>{title}</h4>
  {#if headerWidth > 600}
    <div class="time">
      <span>Server Time</span>
      <pre>{time} {date}</pre>
    </div>
    <button on:click={() => theme = theme === "dark" ? "light" : "dark"}>
      <Icon name="circle-half-stroke" size=1.75 />
    </button>
  {/if}
</header>

<!-- CSS -->
<style>
  header {
    color: var(--color-text-bright);
    background-color: var(--color-header);
  
    overflow-x: auto;
    overflow-y: hidden;
    
    display: flex;
    align-items: center;
  }
  header button {
    height: 4.2rem;
    border-radius: 0;
    padding: var(--gap);
    background-color: transparent;
  }
  .time {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex-wrap: nowrap;
    padding: .25rem 0 .25rem 1rem;
    /* padding: .25rem 1rem .25rem 1rem; */
    margin-left: auto
  }
</style>
