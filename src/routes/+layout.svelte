<script lang="ts">
  import Header from '$lib/components/organisms/Header.svelte';
  import PageLoader from '$lib/components/atoms/PageLoader.svelte';
  import '../app.css';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { tick } from 'svelte';

  let loading = true;
  onMount(async () => {
    await tick();
    loading = false;
  });
</script>

<!-- Global loading screen removed. -->

<svelte:head>
  <title>TicketsDMK | Entradas para conciertos y eventos</title>

  <meta
    name="description"
    content="Compra entradas para conciertos y eventos en Barcelona y otras ciudades. TicketsDMK ofrece venta segura, rápida y sin complicaciones."
  />

  <link rel="canonical" href="https://ticketsdmk.com/" />

  <html lang="es"></html>
</svelte:head>
<Header />
{#if loading}
  <PageLoader ariaLabel="Cargando..." />
{:else}
  <main class="app-main">
    <slot />
  </main>
{/if}
