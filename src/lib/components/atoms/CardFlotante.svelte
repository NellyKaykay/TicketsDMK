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
  import { translations } from '../../stores/i18n';

  type CardTranslations = {
    card: {
      available: string;
      limited: string;
      soldOut: string;
      viewTickets: string;
    };
  };

  const fallback: CardTranslations = {
    card: {
      available: 'Disponible',
      limited: 'Pocas entradas',
      soldOut: 'Agotado',
      viewTickets: 'Ver entradas'
    }
  };

  function getSafeTranslations(input: any): CardTranslations {
    return {
      card: {
        available: input?.card?.available ?? fallback.card.available,
        limited: input?.card?.limited ?? fallback.card.limited,
        soldOut: input?.card?.soldOut ?? fallback.card.soldOut,
        viewTickets: input?.card?.viewTickets ?? fallback.card.viewTickets
      }
    };
  }

  $: t = getSafeTranslations($translations);

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

<Card
    class="hero-floating-card border border-[#003333]/25 rounded-2xl absolute left-1/2 -translate-x-1/2 -top-56 z-30 bg-white/95 backdrop-blur-sm 
      shadow-[0_28px_100px_rgba(0,0,0,0.65)] hover:shadow-[0_40px_160px_rgba(0,0,0,0.85)]
      transition-transform transition-shadow duration-500 ease-out 
      hover:-translate-y-8"
>
  <!-- CONTENEDOR DE IMAGEN: imagen ocupa 100% del bloque -->
  <div class="relative w-full h-full overflow-hidden rounded-2xl bg-transparent p-0 m-0">
    <img
      src={concert.image ?? '/carousel/image-4.jpg'}
      alt="Foto del evento"
      class="w-full h-full object-cover object-center rounded-2xl"
      loading="lazy"
    />

    <span
      class="absolute top-3 right-3 px-3 py-1 text-xs rounded-full font-semibold shadow-sm
             bg-white/90 backdrop-blur-sm"
      class:bg-green-100={concert.availability === 'available'}
      class:text-green-800={concert.availability === 'available'}
      class:bg-yellow-100={concert.availability === 'limited'}
      class:text-yellow-800={concert.availability === 'limited'}
      class:bg-red-100={concert.availability === 'sold-out'}
      class:text-red-800={concert.availability === 'sold-out'}
    >
      {concert.availability === 'available'
        ? t.card.available
        : concert.availability === 'limited'
        ? t.card.limited
        : t.card.soldOut}
    </span>
  </div>

  <!-- CONTENIDO TEXTO -->
  <div class="flex flex-col gap-0 min-h-[120px] px-4 pb-3 pt-2">
    <h3 class="text-sm font-bold text-[#003333] truncate mb-0">{concert.artist}</h3>
    <p class="text-xs text-gray-700 truncate mb-0">{concert.title}</p>

    <div class="flex items-center justify-between text-[11px] text-gray-600 mt-1">
      <span>{formatDate(concert.date)}</span>
      <span class="truncate max-w-[50%] text-right">{concert.venue}</span>
    </div>

    <div class="flex items-center justify-end mt-3">
      {#if concert.availability !== 'sold-out'}
        <a
          href={`/concert/${concert.id}`}
          class="px-4 py-2 rounded-md text-white text-xs font-semibold tracking-wide
                 transition-transform duration-200"
          style="background-color: #003333; min-width: 120px; text-align: center;"
        >
          {t.card.viewTickets}
        </a>
      {:else}
        <span
          class="px-4 py-2 rounded-md text-white text-xs font-semibold opacity-60 cursor-not-allowed"
          style="background-color: #003333; min-width: 120px; text-align: center;"
        >
          {t.card.soldOut}
        </span>
      {/if}
    </div>
  </div>
</Card>

<style>
  /* Estilos globales para el efecto flotante */
  :global(.hero-floating-card) {
    /* efecto flotante MUY visible */
    transform: translateX(-50%) translateY(-18px) scale(1.03);
    box-shadow: 0 28px 100px 0 rgba(0,0,0,0.65), 0 2px 16px 0 rgba(0,0,0,0.18);
  }

  :global(.hero-floating-card)::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    z-index: -1;
    background: radial-gradient(
      circle at 50% 120%,
      rgba(0, 0, 0, 0.55),
      transparent 70%
    );
    opacity: 0.95;
    filter: blur(22px);
    transition: opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease;
    transform: translate3d(0, 24px, 0) scale(1.04);
  }

  :global(.hero-floating-card:hover) {
    transform: translateX(-50%) translateY(-38px) scale(1.06);
    box-shadow: 0 40px 160px 0 rgba(0,0,0,0.85), 0 4px 32px 0 rgba(0,0,0,0.22);
  }

  :global(.hero-floating-card:hover)::before {
    opacity: 1;
    filter: blur(32px);
    transform: translate3d(0, 38px, 0) scale(1.08);
  }
</style>
