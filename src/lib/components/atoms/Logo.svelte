<script lang="ts">
  export let size: 'sm' | 'md' | 'lg' = 'md';
  
  const sizes = {
    sm: 'h-24 w-24',
    md: 'h-40 w-40', 
    lg: 'h-48 w-48'
  };
  
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };
</script>

<a href="/" class="flex items-center">
  <img 
    src="/logo-ticketsdmk.png" 
    alt="TicketsDMK" 
    class={`object-contain ${sizes[size]}`}
  />
</a>