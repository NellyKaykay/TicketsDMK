<script lang="ts">
  import Header from '$lib/components/organisms/Header.svelte';
  import '../app.css';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
</script>

<!-- Global loading screen removed. -->

<svelte:head>
  <title>TicketsDMK – Entradas para eventos y conciertos</title>
  <meta name="description" content="Compra entradas para conciertos y eventos en España. TicketsDMK conecta con salas, artistas y vuelos al mejor precio." />
  <link rel="canonical" href="https://ticketsdmk.com/" />
</svelte:head>
<Header />
<main class="app-main">
  <slot />
</main>
