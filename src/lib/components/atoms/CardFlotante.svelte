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
  import { goto } from '$app/navigation';

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

  export let concert: Concert | null = null;
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    if (concert) {
      loading = false;
      return;
    }
    loading = true;
    error = null;
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('No se pudieron cargar los eventos');
      const data = await res.json();
      if (Array.isArray(data.events) && data.events.length > 0) {
        const now = new Date();
        const upcoming = data.events
          .filter((e: Concert) => new Date(e.date) >= now)
          .sort((a: Concert, b: Concert) => new Date(a.date).getTime() - new Date(b.date).getTime());
        concert = upcoming.length > 0 ? upcoming[0] : null;
      } else {
        concert = null;
      }
    } catch (e: any) {
      error = e.message || 'Error desconocido';
      concert = null;
    } finally {
      loading = false;
    }
  });

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
</script>

{#if loading}
  <div class="card-fadein-wrapper text-center py-8">Cargando evento destacado...</div>
{:else if error}
  <div class="card-fadein-wrapper text-center py-8 text-red-600">{error}</div>
{:else if concert}
  <div class="card-fadein-wrapper">
    <Card
      class="hero-floating-card border-4 border-[#003333]/60 rounded-[24px] z-50 bg-white/95 backdrop-blur-sm object-contain transition-transform duration-200 hover:scale-105 mx-auto"
        style="width: 580px; max-width: 96vw; min-width: 320px; max-height: 90vh; box-shadow: 0 0 0 8px rgba(0,51,51,0.18), 0 40px 180px 0 rgba(0,51,51,0.85), 0 8px 48px 0 rgba(0,51,51,0.28), 0 0px 0px 8px rgba(0,51,51,0.18); outline: 4px solid rgba(0,51,51,0.12); outline-offset: 0px; overflow: visible;"
    >
      <!-- CONTENEDOR DE IMAGEN: ocupa 100%, sin fondo blanco -->
      <div
        class="relative w-full overflow-hidden rounded-t-[24px] flex-shrink-0"
        style="aspect-ratio: 16/9;"
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
          class:bg-[#e6f7f7]={concert.availability === 'available'}
          class:text-[#003333]={concert.availability === 'available'}
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
      <div class="flex flex-col gap-0 min-h-[140px] px-4 pb-4 pt-8 bg-white rounded-b-[24px] bg-opacity-95 -mt-6">
        <h3 class="text-sm font-bold text-[#003333] truncate mb-0">{concert.artist}</h3>
        <p class="text-xs text-gray-700 truncate mb-0">{concert.title}</p>

        <div class="flex items-center justify-between text-[11px] text-gray-600 mt-1">
          <span>{formatDate(concert.date)}</span>
          <span class="truncate max-w-[50%] text-right">{concert.venue}</span>
        </div>

        <div class="flex items-center justify-end mt-3">
          {#if concert.availability !== 'sold-out'}
            <a href={`/events/${concert.id}`}
              class="px-4 py-2 rounded-md text-white text-xs font-semibold tracking-wide bg-[#003333] hover:bg-[#002626] opacity-90 inline-block text-center"
              style="min-width: 120px;"
              title="Ver entradas"
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

  /* Animacion flotante continua */
  @keyframes cardFloat {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-12px);
    }
  }

  /* Pulso sutil en la sombra */
  @keyframes shadowPulse {
    0%, 100% {
      box-shadow: 0 30px 80px 0 rgba(0, 51, 51, 0.5),
        0 12px 40px 0 rgba(0, 51, 51, 0.3),
        0 0 0 6px rgba(0, 51, 51, 0.15),
        0 0 60px 0 rgba(0, 51, 51, 0.1);
    }
    50% {
      box-shadow: 0 50px 120px 0 rgba(0, 51, 51, 0.65),
        0 20px 60px 0 rgba(0, 51, 51, 0.35),
        0 0 0 8px rgba(0, 51, 51, 0.2),
        0 0 80px 0 rgba(0, 51, 51, 0.15);
    }
  }

  :global(.hero-floating-card) {
    animation: cardFloat 4s ease-in-out infinite, shadowPulse 4s ease-in-out infinite;
    border-width: 4px;
    border-color: #00333399;
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1);
    will-change: transform, box-shadow;
  }

  /* Sombra difusa debajo - efecto de "elevacion" */
  :global(.hero-floating-card)::before {
    content: '';
    position: absolute;
    left: 10%;
    right: 10%;
    bottom: -30px;
    height: 40px;
    border-radius: 50%;
    z-index: -1;
    background: radial-gradient(
      ellipse at center,
      rgba(0, 51, 51, 0.45),
      transparent 70%
    );
    filter: blur(18px);
    animation: shadowFloat 4s ease-in-out infinite;
  }

  @keyframes shadowFloat {
    0%, 100% {
      opacity: 0.7;
      transform: scale(1);
    }
    50% {
      opacity: 0.4;
      transform: scale(0.85);
    }
  }

  /* Reflejo / glow sutil en el borde */
  :global(.hero-floating-card)::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    z-index: -1;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.15) 0%,
      transparent 50%,
      rgba(0, 51, 51, 0.08) 100%
    );
    pointer-events: none;
  }

  :global(.hero-floating-card:hover) {
    animation-play-state: paused;
    transform: scale(1.05) translateY(-8px);
    box-shadow: 0 60px 160px 0 rgba(0, 51, 51, 0.7),
      0 24px 80px 0 rgba(0, 51, 51, 0.4),
      0 0 0 10px rgba(0, 51, 51, 0.25),
      0 0 100px 0 rgba(0, 51, 51, 0.2);
    border-color: #003333cc;
  }

  :global(.hero-floating-card:hover)::before {
    opacity: 0.3;
    filter: blur(24px);
    transform: scale(0.75);
  }

  @media (max-width: 640px) {
    :global(.hero-floating-card) {
      width: 98vw !important;
      min-width: 0 !important;
      max-width: 99vw !important;
    }

    :global(.hero-floating-card) img {
      min-height: 180px !important;
      max-height: 260px !important;
    }
  }
</style>
