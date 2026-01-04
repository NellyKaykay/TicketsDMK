<script lang="ts">
  import { translations } from '../../stores/i18n';
  export let variant: 'desktop' | 'mobile' = 'desktop';
  export let onLinkClick: () => void = () => {};

  type HeaderTranslations = {
    header: {
      events: string;
      about: string;
      contact: string;
      concierto: string;
      teatro: string;
      película: string;
      monólogo: string;
    }
  };
  const fallback: HeaderTranslations = {
    header: {
      events: 'Eventos',
      about: 'Nosotros',
      contact: 'Contacto',
      concierto: 'Concierto',
      teatro: 'Teatro',
      película: 'Película',
      monólogo: 'Monólogo'
    }
  };
  function getSafeTranslations(input: any): HeaderTranslations {
    return {
      header: {
        events: input?.header?.events ?? fallback.header.events,
        about: input?.header?.about ?? fallback.header.about,
        contact: input?.header?.contact ?? fallback.header.contact,
        concierto: input?.header?.concierto ?? fallback.header.concierto,
        teatro: input?.header?.teatro ?? fallback.header.teatro,
        película: input?.header?.película ?? fallback.header.película,
        monólogo: input?.header?.monólogo ?? fallback.header.monólogo,
      }
    };
  }
  $: t = getSafeTranslations($translations);

  const navItems = [
    { href: '/about', label: 'about' },
    { href: '/contact', label: 'contact' }
  ];

  // canonical links: point categories to /events with query
  const eventsCategorias = [
    { href: '/events?category=concierto', label: 'Concierto' },
    { href: '/events?category=teatro', label: 'Teatro' },
    { href: '/events?category=pelicula', label: 'Película' },
    { href: '/events?category=monologo', label: 'Monólogo' }
  ];

  const baseStyles = 'text-gray-600 transition-colors duration-200';

  const variantStyles = {
    desktop: 'hidden md:flex items-center space-x-8',
    mobile: 'flex flex-col space-y-3'
  };

  const linkStyles = {
    desktop: 'text-2xl font-semibold',
    mobile: 'text-2xl font-semibold px-4 py-3 rounded-md hover:bg-gray-100'
  };

  let showEventsDropdown = false;
</script>

<nav class={variantStyles[variant]}>
  {#if variant === 'desktop'}
    <!-- Eventos dropdown -->
    <div class="relative"
         role="button"
         tabindex="0"
         on:mouseenter={() => showEventsDropdown = true}
         on:mouseleave={() => showEventsDropdown = false}
         on:keydown={(e) => e.key === 'Enter' && (showEventsDropdown = !showEventsDropdown)}>
      <a 
        href="/events" 
        class="{baseStyles} {linkStyles[variant]} flex items-center"
        style="color: #666666;"
        on:mouseenter={(e) => (e.target as HTMLElement).style.color='#003333'}
        on:mouseleave={(e) => (e.target as HTMLElement).style.color='#666666'}
      >
        {t.header.events}
        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </a>
      {#if showEventsDropdown}
        <div class="absolute top-full left-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          {#each eventsCategorias as categoria}
            <a 
              href={categoria.href}
              class="block px-4 py-2 text-sm transition-colors duration-200 first:rounded-t-md last:rounded-b-md text-gray-600 hover:bg-gray-50" 
              style="color: #666666;"
              on:mouseenter={(e) => { (e.target as HTMLElement).style.color='#003333'; (e.target as HTMLElement).style.backgroundColor='#f9fafb'; }}
              on:mouseleave={(e) => { (e.target as HTMLElement).style.color='#666666'; (e.target as HTMLElement).style.backgroundColor='transparent'; }}
              on:click={() => { showEventsDropdown = false; onLinkClick(); }}
            >
              {t.header[categoria.label.toLowerCase()]}
            </a>
          {/each}
        </div>
      {/if}
    </div>
    <!-- Otros items: Nosotros y Contacto -->
    <div class="flex items-center space-x-8">
      {#each navItems as item}
        <a 
          href={item.href} 
          class={`${baseStyles} ${linkStyles[variant]}`}
          style="color: #666666;"
          target="_self"
          rel=""
          on:mouseenter={(e) => (e.target as HTMLElement).style.color='#003333'}
          on:mouseleave={(e) => (e.target as HTMLElement).style.color='#666666'}
          on:click={onLinkClick}
        >
          {t.header[item.label]}
        </a>
      {/each}
    </div>
  {:else}
    <!-- Mobile: enlace directo a /events -->
    <a 
      href="/events" 
      class={`${baseStyles} ${linkStyles[variant]}`}
      style="color: #666666;"
      on:mouseenter={(e) => (e.target as HTMLElement).style.color='#003333'}
      on:mouseleave={(e) => (e.target as HTMLElement).style.color='#666666'}
    >
      {t.header.events}
    </a>
    {#each navItems as item}
      <a 
        href={item.href} 
        class={`${baseStyles} ${linkStyles[variant]}`}
        style="color: #666666;"
        target="_self"
        rel=""
        on:mouseenter={(e) => (e.target as HTMLElement).style.color='#003333'}
        on:mouseleave={(e) => (e.target as HTMLElement).style.color='#666666'}
        on:click={onLinkClick}
      >
        {t.header[item.label]}
      </a>
    {/each}
  {/if}
</nav>