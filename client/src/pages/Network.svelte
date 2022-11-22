<!-- Javascript -->
<script>

  // Import Components
  import Icon from '../components/Icon.svelte'

</script>

<!-- HTML -->
<section>

  <!-- Connection Settings -->
  <aside>
    <h4>This Computer</h4>
    <div>

      <label>
        Interface <br>
        <select>
          <option>Ethernet</option>
          <option>WiFi</option>
        </select>
      </label>

      <!-- nicInfo -->
      <div>
        <span class="w90-t     ">xxx.xxx.xxx.xxx</span>
        <span class="w50-t t-sm mb-1">Mask: xxx.xxx.xxx.xxx</span>
        <div class="grid gap-0 t-mono">
          <!-- For added IPs -->
        </div>
        <span class="w50-t t-sm mb-1">Gate: xxx.xxx.xxx.xxx</span>
        <span class="w50-t t-sm">DNS1: xxx.xxx.xxx.xxx</span>
        <span class="w50-t t-sm mb-1">DNS2: xxx.xxx.xxx.xxx</span>
        <span class="w50-t t-sm">DHCP: true</span>
        <span
          onclick="dialogOpen('interfaceMetricPopup')" 
          style="width: fit-content;">
          Metric: 99
        </span>
      </div>

    </div>
  </aside>

  <!-- Terminal -->
  <article>
    <h4>This Computer</h4>
    <div>
      
    </div>
  </article>

</section>

<!-- CSS -->
<style>
  section {
    /* padding: var(--gap); */
    /* max-width: 1200px; */
    margin: auto;
    display: grid;
    grid-template-columns: auto 1fr;
    flex-wrap: wrap;
    height: 100%;
    /* gap: var(--gap); */
    align-items: flex-start;
  }
  aside {
    padding: var(--gap);
    border-color: var(--color-header);
    display: grid;
    align-content: flex-start;
    height: 100%;
    gap: var(--gap);
  }
  article {
    padding: var(--gap);
    display: grid;
    align-content: flex-start;
    width: 100%;
    height: 100%;
    gap: var(--gap);
  }
  /* If width is less than 960px */
  @media (max-width: 960px) {
    section {
      grid-template-columns: 1fr;
    }
    aside {
      border-bottom: var(--border);
    }
  }
  /* If width is greater than 960px */
  @media (min-width: 960px) {
    aside {
      border-right: var(--border);
    }
  }

</style>