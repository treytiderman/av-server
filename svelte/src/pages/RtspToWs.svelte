<!-- Javascript -->
<script>

  // Components
  import Icon from '../components/Icon.svelte'

  // Page Data
  let data = {
    playerObj: null,
    playerCanvas: null,
    watch: {
      wsUrl: "ws://192.168.1.1:9999",
      placeholder: {
        wsUrl: "ws://192.168.1.1:9999",
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
    data.playerObj = new JSMpeg.Player(url, {canvas: data.playerCanvas})
  }

  // Component Startup
  import { onMount } from 'svelte';
  let doneLoading = false
  onMount(async () => {

    // Try to connect to the stream
    data.playerObj = new JSMpeg.Player(`ws://${window.location.hostname}:9999`, {canvas: data.playerCanvas})

    // Startup complete
    doneLoading = true

  })

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
    <button class="green" on:click={connectWsUrl(data.watch.wsUrl)}>
      Connect
    </button>
  </div>
  <canvas bind:this={data.playerCanvas}></canvas>
  <h2>Settings</h2>
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
    <button class="red">
      Stop
    </button>
    <button class="green">
      Start
    </button>
  </div>

</article>

<!-- CSS -->
<style>
  article {
    padding: var(--gap);
    max-width: 30rem;
    /* overflow: auto; */
    margin: auto;
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
</style>