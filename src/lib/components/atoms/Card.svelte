<script lang="ts">
  export let variant: 'default' | 'elevated' | 'bordered' = 'default';
  export let padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  export let clickable = false;
  export let onClick: (() => void) | undefined = undefined;
  
  const baseStyles = 'bg-white overflow-hidden';
  
  const variants = {
    default: 'shadow-sm',
    elevated: 'shadow-lg',
    bordered: 'border border-gray-200 shadow-sm'
  };
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const clickableStyles = clickable ? 'cursor-pointer hover:shadow-md transition-shadow duration-200' : '';
  
  $: classes = `${baseStyles} ${variants[variant]} ${paddings[padding]} ${clickableStyles} rounded-lg`;
</script>

{#if clickable}
  <button class={classes} on:click={onClick} type="button">
    <slot />
  </button>
{:else}
  <div class={classes}>
    <slot />
  </div>
{/if}