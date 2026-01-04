<script>
  import EventsView from '$lib/components/organisms/EventsView.svelte';
  import Footer from '$lib/components/organisms/Footer.svelte';

  export let data;
  const events = data.events ?? [];
</script>

<svelte:head>
  <title>Eventos - TicketsDMK</title>
  <meta name="description" content="Explora nuestros próximos eventos musicales." />
</svelte:head>

<EventsView {events} />

<Footer />
