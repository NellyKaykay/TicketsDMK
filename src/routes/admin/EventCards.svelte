<script lang="ts">
  import { onMount } from 'svelte';
  import ConcertCard from '$lib/components/molecules/ConcertCard.svelte';
  let events: any[] = [];
  let loading = true;
  let error = '';

  onMount(async () => {
    loading = true;
    error = '';
    try {
      const token = 'TicketsDMK_admin_2026_secure_93kLx';
      const res = await fetch('/api/admin/events', {
        method: 'GET',
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cargar eventos');
      events = data.events;
    } catch (e: any) {
      error = e.message || 'Error inesperado';
    } finally {
      loading = false;
    }
  });
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
      {#each events as concert}
        <ConcertCard {concert} />
      {/each}
    </div>
  {/if}
</div>
