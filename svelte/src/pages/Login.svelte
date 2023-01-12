<!-- Javascript -->
<script>
  import { ws } from "../js/ws";
  import { settings } from '../js/settings'

  // Variables
  let username = "user"
  let password = "password"
  let error = ""
  let role = ""
  
  // Functions
  async function submitLogin() {
    ws.send.event("/user/v1", "login", {
      username: username,
      password: password,
    })
  }

  // Component Startup
  import { onMount } from 'svelte'
  onMount(async () => {

    // Start WebSocket Connection
    ws.setDebug(true)
    ws.connect({port: 4620}, $settings.offline)
    setTimeout(() => {
      // ws.send.subscribe("time")
      ws.receive.event("/user/v1", "login", body => {
        console.log("login", body)
        if (body !== "username or password incorrect") {          
          $ws.status = "logged in"
          $ws.user = body
          error = body
        }
      })
      ws.receive.event("/user/v1", "logout", body => {
        console.log("logout", body)
        if (body === true) {          
          $ws.status = "open"
        }
      })
    }, 100)

  })

</script>

<!-- HTML -->
<article>
  <main class="grid">
    <br>
    <h1>Login</h1>
    {#if error}
      <p class="red">{error}</p>
    {/if}
    <label>
      Username <br>
      <input type="text" class="fill" placeholder="username"
        bind:value={username}
      >
    </label>
    <label>
      Password <br>
      <input type="password" class="fill" placeholder="password"
        bind:value={password}
      >
    </label>
    <button on:click={submitLogin}>Submit</button>
  </main>
</article>

<!-- CSS -->
<style>
  article {
    background-color: black;
    z-index: 100;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  main {
    padding: var(--gap);
    max-width: 350px;
    margin: auto;
  }
</style>