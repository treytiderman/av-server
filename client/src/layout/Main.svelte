<!-- Javascript -->
<script>

  // Export
  export let pageObj
  export let center

</script>

<!-- HTML -->
<main class:center={center}>
  <svelte:component this={pageObj?.pageComponent}/>
</main>

<!-- CSS -->
<style>
  main {
    overflow: auto;
    flex-grow: 1;
  }
  main.center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>