<script lang="ts">
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

<div class="relative overflow-visible flex items-center justify-center hero-no-gap min-h-[60vh] sm:min-h-[70vh]">
  <!-- Card principal - ocupa todo el hero -->
  <div class="w-full h-full z-10 flex justify-center items-center">
    <div class="w-full">
      <CardFlotante />
    </div>
  </div>
</div>