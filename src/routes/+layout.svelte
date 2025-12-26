<script lang="ts">
  import Header from '$lib/components/organisms/Header.svelte';
  import '../app.css';
  import { onMount } from 'svelte';

  let loading = true;
  const title = 'TICKETSDMK';

  onMount(() => {
    setTimeout(() => {
      loading = false;
    }, 1200); // ajustable
  });
</script>

{#if loading}
  <div class="loading-screen">
    <div class="loader-card">
      <div class="logo-wrap">
        <img src="/logo.png" alt="TicketsDMK" />
        <h1 class="logo-title">
          {#each title.split('') as ch, i}
            <span style="--i:{i}">{ch}</span>
          {/each}
        </h1>
      </div>
      <p class="loading-sub">Cargando eventos…</p>
      <span class="spinner" aria-hidden="true"></span>
    </div>
  </div>
{/if}

<Header />
<slot />
