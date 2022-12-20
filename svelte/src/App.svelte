<!-- Javascript -->
<script>

  // Routing
  import Router, { location, querystring } from 'svelte-spa-router'
  import { wrap } from 'svelte-spa-router/wrap'

  // Components
  import Header from './layout/Header.svelte'
  import Nav from './layout/Nav.svelte'

  // Variables
  let navShow = false
  let navItem
  let navItems = []
  let routes = {
    "/": wrap({asyncComponent: () => import("./pages/Home.svelte")}),
  }

  // Functions
  function addToNavItems(items, split, urlPath) {
    // Is in items
    if (split.length > 1) {
      // Add subItems if it doesn't exist
      if (items.find(navItem => navItem.name === split[0]) === undefined) {
        const subItems = {
          name: split[0],
          show: false,
          subItems: [],
        }
        items.push(subItems)
      }
      // Recursive
      let items2 = items.find(navItem => navItem.name === split[0]).subItems
      addToNavItems(items2, split.slice(1), urlPath)
    }
    // Is in root
    else {
      const navItem = {
        name: split[0],
        icon: "file-lines",
        path: urlPath,
      }
      items.push(navItem)
    }
    // Sort
    items.sort((a,b) => a.path && !b.path ? -1 : 0)
  }

  // Get all pages then build routes and navMenu
  const pagesGlob = import.meta.glob('./pages/**/*.svelte')
  for (const filePath in pagesGlob) {
    // routes
    const urlPath = filePath.replace('./pages','').replace('.svelte','').toLocaleLowerCase()
    routes[urlPath] = wrap({asyncComponent: pagesGlob[filePath]})
    // navItems
    const urlPathHash = filePath.replace('./pages','./#').replace('.svelte','').toLocaleLowerCase()
    const filePathClean = filePath.replace('./pages/','').replace('.svelte','')
    const split = filePathClean.split('/')
    addToNavItems(navItems, split, urlPathHash)
  }

  // Subscribe to screen width
  $: screenWidth = document.documentElement.offsetWidth
  
</script>

<!-- HTML -->
<Header title={$location}
  on:nav={() => navShow = !navShow}/>
<div class="navMain">
  <Nav show={navShow} navItems={navItems} 
    on:itemPress={event => {
      navItem = event.detail
      if (screenWidth < 1200) navShow = false
    }}/>
  <main>
    <Router {routes}/>
  </main>
</div>

<!-- CSS -->
<style>
  :global(body) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  main {
    overflow: auto;
    flex-grow: 1;
  }
  .navMain {
    height: calc(100% - 4.2rem);
    display: flex;
    flex-grow: 1;
  }
</style>
