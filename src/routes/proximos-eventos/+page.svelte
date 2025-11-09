<script>
  import '../../app.css';
  import ConcertCard from '$lib/components/molecules/ConcertCard.svelte';
  import Container from '$lib/components/layout/Container.svelte';
  import Footer from '$lib/components/organisms/Footer.svelte';
  
  // Solo eventos próximos (no finalizados)
  const upcomingConcerts = [
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
      id: '8',
      title: 'Alicante',
      artist: 'Hayko',
      date: '2025-12-08',
      venue: 'Teatro Principal Alicante',
      image: '/carousel/image-1.jpg',
      price: 'Desde 45€',
      category: 'Rock',
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
    }
  ];

  let selectedCity = 'Todas';
  let selectedCategory = 'Todas';
  let sortBy = 'date'; // date, price, availability

  // Obtener valores únicos para filtros
  $: cities = ['Todas', ...new Set(upcomingConcerts.map(concert => concert.title))].sort();
  $: categories = ['Todas', ...new Set(upcomingConcerts.map(concert => concert.category))].sort();

  // Filtrar eventos
  $: filteredConcerts = upcomingConcerts.filter(concert => {
    const cityMatch = selectedCity === 'Todas' || concert.title === selectedCity;
    const categoryMatch = selectedCategory === 'Todas' || concert.category === selectedCategory;
    return cityMatch && categoryMatch;
  });

  // Ordenar eventos
  $: sortedConcerts = [...filteredConcerts].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.date) - new Date(b.date);
    } else if (sortBy === 'price') {
      const priceA = parseInt(a.price.replace(/\D/g, '')) || 0;
      const priceB = parseInt(b.price.replace(/\D/g, '')) || 0;
      return priceA - priceB;
    } else if (sortBy === 'availability') {
      const order = { 'available': 0, 'limited': 1, 'sold-out': 2 };
      return order[a.availability] - order[b.availability];
    }
    return 0;
  });
</script>

<svelte:head>
  <title>Próximos Eventos - TicketsDMK</title>
  <meta name="description" content="Descubre todos nuestros próximos eventos musicales. Reserva tu entrada para los mejores espectáculos." />
</svelte:head>

<main class="min-h-screen bg-gray-50">
  <!-- Header -->
  <section class="bg-green-800 text-white py-16">
    <Container>
      <div class="text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Próximos Eventos</h1>
        <p class="text-xl text-green-100 max-w-2xl mx-auto">
          No te pierdas estos increíbles eventos que vienen
        </p>
        <div class="mt-6 inline-flex items-center px-4 py-2 bg-green-700 rounded-full text-green-100">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          {upcomingConcerts.length} eventos disponibles
        </div>
      </div>
    </Container>
  </section>

  <!-- Filters -->
  <section class="py-8 bg-white border-b">
    <Container>
      <div class="flex flex-wrap gap-4 justify-center">
        <!-- City Filter -->
        <div class="flex flex-col">
          <label for="city-filter" class="text-sm font-medium text-gray-700 mb-2">Ciudad</label>
          <select id="city-filter" bind:value={selectedCity} class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
            {#each cities as city}
              <option value={city}>{city}</option>
            {/each}
          </select>
        </div>

        <!-- Category Filter -->
        <div class="flex flex-col">
          <label for="category-filter" class="text-sm font-medium text-gray-700 mb-2">Categoría</label>
          <select id="category-filter" bind:value={selectedCategory} class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
            {#each categories as category}
              <option value={category}>{category}</option>
            {/each}
          </select>
        </div>

        <!-- Sort Filter -->
        <div class="flex flex-col">
          <label for="sort-filter" class="text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
          <select id="sort-filter" bind:value={sortBy} class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option value="date">Fecha</option>
            <option value="price">Precio</option>
            <option value="availability">Disponibilidad</option>
          </select>
        </div>

        <!-- Reset Filters -->
        <div class="flex flex-col justify-end">
          <button 
            on:click={() => { selectedCity = 'Todas'; selectedCategory = 'Todas'; sortBy = 'date'; }}
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </Container>
  </section>

  <!-- Events Grid -->
  <section class="py-16">
    <Container>
      {#if sortedConcerts.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {#each sortedConcerts as concert}
            <ConcertCard {concert} />
          {/each}
        </div>

        <!-- Results Count -->
        <div class="text-center mt-12">
          <p class="text-gray-600">
            Mostrando {sortedConcerts.length} de {upcomingConcerts.length} próximos eventos
          </p>
        </div>
      {:else}
        <!-- No Results -->
        <div class="text-center py-16">
          <svg class="w-24 h-24 mx-auto mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <h3 class="text-2xl font-semibold text-gray-900 mb-4">No se encontraron eventos próximos</h3>
          <p class="text-gray-600 mb-6">Intenta ajustar los filtros para encontrar más eventos.</p>
          <button 
            on:click={() => { selectedCity = 'Todas'; selectedCategory = 'Todas'; }}
            class="px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Ver todos los próximos eventos
          </button>
        </div>
      {/if}

      <!-- Navigation -->
      <div class="flex flex-wrap gap-4 justify-center mt-16">
        <a 
          href="/" 
          class="inline-flex items-center px-6 py-3 border border-green-800 text-green-800 rounded-lg hover:bg-green-50 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Volver al inicio
        </a>
        
        <a 
          href="/concerts" 
          class="inline-flex items-center px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Ver todos los eventos
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
      </div>
    </Container>
  </section>
</main>

<Footer />