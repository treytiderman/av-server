<script>
    import { global } from "../js/global";

    let reloadShow = false
    let reloadTimeout = setTimeout(() => {
        reloadShow = true
    }, 2000)
</script>

<main class="grid" style="padding: var(--gap)">
    <h2>Lost connection to server {$global.url.ip}:{$global.url.port} on {localStorage.getItem("server_offline")}</h2>
    <br>
    {#if reloadShow}    
        <section>
            <a class="button" href="/">Reload?</a>
        </section>
    {/if}
</main>

<style>
    .button {
        padding: var(--pad);
        border-radius: var(--radius);
        background-color: var(--color-bg-blue);
        color: var(--color-text-blue);
        text-decoration: none;
    }
</style>