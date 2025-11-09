<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Avatar from '$lib/components/atoms/Avatar.svelte';
  import { browser } from '$app/environment';
  
  export let variant: 'desktop' | 'mobile' = 'desktop';
  
  let user: { name?: string; email?: string; avatar?: string; loginMethod?: string } | null = null;
  
  let isOpen = false;
  let menuRef: HTMLDivElement;
  
  function toggleMenu() {
    isOpen = !isOpen;
  }
  
  function closeMenu() {
    isOpen = false;
  }
  
  function handleLogout() {
    if (browser) {
      localStorage.removeItem('user');
      user = null;
      closeMenu();
      goto('/');
    }
  }
  
  onMount(() => {
    if (!browser) return;
    
    // Verificar si hay usuario logueado
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        user = JSON.parse(storedUser);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
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
  {#if user}
    <!-- Usuario logueado -->
    <button
      on:click={toggleMenu}
      class="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
      class:w-full={variant === 'mobile'}
      class:justify-between={variant === 'mobile'}
    >
      <div class="flex items-center space-x-2">
        <Avatar src={user.avatar} alt={user.name || 'Usuario'} size={32} />
        <span class="text-sm font-medium">{user.name || 'Usuario'}</span>
      </div>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>
    
    {#if isOpen}
      <div class={variant === 'desktop' ? 'absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50' : 'mt-2 bg-gray-50 rounded-md p-2'}>
        <!-- Información del usuario -->
        <div class="px-4 py-3 border-b border-gray-200">
          <p class="text-sm font-medium text-gray-900">{user?.name || 'Usuario'}</p>
          <p class="text-sm text-gray-500 truncate">{user?.email}</p>
          {#if user?.loginMethod}
            <p class="text-xs mt-1" style="color: #003333;">
              Conectado via {user.loginMethod === 'google' ? 'Google' : user.loginMethod === 'facebook' ? 'Facebook' : 'Email'}
            </p>
          {/if}
        </div>
        
        <!-- Menú de opciones -->
        <div class="py-1">
          <a href="/profile" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
            <svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Mi Perfil
          </a>
          <a href="/tickets" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
            <svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Mis Entradas
          </a>
          <a href="/favorites" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
            <svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Favoritos
          </a>
          <a href="/settings" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
            <svg class="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configuración
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
        class={variant === 'desktop' ? 'text-gray-600 hover:text-gray-900 text-sm font-medium' : 'text-center py-2 text-gray-600 hover:text-gray-900 text-sm font-medium'}
      >
        Iniciar Sesión
      </a>
      <a 
        href="/register" 
        class={variant === 'desktop' ? 'text-white px-4 py-2 rounded-md text-sm font-medium transition-colors' : 'text-white px-4 py-2 rounded-md text-sm font-medium text-center transition-colors'}
        style="background-color: #003333;"
      >
        Registrarse
      </a>
    </div>
  {/if}
</div>
