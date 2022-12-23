<!-- Javascript -->
<script>
  import { ws } from "../js/ws";

  ws.setDebug(true)
  ws.connect({
    ip: "192.168.1.9",
    port: "4620",
  })

</script>

<!-- HTML -->
<article class="grid">
  <h1>Testing WS</h1>
  <div>
    <button on:click={event => {
       ws.send({
        "name": "time",
        "event": "get"
      })
    }}>
      Send
    </button>
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