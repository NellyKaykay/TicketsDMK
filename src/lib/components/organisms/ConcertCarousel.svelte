<script lang="ts">
  import { onMount } from 'svelte';
  import ConcertCard from '../molecules/ConcertCard.svelte';
  import CarouselControls from '../molecules/CarouselControls.svelte';
  
  export let title = '';
  export let subtitle = '';
  export let concerts: Array<{
    id: string;
    title: string;
    artist: string;
    date: string;
    venue: string;
    image: string;
    price: string;
    category: string;
    availability: 'available' | 'limited' | 'sold-out';
  }> = [];
  
  let currentIndex = 0;
  let carouselContainer: HTMLDivElement;
  let itemsPerView = 4;
  let autoplayInterval: number;
  
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
    const maxIndex = Math.max(0, concerts.length - itemsPerView);
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
  }
  
  function prevSlide() {
    const maxIndex = Math.max(0, concerts.length - itemsPerView);
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
  
  $: canGoPrevious = currentIndex > 0;
  $: canGoNext = currentIndex < Math.max(0, concerts.length - itemsPerView);
  $: translateX = -currentIndex * (100 / itemsPerView);
  
  onMount(() => {
    updateItemsPerView();
    startAutoplay();
    
    const handleResize = () => updateItemsPerView();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      stopAutoplay();
    };
  });
</script>

{#if title}
<!-- Header -->
<div class="text-center mb-8">
  <h2 class="text-3xl font-bold text-green-800 mb-2">{title}</h2>
  {#if subtitle}
    <p class="text-lg text-gray-600">{subtitle}</p>
  {/if}
</div>
{/if}

<!-- Carousel -->
    <div class="relative">
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
          {#each concerts as concert (concert.id)}
            <div class="w-full flex-shrink-0 px-3" style="width: {100 / itemsPerView}%">
              <ConcertCard {concert} />
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Controls -->
      {#if concerts.length > itemsPerView}
        <CarouselControls 
          position="inside"
          {canGoPrevious}
          {canGoNext}
          onPrevious={prevSlide}
          onNext={nextSlide}
        />
      {/if}
    </div>
    
    <!-- Indicators -->
    {#if concerts.length > itemsPerView}
      <div class="flex justify-center mt-8 space-x-2">
        {#each Array(Math.ceil(concerts.length / itemsPerView)) as _, index}
          <button
            class="w-2 h-2 rounded-full transition-colors duration-200 {index === Math.floor(currentIndex / itemsPerView) ? 'bg-green-800' : 'bg-gray-300'}"
            on:click={() => currentIndex = index * itemsPerView}
            aria-label="Ir a slide {index + 1}"
          ></button>
        {/each}
      </div>
    {/if}
    
    <!-- View All Button -->
    <div class="text-center mt-12">
      <a 
        href="/concerts" 
        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-800 bg-green-50 hover:bg-green-100 transition-colors duration-200"
      >
        Ver todos los eventos
        <svg class="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </a>
    </div>