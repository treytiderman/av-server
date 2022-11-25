<!-- Javascript -->
<script>

  // Import Components
  import Icon from '../components/Icon.svelte'

</script>

<!-- HTML -->
<section>

  <!-- This Computer -->
  <aside>
    <h4>This Computer</h4>

    <!-- NIC Info -->
    <div class="nicInfo">
      <label>
        Interface <br>
        <select>
          <option>Ethernet</option>
          <option>WiFi</option>
        </select>
      </label>
      <div>xxx.xxx.xxx.xxx</div>
      <div>Mask: xxx.xxx.xxx.xxx</div>
      <!-- {#if nic.ips}        
        <div></div>
      {/if} -->
      <div>Gate: xxx.xxx.xxx.xxx</div>
      <div>DNS1: xxx.xxx.xxx.xxx</div>
      <div>DNS2: xxx.xxx.xxx.xxx</div>
      <div>DHCP: true</div>
      <div>Metric: 99</div>
    </div>

  </aside>

  <!-- Preset Actions + Presets -->
  <article>

    <!-- Preset Actions -->
    <div class="actions">
      <h4>Preset Actions</h4>
      <div class="actionButtons">
        <button>
          Set 
          <Icon name="check" size=1 />
        </button>
        <button>
          Add 
          <Icon name="plus" size=1 />
        </button>
        <button>
          <span>Remove</span>
          <Icon name="trash" size=1 />
        </button>
      </div>
    </div>

    <!-- Presets -->
    <div>
      <h4>Presets</h4>
      <div>
        
      </div>
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

  .nicInfo {
    display: grid;
    align-content: flex-start;
    gap: var(--pad);
    width: 300px;
  }
  .actions {
    display: grid;
    align-content: flex-start;
    gap: var(--pad);
  }
  .actionButtons {
    display: flex;
    align-items: center;
    gap: var(--pad);
  }

  button {
    display: flex;
    align-items: center;
    gap: var(--pad);
  }

</style>