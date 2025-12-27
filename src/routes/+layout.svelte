<script lang="ts">
  import Header from '$lib/components/organisms/Header.svelte';
  import '../app.css';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  let loading = true;
  const title = 'TICKETSDMK';

  onMount(() => {
    setTimeout(() => {
      loading = false;
    }, 4500); // ajustable: aumentado para completar la animación lenta
  });
</script>

{#if loading}
  <div class="loading-screen" role="status" aria-live="polite">
    <div class="loader-card">
      <span class="logo-title" aria-hidden="true">
        {#each title.split('') as ch, i}
          <span style="--i:{i}">{ch}</span>
        {/each}
      </span>
      <h1 class="visually-hidden">Cargando eventos…</h1>
    </div>
  </div>
{/if}

<Header />
<main class="app-main" role="main">
  <slot />
</main>
