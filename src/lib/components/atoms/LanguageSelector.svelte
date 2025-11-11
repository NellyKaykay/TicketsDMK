<script lang="ts">
  export let currentLang = 'es';
  
  const languages = [
    { code: 'es', name: '', flag: '🇪🇸' },
    { code: 'en', name: '', flag: '🇺🇸' },
    { code: 'ru', name: '', flag: '🇷🇺' },
    { code: 'am', name: '', flag: '🇦🇲' }
  ];
  
  let isOpen = false;
  
  function toggleDropdown() {
    isOpen = !isOpen;
  }
  
  function selectLanguage(langCode: string) {
    currentLang = langCode;
    isOpen = false;
    // Aquí podrías dispatch un evento o actualizar un store
  }
  
  function closeDropdown() {
    isOpen = false;
  }
</script>

<div class="relative language-selector">
  <button
    on:click={toggleDropdown}
    class="flex items-center space-x-2 px-6 py-3 text-2xl text-gray-700 hover:text-gray-900 focus:outline-none font-semibold"
    aria-expanded={isOpen}
    aria-haspopup="true"
  >
    <span>{languages.find(lang => lang.code === currentLang)?.flag}</span>
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  </button>
  
  {#if isOpen}
    <div class="absolute right-0 mt-2 w-16 bg-white rounded-md shadow-lg border border-gray-200 z-50">
      {#each languages as lang}
        <button
          on:click={() => selectLanguage(lang.code)}
          class="w-full text-left flex items-center justify-center px-4 py-3 text-2xl text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md font-semibold"
          class:bg-gray-50={lang.code === currentLang}
        >
          <span>{lang.flag}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>

<!-- Handle clicks outside dropdown -->
<svelte:window on:click={(e) => {
  if (e.target && e.target instanceof Element && !e.target.closest('.language-selector')) {
    closeDropdown();
  }
}} />