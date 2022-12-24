<!-- Javascript -->
<script>
    import { subscribe } from "svelte/internal";
  import { ws } from "../js/ws";

  ws.setDebug(true)
  ws.connect({
    ip: "192.168.1.9",
    port: "4620",
  })
  ws.receive.json(obj => {
    console.log(obj)
  })

  const IP = "192.168.1.246"
  const PORT = 23
  let lines = []
  ws.receive.event(`/tcp/client/v1/${IP}:${PORT}`, (event, body) => {
    if (event === "send" || event === "receive") {
      lines = [...lines, body.ascii]
    }
    else if (event === "open") {
      lines = [...lines, "connection open"]
    }
    else if (event === "close") {
      lines = [...lines, "connection closed"]
    }
  })

</script>

<!-- HTML -->
<article class="grid">
  <h1>Testing WS</h1>
  <p>{$ws.time}</p>
  <div class="flex">
    <button on:click={() => ws.send.get("time")}>
      get "time"
    </button>
    <button on:click={() => ws.send.subscribe("time")}>
      subscribe "time"
    </button>
    <button on:click={() => ws.send.unsubscribe("time")}>
      unsubscribe "time"
    </button>
  </div>

  <hr>

  <div class="flex">
    <button on:click={() => ws.send.event("/tcp/client/v1", "open", {
      "ip": IP,
      "port": PORT,
      "expectedDelimiter": "\r"
    })}>
      open
    </button>
    <button on:click={() => ws.send.event("/tcp/client/v1", "send", {
      "ip": IP,
      "port": PORT,
      "data": "MV?",
      "encoding": "ascii",
      "cr": true,
      "lf": false
    })}>
      send
    </button>
    <button on:click={() => ws.send.event("/tcp/client/v1", "close", {
      "ip": IP,
      "port": PORT
    })}>
      close
    </button>
  </div>

  <div class="grid gap-0">
    {#each lines as line}
      <div>{line}</div>
    {/each}
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