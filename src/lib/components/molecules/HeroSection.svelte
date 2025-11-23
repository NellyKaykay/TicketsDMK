<script lang="ts">
  import Button from '../atoms/Button.svelte';
  import Container from '../layout/Container.svelte';
  import ResponsiveText from '../layout/ResponsiveText.svelte';
  import Stack from '../layout/Stack.svelte';
  import ResponsiveGrid from '../layout/ResponsiveGrid.svelte';
  import CardFlotante from '../atoms/CardFlotante.svelte';
  import { translations } from '../../stores/i18n';
  type HeroTranslations = {
    homepage: {
      title: string;
      subtitle: string;
      description: string;
      cardTitle: string;
      cardArtist: string;
      cardVenue: string;
      cardCategory: string;
    };
    buttons: {
      exploreEvents: string;
      howItWorks: string;
    };
  };
  const fallback: HeroTranslations = {
    homepage: {
      title: 'Descubre los mejores eventos',
      subtitle: 'Vive experiencias musicales únicas con TicketsDMK',
      description: 'Encuentra entradas para tus artistas favoritos, descubre nuevos talentos y disfruta de eventos exclusivos en las mejores salas de eventos.',
      cardTitle: 'Concierto de prueba',
      cardArtist: 'Artista Ejemplo',
      cardVenue: 'Sala Principal',
      cardCategory: 'Pop'
    },
    buttons: {
      exploreEvents: 'Explorar Eventos',
      howItWorks: 'Cómo funciona'
    }
  };

  function getSafeTranslations(input: any): HeroTranslations {
    return {
      homepage: {
        title: input?.homepage?.title ?? fallback.homepage.title,
        subtitle: input?.homepage?.subtitle ?? fallback.homepage.subtitle,
        description: input?.homepage?.description ?? fallback.homepage.description,
        cardTitle: input?.homepage?.cardTitle ?? fallback.homepage.cardTitle,
        cardArtist: input?.homepage?.cardArtist ?? fallback.homepage.cardArtist,
        cardVenue: input?.homepage?.cardVenue ?? fallback.homepage.cardVenue,
        cardCategory: input?.homepage?.cardCategory ?? fallback.homepage.cardCategory,
      },
      buttons: {
        exploreEvents: input?.buttons?.exploreEvents ?? fallback.buttons.exploreEvents,
        howItWorks: input?.buttons?.howItWorks ?? fallback.buttons.howItWorks,
      }
    };
  }

  $: t = getSafeTranslations($translations);
</script>

<div class="relative text-[#003333] overflow-hidden min-h-[70vh] sm:min-h-[80vh] flex items-center">
  <!-- Background image -->
  <img src="heroe-image.jpg" alt="Hero background" class="absolute inset-0 w-full h-full object-cover" />
  <!-- Content -->
  <div class="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
    <div class="text-center max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-4">{t.homepage.title}</h1>
      <h2 class="text-2xl mb-2">{t.homepage.subtitle}</h2>
      <p class="mb-6">{t.homepage.description}</p>
    </div>
  </div>
</div>

<!-- Card flotante integrado -->
<div class="w-full flex justify-center relative z-10 hero-card-float mt-[-18rem] sm:mt-[-24rem] lg:mt-[-32rem]">
  <div class="w-full sm:w-4/5 lg:w-3/5 bg-transparent">
    <style>
      /* Efecto flotante visible para el contenedor de la tarjeta en el hero */
      .hero-card-float {
        filter: drop-shadow(0 40px 120px rgba(0,0,0,0.7)) drop-shadow(0 4px 32px rgba(0,0,0,0.22));
        transition: filter 0.4s cubic-bezier(.4,2,.6,1);
      }
      .hero-card-float:hover {
        filter: drop-shadow(0 60px 180px rgba(0,0,0,0.85)) drop-shadow(0 8px 48px rgba(0,0,0,0.28));
      }
    </style>
    <CardFlotante
      concert={{
        id: "1",
        title: t.homepage.cardTitle,
        artist: t.homepage.cardArtist,
        date: "2024-07-01",
        venue: t.homepage.cardVenue,
        image: "/carousel/image-4.jpg",
        price: "25",
        category: t.homepage.cardCategory,
        availability: "available"
      }}
    />
  </div>
</div>
<!-- Botones debajo del card flotante -->
<div class="w-full flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
  <Button variant="primary" size="lg" href="#eventos">
    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
    </svg>
    {t.buttons.exploreEvents}
  </Button>
  <Button variant="outline" size="lg" href="/about">
    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
    {t.buttons.howItWorks}
  </Button>
</div>