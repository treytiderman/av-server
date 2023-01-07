<!-- Javascript -->
<script>
  import { http } from "../js/http";

  // Components
  import Icon from '../components/Icon.svelte'

  // Variables
  let username = "user"
  let password = "password"
  let error = ""
  let role = ""
  
  // Functions
  async function submitLogin() {
    const response = await http.login(username, password, { port: "4620" })
    error = response ?? ""
  }

  async function checkRole() {
    const response = await http.user({ port: "4620" })
    role = response ?? ""
  }

</script>

<!-- HTML -->
<article class="grid">
  <h2>Login</h2>
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
  <hr>
  <button on:click={checkRole}>checkRole</button>
  <p class="yellow">{role}</p>
</article>

<!-- CSS -->
<style>
  article {
    padding: var(--gap);
    max-width: 400px;
    margin: auto;
  }
</style>