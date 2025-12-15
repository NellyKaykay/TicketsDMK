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
  import { onMount } from 'svelte';
  import { fade, scale, fly } from 'svelte/transition';
  import Card from '../atoms/Card.svelte';
  import { translations } from '../../stores/i18n';

  let show = false;
  onMount(() => {
    setTimeout(() => {
      show = true;
    }, 50);
  });

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

{#if show}
  <div class="card-fadein-wrapper">
    <Card
      class="hero-floating-card border-4 border-[#003333]/60 rounded-[24px] absolute left-1/2 -translate-x-1/2 -top-56 z-30 bg-white/95 backdrop-blur-sm object-contain transition-transform duration-200 hover:scale-105 animate-floating"
      style="width: 520px; max-width: 96vw; min-width: 320px; height: 850px; box-shadow: 0 0 0 8px #1de9b6, 0 40px 180px 0 rgba(0,51,51,0.85), 0 8px 48px 0 rgba(0,51,51,0.28), 0 0px 0px 8px rgba(0,51,51,0.18); outline: 4px solid #1de9b6; outline-offset: 0px;"
    >
      <!-- CONTENEDOR DE IMAGEN: ocupa 100%, sin fondo blanco -->
      <div
        class="relative w-full overflow-hidden rounded-t-[24px] flex-shrink-0"
        style="aspect-ratio: 16/7;"
      >
        <img
          src={concert.image ?? '/carousel/image-4.jpg'}
          alt="Foto del evento"
          class="absolute inset-0 w-full h-full object-cover object-center rounded-t-[24px]"
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
      <div class="flex flex-col gap-0 min-h-[120px] px-4 pb-3 pt-8 bg-white rounded-b-[24px] bg-opacity-95 -mt-6">
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
  </div>
{/if}

<style>
  .card-fadein-wrapper {
    opacity: 0;
    transform: translateY(80px);
    animation: cardFadeIn 1.2s cubic-bezier(.4,2,.6,1) 0.2s forwards;
  }
  @keyframes cardFadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  /* Efecto flotante animado */
  @keyframes floating {
    0% { transform: translateX(-50%) translateY(0) scale(1); }
    20% { transform: translateX(-50%) translateY(-32px) scale(1.04) rotate(-2deg); }
    50% { transform: translateX(-50%) translateY(-56px) scale(1.08) rotate(2deg); }
    80% { transform: translateX(-50%) translateY(-32px) scale(1.04) rotate(-2deg); }
    100% { transform: translateX(-50%) translateY(0) scale(1); }
  }
  :global(.animate-floating) {
    animation: floating 2.2s cubic-bezier(.4,2,.6,1) infinite;
  }
  :global(.hero-floating-card) {
    transform: translateX(-50%) scale(1);
    box-shadow: 0 40px 180px 0 rgba(0, 51, 51, 0.85),
      0 8px 48px 0 rgba(0, 51, 51, 0.28),
      0 0px 0px 8px rgba(0, 51, 51, 0.18);
    border-width: 4px;
    border-color: #00333399;
    transition: transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s cubic-bezier(0.4,0,0.2,1);
    will-change: transform, box-shadow;
  }

  :global(.hero-floating-card)::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    z-index: -1;
    background: radial-gradient(
      circle at 50% 120%,
      rgba(0, 51, 51, 0.75),
      transparent 70%
    );
    opacity: 1;
    filter: blur(32px);
    transition: opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease;
    transform: translate3d(0, 32px, 0) scale(1.08);
  }

  :global(.hero-floating-card:hover) {
    transform: translateX(-50%) scale(1.05);
    box-shadow: 0 60px 240px 0 rgba(0, 51, 51, 1),
      0 16px 64px 0 rgba(0, 51, 51, 0.35),
      0 0px 0px 12px rgba(0, 51, 51, 0.28);
    border-color: #003333cc;
  }

  :global(.hero-floating-card:hover)::before {
    opacity: 1;
    filter: blur(48px);
    transform: translate3d(0, 48px, 0) scale(1.12);
  }

  @media (max-width: 640px) {
    :global(.hero-floating-card) {
      width: 98vw !important;
      min-width: 0 !important;
      height: 420px !important;
      max-width: 99vw !important;
      left: 50% !important;
      transform: translateX(-50%) translateY(-18px) scale(1.01) !important;
    }

    :global(.hero-floating-card) img {
      min-height: 180px !important;
      max-height: 260px !important;
    }
  }
</style>
