<script lang="ts">
  import { base } from '$app/paths';
  export let size: 'sm' | 'md' | 'lg' | 'header' = 'md';
  
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
    header: 'h-10 w-auto sm:h-16'
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
    src={base + '/logo-ticketsdmk.jpg'} 
    alt="TicketsDMK" 
    class={`object-contain transition-transform duration-200 hover:scale-105 ${sizes[size]}`}
    on:error={(e) => { e.target.src = base + '/logo-ticketsdmk.jpg'; }}
  />
</a>