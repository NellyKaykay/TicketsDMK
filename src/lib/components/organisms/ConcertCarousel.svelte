<script lang="ts">
  import { onMount } from 'svelte';
  import ConcertCard from '../molecules/ConcertCard.svelte';
  import CarouselControls from '../molecules/CarouselControls.svelte';
  
  export let title = '';
  export let subtitle = '';
  export let viewAllLink = '/events';
  export let concerts: Array<{
    id: string;
    title: string;
    artist: string;
    date: string;
    venue: string;
    image: string;
    price: string;
    category: string;
    city: string;
    availability: 'available' | 'limited' | 'sold-out';
  }> = [];

  let loading = false;
  let error: string | null = null;
  
  let currentIndex = 0;
  let carouselContainer: HTMLDivElement;
  let itemsPerView = 4;
  let autoplayInterval: ReturnType<typeof setInterval>;
  let selectedCity = 'Todas';
  let selectedEventType = 'Todos';
  let showCitySelector = false;
  let showEventTypeSelector = false;

  const cities = ['Todas', 'Barcelona', 'Madrid', 'Valencia', 'Alicante'];
  const eventTypes = ['Todos', 'Concierto', 'Teatro', 'Película', 'Monólogo'];

  // Filtrar eventos por ciudad y tipo
  $: filteredConcerts = concerts.filter(concert => {
    const cityMatch = selectedCity === 'Todas' || concert.city === selectedCity;
    const typeMatch = selectedEventType === 'Todos' || concert.title === selectedEventType;
    return cityMatch && typeMatch;
  });

  // Reiniciar índice cuando cambie el filtro
  $: if (selectedCity || selectedEventType) {
    currentIndex = 0;
  }
  
  // Responsive items per view
  function updateItemsPerView() {
    if (!carouselContainer) return;
    const width = carouselContainer.clientWidth;
    if (width < 640) itemsPerView = 1;
    else if (width < 768) itemsPerView = 2;
    else if (width < 1024) itemsPerView = 3;
    else itemsPerView = 4;
  }
  
  function nextSlide() {
    const maxIndex = Math.max(0, filteredConcerts.length - itemsPerView);
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
  }
  
  function prevSlide() {
    const maxIndex = Math.max(0, filteredConcerts.length - itemsPerView);
    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
  }
  
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }
  
  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
  }
  
  function selectCity(city: string) {
    selectedCity = city;
    showCitySelector = false;
  }

  function selectEventType(etype: string) {
    selectedEventType = etype;
    showEventTypeSelector = false;
  }

  function toggleCitySelector() {
    showCitySelector = !showCitySelector;
    showEventTypeSelector = false;
  }

  function toggleEventTypeSelector() {
    showEventTypeSelector = !showEventTypeSelector;
    showCitySelector = false;
  }
  
  $: canGoPrevious = currentIndex > 0;
  $: canGoNext = currentIndex < Math.max(0, filteredConcerts.length - itemsPerView);
  $: translateX = -currentIndex * (100 / itemsPerView);
  
  onMount(() => {
    updateItemsPerView();
    startAutoplay();
    
    const handleResize = () => updateItemsPerView();
    const handleClickOutside = (event: Event) => {
      const target = event.target as Element;
      if (!target.closest('.city-selector')) {
        showCitySelector = false;
      }
      if (!target.closest('.event-type-selector')) {
        showEventTypeSelector = false;
      }
    };
    
    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
      stopAutoplay();
    };
  });
</script>



{#if title}
<!-- Header -->
<div class="text-center mb-8">
  <h2 class="text-3xl font-bold mb-2" style="color: #003333;">{title}</h2>
  {#if subtitle}
    <p class="text-lg text-gray-600 mb-6">{subtitle}</p>
  {/if}
</div>
{/if}

<!-- Aquí iría la imagen del fondo del héroe -->
<!-- <div class="hero-bg"> ... </div> -->

{#if cities.length > 1}
  <div class="flex flex-wrap justify-center items-center gap-3 mb-8">
    <!-- Boton Todos -->
    <button
      class="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 {selectedCity === 'Todas' && selectedEventType === 'Todos'
        ? 'text-white bg-[#003333]'
        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'}"
      on:click={() => { selectedCity = 'Todas'; selectedEventType = 'Todos'; }}
    >
      Todos
    </button>

    <!-- Desplegable Ciudad -->
    <div class="relative city-selector">
      <button
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 {selectedCity !== 'Todas'
          ? 'text-white bg-[#003333]'
          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'}"
        on:click={toggleCitySelector}
      >
        <span>{selectedCity === 'Todas' ? 'Ciudad' : selectedCity}</span>
        <svg class="w-4 h-4 transition-transform duration-200 {showCitySelector ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      {#if showCitySelector}
        <div class="absolute top-full left-0 mt-1 min-w-[160px] bg-white border border-gray-200 rounded-lg shadow-lg z-20">
          {#each cities as city}
            <button
              class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 {selectedCity === city ? 'font-semibold bg-[#e6f7f7] text-[#003333]' : ''}"
              on:click={() => selectCity(city)}
            >
              {city}
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Desplegable Evento -->
    <div class="relative event-type-selector">
      <button
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 {selectedEventType !== 'Todos'
          ? 'text-white bg-[#003333]'
          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'}"
        on:click={toggleEventTypeSelector}
      >
        <span>{selectedEventType === 'Todos' ? 'Evento' : selectedEventType}</span>
        <svg class="w-4 h-4 transition-transform duration-200 {showEventTypeSelector ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      {#if showEventTypeSelector}
        <div class="absolute top-full left-0 mt-1 min-w-[160px] bg-white border border-gray-200 rounded-lg shadow-lg z-20">
          {#each eventTypes as etype}
            <button
              class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 {selectedEventType === etype ? 'font-semibold bg-[#e6f7f7] text-[#003333]' : ''}"
              on:click={() => selectEventType(etype)}
            >
              {etype}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}

<!-- Carousel -->
<div class="relative">
  {#if loading}
    <div class="text-center py-12 bg-gray-50 rounded-lg">Cargando eventos...</div>
  {:else if error}
    <div class="text-center py-12 bg-gray-50 rounded-lg text-red-600">{error}</div>
  {:else if filteredConcerts.length > 0}
    <div 
      bind:this={carouselContainer}
      class="overflow-hidden rounded-lg"
      role="group"
      aria-label="Carousel de eventos"
      on:mouseenter={stopAutoplay}
      on:mouseleave={startAutoplay}
    >
      <div 
        class="flex transition-transform duration-500 ease-in-out"
        style="transform: translateX({translateX}%)"
      >
        {#each filteredConcerts as concert (concert.id)}
          <div class="flex-shrink-0" style="width: {100 / itemsPerView}%">
            <ConcertCard {concert} />
          </div>
        {/each}
      </div>
    </div>
    
    <!-- Controls -->
    {#if filteredConcerts.length > itemsPerView}
      <CarouselControls 
        position="inside"
        {canGoPrevious}
        {canGoNext}
        onPrevious={prevSlide}
        onNext={nextSlide}
      />
    {/if}
  {:else}
    <!-- No events message -->
    <div class="text-center py-12 bg-gray-50 rounded-lg">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No hay eventos en {selectedCity}</h3>
      <p class="text-gray-500 mb-4">Selecciona otra ciudad o vuelve más tarde para ver nuevos eventos.</p>
      <button 
        class="px-4 py-2 text-white rounded-lg transition-colors" style="background-color: #003333;"
        on:click={() => selectCity('Todas')}
      >
        Ver todos los eventos
      </button>
    </div>
  {/if}
</div>

<!-- Indicators -->
{#if filteredConcerts.length > itemsPerView}
  <div class="flex justify-center mt-8 space-x-2">
    {#each Array(Math.ceil(filteredConcerts.length / itemsPerView)) as _, index}
      <button
        class="w-2 h-2 rounded-full transition-colors duration-200 {index === Math.floor(currentIndex / itemsPerView) ? '' + ' style=\"background-color: #003333;\"' : 'bg-gray-300'}"
        on:click={() => currentIndex = index * itemsPerView}
        aria-label="Ir a slide {index + 1}"
      ></button>
    {/each}
  </div>
{/if}

<!-- View All Button -->
<div class="text-center mt-12">
  <a 
    href={viewAllLink} 
    class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md transition-colors duration-200" style="color: #003333; background-color: #e6f7f7;"
  >
    Ver todos los eventos
    <svg class="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
    </svg>
  </a>
</div>