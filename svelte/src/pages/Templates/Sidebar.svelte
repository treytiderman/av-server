<!-- Javascript -->
<script>

  // Components
  import Icon from '../../components/Icon.svelte'

</script>

<!-- HTML -->
<article>
  <aside class="grid">
    <h2>aside</h2>
    <!-- Put content here -->
  </aside>
  <section class="grid">
    <h2>section</h2>
    <!-- Put content here -->
  </section>
</article>

<!-- CSS -->
<style>

  /* Sidebar */
  article {
    height: 100%;
    overflow: auto;
    display: flex;
  }
  aside {
    min-width: 20rem;
    padding: var(--gap);
    border-right: var(--border);
    border-color: var(--color-border-section);
  }
  section {
    flex-grow: 1;
    padding: var(--gap);
  }
  @media (max-width: 50rem) {
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

  /* Page Styles */
  

</style>