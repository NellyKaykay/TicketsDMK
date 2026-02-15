<script lang="ts">
  import { onMount } from 'svelte';
  const adminToken = 'TicketsDMK_admin_2026_secure_93kLx';
  let events: any[] = [];
  let loading = true;
  let error = '';

  async function loadEvents() {
    loading = true;
    error = '';
    try {
      const res = await fetch('/api/admin/events', {
        method: 'GET',
        headers: { 'x-admin-token': adminToken }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cargar eventos');
      events = data.events;
    } catch (e: any) {
      error = e.message || 'Error inesperado';
    } finally {
      loading = false;
    }
  }

  async function deleteEvent(id: string) {
    if (!confirm('¿Seguro que quieres eliminar este evento?')) return;
    try {
      const res = await fetch('/api/admin/events', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken
        },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al eliminar');
      events = events.filter(e => e.id !== id);
    } catch (e: any) {
      alert('Error: ' + (e.message || 'No se pudo eliminar'));
    }
  }

  onMount(loadEvents);
</script>

<div class="mt-10">
  {#if loading}
    <div class="text-center text-gray-500">Cargando eventos...</div>
  {:else if error}
    <div class="text-center text-red-600">{error}</div>
  {:else if events.length === 0}
    <div class="text-center text-gray-500">No hay eventos para mostrar.</div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each events as event}
        <div class="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-bold text-[#003333]">{event.artist || 'Sin artista'}</h4>
              <p class="text-sm text-gray-600">{event.title}</p>
              <p class="text-xs text-gray-500">{event.date}</p>
            </div>
            {#if event.flyer_url}
              <img src={event.flyer_url} alt="Flyer" class="w-16 h-16 object-cover rounded" />
            {/if}
          </div>
          <button
            class="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 self-end"
            on:click={() => deleteEvent(event.id)}
          >
            Eliminar
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>
