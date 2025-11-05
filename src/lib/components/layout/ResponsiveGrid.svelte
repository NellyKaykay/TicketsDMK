<script lang="ts">
  import { responsivePresets } from '$lib/utils/responsive';
  
  export let columns: 2 | 3 | 4 | 'auto' = 3;
  export let gap: 'small' | 'medium' | 'large' = 'medium';
  export let className: string = '';
  
  const gapClasses = {
    small: 'gap-4',
    medium: 'gap-6 lg:gap-8', 
    large: 'gap-8 lg:gap-12'
  };
  
  $: gridClasses = [
    columns === 2 ? responsivePresets.grid.responsive2 :
    columns === 3 ? responsivePresets.grid.responsive3 :
    columns === 4 ? responsivePresets.grid.responsive4 :
    responsivePresets.grid.autoFit,
    className
  ].filter(Boolean).join(' ').replace(/gap-\d+(?:\s+lg:gap-\d+)?/, gapClasses[gap]);
</script>

<div class={gridClasses}>
  <slot />
</div>