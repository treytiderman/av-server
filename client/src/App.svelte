<script>

  // Store
  import { router } from "./js/global.js"

  // Theme
  import "./themes/theme-dark.css"
  import "./themes/theme-light.css"
  import "./themes/theme-test.css"

  // Components
  import Icon from './components/Icon.svelte'
  import Header from './layout/Header.svelte'
  import Nav from './layout/Nav.svelte'
  import Main from './layout/Main.svelte'
  import Dialog from './layout/Dialog.svelte'

  // Pages 
  import Page from './pages/Page.svelte';
  import Home from './pages/Home.svelte';
  import Network from './pages/Network.svelte';
  import Dhcp from './pages/Dhcp.svelte';
  import SerialPort from './pages/SerialPort.svelte';

  let navMenu = [
    {
      name: {
        header: "Home",
        nav: "Home"
      },
      icon: "house",
      // pageComponent: Home,
      pageComponent: Network,
    },
    {
      name: {
        header: "Tools",
        nav: "Tools"
      },
      icon: "wrench",
      hideSubMenu: false,
      subMenu: [
          {
            name: {
              header: "Network Settings",
              nav: "Network"
            },
            icon: "network-wired",
            pageComponent: Network,
          },
          {
            name: {
              header: "DHCP",
              nav: "DHCP"
            },
            icon: "server",
            pageComponent: Dhcp,
          },
          {
            name: {
              header: "SerialPort",
              nav: "SerialPort"
            },
            icon: "terminal",
            pageComponent: SerialPort,
          },
        ],
      },
    {
      name: {
        header: "Settings",
        nav: "Settings"
      },
      icon: "gear",
      pageComponent: Page,
    },
  ]
  $router.pageObj = navMenu[0]
  // $router.pageObj = {
  //   name: {
  //     header: "SerialPort",
  //     nav: "SerialPort"
  //   },
  //   icon: "terminal",
  //   pageComponent: SerialPort,
  // }

  $: screenWidth = document.documentElement.offsetWidth
  let navHide = true

  $: console.log("$router", $router)

</script>

<!-- HTML -->
<Dialog pageObj={$router.dialogObj}/>
<Header
  title={$router.pageObj?.name.header}
  on:nav={() => navHide = !navHide}
/>
<div class="navMain">
  <Nav menu={navMenu} hide={navHide} on:navPress={event => {
    $router.pageObj = event.detail
    if (screenWidth < 1200) navHide = true
  }}/>
  <Main pageObj={$router.pageObj} center={false}/>
</div>

<!-- CSS -->
<style>
  :global(body) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .navMain {
    height: calc(100% - 4.2rem);
    display: flex;
    flex-grow: 1;
  }
</style>
