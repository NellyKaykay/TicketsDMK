<script lang="ts">
  import Navigation from './Navigation.svelte';
  import UserMenu from './UserMenu.svelte';
  import LanguageSelector from '../atoms/LanguageSelector.svelte';
  
  export let isOpen = false;
  export let onClose: () => void = () => {};
</script>

{#if isOpen}
  <!-- Overlay -->
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
    on:click={onClose}
    on:keydown={(e) => e.key === 'Escape' && onClose()}
    role="button"
    tabindex="0"
    aria-label="Cerrar menú"
  ></div>
  
  <!-- Mobile menu panel -->
  <div class="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl z-50 md:hidden transform transition-transform duration-300 ease-in-out">
    <div class="h-full flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Menú</h2>
        <button
          on:click={onClose}
          class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          aria-label="Cerrar menú"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Navigation -->
      <div class="flex-1 px-4 py-6 space-y-6">
        <Navigation variant="mobile" onLinkClick={onClose} />
        
        <!-- Divider -->
        <hr class="border-gray-200">
        
        <!-- User Menu -->
        <UserMenu variant="mobile" />
        
        <!-- Language Selector -->
        <div class="pt-4">
          <LanguageSelector />
        </div>
      </div>
    </div>
  </div>
{/if}