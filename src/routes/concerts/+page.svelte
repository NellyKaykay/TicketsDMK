<script>
  import '../../app.css';
  import ConcertCard from '$lib/components/molecules/ConcertCard.svelte';
  import Container from '$lib/components/layout/Container.svelte';
  import Footer from '$lib/components/organisms/Footer.svelte';
  
  // Todos los eventos (próximos y pasados)
  const allConcerts = [
    // Próximos Eventos
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
    },
    // Eventos Pasados
    {
      id: '11',
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
      id: '12',
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
      id: '13',
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
      id: '14',
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

  let selectedCity = 'Todas';
  let selectedCategory = 'Todas';
  let selectedStatus = 'Todos';

  // Obtener valores únicos para filtros
  $: cities = ['Todas', ...new Set(allConcerts.map(concert => concert.title))].sort();
  $: categories = ['Todas', ...new Set(allConcerts.map(concert => concert.category))].sort();
  $: statuses = ['Todos', 'Próximos', 'Pasados'];

  // Filtrar eventos
  $: filteredConcerts = allConcerts.filter(concert => {
    const cityMatch = selectedCity === 'Todas' || concert.title === selectedCity;
    const categoryMatch = selectedCategory === 'Todas' || concert.category === selectedCategory;
    
    let statusMatch = true;
    if (selectedStatus === 'Próximos') {
      statusMatch = concert.price !== 'Finalizado';
    } else if (selectedStatus === 'Pasados') {
      statusMatch = concert.price === 'Finalizado';
    }
    
    return cityMatch && categoryMatch && statusMatch;
  });
</script>

<svelte:head>
  <title>Todos los Eventos - TicketsDMK</title>
  <meta name="description" content="Explora todos nuestros eventos musicales - próximos y pasados. Encuentra el evento perfecto para ti." />
</svelte:head>

<main class="min-h-screen bg-gray-50">
  <!-- Header -->
  <section class="text-white py-16" style="background-color: #003333;">
    <Container>
      <div class="text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Todos los Eventos</h1>
        <p class="text-xl max-w-2xl mx-auto" style="color: #b3e0e0;">
          Descubre nuestra completa colección de eventos musicales
        </p>
      </div>
    </Container>
  </section>

  <!-- Filters -->
  <section class="py-8 bg-white border-b">
    <Container>
      <div class="flex flex-wrap gap-4 justify-center">
        <!-- City Filter -->
        <div class="flex flex-col">
          <label for="city-filter-all" class="text-sm font-medium text-gray-700 mb-2">Ciudad</label>
          <select id="city-filter-all" bind:value={selectedCity} class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent" style="--tw-ring-color: #003333;">
            {#each cities as city}
              <option value={city}>{city}</option>
            {/each}
          </select>
        </div>

        <!-- Category Filter -->
        <div class="flex flex-col">
          <label for="category-filter-all" class="text-sm font-medium text-gray-700 mb-2">Categoría</label>
          <select id="category-filter-all" bind:value={selectedCategory} class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent" style="--tw-ring-color: #003333;">
            {#each categories as category}
              <option value={category}>{category}</option>
            {/each}
          </select>
        </div>

        <!-- Status Filter -->
        <div class="flex flex-col">
          <label for="status-filter-all" class="text-sm font-medium text-gray-700 mb-2">Estado</label>
          <select id="status-filter-all" bind:value={selectedStatus} class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent" style="--tw-ring-color: #003333;">
            {#each statuses as status}
              <option value={status}>{status}</option>
            {/each}
          </select>
        </div>

        <!-- Reset Filters -->
        <div class="flex flex-col justify-end">
          <button 
            on:click={() => { selectedCity = 'Todas'; selectedCategory = 'Todas'; selectedStatus = 'Todos'; }}
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
      {#if filteredConcerts.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {#each filteredConcerts as concert}
            <ConcertCard {concert} />
          {/each}
        </div>

        <!-- Results Count -->
        <div class="text-center mt-12">
          <p class="text-gray-600">
            Mostrando {filteredConcerts.length} de {allConcerts.length} eventos
          </p>
        </div>
      {:else}
        <!-- No Results -->
        <div class="text-center py-16">
          <svg class="w-24 h-24 mx-auto mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 0a4 4 0 01-4-4V8a2 2 0 012-2h8a2 2 0 012 2v0a4 4 0 01-4 4m-6 0v0a4 4 0 014 4v0m0 0v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m6 0V8"/>
          </svg>
          <h3 class="text-2xl font-semibold text-gray-900 mb-4">No se encontraron eventos</h3>
          <p class="text-gray-600 mb-6">Intenta ajustar los filtros para encontrar más eventos.</p>
          <button 
            on:click={() => { selectedCity = 'Todas'; selectedCategory = 'Todas'; selectedStatus = 'Todos'; }}
            class="px-6 py-3 text-white rounded-lg transition-colors" style="background-color: #003333;"
          >
            Ver todos los eventos
          </button>
        </div>
      {/if}

      <!-- Back to Home -->
      <div class="text-center mt-16">
        <a 
          href="/" 
          class="inline-flex items-center px-6 py-3 border rounded-lg transition-colors" style="border-color: #003333; color: #003333;"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Volver al inicio
        </a>
      </div>
    </Container>
  </section>
</main>

<Footer />