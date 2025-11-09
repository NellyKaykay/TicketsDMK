<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let href: string | undefined = undefined;
  export let disabled = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let onClick: (() => void) | undefined = undefined;
  
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'text-white focus:ring-offset-2',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500',
    outline: 'border bg-transparent focus:ring-offset-2',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';
  
  $: classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? disabledStyles : ''}`;
  
  $: customStyle = variant === 'primary' ? 'background-color: #003333;' : 
                   variant === 'outline' ? 'border-color: #003333; color: white; background-color: transparent;' : 
                   '';
</script>

{#if href && !disabled}
  <a {href} class={classes} style={customStyle}>
    <slot />
  </a>
{:else}
  <button {type} class={classes} style={customStyle} {disabled} on:click={onClick}>
    <slot />
  </button>
{/if}