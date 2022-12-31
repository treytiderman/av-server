<!-- Javascript -->
<script>
  import { get, post } from "../js/helper";

  // Components
  import Icon from '../components/Icon.svelte'

  // Page Data
  let data = {
    playerObj: null,
    playerCanvas: null,
    watch: {
      connected: false,
      wsUrl: "wss://stream.trey.app",
      placeholder: {
        wsUrl: "wss://stream.trey.app",
      }
    },
    settings: {
      rtspUrl: "rtsp://user:okayokay9@192.168.1.21:554",
      wsPort: "9999",
      frameRate: "20",
      placeholder: {
        rtspUrl: "rtsp://user:password@192.168.1.21:554",
        wsPort: "9999",
        frameRate: "20",
      }
    }
  }

  // Functions
  function connectWsUrl(url) {
    data.playerObj.destroy()
    data.watch.connected = false
    data.playerObj = new JSMpeg.Player(url, {canvas: data.playerCanvas})
    setTimeout(() => {
      if (data.playerObj.source.established) data.watch.connected = true
    }, 1000);
  }
  function startStream() {
    post("/api/rtsp2ws/v1/start", {
      rtspUrl: data.settings.rtspUrl,
      wsPort: data.settings.wsPort,
      frameRate: data.settings.frameRate
    })
  }
  function stopStream() {
    get("/api/rtsp2ws/v1/stop")
  }

  // Component Startup
  import { onDestroy, onMount } from 'svelte';
  let doneLoading = false
  onMount(async () => {

    // Try to connect to the stream
    const ip = document.location.hostname
    const port = 9999
    const path = ''
    const protocol = document.location.protocol === 'http:' ? 'ws' : 'wss'
    const host = protocol === 'wss' ? `${ip}` : `${ip}:${port}`
    const url = `${protocol}://${host}/${path}`
    data.playerObj = new JSMpeg.Player(url, {canvas: data.playerCanvas})
    setTimeout(() => {
      if (data.playerObj.source.established) data.watch.connected = true
    }, 1000);

    // Startup complete
    doneLoading = true

  })

  onDestroy(async () => {
    data.playerObj.destroy()
  })

  $: console.log(data.watch.connected)

</script>

<!-- HTML -->
<article class="grid">

  <h2>WebSocket Stream</h2>
  <div class="flex nowrap align-end">
    <label>
      wsUrl<br>
      <input type="text" bind:value={data.watch.wsUrl}
        placeholder={data.watch.placeholder.wsUrl}>
    </label>
    <button class="green" on:click={() => connectWsUrl(data.watch.wsUrl)}>
      Connect
    </button>
  </div>
  <canvas bind:this={data.playerCanvas} class:border-red={!data.playerObj?.source?.established}></canvas>

  <!-- <h2>Settings</h2>
  <label>
    rtspUrl<br>
    <input type="text" bind:value={data.settings.rtspUrl}
      placeholder={data.settings.placeholder.rtspUrl}>
  </label>
  <label>
    wsPort<br>
    <input type="text" bind:value={data.settings.wsPort}
      placeholder={data.settings.placeholder.wsPort}>
  </label>
  <label>
    frameRate<br>
    <input type="text" bind:value={data.settings.frameRate}
      placeholder={data.settings.placeholder.frameRate}>
  </label>
  <div class="flex even">
    <button class="red" on:click={stopStream}>
      Stop
    </button>
    <button class="green" on:click={startStream}>
      Start
    </button>
  </div> -->

</article>

<!-- CSS -->
<style>
  article {
    padding: var(--gap);
    max-width: 30rem;
    /* overflow: auto; */
    /* margin: auto; */
    height: 100%;
  }
  label,
  input {
    width: 100%;
  }
  canvas {
    background-color: var(--color-bg-section);
    border-radius: var(--radius-lg);
    max-width: 100%;
    width: 100%;
  }
  canvas.border-red {
    border: var(--border);
    border-color: var(--color-bg-red);
  }
</style>