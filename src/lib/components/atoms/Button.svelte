<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let href: string | undefined = undefined;
  export let disabled = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let onClick: (() => void) | undefined = undefined;
  
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'text-[#001212] focus:ring-offset-2',
    secondary: 'bg-[#0B3332] hover:bg-[#0B3332]/80 text-white focus:ring-[#00C27E]',
    outline: 'border bg-transparent focus:ring-offset-2',
    ghost: 'text-white/75 hover:text-white hover:bg-white/5 focus:ring-[#00C27E]'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-base',
    md: 'px-6 py-3 text-xl',
    lg: 'px-8 py-4 text-2xl'
  };
  
  const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';
  
  $: classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? disabledStyles : ''}`;
  
  $: customStyle = variant === 'primary' ? 'background-color: var(--accent); color: var(--bg);' : 
                   variant === 'outline' ? 'border-color: var(--accent); color: var(--accent); background-color: transparent;' : 
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