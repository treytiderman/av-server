<!-- Javascript -->
<script>
  import { ws } from '../js/ws'

  // Components
  import Icon from '../components/Icon.svelte'

  // Functions
  function logout() {
    ws.send.event("/user/v1", "logout")
  }
  
  // WebSocket Events
  ws.connected(() => {
    ws.receive.event("/user/v1", "logout", body => {
      if (body === true) {
        console.log("token deleted")
        localStorage.removeItem("token")
      }
    })
  })

</script>

<!-- HTML -->
<article class="grid">
  <h2>Welcome {$ws.user.username}</h2>
  <div>
    <button on:click={logout}>Logout</button>
  </div>
  <pre>{JSON.stringify($ws, null, 2)}</pre>
</article>

<!-- CSS -->
<style>
  article {
    padding: var(--gap);
    max-width: 1200px;
    margin: auto;
  }
</style>