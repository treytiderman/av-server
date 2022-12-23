<!-- Javascript -->
<script>
  import { ws } from "../js/ws";

  ws.setDebug(true)
  ws.connect({
    ip: "192.168.1.154",
    port: "4620",
  })
  ws.receiveJSON(obj => {
    console.log(obj)
  })

  let time = ""
  ws.receiveEvent("time", (event, body) => {
    time = body
  })

  const IP = "192.168.1.246"
  const PORT = 23
  ws.receiveEvent(`/tcp/client/v1${IP}:${PORT}`, (event, body) => {
    
  })

</script>

<!-- HTML -->
<article class="grid">
  <h1>Testing WS</h1>
  <p>{time}</p>
  <div class="flex">
    <button on:click={event => ws.get("time")}>
      get "time"
    </button>
    <button on:click={event => ws.subscribe("time")}>
      subscribe "time"
    </button>
    <button on:click={event => ws.unsubscribe("time")}>
      unsubscribe "time"
    </button>
  </div>
  <hr>
  <div class="flex">
    <button on:click={event => ws.event("/tcp/client/v1", "open", {
      "ip": IP,
      "port": PORT,
      "expectedDelimiter": "\r"
    })}>
      open
    </button>
    <button on:click={event => ws.event("/tcp/client/v1", "send", {
      "ip": IP,
      "port": PORT,
      "data": "MV?",
      "encoding": "ascii",
      "cr": true,
      "lf": false
    })}>
      send
    </button>
    <button on:click={event => ws.event("/tcp/client/v1", "close", {
      "ip": IP,
      "port": PORT
    })}>
      close
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