<!-- Javascript -->
<script>

  // Components
  import Icon from '../../components/Icon.svelte'

</script>

<!-- HTML -->
<article>
  <h2>Heading h2</h2>
  <p>
    Paragraph of text...
    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
    Dolore doloribus nobis error repellat vitae, sit quasi 
    earum eveniet necessitatibus architecto alias officia 
    nemo accusamus ratione, delectus sint aut porro nam.
  </p>
  <div>
    <button>Button</button>
  </div>
</article>

<!-- CSS -->
<style>
  article {
    padding: var(--gap);
    max-width: 1200px;
    overflow: auto;
    margin: auto;
    height: 100%;

    display: grid;
    gap: var(--gap);
    align-content: flex-start;
  }
</style>