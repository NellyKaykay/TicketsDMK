<script lang="ts">
  import IconButton from '../atoms/IconButton.svelte';
  
  export let onPrevious: () => void;
  export let onNext: () => void;
  export let canGoPrevious = true;
  export let canGoNext = true;
  export let position: 'inside' | 'outside' = 'inside';
  
  const positionStyles = {
    inside: 'absolute top-1/2 transform -translate-y-1/2 z-10',
    outside: 'flex justify-center space-x-4 mt-6'
  };
  
  const leftPosition = position === 'inside' ? 'left-4' : '';
  const rightPosition = position === 'inside' ? 'right-4' : '';
</script>

{#if position === 'inside'}
  <!-- Inside positioning -->
  <div class={`${positionStyles[position]} ${leftPosition}`}>
    <IconButton 
      direction="left" 
      size="lg" 
      disabled={!canGoPrevious}
      onClick={onPrevious}
    />
  </div>
  
  <div class={`${positionStyles[position]} ${rightPosition}`}>
    <IconButton 
      direction="right" 
      size="lg" 
      disabled={!canGoNext}
      onClick={onNext}
    />
  </div>
{:else}
  <!-- Outside positioning -->
  <div class={positionStyles[position]}>
    <IconButton 
      direction="left" 
      size="md" 
      disabled={!canGoPrevious}
      onClick={onPrevious}
    />
    <IconButton 
      direction="right" 
      size="md" 
      disabled={!canGoNext}
      onClick={onNext}
    />
  </div>
{/if}