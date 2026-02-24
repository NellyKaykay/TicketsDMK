<script lang="ts">
  import type { TicketType } from '$lib/types/event';
  import VenueMap from '$lib/components/VenueMap.svelte';
  import { cart, cartTotal, cartSeatIds, removeSeat, clearCart } from '$lib/stores/cart';

  export let data: { city: string | null; events: any[]; error?: { status: number; message: string } };

  let selectedEventIndex = 0;

  $: events = data.events ?? [];
  $: selectedEvent = events[selectedEventIndex] ?? null;
  $: ticketTypes = ((selectedEvent?.ticket_types ?? []) as TicketType[]).slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  const soldSeats: Set<string> = new Set();

  function available(t: TicketType) {
    return Math.max(0, (t.capacity || 0) - (t.sold || 0));
  }

  $: maxPerZone = Object.fromEntries(
    ticketTypes.map(t => [t.zone_code, available(t)])
  ) as Record<string, number>;

  $: selectedByZone = groupByZone($cart, ticketTypes);

  function groupByZone(items: typeof $cart, types: TicketType[]) {
    const map = new Map<string, { ticket: TicketType; seats: { seatId: string; row: string; number: number }[] }>();
    for (const item of items) {
      const zone_code = item.seatId.split('-')[0];
      const ticket = types.find(t => t.zone_code === zone_code);
      if (!ticket) continue;
      if (!map.has(zone_code)) {
        map.set(zone_code, { ticket, seats: [] });
      }
      map.get(zone_code)!.seats.push(item);
    }
    for (const group of map.values()) {
      group.seats.sort((a, b) => a.row.localeCompare(b.row) || a.number - b.number);
    }
    return map;
  }

  function formatMoney(cents: number) {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' }).format(cents / 100);
  }

  function pay() {
    if ($cart.length === 0) {
      alert('Selecciona al menos 1 asiento');
      return;
    }
    const order = [...selectedByZone].map(([, group]) => ({
      ticket_type_id: group.ticket.id,
      zone: group.ticket.name,
      seats: group.seats.map(s => s.seatId),
      qty: group.seats.length,
      unit_cents: group.ticket.price_cents,
      subtotal_cents: group.ticket.price_cents * group.seats.length
    }));
    console.log('Order:', order, 'totalCents:', $cartTotal);
    alert(`Simulacion de pago — total: ${formatMoney($cartTotal)}`);
  }

  function onEventChange() {
    clearCart();
  }
</script>

<svelte:head>
  <title>Sala {data.city ?? ''} | TicketsDMK</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
  <!-- Header -->
  <section class="text-white py-10" style="background-color: #003333;">
    <div class="container mx-auto px-4 text-center">
      <h1 class="text-3xl md:text-4xl font-bold mb-2">Sala {data.city}</h1>
      <p class="text-sm" style="color: #b3e0e0;">Selecciona un evento y elige tus asientos</p>
    </div>
  </section>

  <div class="container mx-auto px-2 sm:px-4 md:px-6 py-4 lg:py-6">
    {#if !data.city}
      <div class="text-center py-16">
        <h2 class="text-xl font-semibold text-gray-800">Ciudad no encontrada</h2>
        <a href="/events" class="mt-4 inline-block px-4 py-2 bg-[#003333] text-white rounded-lg">Volver a eventos</a>
      </div>
    {:else if events.length === 0}
      <div class="text-center py-16">
        <h2 class="text-xl font-semibold text-gray-800">No hay eventos en {data.city}</h2>
        <p class="text-sm text-gray-500 mt-2">Vuelve pronto para ver nuevos eventos.</p>
        <a href="/events" class="mt-4 inline-block px-4 py-2 bg-[#003333] text-white rounded-lg">Ver todos los eventos</a>
      </div>
    {:else}
      <!-- Event selector -->
      {#if events.length > 1}
        <div class="max-w-md mx-auto mb-6">
          <select
            class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:border-transparent"
            style="--tw-ring-color: #003333;"
            bind:value={selectedEventIndex}
            on:change={onEventChange}
          >
            {#each events as ev, i}
              <option value={i}>{ev.artist} — {ev.title} ({new Date(ev.date).toLocaleDateString('es-ES')})</option>
            {/each}
          </select>
        </div>
      {/if}

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-start">
        <!-- Left: seat map -->
        <div class="lg:col-span-2 space-y-4 md:space-y-5">
          <div class="bg-white rounded-xl shadow-[0_4px_24px_0_#003333] p-2 w-full max-w-2xl mx-auto">
            <h2 class="text-base font-semibold text-gray-800 mb-1">Selecciona tus asientos</h2>
            <p class="text-xs text-gray-400 mb-2">Haz clic en un asiento para seleccionarlo</p>
            <VenueMap {ticketTypes} {soldSeats} {maxPerZone} />

            <!-- Zone pricing legend -->
            <div class="mt-2 flex flex-wrap gap-2">
              {#each ticketTypes as t}
                <div class="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg border border-gray-100">
                  <span class="w-2 h-2 rounded" style="background:{t.color || '#cbd5e1'}"></span>
                  <span class="text-xs font-medium text-gray-700">{t.name}</span>
                  <span class="text-xs text-gray-500">{formatMoney(t.price_cents)}</span>
                  <span class="text-[10px] text-gray-400">({available(t)} disp.)</span>
                </div>
              {/each}
            </div>
          </div>
        </div>

        <!-- Right column: event info + checkout -->
        <aside class="space-y-3 w-full">
          <!-- Event card -->
          {#if selectedEvent}
            <div class="bg-white rounded-xl shadow-[0_4px_24px_0_#003333] overflow-hidden w-full max-w-sm mx-auto">
              {#if selectedEvent.image}
                <img src={selectedEvent.image} alt={selectedEvent.artist} class="w-full object-cover max-h-72" />
              {/if}
              <div class="p-3">
                <h3 class="text-lg font-bold text-gray-900">{selectedEvent.artist}</h3>
                <p class="text-xs text-gray-500 mt-0.5">{selectedEvent.title}</p>
                <p class="text-xs text-gray-400 mt-0.5">{new Date(selectedEvent.date).toLocaleString('es-ES')}</p>
                {#if selectedEvent.venue}
                  <div class="mt-1.5 text-xs text-gray-600">
                    <strong>Sala:</strong> {typeof selectedEvent.venue === 'object' ? selectedEvent.venue.name : selectedEvent.venue}
                  </div>
                {/if}
              </div>
            </div>
          {/if}

          <!-- Checkout summary -->
          <div class="bg-white rounded-xl shadow-[0_4px_24px_0_#003333] overflow-hidden w-full max-w-sm mx-auto">
            <div class="bg-[#003333] text-white px-4 py-3">
              <h3 class="text-base font-semibold">Resumen de compra</h3>
              <p class="text-xs text-emerald-200 mt-0.5">{$cart.length} {$cart.length === 1 ? 'entrada' : 'entradas'}</p>
            </div>

            <div class="p-4">
              {#if $cart.length === 0}
                <p class="text-sm text-gray-400 text-center py-4">Selecciona asientos en el mapa</p>
              {:else}
                <div class="space-y-4">
                  {#each [...selectedByZone] as [zone_code, group]}
                    <div>
                      <div class="flex items-center gap-2 mb-2">
                        <span class="w-2.5 h-2.5 rounded-sm" style="background:{group.ticket.color || '#cbd5e1'}"></span>
                        <span class="text-sm font-semibold text-gray-700">{group.ticket.name}</span>
                        <span class="text-xs text-gray-400 ml-auto">{formatMoney(group.ticket.price_cents)} c/u</span>
                      </div>
                      <div class="space-y-1 ml-5">
                        {#each group.seats as seat}
                          <div class="flex justify-between items-center text-sm">
                            <span class="text-gray-600">Fila {seat.row}, Asiento {seat.number}</span>
                            <button
                              class="text-red-400 hover:text-red-600 text-lg leading-none px-1"
                              on:click={() => removeSeat(seat.seatId)}
                              aria-label="Quitar asiento"
                            >
                              &times;
                            </button>
                          </div>
                        {/each}
                      </div>
                      <div class="flex justify-between text-sm mt-2 ml-5 text-gray-500 border-b border-gray-100 pb-2">
                        <span>Subtotal ({group.seats.length})</span>
                        <span>{formatMoney(group.ticket.price_cents * group.seats.length)}</span>
                      </div>
                    </div>
                  {/each}
                </div>

                <div class="mt-4 flex justify-between font-bold text-base text-gray-900">
                  <span>Total</span>
                  <span>{formatMoney($cartTotal)}</span>
                </div>

                <button
                  class="mt-3 w-full text-sm text-red-500 hover:text-red-700 hover:bg-red-50 py-2 rounded-lg transition-colors"
                  on:click={clearCart}
                >
                  Vaciar cesta
                </button>
              {/if}

              <button
                class="mt-4 w-full bg-[#003333] hover:bg-[#002626] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                on:click={pay}
                disabled={$cart.length === 0}
              >
                {#if $cart.length > 0}
                  Pagar {formatMoney($cartTotal)}
                {:else}
                  Pagar
                {/if}
              </button>
            </div>
          </div>
        </aside>
      </div>
    {/if}
  </div>
</div>
