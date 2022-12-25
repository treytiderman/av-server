<!-- Javascript -->
<script>

  // Global store
  import { global, parseQuerystring, getScreenSize } from "./js/global"

  // Settings
  import { settings } from './js/settings'
  
  // Server Connection
  import { ws } from './js/ws'

  // Pages
  // import home from "./pages/home.svelte";

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

  // Routes
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

  // Component Startup
  import { onMount } from 'svelte';
  let doneLoading = false
  onMount(async () => {

    // Start WebSocket Connection
    ws.setDebug(true)
    ws.connect({port: 4620})

    // Startup complete
    doneLoading = true

  })

  // Global
  $: $global.url = {
    ip: document.location.hostname,
    protocal: document.location.protocol,
    port: document.location.port,
    path: $location,
    querystring: parseQuerystring($querystring),
  }
  $global.screen = getScreenSize()
  window.addEventListener("resize", () => $global.screen = getScreenSize())

  // Theme
  const themesGlob = import.meta.glob('../../public/themes/**/*.css')
  for (const filePath in themesGlob) {
    themesGlob[filePath]()
    const themeName = filePath.replace('./themes/', '').replace('.css', '')
    $settings.themes.push(themeName)
  }
  $: document.documentElement.classList = $settings.theme

  // Font Size
  $: document.documentElement.style.fontSize = $settings.font_size + "px"

  // Debug
  // $: console.log(routes)
  // $: console.log($global)
  $: console.log($settings)
  
</script>

<!-- HTML -->
{#if $ws.status === "open"}
<Header title={$location}
  on:nav={() => navShow = !navShow}/>
<div class="navMain">
  <Nav show={navShow} navItems={navItems} 
    on:itemPress={event => {
      navItem = event.detail
      if ($global.screen.width < 1200) navShow = false
    }}/>
  <main>
    <Router {routes}/>
  </main>
</div>

<!-- Server Offline -->
{:else}
<main class="grid" style="padding: var(--gap)">
  <h2>Lost connection to server {$global.url.ip}:{$global.url.port} on {localStorage.getItem("server_offline")}</h2>
  <section>
    <button on:click={() => window.location.reload(true)}>Reload?</button>
  </section>
</main>
{/if}

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
