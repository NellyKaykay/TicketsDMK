<script context="module" lang="ts">
  export interface Concert {
    id: string;
    title: string;
    artist: string;
    date: string;
    venue: string;
    image: string;
    price: string;
    category: string;
    availability: 'available' | 'limited' | 'sold-out';
  }
</script>
<script lang="ts">
  import Card from '../atoms/Card.svelte';
  import { goto } from '$app/navigation';

  export let concert: Concert;

  $: availabilityClasses = concert.availability === 'available'
    ? 'bg-[#003333] text-white'
    : concert.availability === 'limited'
      ? 'bg-amber-400 text-amber-900'
      : 'bg-red-500 text-white';

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
</script>



<Card>
  <!-- Imagen con overlay degradado -->
  <div class="relative w-full aspect-[4/3] bg-gray-200 overflow-hidden group">
    <img
      src={concert.image}
      alt={concert.title}
      class="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
      style="display: block;"
    />
    <!-- Overlay degradado inferior -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>

    <!-- Badge disponibilidad arriba derecha -->
    <span class="absolute top-3 right-3 px-2.5 py-1 text-[11px] rounded-full font-semibold backdrop-blur-sm shadow-sm {availabilityClasses}"
    >
      {concert.availability === 'available' ? 'Disponible' : concert.availability === 'limited' ? 'Últimas entradas' : 'Agotado'}
    </span>

    <!-- Fecha destacada sobre la imagen -->
    <div class="absolute bottom-3 left-3 flex items-center gap-2 text-white text-sm font-medium drop-shadow-lg">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      <span>{formatDate(concert.date)}</span>
    </div>
  </div>

  <!-- Contenido -->
  <div class="flex flex-col justify-between flex-1 p-4 gap-2">
    <!-- Artista y título -->
    <div class="space-y-1">
      <h3 class="text-[15px] font-bold text-[#003333] leading-tight line-clamp-1">{concert.artist}</h3>
      <p class="text-sm text-gray-500 line-clamp-1">{concert.title}</p>
    </div>

    <!-- Ubicación -->
    <div class="flex items-center gap-1.5 text-xs text-gray-500">
      <svg class="w-3.5 h-3.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      <span class="truncate">{concert.venue}</span>
    </div>

    <!-- Separador -->
    <div class="border-t border-gray-100"></div>

    <!-- Precio y botón -->
    <div class="flex items-center justify-between gap-2">
      {#if concert.price}
        <div class="flex flex-col">
          <span class="text-[11px] text-gray-400 uppercase tracking-wide">Desde</span>
          <span class="text-lg font-bold text-[#003333] leading-tight">{concert.price}</span>
        </div>
      {/if}
      {#if concert.availability !== 'sold-out'}
        <a href={`/events/${concert.id}`}
          class="inline-flex items-center gap-1 px-4 py-2 rounded-full text-white text-sm font-semibold bg-[#003333] hover:bg-[#004d4d] transition-all duration-200 hover:shadow-md {!concert.price ? 'w-full justify-center' : ''}"
          title="Comprar entradas"
        >
          Comprar
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </a>
      {:else}
        <span
          class="inline-flex items-center px-4 py-2 rounded-full text-white/70 text-sm font-semibold bg-gray-400 cursor-not-allowed {!concert.price ? 'w-full justify-center' : ''}"
        >
          Agotado
        </span>
      {/if}
    </div>
  </div>
</Card>


