<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let href: string | undefined = undefined;
  export let disabled = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let onClick: (() => void) | undefined = undefined;
  
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-green-800 hover:bg-green-700 text-white focus:ring-green-800',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500',
    outline: 'border border-green-800 bg-transparent hover:bg-green-800 text-white focus:ring-green-800',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';
  
  $: classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? disabledStyles : ''}`;
</script>

{#if href && !disabled}
  <a {href} class={classes}>
    <slot />
  </a>
{:else}
  <button {type} class={classes} {disabled} on:click={onClick}>
    <slot />
  </button>
{/if}