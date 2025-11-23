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

  const eventosCategorias = [
    { href: '/concerts', label: 'Concierto' },
    { href: '/teatro', label: 'Teatro' },
    { href: '/pelicula', label: 'Película' },
    { href: '/monologo', label: 'Monólogo' }
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

  let showEventosDropdown = false;
</script>

<nav class={variantStyles[variant]}>
  {#if variant === 'desktop'}
    <!-- Solo un dropdown de Eventos -->
    <div class="relative"
         role="button"
         tabindex="0"
         on:mouseenter={() => showEventosDropdown = true}
         on:mouseleave={() => showEventosDropdown = false}
         on:keydown={(e) => e.key === 'Enter' && (showEventosDropdown = !showEventosDropdown)}>
      <a 
        href="/#eventos" 
        class="{baseStyles} {linkStyles[variant]} flex items-center"
        style="color: #666666;"
        on:mouseenter={(e) => e.target.style.color='#003333'}
        on:mouseleave={(e) => e.target.style.color='#666666'}
        on:click={(e) => e.preventDefault()}
      >
        {t.header.events}
        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </a>
      {#if showEventosDropdown}
        <div class="absolute top-full left-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          {#each eventosCategorias as categoria}
            <a 
              href={categoria.href}
              class="block px-4 py-2 text-sm transition-colors duration-200 first:rounded-t-md last:rounded-b-md text-gray-600 hover:bg-gray-50" 
              style="color: #666666;"
              on:mouseenter={(e) => { e.target.style.color='#003333'; e.target.style.backgroundColor='#f9fafb'; }}
              on:mouseleave={(e) => { e.target.style.color='#666666'; e.target.style.backgroundColor='transparent'; }}
              on:click={() => { showEventosDropdown = false; onLinkClick(); }}
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
          on:mouseenter={(e) => e.target.style.color='#003333'}
          on:mouseleave={(e) => e.target.style.color='#666666'}
          on:click={onLinkClick}
        >
          {t.header[item.label]}
        </a>
      {/each}
    </div>
  {:else}
    <!-- Solo un enlace de Eventos en mobile -->
    <a 
      href="/#eventos" 
      class={`${baseStyles} ${linkStyles[variant]}`}
      style="color: #666666;"
      on:mouseenter={(e) => e.target.style.color='#003333'}
      on:mouseleave={(e) => e.target.style.color='#666666'}
      on:click={(e) => e.preventDefault()}
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
        on:mouseenter={(e) => e.target.style.color='#003333'}
        on:mouseleave={(e) => e.target.style.color='#666666'}
        on:click={onLinkClick}
      >
        {t.header[item.label]}
      </a>
    {/each}
  {/if}
  </nav>