<!-- Javascript -->
<script>

  let colors = [
    "--color-grey-100",
    "--color-grey-200",
    "--color-grey-300",
    "--color-grey-400",
    "--color-grey-500",
    "--color-grey-600",
    "--color-grey-700",
    "--color-grey-800",
    "--color-grey-900",

    "--color-red-100",
    "--color-red-200",
    "--color-red-300",
    "--color-red-400",
    "--color-red-500",
    "--color-red-600",
    "--color-red-700",
    "--color-red-800",
    "--color-red-900",
    
    "--color-orange-100",
    "--color-orange-200",
    "--color-orange-300",
    "--color-orange-400",
    "--color-orange-500",
    "--color-orange-600",
    "--color-orange-700",
    "--color-orange-800",
    "--color-orange-900",

    "--color-yellow-100",
    "--color-yellow-200",
    "--color-yellow-300",
    "--color-yellow-400",
    "--color-yellow-500",
    "--color-yellow-600",
    "--color-yellow-700",
    "--color-yellow-800",
    "--color-yellow-900",

    "--color-lime-100",
    "--color-lime-200",
    "--color-lime-300",
    "--color-lime-400",
    "--color-lime-500",
    "--color-lime-600",
    "--color-lime-700",
    "--color-lime-800",
    "--color-lime-900",

    "--color-green-100",
    "--color-green-200",
    "--color-green-300",
    "--color-green-400",
    "--color-green-500",
    "--color-green-600",
    "--color-green-700",
    "--color-green-800",
    "--color-green-900",

    "--color-cyan-100",
    "--color-cyan-200",
    "--color-cyan-300",
    "--color-cyan-400",
    "--color-cyan-500",
    "--color-cyan-600",
    "--color-cyan-700",
    "--color-cyan-800",
    "--color-cyan-900",

    "--color-blue-100",
    "--color-blue-200",
    "--color-blue-300",
    "--color-blue-400",
    "--color-blue-500",
    "--color-blue-600",
    "--color-blue-700",
    "--color-blue-800",
    "--color-blue-900",

    "--color-purple-100",
    "--color-purple-200",
    "--color-purple-300",
    "--color-purple-400",
    "--color-purple-500",
    "--color-purple-600",
    "--color-purple-700",
    "--color-purple-800",
    "--color-purple-900",

    "--color-pink-100",
    "--color-pink-200",
    "--color-pink-300",
    "--color-pink-400",
    "--color-pink-500",
    "--color-pink-600",
    "--color-pink-700",
    "--color-pink-800",
    "--color-pink-900",
  ]

</script>

<!-- HTML -->
<article>
  <h2>Palette</h2>
  <section>
    {#each colors as color}
      <div style="background-color: var({color});"></div>
    {/each}
  </section>
</article>

<!-- CSS -->
<style>
  article {
    padding: var(--gap);
    max-width: 40rem;
    overflow: auto;
    margin: auto;
    height: 100%;

    display: grid;
    gap: var(--gap);
    align-content: flex-start;
  }
  section {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap: var(--gap);
    gap: 0;
  }
  h2 {
    cursor: pointer;
  }
  div {
    height: 3rem;
  }
</style>