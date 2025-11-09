<script>
  import '../app.css';
  import HeroSection from '$lib/components/molecules/HeroSection.svelte';
  import ConcertCarousel from '$lib/components/organisms/ConcertCarousel.svelte';
  import Footer from '$lib/components/organisms/Footer.svelte';
  
  const concerts = [
    // Barcelona Events
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
      id: '5',
      title: 'Barcelona',
      artist: 'Aram MP3',
      date: '2025-11-25',
      venue: 'Palau de Vidre Barcelona',
      image: '/carousel/image-2.jpg',
      price: 'Desde 50€',
      category: 'Pop',
      availability: 'available'
    },
    {
      id: '9',
      title: 'Barcelona',
      artist: 'Sirusho',
      date: '2025-12-05',
      venue: 'Teatro del Liceu Barcelona',
      image: '/carousel/image-3.jpg',
      price: 'Desde 60€',
      category: 'Traditional',
      availability: 'limited'
    },
    // Valencia Events
    {
      id: '2',
      title: 'Valencia',
      artist: 'Tata Simonyan',
      date: '2025-11-28',
      venue: 'Teatro Real Valencia',
      image: '/carousel/image-2.jpg',
      price: 'Desde 55€',
      category: 'Jazz',
      availability: 'limited'
    },
    {
      id: '6',
      title: 'Valencia',
      artist: 'Emmy',
      date: '2025-12-10',
      venue: 'Palacio de la Música Valencia',
      image: '/carousel/image-4.jpg',
      price: 'Desde 40€',
      category: 'Modern',
      availability: 'available'
    },
    // Madrid Events
    {
      id: '3',
      title: 'Madrid',
      artist: 'Brunete',
      date: '2025-12-31',
      venue: 'Palacio de la Música Madrid',
      image: '/carousel/image-4.jpg',
      price: 'Desde 65€',
      category: 'Electronic',
      availability: 'available'
    },
    {
      id: '7',
      title: 'Madrid',
      artist: 'Armen Aloyan',
      date: '2025-11-15',
      venue: 'Teatro Real Madrid',
      image: '/carousel/image-1.jpg',
      price: 'Desde 70€',
      category: 'Folk',
      availability: 'available'
    },
    {
      id: '10',
      title: 'Madrid',
      artist: 'Nvard Poghosyan',
      date: '2025-12-20',
      venue: 'Auditorio Nacional Madrid',
      image: '/carousel/image-3.jpg',
      price: 'Desde 55€',
      category: 'Classical',
      availability: 'limited'
    },
    // Alicante Events
    {
      id: '4',
      title: 'Alicante',
      artist: 'Arkadi Dumikyan',
      date: '2025-11-20',
      venue: 'Sala Riviera Alicante',
      image: '/carousel/image-3.jpg',
      price: 'Desde 35€',
      category: 'Acoustic',
      availability: 'sold-out'
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
  <div class="relative">
    <HeroSection />
    
    <!-- Floating Event Card -->
    {#if nextEvent}
      <div class="absolute top-8 right-32 hidden xl:block z-10">
        <div class="bg-green-50 rounded-xl border-2 border-gray-300 p-8 w-[440px] 
                    shadow-[0_40px_80px_-15px_rgba(75,85,99,0.8)] 
                    drop-shadow-[0_40px_40px_rgba(55,65,81,0.6)]
                    hover:shadow-[0_50px_100px_-10px_rgba(75,85,99,1)]
                    hover:drop-shadow-[0_50px_50px_rgba(55,65,81,0.8)]
                    hover:-translate-y-3 hover:scale-105 transition-all duration-500 ease-out">
          <!-- Badge -->
          <div class="flex items-center justify-between mb-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Próximo Evento
            </span>
            <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium {
              nextEvent.availability === 'available' ? 'bg-green-100 text-green-800' :
              nextEvent.availability === 'limited' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }">
              {nextEvent.availability === 'available' ? 'Disponible' :
               nextEvent.availability === 'limited' ? 'Limitado' : 'Agotado'}
            </span>
          </div>
          
          <!-- Event Image -->
          <div class="relative mb-6">
            <img 
              src={nextEvent.image} 
              alt={nextEvent.artist}
              class="w-full h-48 object-cover rounded-lg"
            />
            <div class="absolute top-2 left-2">
              <span class="bg-green-600 text-white px-3 py-2 rounded text-sm font-bold">
                {nextEvent.title}
              </span>
            </div>
          </div>
          
          <!-- Event Details -->
          <div class="space-y-4">
            <div>
              <h3 class="font-bold text-xl text-green-600 truncate">{nextEvent.artist}</h3>
              <p class="text-lg text-gray-900 font-semibold truncate">{nextEvent.venue}</p>
            </div>
            
            <div class="flex items-center text-lg text-green-600 font-medium">
              <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              {new Date(nextEvent.date).toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-xl font-semibold text-gray-900">{nextEvent.price}</span>
            </div>
          </div>
          
          <!-- Action Button -->
          <div class="mt-6">
            <a 
              href="/events/{nextEvent.title.toLowerCase()}"
              class="w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-800 hover:bg-green-700 transition-colors duration-200"
              class:opacity-50={nextEvent.availability === 'sold-out'}
              class:cursor-not-allowed={nextEvent.availability === 'sold-out'}
              aria-disabled={nextEvent.availability === 'sold-out'}
            >
            >
              {nextEvent.availability === 'sold-out' ? 'Agotado' : 'Ver Detalles'}
              {#if nextEvent.availability !== 'sold-out'}
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              {/if}
            </a>
          </div>
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Concert Carousel -->
  <section id="eventos" class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-green-800 sm:text-4xl">
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
      
      <!-- Próximos Eventos -->
      <div>
        <ConcertCarousel {concerts} title="Próximos Eventos" subtitle="No te pierdas estos increíbles eventos que vienen" viewAllLink="/proximos-eventos" />
      </div>
    </div>
  </section>
  
  <!-- Additional content sections can be added here -->
  <section class="py-16 bg-white" id="about">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center">
        <h2 class="text-base text-green-800 font-semibold tracking-wide uppercase">Sobre nosotros</h2>
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
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-green-800 text-white mx-auto">
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
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-green-800 text-white mx-auto">
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
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-green-800 text-white mx-auto">
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
