<!-- Javascript -->
<script>
  import { location } from 'svelte-spa-router'

  // Components
  import Icon from '../components/Icon.svelte'

  // Variables
  export let indent = 1
  export let navItem = {
    name: "Box",
    show: false,
    subItems: [
      {
        name: "Infinite Box",
        icon: "1",
        path: "/#/box",
      },
    ],
  }
  const iconSize = 1.25
  const indentSubItem = 1

</script>

<!-- HTML -->

<!-- If page has subItems -->
{#if navItem?.subItems}
  <button
    style={`padding-left: calc(var(--gap)*${indent});`}
    on:click={() => navItem.show = !navItem.show}>
    {#if navItem.show}
      <Icon name="folder-open" size={iconSize}/>
    {:else}
      <Icon name="folder" size={iconSize}/>
    {/if}
    {navItem.name}
  </button>

  <!-- Add each subnavItem to the Nav -->
  {#if navItem.show}
    <div class="subItems">
      {#each navItem.subItems as subItem}
        <svelte:self on:click navItem={subItem} indent={indent + indentSubItem}/>
      {/each}
    </div>
  {/if}

<!-- Else add the navItem -->
{:else if navItem?.name}
  <a on:click href={window.location.pathname.substring(0, window.location.pathname.length - 1) + navItem.path} 
    class:active={"./#" + $location === navItem.path}
    style={`padding-left: calc(var(--gap)*${indent});`}>
    <Icon name="{navItem.icon}" size={iconSize} />
    {navItem.name}
  </a>
{/if}

<!-- CSS -->
<style>
  a, button {
    border-radius: 0;
    text-decoration: none;
    padding: var(--pad) var(--gap);
    color: var(--color-text);
    background-color: transparent;
    display: flex;
    align-items: center;
    gap: var(--gap);
    white-space: nowrap;
  }
  button {
    border-radius: 0;
    padding: var(--pad) var(--gap);
    color: var(--color-text);
    background-color: transparent;
    display: flex;
    align-items: center;
    gap: var(--gap);
  }
  .active {
    color: var(--color-text-input);
    background-color: var(--color-bg-input);
  }
  .subItems {
    display: flex;
    flex-direction: column;
  }
</style>
