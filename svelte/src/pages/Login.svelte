<!-- Javascript -->
<script>
  import { http } from "../js/http";

  // Components
  import Icon from '../components/Icon.svelte'

  // Variables
  let username = "user"
  let password = "password"
  
  // Functions
  async function submitLogin() {
    const response = await http.login(username, password, { port: "4620" })
    console.log(response)
  }

</script>

<!-- HTML -->
<article class="grid">
  <h2>Login</h2>
  <label>
    Username <br>
    <input type="text" class="fill" placeholder="username"
      bind:value={username}
    >
  </label>
  <label>
    Password <br>
    <input type="text" class="fill" placeholder="password"
      bind:value={password}
    >
  </label>
  <button on:click={submitLogin}>
    Submit
  </button>
</article>

<!-- CSS -->
<style>
  article {
    padding: var(--gap);
    max-width: 400px;
    margin: auto;
  }
</style>