<!-- Javascript -->
<script>

  // Sizing
  export let size = undefined
  export let width = undefined
  export let height = undefined
  if (size !== undefined) {
    width = size
    height = size
  }

  // Color
  export let colorBg = undefined
  export let colorText = "currentColor"

  // Padding
  export let pad = 0
  // pad = `calc(var(--gap)*${pad})`

  // Gap
  export let gap = 1
  gap = `calc(var(--gap)*${gap})`

  // Flex
  export let flex = false
  export let even = false
  export let column = false
  
  // Resize
  export let resize = false
  export let resizeX = false
  export let resizeY = false
  
</script>

<!-- HTML -->
<div
  class:flex={flex}
  class:flex-even={even}
  class:flex-column={column}
  class:resize={resize}
  class:resizeX={resizeX}
  class:resizeY={resizeY}
  class="{$$props.class}"
  style="
    width: {width}rem;
    height: {height}rem;
    color: {colorText};
    background-color: {colorBg};
    padding: {`calc(var(--gap)*${pad})`};
    gap: {gap};
    {$$props.style}
">
  <slot/>
</div>

<style>
  div { border: 1px solid var(--color-text-dim); }

  div {
    overflow: auto;
  }

  /* Flex */
  .flex {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
  }
  .flex-column {
    flex-direction: column;
    flex-wrap: nowrap;
  }
  :global(.flex-even > *) {
    flex: 1 0 0%;
  }
  .major-end { align-items: flex-end; }
  .major-start { align-items: flex-start; }
  .major-center { align-items: center; }
  .major-stretch { align-items: stretch; }
  .cross-end { justify-content: flex-end; }
  .cross-start { justify-content: flex-start; }
  .cross-center { justify-content: center; }
  .cross-space-between { justify-content: space-between; }

  /* resize */
  .resize {
    resize: both;
    overflow: scroll;
  }
  .resizeX {
    resize: horizontal;
  }
  .resizeY {
    resize: vertical;
  }

</style>