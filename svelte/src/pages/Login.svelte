<!-- Javascript -->
<script>
  import { fade } from 'svelte/transition'
  import { ws } from "../js/ws"
  import { settings } from '../js/settings'

  // Components
  import Stars from "../components/Stars.svelte";

  // Variables
  let username = "user"
  let password = "password"
  let error = ""
  
  // Functions
  function log(...params) { if (true) console.log("ws.js |", ...params) }
  async function submitLogin() {
    ws.send.event("/user/v1", "login", {
      username: username,
      password: password,
    })
  }

  // WebSocket Receive
  ws.receive.event("/user/v1", "user", body => {
    log("user", body)
    $ws.user = body
  })
  ws.receive.event("/user/v1", "login", body => {
    log("login", body)
    if (body === "success") {
      $ws.auth = true
    }
    else if (body === "username or password incorrect") {          
      $ws.auth = false
      error = body
    }
  })
  ws.receive.event("/user/v1", "token", body => {
    log("token", body)
    if (body === "bad token") {
      // error = body
      // localStorage.setItem("token", body)
    }
    else if (body === "good token") {
      $ws.auth = true
    }
    else {
      $ws.auth = true
      localStorage.setItem("token", body)
    }
  })
  ws.receive.event("/user/v1", "logout", body => {
    log("logout", body)
    if (body === true) {          
      $ws.auth = false
    }
  })

  // WebSocket Send
  ws.send.event("/user/v1", "token", localStorage.getItem("token"))

</script>

<!-- HTML -->
{#if $ws.status === "open" && $ws.auth === false}
  <article transition:fade="{{ duration: $settings.animation_ms, delay: 50 }}">
    <Stars>
      <main class="grid">
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
    </Stars>
  </article>
{/if}

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
    max-width: 25rem;
    margin: auto;
    margin-top: 10rem;
    /* background-color: var(--color-bg); */
    background-color: #00000033;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    border-radius: var(--radius-lg);
  }
  /* main {
    background-color: var(--color-purple-200);
    color: var(--color-purple-600);
  }
  h1 {
    color: var(--color-purple-900);
  }
  input {
    background-color: var(--color-purple-400);
    color: var(--color-purple-800);
  }
  button {
    background-color: var(--color-purple-400);
    color: var(--color-purple-900);
  } */
</style>