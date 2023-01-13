<!-- Javascript -->
<script>
  import { dateObjToTime } from "../js/helper.js"
  import { ws } from "../js/ws.js"

  // Custom events
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // Components 
  import Icon from '../components/Icon.svelte'

  // Exports
  export let title = "Title"
  const iconSize = 1.5

  // WebSocket Sends
  ws.send.get("time")
  $: time = dateObjToTime( new Date($ws.time) )

</script>

<!-- HTML -->
<header>
  <button aria-label="navMenu" on:click={() => dispatch('nav')}>
    <Icon name="bars" size={iconSize} />
  </button>
  <h2>{title}</h2>
  <div>
    {time}
  </div>
</header>

<!-- CSS -->
<style>
  header {
    color: var(--color-text-bright);
    background-color: var(--color-bg-header);
  
    overflow-x: auto;
    overflow-y: hidden;
    
    display: flex;
    align-items: center;

    border-bottom: var(--border);
    border-color: var(--color-border-header);
    height: 4.2rem;
  }
  header h2 {
    color: var(--color-text-bright);
  }
  header button {
    color: var(--color-text-bright);
    height: 4.2rem;
    border-radius: 0;
    padding: var(--gap);
    background-color: transparent;
  }
  header div {
    color: var(--color-text-bright);
    margin-right: 1rem;
    margin-left: auto;
  }
</style>
