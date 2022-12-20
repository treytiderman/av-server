<!-- Javascript -->
<script>

  // Components
  import Icon from '../../components/Icon.svelte'
  import Slider from '../../components/Slider.svelte'
  import SliderVertical from '../../components/SliderVertical.svelte'

</script>

<!-- HTML -->
<article>

  <h2>Sliders</h2>
  <Slider label="Label"/>
  <Slider label="Specific Min Max and Units" min=-36 max=6 value=-12 units="dB"/>
  <Slider label="Disabled" disabled=true/>
  
  <h2>Vertical Slider</h2>
  <div>
    <SliderVertical label="Label"/>
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