<!-- Javascript -->
<script>

  // Global store
  import { global, parseQuerystring, getScreenSize } from "./js/global"

  // Settings
  import { settings } from './js/settings'

  // Server Connection
  import { ws } from './js/ws'

  // Pages
  import Home from "./pages/Home.svelte";
  import Login from "./pages/Login.svelte";
  import Files from "./pages/Files.svelte";
  import Dhcp_server from "./pages/Dhcp_server.svelte";
  import Network from "./pages/Network.svelte";
  import Rtsp2ws from "./pages/Rtsp2ws.svelte";
  import Serial from "./pages/Serial.svelte";
  import Tcp_client from "./pages/Tcp_client.svelte";

  // Router
  import Router, { location, querystring } from 'svelte-spa-router'
  const routes = {
    "/": Files,
    "/dhcp/server": Dhcp_server,
    "/network": Network,
    "/rtsp2ws": Rtsp2ws,
    "/serial": Serial,
    "/tcp/client": Tcp_client,
  }
  
  // Header and Nav
  import Header from './layout/Header.svelte'
  import Nav from './layout/Nav.svelte'
  let navShow = false
  let navItem
  let navItems = [
    // {
    //   name: "Home",
    //   icon: "house",
    //   path: "/#/",
    // },
    // {
    //   name: "Tools",
    //   show: true,
    //   subItems: [
        {
          name: "Network",
          icon: "ethernet",
          path: "/#/network",
        },
        {
          name: "DHCP Server",
          icon: "server",
          path: "/#/dhcp/server",
        },
        {
          name: "TCP Client",
          icon: "terminal",
          path: "/#/tcp/client",
        },
        {
          name: "Serial",
          icon: "terminal",
          path: "/#/serial",
        },
        {
          name: "RTSP to WebSocket",
          icon: "video",
          path: "/#/rtsp2ws",
        },
    //   ],
    // },
  ]

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

  // Settings
  $: document.documentElement.classList = $settings.theme
  $: document.documentElement.style.fontSize = $settings.font_size + "px"

  // Component Startup
  import { onMount } from 'svelte';
  onMount(async () => {

    // Start WebSocket Connection
    ws.setDebug(true)
    ws.connect({port: 4620}, $settings.offline)
    setTimeout(() => ws.send.subscribe("time"), 100);

  })

  // Debug
  // $: console.log(routes)
  // $: console.log($global)
  // $: console.log($settings)
  // $: console.log($ws)
  
</script>

<!-- HTML -->
{#if $ws.status === "open" || $ws.status === "offline"}
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
