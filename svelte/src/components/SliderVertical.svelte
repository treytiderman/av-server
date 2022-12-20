<!-- Javascript -->
<script context="module">
  let counter = 0
</script>
<script>

  // Event Dispatcher
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // Exports
  export let label = ""
  export let value = 50
  export let max = 100
  export let min = 0
  export let units = "%"
  export let disabled = false

  // Variables
  let id = "slider_" + counter++;

  // Dynamic Variables
  $: percent = ((value - min) / (max - min)) * 100;
  $: background = `linear-gradient(to right, var(--color-bg-highlight) 0% ${percent}%, var(--color-bg-input) ${percent}% 100%)`

</script>

<!-- HTML -->
<div>
  <label 
    for={id}
    hidden={label === ""}>
    {label}
    <output>
      {value} {units}
    </output>
  </label>
  <div class="rotation-wrapper-outer">
    <div class="rotation-wrapper-inner">
      <input
        type="range" 
        id={id}
        max={max}
        min={min}
        disabled={disabled}
        class="element-to-rotate"
        style="background: {background}"
        bind:value={value}
        on:input
      >
    </div>
  </div>
</div>

<!-- CSS -->
<style>
  div {
    border: 1px solid red;
  }
  input[type=range] {
    -webkit-appearance: none;
    /* width: 100%; */
    min-width: 150px;
    height: var(--gap);
    margin: calc(var(--gap)*1.25) 0 var(--pad) 0;
    padding: 0;
    border: none;
    border-radius: var(--radius);
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: calc(var(--gap)*2);
    width: calc(var(--gap)*1.5);
    border: var(--border);
    border-color: var(--color-text);
    border-radius: var(--radius);
    background-color: var(--color-text);
  }
  input[type=range]::-moz-range-thumb {
    height: calc(var(--gap)*2);
    width: calc(var(--gap)*1.5);
    border: var(--border);
    border-color: var(--color-text);
    border-radius: var(--radius);
    background-color: var(--color-text);
  }
  input[type=range]:focus {
    outline: none;
  }
  input[type=range]:disabled {
    filter: var(--filter-brightness-disable);
    cursor: not-allowed;
  }
  label {
    display: flex;
    /* border: 1px solid red; */
  }
  output {
    margin-left: auto;
  }

  .rotation-wrapper-outer {
    display: table;
  }
  .rotation-wrapper-inner {
    padding: 50% 0;
    height: 0;
  }
  .element-to-rotate {
    display: block;
    transform-origin: top left;
    /* Note: for a CLOCKWISE rotation, use the commented-out transform instead of this one. */
    transform: rotate(-90deg) translate(-100%);
    /* transform: rotate(90deg) translate(0, -100%); */
  }
</style>