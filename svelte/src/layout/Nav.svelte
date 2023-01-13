<!-- Javascript -->
<script>

  // Custom events
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  
  // Components
  import NavItem from '../layout/NavItem.svelte'

  // Variables
  export let show = true
  export let navItems = [
    {
      name: "Home",
      icon: "house",
      path: "/#/",
    },
    {
      name: "Box",
      icon: "box",
      path: "/#/box",
    },
    {
      name: "Sub Items",
      show: false,
      subItems: [
        {
          name: "Item One",
          icon: "1",
          path: "/#/1",
        },
        {
          name: "Item Two",
          icon: "2",
          path: "/#/2",
        },
      ],
    },
    {
      name: "Recursive Items",
      show: false,
      subItems: [
        {
          name: "Box 1",
          show: false,
          subItems: [
            {
              name: "One",
              icon: "1",
              path: "/#/1",
            },
            {
              name: "Two",
              icon: "2",
              path: "/#/2",
            },
          ],
        },
        {
          name: "Box 2",
          show: false,
          subItems: [
            {
              name: "Three",
              icon: "3",
              path: "/#/3",
            },
            {
              name: "Four",
              icon: "4",
              path: "/#/4",
            },
          ],
        },
      ],
    }
  ]

</script>

<!-- HTML -->
{#if show}
  <nav>

    <!-- Add each navItems to the Nav -->
    {#each navItems as navItem}
      <NavItem navItem={navItem} 
        on:click={() => dispatch("itemPress", navItem)}/>
    {/each}

  </nav>
{/if}
  
<!-- CSS -->
<style>
  nav {
    z-index: 10;
    min-width: 16rem;
    background-color: var(--color-bg-header);
    display: flex;
    flex-direction: column;
    overflow: auto;
    border-right: var(--border);
    border-color: var(--color-border-header);
  }
  /* If width is less than 1200px make the nav menu full width */
  @media (max-width: 800px) {
    nav {
      position: fixed;
      top: 4.2rem;
      left: 0;
      right: 0;
      bottom: 0;
      border-right: none;
    }
  }
  ::-webkit-scrollbar-thumb {
    background: var(--color-bg-input);
  }
</style>
