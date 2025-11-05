<script lang="ts">
  import { responsivePresets } from '$lib/utils/responsive';
  
  export let direction: 'column' | 'row' | 'responsive' = 'responsive';
  export let align: 'start' | 'center' | 'end' | 'stretch' = 'start';
  export let justify: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly' = 'start';
  export let gap: 'small' | 'medium' | 'large' = 'medium';
  export let className: string = '';
  
  const alignClasses = {
    start: 'items-start',
    center: 'items-center', 
    end: 'items-end',
    stretch: 'items-stretch'
  };
  
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end', 
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };
  
  const gapClasses = {
    small: 'gap-2 sm:gap-3',
    medium: 'gap-4 sm:gap-6',
    large: 'gap-6 sm:gap-8'
  };
  
  const directionClasses = {
    column: 'flex flex-col',
    row: 'flex flex-row',
    responsive: 'flex flex-col sm:flex-row'
  };
  
  $: stackClasses = [
    directionClasses[direction],
    alignClasses[align],
    justifyClasses[justify],
    gapClasses[gap],
    className
  ].filter(Boolean).join(' ');
</script>

<div class={stackClasses}>
  <slot />
</div>