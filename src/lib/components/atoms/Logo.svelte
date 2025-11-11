<script lang="ts">
  export let size: 'sm' | 'md' | 'lg' | 'header' = 'md';
  
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-32 w-32', 
    lg: 'h-40 w-40',
  header: 'h-16 w-auto sm:h-24'
  };
  
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    header: 'text-xl'
  };
</script>

<a href="/" class="flex items-center">
  <img 
    src="/logo-ticketsdmk.jpg" 
    alt="TicketsDMK" 
    class={`object-contain transition-transform duration-200 hover:scale-105 ${sizes[size]}`}
  />
</a>