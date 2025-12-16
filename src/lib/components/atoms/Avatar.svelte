<script lang="ts">
  export let src: string | null = null;
  export let alt = 'User';
  export let size = 36; // px

  // inicial calculada a partir del alt (nombre)
  $: initial = alt ? String(alt).trim().charAt(0).toUpperCase() : 'U';
</script>

<div
  class="inline-flex items-center justify-center rounded-full bg-[#003333] overflow-hidden"
  style={`width:${size}px;height:${size}px`}
  aria-label={alt}
>
  {#if src}
    <img src={src} alt={alt} class="w-full h-full object-cover" />
  {:else}
    <!-- Inicial del usuario como fallback -->
    <span class="text-sm font-semibold text-white select-none">{initial}</span>
  {/if}
</div>
