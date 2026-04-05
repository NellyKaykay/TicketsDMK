<script>
  import { onMount } from 'svelte';

  import HeroSection from '$lib/components/molecules/HeroSection.svelte';
  import ConcertCarousel from '$lib/components/organisms/ConcertCarousel.svelte';
  import ConcertCard from '$lib/components/molecules/ConcertCard.svelte';
  import Footer from '$lib/components/organisms/Footer.svelte';

  let showLoader = true;
  let concerts = [];
  let pastConcerts = [];

  onMount(async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        const allEvents = data.events || [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        concerts = allEvents.filter(e => new Date(e.date) >= today);
        pastConcerts = allEvents.filter(e => new Date(e.date) < today);
      }
    } catch (e) {
      console.error('Error loading events:', e);
    } finally {
      showLoader = false;
    }
  });

  $: nextEvent = concerts
    .filter(concert => new Date(concert.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
</script>

<svelte:head>
  <title>TicketsDMK - Tu plataforma de eventos musicales</title>
  <meta name="description" content="Descubre y compra entradas para los mejores eventos y eventos musicales. La plataforma líder en entretenimiento musical." />
  <meta name="keywords" content="eventos, entradas, música, eventos, tickets, espectáculos" />
  <meta property="og:title" content="TicketsDMK - Tu plataforma de eventos musicales" />
  <meta property="og:description" content="Descubre y compra entradas para los mejores eventos y eventos musicales." />
  <meta property="og:type" content="website" />
</svelte:head>

<main class="min-h-screen bg-white">
  {#if showLoader}
    <div class="page-loader" role="status" aria-label="Loading">
      <div class="spinner"></div>
    </div>
  {/if}
  <!-- Hero Section with Floating Event Card -->
  <HeroSection />

  <!-- Bloque texto descriptivo -->
  <section class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-4">
    <div class="text-center max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-4 text-[#003333]">Descubre los mejores eventos</h1>
      <h2 class="text-2xl mb-2 text-[#003333]/70">Vive experiencias musicales únicas con TicketsDMK</h2>
      <p class="mb-6 text-gray-600">Encuentra entradas para tus artistas favoritos, descubre nuevos talentos y disfruta de eventos exclusivos en las mejores salas de eventos.</p>
    </div>
  </section>

  <!-- Bloque Próximos Eventos Destacados -->
  <section class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-12">
    <h2 class="text-3xl font-bold text-center mb-8">Próximos Eventos</h2>
    <ConcertCarousel
      title=""
      subtitle=""
      viewAllLink="/events"
      concerts={concerts}
    />
  </section>




  <!-- Concert Carousel: Eventos Pasados -->
  <section id="eventos" class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold sm:text-4xl" style="color: #003333;">
          Eventos Pasados
        </h2>
        <p class="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          Revive los increíbles momentos que ya hemos vivido
        </p>
      </div>
      <!-- Eventos Pasados -->
      <div class="mb-16">
        <ConcertCarousel concerts={pastConcerts} title="" subtitle="" />
      </div>
    </div>
  </section>
  
  <!-- Additional content sections can be added here -->
  <section class="py-16 bg-white" id="about">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center">
        <h2 class="text-base font-semibold tracking-wide uppercase" style="color: #003333;">Sobre nosotros</h2>
        <p class="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
          La mejor experiencia en eventos musicales
        </p>
        <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          Desde 2025, conectamos a los amantes de la música con sus artistas favoritos, 
          ofreciendo una plataforma segura y confiable para la compra de entradas.
        </p>
      </div>

      <div class="mt-10">
        <div class="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
          <div class="text-center">
            <div class="flex items-center justify-center h-12 w-12 rounded-md text-white mx-auto" style="background-color: #003333;">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="mt-5">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Compra segura</h3>
              <p class="mt-2 text-base text-gray-500">
                Transacciones 100% seguras con encriptación SSL y múltiples métodos de pago.
              </p>
            </div>
          </div>

          <div class="text-center">
            <div class="flex items-center justify-center h-12 w-12 rounded-md text-white mx-auto" style="background-color: #003333;">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div class="mt-5">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Entrega instantánea</h3>
              <p class="mt-2 text-base text-gray-500">
                Recibe tus entradas al instante por email y móvil. Sin esperas, sin complicaciones.
              </p>
            </div>
          </div>

          <div class="text-center">
            <div class="flex items-center justify-center h-12 w-12 rounded-md text-white mx-auto" style="background-color: #003333;">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.5a9.5 9.5 0 110 19 9.5 9.5 0 010-19z" />
              </svg>
            </div>
            <div class="mt-5">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Soporte 24/7</h3>
              <p class="mt-2 text-base text-gray-500">
                Nuestro equipo está disponible las 24 horas para ayudarte con cualquier consulta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- Banner Publicidad SkyArmenia -->
  <section class="w-full py-8 banner-skyarmenia">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <a href="https://skyarmenia.com" target="_blank" rel="noopener noreferrer" class="block group">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div class="flex items-center gap-4">
            <div class="bg-white rounded-xl p-2">
              <img src="/logo-skyarmenia.jpeg" alt="SkyArmenia Logo" class="h-10 w-auto" />
            </div>
            <div>
              <h3 class="text-2xl md:text-3xl font-bold tracking-tight group-hover:underline">SkyArmenia.com</h3>
              <p class="text-sm md:text-base text-white/80 mt-1">Descubre los mejores vuelos y destinos. ¡Viaja con nosotros!</p>
            </div>
          </div>
          <div class="flex-shrink-0">
            <span class="inline-flex items-center gap-2 bg-white font-semibold px-6 py-3 rounded-full text-sm md:text-base shadow-lg transition-colors" style="color: #003333;">
              Visitar sitio
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>
        </div>
      </a>
    </div>
  </section>

  <!-- Bloque Publicidad Disponible -->
  <section class="w-full py-10 bg-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="ad-placeholder relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-white p-8 md:p-12 text-center">
        <div class="absolute inset-0 opacity-[0.03]" style="background-image: repeating-linear-gradient(45deg, #003333 0, #003333 1px, transparent 0, transparent 50%); background-size: 20px 20px;"></div>
        <div class="relative z-10">
          <div class="flex justify-center mb-4">
            <div class="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1.5">
              <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Espacio disponible</span>
            </div>
          </div>
          <h3 class="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Aquí puede estar tu publicidad</h3>
          <p class="text-gray-500 text-base md:text-lg max-w-2xl mx-auto mb-6">
            Alcanza a miles de personas apasionadas por los eventos y la música. Promociona tu marca en el lugar perfecto.
          </p>
          <a href="mailto:info@ticketsdmk.com?subject=Publicidad%20en%20TicketsDMK" class="inline-flex items-center gap-2 font-semibold text-white px-8 py-3 rounded-full text-sm md:text-base shadow-md hover:shadow-lg transition-all ad-cta">
            Contáctanos
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
</main>

<!-- Footer -->
<Footer />

<style>
.page-loader {
  position: fixed;
  inset: 0;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(0,0,0,0.08);
  border-top-color: #38b6ff;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.banner-skyarmenia {
  background: linear-gradient(to right, #003333, #005555);
}
.ad-cta {
  background: linear-gradient(135deg, #003333, #005555);
}
.ad-cta:hover {
  background: linear-gradient(135deg, #004444, #006666);
  transform: translateY(-1px);
}
</style>
