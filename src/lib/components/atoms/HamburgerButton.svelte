<script lang="ts">
  export let isOpen = false;
  export let onClick: () => void = () => {};
</script>

<button
  on:click={onClick}
  class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
  aria-expanded={isOpen}
  aria-label="Abrir menú principal"
>
  <span class="sr-only">Abrir menú principal</span>
  {#if !isOpen}
    <!-- Hamburger icon -->
    <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  {:else}
    <!-- Close icon -->
    <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  {/if}
</button>