<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  let username = '';
  let password = '';
  let showPassword = false;
  let error = '';
  let isLogged = false;

  const admins = [
    { user: 'David', pass: 'david2025' },
    { user: 'Nelly', pass: 'nelly2025' }
  ];

  function handleLogin() {
    const found = admins.find(a => a.user === username && a.pass === password);
    if (found) {
      isLogged = true;
      error = '';
    } else {
      error = 'Usuario o contraseña incorrectos';
    }
  }
</script>

<svelte:head>
  <title>Admin | TicketsDMK</title>
</svelte:head>

<div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
  {#if !isLogged}
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center" style="color: #003333;">Acceso Administrador</h2>
      {#if error}
        <div class="mb-4 text-red-600 text-center">{error}</div>
      {/if}
      <form on:submit|preventDefault={handleLogin} class="flex flex-col gap-4">
        <input type="text" placeholder="Usuario" bind:value={username} class="border rounded-md px-4 py-2" required />
        <div class="relative">
          <input type={showPassword ? 'text' : 'password'} placeholder="Contraseña" bind:value={password} class="border rounded-md px-4 py-2 w-full" required />
          <button type="button" class="absolute right-2 top-2 text-xs text-gray-500" style="background: none; border: none; cursor: pointer;" on:click={() => showPassword = !showPassword}>
            {showPassword ? 'Ocultar' : 'Ver'}
          </button>
        </div>
        <button type="submit" class="bg-[#003333] text-white rounded-md px-4 py-2 font-semibold">Entrar</button>
      </form>
    </div>
  {:else}
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl text-center">
      <h2 class="text-2xl font-bold mb-6" style="color: #003333;">Panel de gestión de eventos</h2>
      <p class="mb-4">¡Login correcto! Crea o edita eventos:</p>
      <form class="flex flex-col gap-4 text-left" style="max-width: 500px; margin: 0 auto;">
        <input type="text" placeholder="ID" class="border rounded-md px-4 py-2" required />
        <input type="text" placeholder="Título" class="border rounded-md px-4 py-2" required />
        <input type="text" placeholder="Artista" class="border rounded-md px-4 py-2" required />
        <input type="date" placeholder="Fecha" class="border rounded-md px-4 py-2" required />
        <input type="text" placeholder="Sala / Venue" class="border rounded-md px-4 py-2" required />
        <input type="text" placeholder="Precio" class="border rounded-md px-4 py-2" required />
        <input type="text" placeholder="Categoría" class="border rounded-md px-4 py-2" required />
        <select class="border rounded-md px-4 py-2" required>
          <option value="available">Disponible</option>
          <option value="limited">Pocas entradas</option>
          <option value="sold-out">Agotado</option>
        </select>
        <input type="text" placeholder="Ruta de imagen (ej: /carousel/image-1.jpg)" class="border rounded-md px-4 py-2" required />
        <input type="file" accept="image/*" class="border rounded-md px-4 py-2" />
        <button type="submit" class="bg-[#003333] text-white rounded-md px-4 py-2 font-semibold">Guardar evento</button>
      </form>
    </div>
  {/if}
</div>
