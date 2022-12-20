<!-- Javascript -->
<script>

  // Components
  import Icon from '../../components/Icon.svelte'

  let lightness = "60%"
  let chroma = "0.22"
  let hue = "293"

  let gridX = 3
  let gridY = 1
  let colors = []

  for (let y = 0; y < gridY; y++) {
    for (let x = 0; x < gridX; x++) {
      // oklch(53% 0.30 290)
      // oklch(75% 0.15 290)
      // oklch(27% 0.15 290)
      let color = {
        lightness: 25*x + "%",
        chroma: "0.3",
        hue: "290"
      }
      colors.push(color)
    }
  }

</script>

<!-- HTML -->
<article>
  <aside>
    <h2>Settings</h2>
  </aside>
  <section>
    <div>
      <h2>Colors OKLCH</h2>
      <h6>Only works in Safari as of 11/27/22</h6>
    </div>
    <div class="color-squares">
      {#each colors as color}
        <div class="color-square" style="{`background: oklch(${color.lightness} ${color.chroma} ${color.hue})`};"></div>
      {/each}
    </div>
    
    <br>
    
    <div class="color-squares">
      <div class="color-square" style="{`background: oklch(15% 0.10 30)`};"></div>
      <div class="color-square" style="{`background: oklch(30% 0.20 30)`};"></div>
      <div class="color-square" style="{`background: oklch(60% 0.30 30)`};"></div>
      <div class="color-square" style="{`background: oklch(75% 0.23 30)`};"></div>
      <div class="color-square" style="{`background: oklch(85% 0.10 30)`};"></div>
      
      <div class="color-square" style="{`background: oklch(15% 0.10 82)`};"></div>
      <div class="color-square" style="{`background: oklch(30% 0.20 82)`};"></div>
      <div class="color-square" style="{`background: oklch(60% 0.30 82)`};"></div>
      <div class="color-square" style="{`background: oklch(75% 0.23 82)`};"></div>
      <div class="color-square" style="{`background: oklch(85% 0.10 82)`};"></div>
      
      <div class="color-square" style="{`background: oklch(15% 0.10 160)`};"></div>
      <div class="color-square" style="{`background: oklch(30% 0.20 160)`};"></div>
      <div class="color-square" style="{`background: oklch(60% 0.30 160)`};"></div>
      <div class="color-square" style="{`background: oklch(75% 0.23 160)`};"></div>
      <div class="color-square" style="{`background: oklch(85% 0.10 160)`};"></div>
      
      <div class="color-square" style="{`background: oklch(15% 0.10 230)`};"></div>
      <div class="color-square" style="{`background: oklch(30% 0.20 230)`};"></div>
      <div class="color-square" style="{`background: oklch(60% 0.30 230)`};"></div>
      <div class="color-square" style="{`background: oklch(75% 0.23 230)`};"></div>
      <div class="color-square" style="{`background: oklch(85% 0.10 230)`};"></div>
      
      <div class="color-square" style="{`background: oklch(15% 0.10 290)`};"></div>
      <div class="color-square" style="{`background: oklch(30% 0.20 290)`};"></div>
      <div class="color-square" style="{`background: oklch(60% 0.30 290)`};"></div>
      <div class="color-square" style="{`background: oklch(75% 0.23 290)`};"></div>
      <div class="color-square" style="{`background: oklch(85% 0.10 290)`};"></div>

      <div class="color-square" style="{`background: oklch(15% 0.10 350)`};"></div>
      <div class="color-square" style="{`background: oklch(30% 0.20 350)`};"></div>
      <div class="color-square" style="{`background: oklch(60% 0.30 350)`};"></div>
      <div class="color-square" style="{`background: oklch(75% 0.23 350)`};"></div>
      <div class="color-square" style="{`background: oklch(85% 0.10 350)`};"></div>
    </div>
    
    <br>
    
    <div class="color-squares">
      <div class="color-square" style="{`background: lch(25% 50 30)`};"></div>
      <div class="color-square" style="{`background: lch(25% 50 30)`};"></div>
      <div class="color-square" style="{`background: lch(25% 50 30)`};"></div>
      <div class="color-square" style="{`background: lch(50% 90 30)`};"></div>
      <div class="color-square" style="{`background: lch(75% 50 30)`};"></div>

      <div class="color-square" style="{`background: lch(25% 50 70)`};"></div>
      <div class="color-square" style="{`background: lch(25% 50 70)`};"></div>
      <div class="color-square" style="{`background: lch(25% 50 70)`};"></div>
      <div class="color-square" style="{`background: lch(50% 90 70)`};"></div>
      <div class="color-square" style="{`background: lch(75% 50 70)`};"></div>
      
      <div class="color-square" style="{`background: lch(25% 50 120)`};"></div>
      <div class="color-square" style="{`background: lch(25% 50 120)`};"></div>
      <div class="color-square" style="{`background: lch(25% 50 120)`};"></div>
      <div class="color-square" style="{`background: lch(50% 90 120)`};"></div>
      <div class="color-square" style="{`background: lch(75% 50 120)`};"></div>

      <div class="color-square" style="{`background: lch(25% 50 300)`};"></div>
      <div class="color-square" style="{`background: lch(25% 50 300)`};"></div>
      <div class="color-square" style="{`background: lch(25% 50 300)`};"></div>
      <div class="color-square" style="{`background: lch(50% 90 300)`};"></div>
      <div class="color-square" style="{`background: lch(75% 50 300)`};"></div>

    </div>

  </section>
</article>

<!-- CSS -->
<style>

  .color-squares {
    display: grid;
    grid-template-columns: repeat(5, 4rem);
    gap: var(--gap);
  }
  .color-square {
    /* width: 4rem; */
    height: 4rem;
    /* https://oklch.evilmartians.io/#78.2,0.098,207.765,100 */
    /* background: oklch(60% 0.22 293); */
  }



  /* .button {
    --button-color:   var(--accent);
    background: var(--button-color);
  }
  .button.is-secondary {
    --button-color:   var(--dimmed);
  }
  .button.is-error {
    --button-color:   var(--error);
  }
  .button:hover {
    background: oklch(from var(--button-color) calc(l + 10%) c h);
  } */




  /* Flex + Widths */
  article {
    height: 100%;
    overflow: auto;
    display: flex;
  }
  aside {
    min-width: 300px;
    padding: var(--gap);
    border-right: var(--border);
    border-color: var(--color-border-section);

    display: grid;
    align-content: flex-start;
    gap: var(--gap);
  }
  section {
    flex-grow: 1;
    padding: var(--gap);

    display: grid;
    align-content: flex-start;
    gap: var(--gap);
  }

  @media (max-width: 800px) {
    article { 
      display: flex;
      flex-direction: column;
    }
    aside {
      padding: var(--gap);
      border-right: none;
      border-bottom: var(--border);
      border-color: var(--color-border-section);
    }
  }

</style>