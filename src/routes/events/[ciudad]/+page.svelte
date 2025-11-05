<script>
  import '../../../app.css';
  import { page } from '$app/stores';
  import Footer from '$lib/components/organisms/Footer.svelte';
  
  $: ciudad = $page.params.ciudad;
  
  // Todos los eventos disponibles
  const allConcerts = [
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
  
  // Filtrar eventos por ciudad
  $: cityEvents = allConcerts.filter(concert => 
    concert.title.toLowerCase() === ciudad?.toLowerCase()
  );
  
  // Capitalizar primera letra de la ciudad
  $: cityName = ciudad ? ciudad.charAt(0).toUpperCase() + ciudad.slice(1) : '';
  
  // Verificar si la ciudad existe
  $: validCity = cityEvents.length > 0;
</script>

<svelte:head>
  <title>Eventos en {cityName} - TicketsDMK</title>
  <meta name="description" content="Descubre todos los eventos musicales disponibles en {cityName}. Compra tus entradas de forma segura." />
  <meta name="keywords" content="eventos, entradas, música, {cityName}, conciertos, tickets" />
</svelte:head>

<main class="min-h-screen bg-gray-50">
  {#if validCity}
    <!-- Hero Section para la ciudad -->
    <section class="bg-gradient-to-r from-green-800 to-green-600 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-4">
            Eventos en {cityName}
          </h1>
          <p class="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
            Descubre los mejores eventos musicales en {cityName}. 
            {cityEvents.length} eventos disponibles.
          </p>
        </div>
      </div>
    </section>

    <!-- Lista de eventos -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-12">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 class="text-3xl font-bold text-gray-900 mb-2">
                Todos los eventos en {cityName}
              </h2>
              <p class="text-gray-600">
                {cityEvents.length} eventos encontrados
              </p>
            </div>
            <a 
              href="/" 
              class="inline-flex items-center text-green-800 hover:text-green-600 font-medium"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Volver al inicio
            </a>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {#each cityEvents as concert}
            <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
              <img src={concert.image} alt="{concert.artist} en {concert.title}" class="w-full h-48 object-cover" />
              <div class="p-6">
                <div class="flex items-start justify-between mb-3">
                  <h3 class="text-xl font-bold text-gray-900">{concert.artist}</h3>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    {concert.availability === 'available' ? 'bg-green-100 text-green-800' : 
                     concert.availability === 'limited' ? 'bg-yellow-100 text-yellow-800' : 
                     'bg-red-100 text-red-800'}">
                    {concert.availability === 'available' ? 'Disponible' : 
                     concert.availability === 'limited' ? 'Últimas entradas' : 
                     'Agotado'}
                  </span>
                </div>
                
                <div class="space-y-2 mb-4">
                  <p class="text-gray-600 flex items-center">
                    <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    {new Date(concert.date).toLocaleDateString('es-ES', { 
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p class="text-gray-600 flex items-center">
                    <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {concert.venue}
                  </p>
                  <p class="text-gray-600 flex items-center">
                    <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                    {concert.category}
                  </p>
                </div>
                
                <div class="flex items-center justify-between">
                  <span class="text-2xl font-bold text-green-800">{concert.price}</span>
                  <button class="bg-green-800 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200
                    {concert.availability === 'sold-out' ? 'opacity-50 cursor-not-allowed' : ''}"
                    disabled={concert.availability === 'sold-out'}>
                    {concert.availability === 'sold-out' ? 'Agotado' : 'Comprar Entradas'}
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>
  {:else}
    <!-- Ciudad no encontrada -->
    <section class="py-16 text-center">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-md mx-auto">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Ciudad no encontrada</h1>
          <p class="text-gray-600 mb-6">
            No hemos encontrado eventos para "{cityName}". 
            Prueba con Barcelona, Madrid, Valencia o Alicante.
          </p>
          <a 
            href="/" 
            class="inline-flex items-center bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Volver al inicio
          </a>
        </div>
      </div>
    </section>
  {/if}
</main>

<Footer />