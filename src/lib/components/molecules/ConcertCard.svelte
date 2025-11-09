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
    available: 'bg-green-100 text-green-800',
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
  <!-- Image -->
  <div class="relative overflow-hidden">
    <img 
      src={concert.image} 
      alt={concert.title}
      class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      loading="lazy"
    />
    
    <!-- Availability badge -->
    <div class="absolute top-3 right-3">
      <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full concert-card-badge ${availabilityStyles[concert.availability]}`}>
        {availabilityText[concert.availability]}
      </span>
    </div>
  </div>
  
  <!-- Content -->
  <div class="p-6">
    <!-- Artist & Title -->
    <div class="mb-3">
      <h3 class="concert-card-title text-green-800 mb-1 line-clamp-1">
        {concert.artist}
      </h3>
      <p class="concert-card-subtitle text-gray-900">
        {concert.title}
      </p>
    </div>
    
    <!-- Event details -->
    <div class="space-y-2 mb-4">
      <div class="flex items-center concert-card-details text-gray-600">
        <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        {formatDate(concert.date)}
      </div>
      
      <div class="flex items-center concert-card-details text-gray-600">
        <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <span class="truncate">{concert.venue}</span>
      </div>
    </div>
    
    <!-- Price & Button -->
    <div class="flex items-center justify-between">
      <div class="concert-card-price text-gray-900">
        desde <span class="concert-card-price-amount text-green-800">{concert.price}</span>
      </div>
      
      {#if concert.availability !== 'sold-out'}
        <Button variant="primary" size="sm" href={`/concert/${concert.id}`}>
          Ver entradas
        </Button>
      {:else}
        <Button variant="secondary" size="sm" disabled>
          Agotado
        </Button>
      {/if}
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