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

  // 3D tilt effect
  let cardEl: HTMLDivElement;
  let tiltX = 0;
  let tiltY = 0;
  let glareX = 50;
  let glareY = 50;
  let isHovering = false;

  function handleMouseMove(e: MouseEvent) {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    tiltX = (y - 0.5) * -15;
    tiltY = (x - 0.5) * 15;
    glareX = x * 100;
    glareY = y * 100;
  }

  function handleMouseEnter() {
    isHovering = true;
  }

  function handleMouseLeave() {
    isHovering = false;
    tiltX = 0;
    tiltY = 0;
    glareX = 50;
    glareY = 50;
  }
</script>

{#if loading}
  <div class="card-fadein-wrapper text-center py-8">Cargando evento destacado...</div>
{:else if error}
  <div class="card-fadein-wrapper text-center py-8 text-red-600">{error}</div>
{:else if concert}
  <div class="card-fadein-wrapper">
    <div
      class="card-3d-perspective"
      bind:this={cardEl}
      on:mousemove={handleMouseMove}
      on:mouseenter={handleMouseEnter}
      on:mouseleave={handleMouseLeave}
      style="transform: perspective(1200px) rotateX({tiltX}deg) rotateY({tiltY}deg);"
      role="region"
      aria-label="Tarjeta de evento destacado"
    >
      <Card
        class="hero-floating-card shadow-[0_4px_24px_0_#003333] rounded-[24px] z-50 bg-white/95 backdrop-blur-sm object-contain transition-transform duration-200 mx-auto"
          style="width: 900px; max-width: 96vw; min-width: 320px; max-height: 90vh; overflow: visible;"
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
      <!-- Glare 3D overlay -->
      <div
        class="card-3d-glare"
        style="background: radial-gradient(circle at {glareX}% {glareY}%, rgba(255,255,255,0.25) 0%, transparent 60%); opacity: {isHovering ? 1 : 0};"
      ></div>
    </div>
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

  /* Contenedor 3D */
  .card-3d-perspective {
    transform-style: preserve-3d;
    transition: transform 0.15s ease-out;
    position: relative;
    will-change: transform;
  }

  /* Glare que sigue al mouse */
  .card-3d-glare {
    position: absolute;
    inset: 0;
    border-radius: 24px;
    pointer-events: none;
    z-index: 100;
    transition: opacity 0.3s ease;
    mix-blend-mode: overlay;
  }

  /* Animacion flotante continua */
  @keyframes cardFloat {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    25% {
      transform: translateY(-10px) rotate(0.3deg);
    }
    50% {
      transform: translateY(-16px) rotate(0deg);
    }
    75% {
      transform: translateY(-10px) rotate(-0.3deg);
    }
  }

  /* Pulso dramatico en la sombra */
  @keyframes shadowPulse {
    0%, 100% {
      box-shadow:
        0 0 0 6px rgba(0, 51, 51, 0.2),
        0 25px 60px 0 rgba(0, 51, 51, 0.55),
        0 10px 30px 0 rgba(0, 51, 51, 0.35),
        0 0 40px 0 rgba(0, 51, 51, 0.12),
        0 0 80px 10px rgba(0, 51, 51, 0.08);
    }
    50% {
      box-shadow:
        0 0 0 10px rgba(0, 51, 51, 0.28),
        0 50px 120px 0 rgba(0, 51, 51, 0.7),
        0 20px 60px 0 rgba(0, 51, 51, 0.4),
        0 0 60px 5px rgba(0, 51, 51, 0.18),
        0 0 120px 20px rgba(0, 51, 51, 0.12);
    }
  }

  /* Glow animado en el borde */
  @keyframes borderGlow {
    0%, 100% {
      border-color: rgba(0, 51, 51, 0.5);
      outline-color: rgba(0, 51, 51, 0.1);
    }
    50% {
      border-color: rgba(0, 51, 51, 0.8);
      outline-color: rgba(0, 51, 51, 0.25);
    }
  }

  :global(.hero-floating-card) {
    animation: cardFloat 5s ease-in-out infinite, shadowPulse 5s ease-in-out infinite, borderGlow 5s ease-in-out infinite;
    border-width: 4px;
    border-color: rgba(0, 51, 51, 0.5);
    outline: 4px solid rgba(0, 51, 51, 0.1);
    outline-offset: 2px;
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1);
    will-change: transform, box-shadow;
  }

  /* Sombra de suelo - efecto de elevacion */
  :global(.hero-floating-card)::before {
    content: '';
    position: absolute;
    left: 8%;
    right: 8%;
    bottom: -40px;
    height: 50px;
    border-radius: 50%;
    z-index: -1;
    background: radial-gradient(
      ellipse at center,
      rgba(0, 51, 51, 0.55),
      rgba(0, 51, 51, 0.2) 40%,
      transparent 70%
    );
    filter: blur(20px);
    animation: shadowFloat 5s ease-in-out infinite;
  }

  @keyframes shadowFloat {
    0%, 100% {
      opacity: 0.8;
      transform: scale(1);
    }
    50% {
      opacity: 0.35;
      transform: scale(0.75);
    }
  }

  /* Reflejo de luz en esquina superior */
  :global(.hero-floating-card)::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: inherit;
    z-index: -1;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.25) 0%,
      rgba(255, 255, 255, 0.08) 20%,
      transparent 50%,
      rgba(0, 51, 51, 0.1) 80%,
      rgba(0, 51, 51, 0.15) 100%
    );
    pointer-events: none;
    animation: shimmer 5s ease-in-out infinite;
  }

  @keyframes shimmer {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }

  :global(.hero-floating-card:hover) {
    animation-play-state: paused;
    transform: scale(1.06) translateY(-12px);
    box-shadow:
      0 0 0 12px rgba(0, 51, 51, 0.3),
      0 60px 160px 0 rgba(0, 51, 51, 0.8),
      0 30px 80px 0 rgba(0, 51, 51, 0.45),
      0 0 80px 10px rgba(0, 51, 51, 0.25),
      0 0 150px 30px rgba(0, 51, 51, 0.15);
    border-color: rgba(0, 51, 51, 0.9);
    outline-color: rgba(0, 51, 51, 0.3);
  }

  :global(.hero-floating-card:hover)::before {
    opacity: 0.2;
    filter: blur(28px);
    transform: scale(0.6);
  }

  :global(.hero-floating-card:hover)::after {
    opacity: 1;
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
