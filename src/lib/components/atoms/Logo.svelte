<script lang="ts">
  import { base } from '$app/paths';
  import logoSrc from '$lib/assets/logo-ticketsdmk.jpg';
  export let size: 'sm' | 'md' | 'lg' | 'header' = 'md';
  
  const sizes = {
    sm: 'h-10 w-10',
    md: 'h-24 w-24',
    lg: 'h-40 w-40',
    header: 'h-14 w-auto sm:h-20'
  };
  
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    header: 'text-xl'
  };
</script>

<a href={base + '/'} class="flex items-center">
  <img 
    src={logoSrc} 
    alt="TicketsDMK" 
    class={`object-contain transition-transform duration-200 hover:scale-105 ${sizes[size]}`}
  />
</a>