<script lang="ts">
  import Button from '../atoms/Button.svelte';
  import Container from '../layout/Container.svelte';
  import ResponsiveText from '../layout/ResponsiveText.svelte';
  import Stack from '../layout/Stack.svelte';
  import ResponsiveGrid from '../layout/ResponsiveGrid.svelte';
  
  export const title = 'Descubre los mejores eventos';
  export const subtitle = 'Vive experiencias musicales únicas con TicketsDMK';
  export const description = 'Encuentra entradas para tus artistas favoritos, descubre nuevos talentos y disfruta de eventos exclusivos en las mejores salas de eventos.';
import CardFlotante from '../atoms/CardFlotante.svelte';
</script>

<div class="relative text-white overflow-hidden min-h-[60vh] sm:min-h-[70vh] flex items-center">
  <!-- Background image -->
  <img src="/heroe-image.jpg" alt="Hero background" class="absolute inset-0 w-full h-full object-cover" />
  
  <!-- Content -->
  <div class="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
    <div class="text-center max-w-4xl mx-auto">
      <!-- Texto eliminado -->
      <!-- Botones eliminados del hero -->
    </div>
  </div>
<!-- Botones debajo del hero -->
</div>


<!-- Card flotante integrado -->
<div class="w-full flex justify-center relative z-10" style="margin-top: -24rem;">
  <CardFlotante
    concert={{
      id: "1",
      title: "Concierto de prueba",
      artist: "Artista Ejemplo",
      date: "2024-07-01",
      venue: "Sala Principal",
      image: "/images/concert.jpg",
      price: "25",
      category: "Pop",
      availability: "available"
    }}
  />
</div>

<!-- Botones debajo del card flotante -->
<div class="w-full flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
  <Button variant="primary" size="lg" href="#eventos">
    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
    </svg>
    Explorar Eventos
  </Button>
  <Button variant="outline" size="lg" href="/about">
    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
    Cómo funciona
  </Button>
</div>