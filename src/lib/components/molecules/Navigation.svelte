<script lang="ts">
  export let variant: 'desktop' | 'mobile' = 'desktop';
  export let onLinkClick: () => void = () => {};
  
  const navItems = [
    { href: 'https://skyarmenia.com', label: 'Vuelos', external: true },
    { href: '/about', label: 'Nosotros' },
    { href: '/contact', label: 'Contacto' }
  ];
  

  
  const ciudades = [
    { href: '/events/barcelona', label: 'Barcelona' },
    { href: '/events/madrid', label: 'Madrid' },
    { href: '/events/valencia', label: 'Valencia' },
    { href: '/events/alicante', label: 'Alicante' }
  ];
  
  const baseStyles = 'text-gray-600 transition-colors duration-200';
  
  const variantStyles = {
    desktop: 'hidden md:flex items-center space-x-8',
    mobile: 'flex flex-col space-y-3'
  };
  
  const linkStyles = {
    desktop: 'text-base font-medium',
    mobile: 'text-lg font-medium px-3 py-2 rounded-md hover:bg-gray-100'
  };
  
  let showEventosDropdown = false;
</script>

<nav class={variantStyles[variant]}>
  {#if variant === 'desktop'}
    <!-- Eventos dropdown -->
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
        Eventos
        <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </a>
      
      {#if showEventosDropdown}
        <div class="absolute top-full left-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          {#each ciudades as ciudad}
            <a 
              href={ciudad.href}
              class="block px-4 py-2 text-sm transition-colors duration-200 first:rounded-t-md last:rounded-b-md text-gray-600 hover:bg-gray-50" 
              style="color: #666666;"
              on:mouseenter={(e) => { e.target.style.color='#003333'; e.target.style.backgroundColor='#f9fafb'; }}
              on:mouseleave={(e) => { e.target.style.color='#666666'; e.target.style.backgroundColor='transparent'; }}
              on:click={() => { showEventosDropdown = false; onLinkClick(); }}
            >
              {ciudad.label}
            </a>
          {/each}
        </div>
      {/if}
    </div>
    
    <!-- Other nav items -->
    {#each navItems as item}
      <a 
        href={item.href} 
        class={`${baseStyles} ${linkStyles[variant]}`}
        style="color: #666666;"
        target={item.external ? '_blank' : '_self'}
        rel={item.external ? 'noopener noreferrer' : ''}
        on:mouseenter={(e) => e.target.style.color='#003333'}
        on:mouseleave={(e) => e.target.style.color='#666666'}
        on:click={onLinkClick}
      >
        {item.label}
        {#if item.external}
          <svg class="ml-1 h-3 w-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        {/if}
      </a>
    {/each}
  {:else}
    <!-- Mobile version -->
    <a 
      href="/#eventos" 
      class={`${baseStyles} ${linkStyles[variant]}`}
      style="color: #666666;"
      on:mouseenter={(e) => e.target.style.color='#003333'}
      on:mouseleave={(e) => e.target.style.color='#666666'}
      on:click={(e) => e.preventDefault()}
    >
      Eventos
    </a>
    {#each navItems as item}
      <a 
        href={item.href} 
        class={`${baseStyles} ${linkStyles[variant]}`}
        style="color: #666666;"
        target={item.external ? '_blank' : '_self'}
        rel={item.external ? 'noopener noreferrer' : ''}
        on:mouseenter={(e) => e.target.style.color='#003333'}
        on:mouseleave={(e) => e.target.style.color='#666666'}
        on:click={onLinkClick}
      >
        {item.label}
        {#if item.external}
          <svg class="ml-1 h-3 w-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        {/if}
      </a>
    {/each}
  {/if}
</nav>