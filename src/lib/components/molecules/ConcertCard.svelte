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

  export let concert: Concert;

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
  <div class="relative h-2/3 w-full">
    <img
      src={concert.image}
      alt={concert.title}
      class="w-full h-full object-cover"
      loading="lazy"
    />
    <span class="absolute top-2 right-2 px-2 py-1 text-xs rounded-full font-semibold"
      class:bg-green-100={concert.availability === 'available'}
      class:text-green-800={concert.availability === 'available'}
      class:bg-yellow-100={concert.availability === 'limited'}
      class:text-yellow-800={concert.availability === 'limited'}
      class:bg-red-100={concert.availability === 'sold-out'}
      class:text-red-800={concert.availability === 'sold-out'}
    >
      {concert.availability === 'available' ? 'Disponible' : concert.availability === 'limited' ? 'Pocas entradas' : 'Agotado'}
    </span>
  </div>
  <div class="flex flex-col justify-between h-1/3 p-2">
    <div>
      <h3 class="text-base font-bold text-[#003333] truncate mb-0.5">{concert.artist}</h3>
      <p class="text-xs text-gray-700 truncate">{concert.title}</p>
    </div>
    <div class="flex items-center justify-between text-xs text-gray-600 mt-1">
      <span>{formatDate(concert.date)}</span>
      <span class="truncate max-w-[50%] text-right">{concert.venue}</span>
    </div>
    <div class="mt-2">
      {#if concert.availability !== 'sold-out'}
        <a
          href={`/concert/${concert.id}`}
          class="block w-full text-center px-3 py-2 rounded-md text-white text-sm font-semibold transition-colors duration-200"
          style="background-color: #003333;"
        >
          Ver entradas
        </a>
      {:else}
        <span
          class="block w-full text-center px-3 py-2 rounded-md text-white text-sm font-semibold opacity-50 cursor-not-allowed"
          style="background-color: #003333;"
        >
          Agotado
        </span>
      {/if}
    </div>
  </div>
</Card>


