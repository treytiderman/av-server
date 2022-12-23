<!-- Javascript -->
<script>
  import { validIPv4, validMask } from "../js/helper.js"

  // Event Dispatcher
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // Import Components
  import Icon from './Icon.svelte'

  // Data
  export let data = {
    value: {
      ip: "192.168.1.2",
      mask: "255.255.255.0",
      gateway: "192.168.1.1",
      dns: ["192.168.1.1", "1.1.1.1"],
    },
    placeholder: {
      ip: "192.168.1.2",
      mask: "255.255.255.0",
      gateway: "192.168.1.1",
      dns: ["192.168.1.1", "1.1.1.1"],
    }
  }

</script>

<!-- HTML -->
<article>

  <!-- Set IP -->
  <div class="grid">
    <label>
      IP address <br>
      <!-- svelte-ignore a11y-autofocus -->
      <input type="text" autofocus
        bind:value={data.value.ip}
        on:keyup={event => { if (event.key === "p") data.value.ip = data.placeholder.ip }}
        class:error={!validIPv4(data.value.ip) && data.value.ip !== ""}
        placeholder={data.placeholder.ip}> <br>
      {#if !validIPv4(data.value.ip) && data.value.ip !== ""}
        <div class="flex error-message">
          <Icon name="circle-exclamation"/>
          <small>{validIPv4(data.value.ip, true)}</small>
        </div>
      {/if}
    </label>
    <label>
      Subnet Mask <br>
      <input type="text"
        bind:value={data.value.mask}
        on:keyup={event => { if (event.key === "p") data.value.mask = data.placeholder.mask }}
        class:error={!validMask(data.value.mask) && data.value.mask !== ""}
        placeholder={data.placeholder.mask}> <br>
      {#if !validMask(data.value.mask) && data.value.mask !== ""}          
        <div class="flex error-message">
          <Icon name="circle-exclamation"/>
          <small>{validMask(data.value.mask, true)}</small>
        </div>
      {/if}
    </label>
    <label>
      Gateway <span class="dim">(optional)</span> <br>
      <input type="text"
        bind:value={data.value.gateway}
        on:keyup={event => { if (event.key === "p") data.value.gateway = data.placeholder.gateway }}
        class:error={!validIPv4(data.value.gateway) && data.value.gateway !== ""}
        placeholder={data.placeholder.gateway}> <br>
      {#if !validIPv4(data.value.gateway) && data.value.gateway !== ""}          
        <div class="flex error-message">
          <Icon name="circle-exclamation"/>
          <small>{validIPv4(data.value.gateway, true)}</small>
        </div>
      {/if}
    </label>
  </div>
  
  <!-- Set DNS -->
  <div class="grid">
    <label>
      DNS 1 <span class="dim">(optional)</span> <br>
      <input type="text"
        bind:value={data.value.dns[0]}
        on:keyup={event => { if (event.key === "p") data.value.dns[0] = data.placeholder.dns[0] }}
        class:error={!validIPv4(data.value.dns[0]) && data.value.dns[0] !== ""}
        class:correct={validIPv4(data.value.dns[0])}
        placeholder={data.placeholder.dns[0]}> <br>
      {#if !validIPv4(data.value.dns[0]) && data.value.dns[0] !== ""}          
        <div class="flex error-message">
          <Icon name="circle-exclamation"/>
          <small>{validIPv4(data.value.dns[0], true)}</small>
        </div>
      {/if}
    </label>
    <label>
      DNS 2 <span class="dim">(optional)</span> <br>
      <input type="text"
        bind:value={data.value.dns[1]}
        on:keyup={event => { if (event.key === "p") data.value.dns[1] = data.placeholder.dns[1] }}
        class:error={!validIPv4(data.value.dns[1]) && data.value.dns[1] !== ""}
        placeholder={data.placeholder.dns[1]}> <br>
      {#if !validIPv4(data.value.dns[1]) && data.value.dns[1] !== ""}          
        <div class="flex error-message">
          <Icon name="circle-exclamation"/>
          <small>{validIPv4(data.value.dns[1], true)}</small>
        </div>
      {/if}
    </label>
    <div>
      <br>
      <div class="buttons">
        <button class="green"
          on:click={() => dispatch("set", data.value)}
          disabled={
            (
                validIPv4(data.value.ip) &&
                validMask(data.value.mask) &&
                (validIPv4(data.value.gateway) || data.value.gateway === "") &&
                (validIPv4(data.value.dns[0]) || data.value.dns[0] === "") &&
                (validIPv4(data.value.dns[1]) || data.value.dns[1] === "")
                ) === false
              }
          >
          Set 
          <Icon name="check" size=1/>
        </button>
        <button class="cyan"
          on:click={() => dispatch("save", data.value)}
          disabled={
            (
              validIPv4(data.value.ip) &&
              validMask(data.value.mask) &&
              (validIPv4(data.value.gateway) || data.value.gateway === "") &&
              (validIPv4(data.value.dns[0]) || data.value.dns[0] === "") &&
              (validIPv4(data.value.dns[1]) || data.value.dns[1] === "")
            ) === false
          }
        >
          Save 
          <Icon name="square-plus" size=1/>
        </button>
      </div>
    </div>
  </div>

</article>

<!-- CSS -->
<style>
  article {
    height: 100%;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap);
    padding: var(--gap);
    align-content: flex-start;
  }
  @media (max-width: 40rem) {
    article {
      display: flex;
      flex-direction: column;
    }
  }
  .buttons {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap);
    
    align-self: flex-end;
  }

  .buttons button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--pad);
    flex: 1 0 0%;
  }

  input {
    font-family: var(--font-mono);
  }

</style>