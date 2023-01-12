<!-- Javascript -->
<script>
  import { ws } from '../js/ws'

  // Components
  import Icon from '../components/Icon.svelte'

</script>

<!-- HTML -->
<article class="grid">
  <h2>Welcome {$ws.user.username}</h2>
  <br>
  <div>
    <button on:click={() => ws.send.event("/user/v1", "logout")}>Logout</button>
  </div>
</article>

<!-- CSS -->
<style>
  article {
    padding: var(--gap);
    max-width: 1200px;
    margin: auto;
  }
</style>