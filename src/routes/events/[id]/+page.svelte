<script lang="ts">
  import { onMount } from 'svelte';
  import type { EventItem, TicketType } from '$lib/types/event';
  import SeatMap from '$lib/components/SeatMap.svelte';
  export let data: { event: EventItem | null; error?: { status: number; message: string } };
  const event = data.event;

  // Normalize ticket types (guard when event is missing)
  let ticketTypes: TicketType[] = (event?.ticket_types || []).slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  // reactively update ticketTypes if event changes (helps during HMR/dev)
  $: if (data.event) {
    ticketTypes = (data.event.ticket_types || []).slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    // reset quantities map when ticket types change
    quantities = {};
    ticketTypes.forEach(t => (quantities[t.id] = 0));
  }

  // map of ticket id -> qty
  let quantities: Record<string, number> = {};
  ticketTypes.forEach(t => (quantities[t.id] = 0));

  // Selected zone (by zone_code)
  let activeZone: string | null = null;

  function available(t: TicketType) {
    return Math.max(0, (t.capacity || 0) - (t.sold || 0));
  }

  function inc(t: TicketType) {
    if (quantities[t.id] < available(t)) quantities[t.id] += 1;
  }

  function dec(t: TicketType) {
    if (quantities[t.id] > 0) quantities[t.id] -= 1;
  }

  function subtotalFor(t: TicketType) {
    return (t.price_cents || 0) * (quantities[t.id] || 0);
  }

  $: totalCents = ticketTypes.reduce((sum, t) => sum + subtotalFor(t), 0);

  function formatMoney(cents: number, currency = 'USD') {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(cents / 100);
  }

  function onZoneClick(zone_code: string | undefined) {
    if (!zone_code) return;
    activeZone = activeZone === zone_code ? null : zone_code;
    // focus corresponding ticket type (increment 1 for convenience)
    const t = ticketTypes.find(x => x.zone_code === zone_code);
    if (t) {
      inc(t);
    }
  }

  function pay() {
    const order = ticketTypes.filter(t => quantities[t.id] > 0).map(t => ({ id: t.id, name: t.name, qty: quantities[t.id], unit_cents: t.price_cents }));
    if (!order.length) {
      alert('Selecciona al menos 1 entrada');
      return;
    }
    // TODO: integrar con checkout / pago
    console.log('Order:', order, 'totalCents:', totalCents);
    alert(`Simulación de pago — total: ${formatMoney(totalCents, ticketTypes[0]?.currency || 'USD')}`);
  }

  // zone layout is optional; default to empty (map will show "no disponible")
  let zoneBlocks: any[] = [];

  // populate zoneBlocks from payload layout if available
  $: zoneBlocks = Array.isArray(event?.layout)
    ? event?.layout
    : event?.layout?.zones ?? [];
</script>

<div class="container mx-auto p-4">
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Left: flyer + info -->
    <div class="lg:col-span-2">
      {#if event && event.flyer_url}
        <div class="bg-white rounded shadow overflow-hidden">
          <img src={event.flyer_url} alt={event?.title} class="w-full object-cover max-h-96" />

          <div class="p-4">
            {#if event}
              <h1 class="text-2xl font-semibold">{event.title}</h1>
              {#if event.artist}<p class="text-sm text-gray-600">{event.artist}</p>{/if}
              {#if event.date}<p class="text-sm text-gray-500 mt-1">{new Date(event.date).toLocaleString()}</p>{/if}
              {#if event.venues && event.venues.length > 0}
                <div class="mt-3 text-sm">
                  <strong>Sala:</strong> {event.venues[0].name}<br />
                  {event.venues[0].city} — {event.venues[0].address}
                </div>
              {/if}
              {#if event.description}
                <div class="mt-4 prose max-w-none text-sm text-gray-800">{@html event.description}</div>
              {/if}
            {:else}
              <div class="text-center py-8">
                <h2 class="text-xl font-semibold">No se puede cargar el evento</h2>
                <p class="text-sm text-gray-600 mt-2">{data.error?.message ?? 'Ha ocurrido un error al cargar el evento.'}</p>
                <div class="mt-4">
                  <a href="/events" class="inline-block px-4 py-2 bg-[#003333] text-white rounded">Volver a eventos</a>
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Zone map (mobile under the flyer) -->
      {#if event?.layout}
        <SeatMap layout={
          Array.isArray(event.layout)
            ? { capacity: 0, zones: event.layout }
            : {
                capacity: event.layout?.capacity ?? 0,
                zones: event.layout?.zones ?? []
              }
        } />
      {/if}
      <div class="mt-4 lg:hidden">
        <h2 class="text-lg font-medium mb-2">Mapa de zonas</h2>
        {#if zoneBlocks.length}
          <div class="bg-white p-3 rounded shadow">
            <svg viewBox="0 0 1000 600" class="w-full h-64">
              {#each zoneBlocks as block}
                <rect
                  x={block.x}
                  y={block.y}
                  width={block.width}
                  height={block.height}
                  fill={block.color || '#e5e7eb'}
                  stroke={activeZone === block.zone_code ? '#111827' : '#9ca3af'}
                  stroke-width={activeZone === block.zone_code ? 3 : 1}
                  on:click={() => onZoneClick(block.zone_code)}
                  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && onZoneClick(block.zone_code)}
                  tabindex="0"
                  role="button"
                  aria-label={block.label ? `Zona ${block.label}` : 'Zona'}
                  class="cursor-pointer"
                />
              {/each}
            </svg>
          </div>
        {:else}
          <div class="bg-gray-50 p-4 rounded text-sm">Mapa no disponible</div>
        {/if}
      </div>

      <!-- Zone list -->
          <div class="mt-6 bg-white rounded shadow p-4">
        <h3 class="text-lg font-medium mb-3">Zonas y entradas</h3>
        <div class="space-y-3">
          {#each ticketTypes as t}
            <div class="flex items-center justify-between border rounded p-3">
              <div>
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded" style="background:{t.color || '#cbd5e1'}"></span>
                  <div class="font-medium">{t.name}</div>
                </div>
                <div class="text-sm text-gray-500">Disponibles: {available(t)}</div>
              </div>
              <div class="flex items-center gap-4">
                <div class="text-sm text-gray-700">{formatMoney(t.price_cents, t.currency)}</div>
                <div class="flex items-center border rounded overflow-hidden">
                  <button class="px-3 py-1 text-lg" on:click={() => dec(t)}>-</button>
                  <div class="px-4">{quantities[t.id]}</div>
                  <button class="px-3 py-1 text-lg" on:click={() => inc(t)}>+</button>
                </div>
                <div class="text-sm w-28 text-right">{formatMoney(subtotalFor(t), t.currency)}</div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Right column: large SVG map and checkout summary -->
    <aside class="space-y-4">
      <div class="hidden lg:block bg-white rounded shadow p-3">
        <h2 class="text-lg font-medium mb-2">Mapa de zonas</h2>
        {#if zoneBlocks.length}
          <div class="bg-white p-2 rounded">
            <svg viewBox="0 0 1000 600" class="w-full h-72">
              {#each zoneBlocks as block}
                <rect
                  x={block.x}
                  y={block.y}
                  width={block.width}
                  height={block.height}
                  fill={block.color || '#e5e7eb'}
                  stroke={activeZone === block.zone_code ? '#111827' : '#9ca3af'}
                  stroke-width={activeZone === block.zone_code ? 3 : 1}
                  on:click={() => onZoneClick(block.zone_code)}
                  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && onZoneClick(block.zone_code)}
                  tabindex="0"
                  role="button"
                  aria-label={block.label ? `Zona ${block.label}` : 'Zona'}
                  class="cursor-pointer transition"
                />
                {#if block.label}
                  <text x={block.x + 6} y={block.y + 18} class="text-xs" fill="#111">{block.label}</text>
                {/if}
              {/each}
            </svg>
          </div>
        {:else}
          <div class="bg-gray-50 p-4 rounded text-sm">Mapa no disponible</div>
        {/if}
      </div>

      <div class="bg-white rounded shadow p-4">
        <h3 class="text-lg font-medium">Resumen</h3>
        <div class="mt-3 text-sm space-y-2">
          {#each ticketTypes.filter(t => quantities[t.id] > 0) as t}
            <div class="flex justify-between">
              <div>{t.name} x {quantities[t.id]}</div>
              <div>{formatMoney(subtotalFor(t), t.currency)}</div>
            </div>
          {/each}
          <div class="border-t pt-2 flex justify-between font-medium">
            <div>Total</div>
            <div>{formatMoney(totalCents, ticketTypes[0]?.currency || 'USD')}</div>
          </div>
          <button class="mt-3 w-full bg-[#003333] hover:bg-[#002626] text-white py-2 rounded" on:click={pay}>Pagar</button>
        </div>
      </div>
    </aside>
  </div>
</div>
