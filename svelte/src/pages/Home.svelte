<!-- Javascript -->
<script>
  import { ws } from '../js/ws'

  // Components
  import Icon from '../components/Icon.svelte'

  // Functions
  function logout() {
    ws.send.event("/user/v1", "logout")
    $ws.auth = false
    localStorage.removeItem("token")
  }
  
  // WebSocket Receive
  ws.receive.event("/user/v1", "logout", body => {
    if (body === true) {
      console.log("token deleted")
      $ws.auth = false
      localStorage.removeItem("token")
    }
  })

  // WebSocket Send
  ws.send.get("system")

</script>

<!-- HTML -->
<article class="grid">
  <h2>Welcome {$ws.user.username}</h2>
  <div>
    <button on:click={logout}>Logout</button>
  </div>
  <pre class="mono" style="font-size: small;">{JSON.stringify($ws, null, 2)}</pre>
</article>

<!-- CSS -->
<style>
  article {
    padding: var(--gap);
    max-width: 1200px;
    margin: auto;
  }
</style>