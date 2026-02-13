<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import EventCards from './EventCards.svelte';
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

  // Campos del formulario de evento
  let title = '';
  let artist = '';
  let date = '';
  let venue = '';
  let price = '';
  let category = '';
  let status = 'available';
  let flyer_url = '';
  let eventError = '';
  let eventSuccess = '';


  // Token de admin (debería coincidir con .env)
  const adminToken = 'ticketsdmk_admin_123456789_cambia_esto';

  // Subida de flyer a Supabase Storage
  async function uploadFlyer(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/admin/upload-flyer', {
      method: 'POST',
      headers: {
        'x-admin-token': adminToken
      },
      body: formData
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Error al subir la imagen');
    }
    return data.publicUrl;
  }

  async function handleEventSubmit() {
    eventError = '';
    eventSuccess = '';
    const venue_id = '00000000-0000-0000-0000-000000000000';
    let flyerInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    let file = flyerInput?.files?.[0];
    let finalFlyerUrl = flyer_url;
    try {
      if (file) {
        finalFlyerUrl = await uploadFlyer(file);
        flyer_url = finalFlyerUrl;
      }
      const token = 'TicketsDMK_admin_2026_secure_93kLx';
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify({
          title,
          artist,
          date,
          flyer_url: finalFlyerUrl,
          venue_id,
          description: null // Puedes agregar más campos si lo deseas
        })
      });
      const data = await res.json();
      if (!res.ok) {
        eventError = data.error || 'Error al guardar el evento';
      } else {
        eventSuccess = data.event_id;
        // Limpiar campos
        title = artist = date = venue = price = category = status = flyer_url = '';
        if (flyerInput) flyerInput.value = '';
      }
    } catch (e: any) {
      eventError = e.message || 'Error inesperado';
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
      <form class="flex flex-col gap-4" on:submit|preventDefault={handleLogin}>
        <input
          type="text"
          placeholder="Usuario"
          class="border rounded-md px-4 py-2"
          bind:value={username}
          required
        />
        <div class="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            class="border rounded-md px-4 py-2 w-full"
            bind:value={password}
            required
          />
          <button
            type="button"
            class="absolute right-2 top-2 text-sm text-gray-600"
            on:click={() => (showPassword = !showPassword)}
            tabindex="-1"
          >
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
      <form class="flex flex-col gap-4 text-left" style="max-width: 500px; margin: 0 auto;" on:submit|preventDefault={handleEventSubmit}>
        {#if eventError}
          <div class="mb-2 text-red-600 text-center">{eventError}</div>
        {/if}
        {#if eventSuccess}
          <div class="mb-2 text-green-600 text-center">Evento guardado correctamente (ID: {eventSuccess})</div>
        {/if}
        <input type="text" placeholder="Título" class="border rounded-md px-4 py-2" bind:value={title} required />
        <input type="text" placeholder="Artista" class="border rounded-md px-4 py-2" bind:value={artist} required />
        <input type="date" placeholder="Fecha" class="border rounded-md px-4 py-2" bind:value={date} required />
        <input type="text" placeholder="Sala / Venue" class="border rounded-md px-4 py-2" bind:value={venue} required />
        <input type="text" placeholder="Precio" class="border rounded-md px-4 py-2" bind:value={price} required />
        <input type="text" placeholder="Categoría" class="border rounded-md px-4 py-2" bind:value={category} required />
        <select class="border rounded-md px-4 py-2" bind:value={status} required>
          <option value="available">Disponible</option>
          <option value="limited">Pocas entradas</option>
          <option value="sold-out">Agotado</option>
        </select>
        <input type="text" placeholder="URL de imagen del flyer" class="border rounded-md px-4 py-2" bind:value={flyer_url} required />
        <input type="file" accept="image/*" class="border rounded-md px-4 py-2" />
        <button type="submit" class="bg-[#003333] text-white rounded-md px-4 py-2 font-semibold">Guardar evento</button>
    </form>
    <!-- Tarjetas de eventos existentes -->
    <div class="mt-16">
      <h3 class="text-xl font-bold mb-4 text-left" style="color:#003333;">Eventos existentes</h3>
      <EventCards />
    </div>
  </div>
  {/if}
</div>

