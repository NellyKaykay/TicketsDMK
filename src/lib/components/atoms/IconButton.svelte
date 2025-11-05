<script lang="ts">
  export let direction: 'left' | 'right' | 'up' | 'down' = 'right';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let disabled = false;
  export let onClick: (() => void) | undefined = undefined;
  
  const baseStyles = 'inline-flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-800';
  
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  const directions = {
    left: 'M15 19l-7-7 7-7',
    right: 'M9 5l7 7-7 7',
    up: 'M19 15l-7-7-7 7',
    down: 'M5 9l7 7 7-7'
  };
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900';
  
  $: classes = `${baseStyles} ${sizes[size]} ${disabledStyles}`;
</script>

<button class={classes} {disabled} on:click={onClick} aria-label={`Navigate ${direction}`}>
  <svg class={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={directions[direction]} />
  </svg>
</button>