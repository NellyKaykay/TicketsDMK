<script lang="ts">
  import Card from '../atoms/Card.svelte';
  import Button from '../atoms/Button.svelte';
  
  export let concert: {
    id: string;
    title: string;
    artist: string;
    date: string;
    venue: string;
    image: string;
    price: string;
    category: string;
    availability: 'available' | 'limited' | 'sold-out';
  };
  
  const availabilityStyles = {
    available: 'text-white' + ' style="background-color: #e6f7f7; color: #003333;"',
    limited: 'bg-yellow-100 text-yellow-800',
    'sold-out': 'bg-red-100 text-red-800'
  };
  
  const availabilityText = {
    available: 'Disponible',
    limited: 'Pocas entradas',
    'sold-out': 'Agotado'
  };
  
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
</script>

<Card variant="elevated" padding="none" clickable>
  <div class="flex flex-col h-[32rem]">
    <!-- Imagen -->
    <div class="relative flex-grow overflow-hidden">
      <img 
        src={concert.image} 
        alt={concert.title}
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <!-- Availability badge -->
      <div class="absolute top-3 right-3">
        <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full concert-card-badge ${availabilityStyles[concert.availability]}`}>
          {availabilityText[concert.availability]}
        </span>
      </div>
    </div>
    <!-- Texto -->
    <div class="p-4 flex flex-col justify-between mb-4">
    <!-- Artist & Title (compact) -->
    <div>
      <h3 class="concert-card-title mb-1 line-clamp-1 text-lg font-semibold" style="color: #003333;">
        {concert.artist}
      </h3>
      <p class="concert-card-subtitle text-gray-900 text-sm line-clamp-1">{concert.title}</p>
    </div>

    <!-- Small details row -->
    <div class="flex items-center justify-between text-sm text-gray-600 mt-2">
      <div class="flex items-center">
        <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <span class="line-clamp-1">{formatDate(concert.date)}</span>
      </div>
      <div class="text-right line-clamp-1 truncate" style="max-width: 45%">{concert.venue}</div>
    </div>

    <!-- Button only (no price) -->
    <div class="mt-3 w-full">
      {#if concert.availability !== 'sold-out'}
        <a
          href={`/concert/${concert.id}`}
          class="w-full block text-center px-0 py-4 mb-4 border border-transparent text-lg font-semibold rounded-md text-white transition-colors duration-200"
          style="background-color: #003333;"
        >
          Ver entradas
        </a>
      {:else}
        <span
          class="w-full block text-center px-0 py-4 mb-4 border border-transparent text-lg font-semibold rounded-md text-white transition-colors duration-200 opacity-50 cursor-not-allowed"
          style="background-color: #003333;"
        >
          Agotado
        </span>
      {/if}
    </div>
  </div>
</div>
</Card>

<style>
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>