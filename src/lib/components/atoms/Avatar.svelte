<script lang="ts">
  export let src: string | null = null;
  export let alt = 'User';
  export let size = 36; // px
</script>

<div
  class="inline-flex items-center justify-center rounded-full bg-gray-200 overflow-hidden ring-1 ring-black/5"
  style={`width:${size}px;height:${size}px`}
  aria-label={alt}
>
  {#if src}
    <img src={src} alt={alt} class="w-full h-full object-cover" />
  {:else}
    <!-- Inicial del usuario como fallback -->
    <span class="text-sm font-semibold text-gray-600 select-none">U</span>
  {/if}
</div>
