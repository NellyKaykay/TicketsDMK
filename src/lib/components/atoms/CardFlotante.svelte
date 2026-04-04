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
        class="hero-floating-card rounded-xl z-50 bg-[#e6f2f2]/95 backdrop-blur-sm object-contain transition-transform duration-200 mx-auto"
          style="width: 90%; max-width: 90%; overflow: visible;"
      >
        <!-- Layout horizontal: texto izquierda, imagen derecha -->
        <div class="flex flex-col sm:flex-row sm:gap-0 w-full h-full rounded-xl overflow-hidden">
          <!-- CONTENIDO TEXTO (izquierda) -->
          <div class="flex flex-col justify-center items-start text-left gap-3 px-6 py-6 sm:pl-10 sm:pr-4 sm:py-8 sm:w-2/5 order-2 sm:order-1">
            <span class="text-lg sm:text-xl font-bold uppercase tracking-widest text-[#003333]/70">Próximo evento</span>
            <h3 class="mt-2 text-4xl sm:text-5xl font-bold text-[#003333] leading-tight">{concert.artist}</h3>
            <div class="mt-2 flex items-center gap-2 text-xl text-gray-600">
              <svg class="w-6 h-6 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span>{formatDate(concert.date)}</span>
            </div>
            <div class="mt-2 flex items-center gap-2 text-xl text-gray-600">
              <svg class="w-6 h-6 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>{concert.venue}</span>
            </div>
            <div class="mt-6">
              {#if concert.availability !== 'sold-out'}
                <a href={`/events/${concert.id}`}
                  class="inline-flex items-center gap-2 px-10 py-3.5 rounded-full text-white text-xl font-semibold bg-[#003333] hover:bg-[#004d4d] transition-all duration-200 hover:shadow-md"
                  title="Ver entradas"
                >
                  {t.card.viewTickets}
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </a>
              {:else}
                <span
                  class="inline-flex items-center px-6 py-2.5 rounded-full text-white/70 text-sm font-semibold bg-gray-400 cursor-not-allowed"
                >
                  {t.card.soldOut}
                </span>
              {/if}
            </div>
            <!-- Badge disponibilidad -->
            <span
              class="px-3 py-1 text-lg rounded-full font-semibold text-[#003333] self-start"
            >
              {concert.availability === 'available'
                ? t.card.available
                : concert.availability === 'limited'
                ? t.card.limited
                : t.card.soldOut}
            </span>
          </div>

          <!-- IMAGEN (derecha) -->
          <div class="relative sm:w-3/5 order-1 sm:order-2 overflow-hidden flex items-center justify-center sm:pl-0 sm:pr-4 sm:py-4">
            <img
              src={concert.image ?? '/carousel/image-4.jpg'}
              alt="Foto del evento"
              class="w-full h-72 sm:h-auto sm:max-h-[90%] object-cover object-center sm:rounded-xl"
              loading="lazy"
            />
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
    border-radius: 0.75rem;
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

  :global(.hero-floating-card) {
    animation: cardFloat 5s ease-in-out infinite;
    box-shadow:
      0 8px 32px 0 rgba(0, 51, 51, 0.5),
      0 20px 60px -10px rgba(0, 51, 51, 0.4),
      0 40px 100px -20px rgba(0, 51, 51, 0.3);
    border-radius: 0.75rem;
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


  :global(.hero-floating-card:hover) {
    animation-play-state: paused;
    transform: scale(1.03) translateY(-8px);
    box-shadow:
      0 12px 40px 0 rgba(0, 51, 51, 0.6),
      0 30px 80px -10px rgba(0, 51, 51, 0.5),
      0 50px 120px -20px rgba(0, 51, 51, 0.35);
  }

  :global(.hero-floating-card:hover)::before {
    opacity: 0.2;
    filter: blur(28px);
    transform: scale(0.6);
  }


  @media (max-width: 640px) {
    :global(.hero-floating-card) {
      width: 98vw !important;
      min-width: 0 !important;
      max-width: 99vw !important;
    }

    :global(.hero-floating-card) img {
      min-height: 220px !important;
      max-height: 300px !important;
    }
  }
</style>
