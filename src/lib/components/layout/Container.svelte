<script lang="ts">
  import { responsivePresets } from '$lib/utils/responsive';
  
  export let variant: 'default' | 'tight' | 'wide' = 'default';
  export let padding: 'default' | 'large' | 'small' | 'none' = 'default';
  export let className: string = '';
  
  $: containerClasses = [
    responsivePresets.container[variant],
    padding !== 'none' ? responsivePresets.sectionPadding[padding] : '',
    className
  ].filter(Boolean).join(' ');
</script>

<div class={containerClasses}>
  <slot />
</div>