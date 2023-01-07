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
  async function folderPress(path) {
    path = path.replace("..", "")
    path = path.replace("/public", "")
    const response = await http.post.json("/api/files/v1", {path: path}, {port: 4620})
    console.log("files", response)

    files = response
  }

  // Startup
  import { onMount } from "svelte";
  onMount(async () => {

    // Get Files
    folderPress("/")

  })


</script>

<!-- HTML -->
<article>
  <div class="header line">
    <span>Name</span>
    <span>Size</span>
  </div>
  <button class="line" on:click={() => folderPress(files.path_up)}>
    <span>{files.path}</span>
    <span></span>
  </button>
  {#each [...files.contains_folders, ...files.contains_files] as file}
    {#if file.isFile}
      <a class="line" href={file.path.replace("../public", "")}>
        <span>{file.file_name}</span>
        <span>{(file.size_bytes / 1024).toFixed(2)} KB</span>
      </a>
    {:else if file.isFolder}
      <button class="line" on:click={() => folderPress(file.path)}>
        <span>{file.file_name}</span>
        <span></span>
      </button>
    {/if}
  {/each}
</article>

<!-- CSS -->
<style>
  article {
    padding: var(--gap);
  }
  a {
    text-decoration: none;
    color: var(--color-text-bright);
  }
  .header {
    border-bottom: var(--border);
    padding-bottom: calc(var(--pad)/2);
  }
  .line {
    display: flex;
    gap: var(--gap);
    align-items: center;
    padding: 0;
    text-align: left;
    background-color: transparent;
    border-radius: var(--radius);
    width: 100%;
    /* border: 1px solid blue; */
  }
  .line > *:nth-child(1) {
    padding-left: var(--pad);
  }
  .line > *:nth-child(2) {
    /* min-width: 6rem; */
    margin-left: auto;
    padding-right: var(--pad);
    /* border: 1px solid red; */
  }
</style>