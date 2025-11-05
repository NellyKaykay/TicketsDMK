<script lang="ts">
  import { responsivePresets, type ResponsiveVariant } from '$lib/utils/responsive';
  
  export let on: ResponsiveVariant | Array<'mobile' | 'tablet' | 'desktop'> = 'all';
  export let className: string = '';
  
  $: visibilityClasses = Array.isArray(on) 
    ? on.map(variant => {
        switch (variant) {
          case 'mobile': return 'block md:hidden';
          case 'tablet': return 'hidden md:block lg:hidden';
          case 'desktop': return 'hidden lg:block';
          default: return '';
        }
      }).join(' ')
    : on === 'mobile' ? responsivePresets.visibility.mobileOnly
    : on === 'tablet' ? 'hidden md:block lg:hidden' 
    : on === 'desktop' ? responsivePresets.visibility.desktopOnly
    : '';
  
  $: finalClasses = [visibilityClasses, className].filter(Boolean).join(' ');
</script>

{#if on === 'all' || visibilityClasses}
  <div class={finalClasses}>
    <slot />
  </div>
{/if}