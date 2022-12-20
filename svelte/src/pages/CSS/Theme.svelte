<!-- Javascript -->
<script>

  // Components
  import Icon from '../../components/Icon.svelte'

</script>

<!-- HTML -->
<article>
  <h2>Heading</h2>
  <p>
    Paragraph of text...
    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
    Dolore doloribus nobis error repellat vitae, sit quasi 
    earum eveniet necessitatibus architecto alias officia 
    nemo accusamus ratione, delectus sint aut porro nam.
  </p>
  <div class="flex">
    <button>Button</button>
    <button disabled>disabled</button>
    <button class="clear">clear</button>
  </div>
  <div class="flex">
    <button class="dim">dim</button>
    <button class="grey">grey</button>
    <button class="red">red</button>
    <button class="orange">orange</button>
    <button class="yellow">yellow</button>
    <button class="lime">lime</button>
    <button class="green">green</button>
    <button class="cyan">cyan</button>
    <button class="blue">blue</button>
    <button class="purple">purple</button>
    <button class="pink">pink</button>
  </div>
  <section>
    <h2>Heading</h2>
    <p>
      Paragraph of text...
      Lorem ipsum dolor sit amet consectetur adipisicing elit. 
      Dolore doloribus nobis error repellat vitae, sit quasi 
      earum eveniet necessitatibus architecto alias officia 
      nemo accusamus ratione, delectus sint aut porro nam.
    </p>
    <div class="flex">
      <button>Button</button>
      <button disabled>disabled</button>
      <button class="clear">clear</button>
    </div>
    <div class="flex">
      <button class="dim">dim</button>
      <button class="grey">grey</button>
      <button class="red">red</button>
      <button class="orange">orange</button>
      <button class="yellow">yellow</button>
      <button class="lime">lime</button>
      <button class="green">green</button>
      <button class="cyan">cyan</button>
      <button class="blue">blue</button>
      <button class="purple">purple</button>
      <button class="pink">pink</button>
    </div>
  </section>
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
  section {
    padding: var(--gap);
    background-color: var(--color-bg-section);
    border-radius: var(--radius-lg);
    display: grid;
    gap: var(--gap);
    align-content: flex-start;
  }
  .flex {
    display: flex;
    gap: var(--gap);
    flex-wrap: wrap;
  }

</style>