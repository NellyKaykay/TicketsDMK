<script lang="ts">
  import ConcertCarousel from '$lib/components/organisms/ConcertCarousel.svelte';
  import Container from '$lib/components/layout/Container.svelte';
  import Footer from '$lib/components/organisms/Footer.svelte';

  type Concert = {
    id: string;
    title: string;
    artist: string;
    date: string;
    venue: string;
    image: string;
    price: string;
    category: string;
    availability: "available" | "limited" | "sold-out";
  };

  const sampleConcerts: Concert[] = [
    {
      id: '1',
      title: 'Sala Principal',
      artist: 'Artista Ejemplo',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      venue: 'Teatro Central',
      image: '/images/sample-flyer.jpg',
      price: '20.00',
      category: 'concierto',
      availability: 'available'
    },
    {
      id: '2',
      title: 'Sala Alternativa',
      artist: 'Banda Demo',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      venue: 'Club Local',
      image: '/images/sample-flyer-2.jpg',
      price: '15.00',
      category: 'concierto',
      availability: 'limited'
    }
  ];
</script>

<svelte:head>
  <title>Todos los eventos - TicketsDMK</title>
  <meta name="description" content="Listado de conciertos y eventos." />
</svelte:head>

<main class="min-h-screen bg-gray-50">
  <Container>
    <section class="py-12">
      <h1 class="text-3xl font-bold mb-6" style="color:#003333;">Todos los eventos</h1>
      <ConcertCarousel
        title="Conciertos destacados"
        subtitle="Próximos eventos"
        concerts={sampleConcerts}
        viewAllLink="/events"
      />
    </section>
  </Container>
</main>

<Footer />