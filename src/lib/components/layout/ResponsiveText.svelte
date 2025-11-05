<script lang="ts">
  import { responsivePresets } from '$lib/utils/responsive';
  
  export let variant: 'hero' | 'title' | 'subtitle' | 'body' = 'body';
  export let tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' = 'p';
  export let className: string = '';
  export let color: string = '';
  
  $: textClasses = [
    responsivePresets.text[variant],
    color,
    className
  ].filter(Boolean).join(' ');
</script>

{#if tag === 'h1'}
  <h1 class={textClasses}><slot /></h1>
{:else if tag === 'h2'}
  <h2 class={textClasses}><slot /></h2>
{:else if tag === 'h3'}
  <h3 class={textClasses}><slot /></h3>
{:else if tag === 'h4'}
  <h4 class={textClasses}><slot /></h4>
{:else if tag === 'h5'}
  <h5 class={textClasses}><slot /></h5>
{:else if tag === 'h6'}
  <h6 class={textClasses}><slot /></h6>
{:else if tag === 'span'}
  <span class={textClasses}><slot /></span>
{:else}
  <p class={textClasses}><slot /></p>
{/if}