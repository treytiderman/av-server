<!-- Javascript -->
<script>
  import { http } from "../js/http";

  // Components
  import Icon from '../components/Icon.svelte'

  // Variables
  let files = {
    "path": "../public/",
    "path_folder": "../public/",
    "path_up": "../",
    "file_name": "",
    "folder_name": "public",
    "isFile": false,
    "isFolder": true,
    "size_bytes": 224,
    "created_iso": "2022-12-31T17:36:38.558Z",
    "accessed_iso": "2023-01-04T15:46:21.423Z",
    "modified_iso": "2023-01-04T15:46:20.989Z",
    "changed_status_iso": "2023-01-04T15:46:20.989Z",
    "contains_files": [],
    "contains_folders": []
  }
  
  // Functions
  import { onMount } from 'svelte';
  onMount(async () => {

    // Get Files
    const response = await http.get.json("/api/files/v1", {port: 4620})
    console.log("files", response)

    files = response

  })


</script>

<!-- HTML -->
<article>
  <h2>{files.path}</h2>
  <hr>
  <div class="header line">
    <span>Name</span>
    <span>Size</span>
    <span>Actions</span>
  </div>
  <div class="line">
    <span>{files.path_up}</span>
    <span></span>
    <span></span>
  </div>
  {#each [...files.contains_files, ...files.contains_folders] as file}
    <div class="line">
      <span>{file.file_name}</span>
      <span>{(file.size_bytes / 1024).toFixed(2)} KB</span>
      <span>
        <button class="clear" style="padding: calc(var(--pad)/2);">
          <Icon name="plus" color="var(--color-text-dim)"/>
        </button>
      </span>
    </div>
  {/each}
</article>

<!-- CSS -->
<style>
  article {
    padding: var(--gap);
  }
  .header {
    border-bottom: var(--border);
    padding-bottom: calc(var(--pad)/2);
  }
  .line {
    display: flex;
    gap: var(--gap);
    align-items: center;
    /* border: 1px solid blue; */
  }
  .line > *:nth-child(1) {
    padding-left: var(--pad);
    min-width: 12rem;
  }
  .line > *:nth-child(2) {
    min-width: 6rem;
    /* border: 1px solid red; */
  }
  .line > *:nth-child(3) {
    margin-left: auto;
    padding-right: var(--pad);
    /* color: var(--color-text-dim); */
    /* min-width: 6rem; */
    /* border: 1px solid red; */
  }
</style>