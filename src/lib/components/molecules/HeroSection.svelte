<script lang="ts">
  import Button from '../atoms/Button.svelte';
  import Container from '../layout/Container.svelte';
  import ResponsiveText from '../layout/ResponsiveText.svelte';
  import Stack from '../layout/Stack.svelte';
  import ResponsiveGrid from '../layout/ResponsiveGrid.svelte';
  
  export let title = 'Descubre los mejores eventos';
  export let subtitle = 'Vive experiencias musicales únicas con TicketsDMK';
  export let description = 'Encuentra entradas para tus artistas favoritos, descubre nuevos talentos y disfruta de eventos exclusivos en las mejores salas de eventos.';
  export let primaryButtonText = 'Explorar Eventos';
  export let primaryButtonHref = '#eventos';
  export let secondaryButtonText = 'Cómo funciona';
  export let secondaryButtonHref = '/about';
</script>

<div class="relative text-white overflow-hidden min-h-[60vh] sm:min-h-[70vh] flex items-center">
  <!-- Background image -->
  <img src="/heroe-image.jpg" alt="Hero background" class="absolute inset-0 w-full h-full object-cover" />
  
  <!-- Content -->
  <div class="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
    <div class="text-center max-w-4xl mx-auto">
      <!-- Main title -->
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style="color: #003333;">
        {title}
      </h1>
      
      <!-- Subtitle -->
      <p class="text-xl sm:text-2xl font-light mb-8" style="color: #004d4d;">
        {subtitle}
      </p>
      
      <!-- Description -->
      <p class="text-xl text-black mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
        {@html description}
      </p>
      
      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button variant="primary" size="lg" href={primaryButtonHref}>
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
          </svg>
          {primaryButtonText}
        </Button>
        
        <Button variant="outline" size="lg" href={secondaryButtonHref}>
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {secondaryButtonText}
        </Button>
      </div>
    </div>
  </div>
</div>