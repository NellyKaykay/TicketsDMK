<script>
  import '../app.css';
  import HeroSection from '$lib/components/molecules/HeroSection.svelte';
  import ConcertCarousel from '$lib/components/organisms/ConcertCarousel.svelte';
  import ConcertCard from '$lib/components/molecules/ConcertCard.svelte';
  import Footer from '$lib/components/organisms/Footer.svelte';
  

  const concerts = [
    {
      id: '1',
      title: 'Barcelona',
      artist: 'Tatev Asatryan',
      date: '2025-12-15',
      venue: 'Arena Central Barcelona',
      image: '/carousel/image-1.jpg',
      price: 'Desde 45€',
      category: 'Rock',
      availability: 'available'
    },
    {
      id: '2',
      title: 'Madrid',
      artist: 'Sirusho',
      date: '2025-12-20',
      venue: 'WiZink Center Madrid',
      image: '/carousel/image-2.jpg',
      price: 'Desde 55€',
      category: 'Pop',
      availability: 'limited'
    },
    {
      id: '3',
      title: 'Valencia',
      artist: 'Armen Aloyan',
      date: '2025-12-22',
      venue: 'Palau de la Música Valencia',
      image: '/carousel/image-3.jpg',
      price: 'Desde 40€',
      category: 'Folk',
      availability: 'available'
    },
    {
      id: '4',
      title: 'Sevilla',
      artist: 'Emmy',
      date: '2025-12-25',
      venue: 'Teatro de la Maestranza Sevilla',
      image: '/carousel/image-4.jpg',
      price: 'Desde 60€',
      category: 'Modern',
      availability: 'sold-out'
    },
    {
      id: '5',
      title: 'Barcelona',
      artist: 'Aram MP3',
      date: '2025-11-25',
      venue: 'Palau de Vidre Barcelona',
      image: '/carousel/image-2.jpg',
      price: 'Desde 50€',
      category: 'Pop',
      availability: 'sold-out'
    },
    {
      id: '6',
      title: 'Bilbao',
      artist: 'Hayko',
      date: '2025-12-28',
      venue: 'Palacio Euskalduna Bilbao',
      image: '/carousel/image-1.jpg',
      price: 'Desde 45€',
      category: 'Rock',
      availability: 'available'
    },
    {
      id: '7',
      title: 'Zaragoza',
      artist: 'Armen Aloyan',
      date: '2025-12-30',
      venue: 'Auditorio de Zaragoza',
      image: '/carousel/image-3.jpg',
      price: 'Desde 40€',
      category: 'Folk',
      availability: 'limited'
    },
    {
      id: '8',
      title: 'Alicante',
      artist: 'Hayko',
      date: '2025-12-08',
      venue: 'Teatro Principal Alicante',
      image: '/carousel/image-1.jpg',
      price: 'Desde 45€',
      category: 'Rock',
      availability: 'available'
    }
  ];
  
  const pastConcerts = [
    {
      id: '5',
      title: 'Sevilla',
      artist: 'Aram Asatryan',
      date: '2025-10-15',
      venue: 'Teatro de la Maestranza Sevilla',
      image: '/carousel/image-1.jpg',
      price: 'Finalizado',
      category: 'Traditional',
      availability: 'sold-out'
    },
    {
      id: '6',
      title: 'Bilbao',
      artist: 'Sirusho',
      date: '2025-09-28',
      venue: 'Palacio Euskalduna Bilbao',
      image: '/carousel/image-2.jpg',
      price: 'Finalizado',
      category: 'Pop',
      availability: 'sold-out'
    },
    {
      id: '7',
      title: 'Zaragoza',
      artist: 'Armen Aloyan',
      date: '2025-08-20',
      venue: 'Auditorio de Zaragoza',
      image: '/carousel/image-3.jpg',
      price: 'Finalizado',
      category: 'Folk',
      availability: 'sold-out'
    },
    {
      id: '8',
      title: 'Málaga',
      artist: 'Emmy',
      date: '2025-07-12',
      venue: 'Teatro Cervantes Málaga',
      image: '/carousel/image-4.jpg',
      price: 'Finalizado',
      category: 'Modern',
      availability: 'sold-out'
    }
  ];
  
  // Encontrar el próximo evento (el más cercano en fecha)
  $: nextEvent = concerts
    .filter(concert => new Date(concert.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
</script>

<svelte:head>
  <title>TicketsDMK - Tu plataforma de eventos musicales</title>
  <meta name="description" content="Descubre y compra entradas para los mejores eventos y eventos musicales. La plataforma líder en entretenimiento musical." />
  <meta name="keywords" content="eventos, entradas, música, eventos, tickets, espectáculos" />
  <meta property="og:title" content="TicketsDMK - Tu plataforma de eventos musicales" />
  <meta property="og:description" content="Descubre y compra entradas para los mejores eventos y eventos musicales." />
  <meta property="og:type" content="website" />
</svelte:head>

<main class="min-h-screen bg-white">
  <!-- Hero Section with Floating Event Card -->
  <div class="relative min-h-[60vh] sm:min-h-[70vh]">
    <HeroSection />
  </div>

  <!-- Bloque Próximos Eventos Destacados -->
  <section class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h2 class="text-3xl font-bold text-center mb-8">Próximos Eventos</h2>
    <ConcertCarousel
      title=""
      subtitle=""
      viewAllLink="/proximos-eventos"
      concerts={concerts}
    />
  </section>




  <!-- Concert Carousel: Eventos Pasados -->
  <section id="eventos" class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold sm:text-4xl" style="color: #003333;">
          Eventos Pasados
        </h2>
        <p class="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          Revive los increíbles momentos que ya hemos vivido
        </p>
      </div>
      <!-- Eventos Pasados -->
      <div class="mb-16">
        <ConcertCarousel concerts={pastConcerts} title="" subtitle="" />
      </div>
    </div>
  </section>
  
  <!-- Additional content sections can be added here -->
  <section class="py-16 bg-white" id="about">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center">
        <h2 class="text-base font-semibold tracking-wide uppercase" style="color: #003333;">Sobre nosotros</h2>
        <p class="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
          La mejor experiencia en eventos musicales
        </p>
        <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          Desde 2025, conectamos a los amantes de la música con sus artistas favoritos, 
          ofreciendo una plataforma segura y confiable para la compra de entradas.
        </p>
      </div>

      <div class="mt-10">
        <div class="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
          <div class="text-center">
            <div class="flex items-center justify-center h-12 w-12 rounded-md text-white mx-auto" style="background-color: #003333;">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="mt-5">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Compra segura</h3>
              <p class="mt-2 text-base text-gray-500">
                Transacciones 100% seguras con encriptación SSL y múltiples métodos de pago.
              </p>
            </div>
          </div>

          <div class="text-center">
            <div class="flex items-center justify-center h-12 w-12 rounded-md text-white mx-auto" style="background-color: #003333;">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div class="mt-5">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Entrega instantánea</h3>
              <p class="mt-2 text-base text-gray-500">
                Recibe tus entradas al instante por email y móvil. Sin esperas, sin complicaciones.
              </p>
            </div>
          </div>

          <div class="text-center">
            <div class="flex items-center justify-center h-12 w-12 rounded-md text-white mx-auto" style="background-color: #003333;">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.5a9.5 9.5 0 110 19 9.5 9.5 0 010-19z" />
              </svg>
            </div>
            <div class="mt-5">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Soporte 24/7</h3>
              <p class="mt-2 text-base text-gray-500">
                Nuestro equipo está disponible las 24 horas para ayudarte con cualquier consulta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<!-- Footer -->
<Footer />
