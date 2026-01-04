<script>
  import ConcertCard from '$lib/components/molecules/ConcertCard.svelte';
  import Container from '$lib/components/layout/Container.svelte';

  export let events = [];

  let selectedCity = 'Todas';
  let selectedCategory = 'Todas';
  let sortBy = 'date';

  $: cities = ['Todas', ...new Set(events.map(concert => concert.title))].sort();
  $: categories = ['Todas', ...new Set(events.map(concert => concert.category))].sort();

  $: filteredConcerts = events.filter(concert => {
    const cityMatch = selectedCity === 'Todas' || concert.title === selectedCity;
    const categoryMatch = selectedCategory === 'Todas' || concert.category === selectedCategory;
    return cityMatch && categoryMatch;
  });

  $: sortedConcerts = [...filteredConcerts].sort((a, b) => {
    if (sortBy === 'date') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'price') {
      const priceA = parseFloat(String(a.price).replace(/[^0-9.]/g, '')) || 0;
      const priceB = parseFloat(String(b.price).replace(/[^0-9.]/g, '')) || 0;
      return priceA - priceB;
    }
    if (sortBy === 'availability') {
      const order = { 'available': 0, 'limited': 1, 'sold-out': 2 };
      return (order[a.availability] ?? 0) - (order[b.availability] ?? 0);
    }
    return 0;
  });
</script>

<main class="min-h-screen bg-gray-50">
  <!-- Header -->
  <section class="text-white py-16" style="background-color: #003333;">
    <Container>
      <div class="text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Próximos Eventos</h1>
        <p class="text-xl max-w-2xl mx-auto" style="color: #b3e0e0;">No te pierdas estos increíbles eventos que vienen</p>
        <div class="mt-6 inline-flex items-center px-4 py-2 rounded-full" style="background-color: #004d4d; color: #b3e0e0;">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          {events.length} eventos disponibles
        </div>
      </div>
    </Container>
  </section>

  <!-- Filters -->
  <section class="py-8 bg-white border-b">
    <Container>
      <div class="flex flex-wrap gap-4 justify-center">
        <div class="flex flex-col">
          <label for="city-filter" class="text-sm font-medium text-gray-700 mb-2">Ciudad</label>
          <select id="city-filter" bind:value={selectedCity} class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent" style="--tw-ring-color: #003333;">
            {#each cities as city}
              <option value={city}>{city}</option>
            {/each}
          </select>
        </div>

        <div class="flex flex-col">
          <label for="category-filter" class="text-sm font-medium text-gray-700 mb-2">Categoría</label>
          <select id="category-filter" bind:value={selectedCategory} class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent" style="--tw-ring-color: #003333;">
            {#each categories as category}
              <option value={category}>{category}</option>
            {/each}
          </select>
        </div>

        <div class="flex flex-col">
          <label for="sort-filter" class="text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
          <select id="sort-filter" bind:value={sortBy} class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent" style="--tw-ring-color: #003333;">
            <option value="date">Fecha</option>
            <option value="price">Precio</option>
            <option value="availability">Disponibilidad</option>
          </select>
        </div>

        <div class="flex flex-col justify-end">
          <button on:click={() => { selectedCity = 'Todas'; selectedCategory = 'Todas'; sortBy = 'date'; }} class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Limpiar filtros</button>
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

        <div class="text-center mt-12">
          <p class="text-gray-600">Mostrando {sortedConcerts.length} de {events.length} próximos eventos</p>
        </div>
      {:else}
        <div class="text-center py-16">
          <svg class="w-24 h-24 mx-auto mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <h3 class="text-2xl font-semibold text-gray-900 mb-4">No se encontraron eventos próximos</h3>
          <p class="text-gray-600 mb-6">Intenta ajustar los filtros para encontrar más eventos.</p>
          <button on:click={() => { selectedCity = 'Todas'; selectedCategory = 'Todas'; }} class="px-6 py-3 text-white rounded-lg transition-colors" style="background-color: #003333;">Ver todos los próximos eventos</button>
        </div>
      {/if}

      <div class="flex flex-wrap gap-4 justify-center mt-16">
        <a href="/" class="inline-flex items-center px-6 py-3 border rounded-lg transition-colors" style="border-color: #003333; color: #003333;">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Volver al inicio
        </a>
        <a href="/events" class="inline-flex items-center px-6 py-3 text-white rounded-lg transition-colors" style="background-color: #003333;">Ver todos los eventos
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>
      </div>
    </Container>
  </section>
</main>
