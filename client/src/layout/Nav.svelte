<!-- Javascript -->
<script>

  // Store
  import { router } from "../js/global.js"

  // Custom events
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  // Components
  import Icon from '../components/Icon.svelte'

  // Variables
  export let hide = true
  export let menu = []
  const iconSize = 1.5
  const subIconSize = 1.25
  
</script>

<!-- HTML -->
<nav class:hide={hide}>

  <!-- Add each page to the Nav -->
  {#each menu as pageObj, index}
    {#if pageObj?.pageComponent}      
      <button 
        class:active={$router.pageObj === pageObj}
        style="margin-top: {menu.length === index+1 ? "auto" : ""}"
        on:click={dispatch('navPress', pageObj)}
      >
        <Icon name={pageObj.icon} size={iconSize} />
        {pageObj.name.nav}
      </button>

    <!-- If page has subpages -->
    {:else if pageObj?.subMenu}
      <button
        on:click={() => pageObj.hideSubMenu = !pageObj.hideSubMenu}
      >
        <Icon name={pageObj.icon} size={iconSize} />
        {pageObj.name.nav}
        {#if pageObj.hideSubMenu} 
          <Icon name="caret-left" size={subIconSize} style="margin-left: auto"/>
        {:else}
          <Icon name="caret-down" size={subIconSize} style="margin-left: auto"/>
        {/if}
      </button>

      <!-- Add each subpage to the Nav -->
      <div class="subMenu" class:hide={pageObj.hideSubMenu}>
        {#each pageObj.subMenu as subpageObj}
          <button
            class:active={$router.pageObj === subpageObj}
            on:click={dispatch('navPress', subpageObj)}
          >
            <Icon name={subpageObj.icon} size={subIconSize} />
            {subpageObj.name.nav}
          </button>
        {/each}
      </div>

    {/if}
  {/each}
</nav>
  
<!-- CSS -->
<style>
  nav {
    z-index: 10;
    min-width: 16rem;
    background-color: var(--color-header);
    display: flex;
    flex-direction: column;
    overflow: auto;
  }
  nav button {
    border-radius: 0;
    text-align: left;
    padding: var(--gap);
    color: var(--color-text);
    background-color: transparent;
    display: flex;
    align-items: center;
    gap: var(--gap);
  }
  nav button.active {
    color: var(--color-text-purple);
    background-color: var(--color-bg-purple);
    /* color: var(--color-text-bright); */
    /* background-color: var(--color-bg); */
  }
  .subMenu {
    display: flex;
    flex-direction: column;
  }
  .subMenu button {
    padding-left: calc(var(--gap)*2);
  }
  .hide { display: none; }

  /* If width is less than 1200px make the nav menu full width */
  @media (max-width: 1200px) {
    nav {
      position: fixed;
      top: 4.2rem;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
</style>
