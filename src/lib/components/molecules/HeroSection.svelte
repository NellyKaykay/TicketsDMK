<script lang="ts">
  import Button from '../atoms/Button.svelte';
  import CardFlotante from '../atoms/CardFlotante.svelte';
  import { translations } from '../../stores/i18n';
  import { base } from '$app/paths';
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

<div class="relative text-[#003333] overflow-hidden min-h-[70vh] sm:min-h-[80vh] flex items-center hero-no-gap">
  <!-- Background image -->
  <img src={base + '/heroe-image.jpg'} alt="Hero background" class="absolute inset-0 w-full h-full object-cover" on:error={(e) => { e.target.src = base + '/heroe-image.jpg'; }} />
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
<div class="w-full flex justify-center relative z-50 hero-card-float mt-[-18rem] sm:mt-[-24rem] lg:mt-[-32rem]">
  <div class="w-full sm:w-4/5 lg:w-3/5 bg-transparent">
    <!-- Eliminado el estilo de drop-shadow y hover del contenedor para evitar conflicto con el efecto de CardFlotante -->
    <CardFlotante />
  </div>
</div>