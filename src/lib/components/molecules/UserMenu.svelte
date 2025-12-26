<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Avatar from '$lib/components/atoms/Avatar.svelte';
  import { user, logout, initSession } from '$lib/stores/user';
  import { get } from 'svelte/store';
  export let variant: 'desktop' | 'mobile' = 'desktop';
  let isOpen = false;
  let menuRef: HTMLDivElement;
  let currentUser = null;
  $: user.subscribe(u => currentUser = u);
  function toggleMenu() {
    isOpen = !isOpen;
  }

  $: currentPath = $page.url?.pathname;

  function handleHeaderClick() {
    // Toggle menu on click (desktop and mobile) so user can access dropdown options
    toggleMenu();
  }
  function closeMenu() {
    isOpen = false;
  }
  async function handleLogout() {
    await logout();
    closeMenu();
    goto('/');
  }
  onMount(() => {
    initSession();
    function handleClickOutside(event: MouseEvent) {
      if (menuRef && !menuRef.contains(event.target as Node)) {
        closeMenu();
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeMenu();
      }
    }
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  });
  const baseStyles = variant === 'desktop' ? 'relative' : 'w-full';
</script>

<div class={baseStyles} bind:this={menuRef}>
  {#if currentUser}
    <!-- Usuario logueado -->
    <button
      on:click={handleHeaderClick}
      class="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
      class:w-full={variant === 'mobile'}
      class:justify-between={variant === 'mobile'}
    >
      <div class="flex items-center space-x-2">
        <Avatar src={currentUser.user_metadata?.avatar_url} alt={currentUser.user_metadata?.name || currentUser.email || 'Usuario'} size={32} />
        <span class="text-sm font-medium">{currentUser.user_metadata?.name || currentUser.email || 'Usuario'}</span>
      </div>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>
    
    {#if isOpen}
      <div class={variant === 'desktop' ? 'absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50' : 'mt-2 bg-gray-50 rounded-md p-2'}>
        <!-- Información del usuario -->
        <div class="px-4 py-3 border-b border-gray-200">
          <p class="text-sm font-medium text-gray-900">{currentUser.user_metadata?.name || 'Usuario'}</p>
          <p class="text-sm text-gray-500 truncate">{currentUser.email}</p>
          <!-- Proveedor de conexión eliminado -->
        </div>
        
        <!-- Menú de opciones -->
        <div class="py-1">
          <a
            href="/profile"
            on:click|preventDefault={() => { closeMenu(); goto('/profile'); }}
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Mi Perfil
          </a>

          <a
            href="/tickets"
            on:click|preventDefault={() => { closeMenu(); goto('/tickets'); }}
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Mis Entradas
          </a>
        </div>
        
        <hr class="my-1 border-gray-200">
        
        <div class="py-1">
          <button 
            on:click={handleLogout}
            class="flex items-center w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 rounded-md"
          >
            <svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </div>
    {/if}
  {:else}
    <!-- Usuario no logueado -->
    <div class={variant === 'desktop' ? 'flex items-center space-x-3' : 'flex flex-col space-y-2'}>
      <a 
        href="/login" 
        class={variant === 'desktop' ? 'text-gray-600 hover:text-gray-900 text-2xl font-semibold px-4 py-2' : 'text-center py-3 text-gray-600 hover:text-gray-900 text-2xl font-semibold'}
      >
        Iniciar Sesión
      </a>
    </div>
  {/if}
</div>
