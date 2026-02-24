<script lang="ts">
  import type { EventItem, TicketType } from '$lib/types/event';
  import VenueMap from '$lib/components/VenueMap.svelte';
  import { cart, cartTotal, cartSeatIds, removeSeat, clearCart } from '$lib/stores/cart';

  export let data: { event: EventItem | null; error?: { status: number; message: string } };
  const event = data.event;

  let ticketTypes: TicketType[] = (event?.ticket_types || []).slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  $: if (data.event) {
    ticketTypes = (data.event.ticket_types || []).slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }

  const soldSeats: Set<string> = new Set();

  function available(t: TicketType) {
    return Math.max(0, (t.capacity || 0) - (t.sold || 0));
  }

  $: maxPerZone = Object.fromEntries(
    ticketTypes.map(t => [t.zone_code, available(t)])
  ) as Record<string, number>;

  // Group cart items by zone for display
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

  function formatMoney(cents: number, currency = 'USD') {
    // Forzar EUR y mostrar el valor real
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
    alert(`Simulacion de pago — total: ${formatMoney($cartTotal, 'EUR')}`);
  }
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
  <div class="container mx-auto px-2 sm:px-4 md:px-6 py-4 lg:py-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-start">
      <!-- Left: seat map -->
      <div class="lg:col-span-2 space-y-4 md:space-y-5">
        <!-- Mapa de la sala -->
        <div class="bg-white rounded-xl shadow-[0_4px_24px_0_#003333] rounded-xl p-2 w-full max-w-2xl mx-auto">
          <h2 class="text-base font-semibold text-gray-800 mb-1">Selecciona tus asientos</h2>
          <p class="text-xs text-gray-400 mb-2">Haz clic en un asiento para seleccionarlo</p>
          <VenueMap {ticketTypes} {soldSeats} {maxPerZone} />

          <!-- Zone pricing legend -->
          <div class="mt-2 flex flex-wrap gap-2">
            {#each ticketTypes as t}
              <div class="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg border border-gray-100">
                <span class="w-2 h-2 rounded" style="background:{t.color || '#cbd5e1'}"></span>
                <span class="text-xs font-medium text-gray-700">{t.name}</span>
                <span class="text-xs text-gray-500">{formatMoney(t.price_cents, 'EUR')}</span>
                <span class="text-[10px] text-gray-400">({available(t)} disp.)</span>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Right column: event info + checkout summary -->
      <aside class="space-y-3 w-full">
        <!-- Event card -->
        {#if event && event.flyer_url}
          <div class="bg-white rounded-xl shadow-[0_4px_24px_0_#003333] overflow-hidden w-full max-w-sm mx-auto">
            <img src={event.flyer_url} alt={event?.title} class="w-full object-cover max-h-72" />

            <div class="p-3">
              {#if event}
                <h1 class="text-lg font-bold text-gray-900">{event.title}</h1>
                {#if event.artist}<p class="text-xs text-gray-500 mt-0.5">{event.artist}</p>{/if}
                {#if event.date}<p class="text-xs text-gray-400 mt-0.5">{new Date(event.date).toLocaleString()}</p>{/if}
                {#if event.venues && event.venues.length > 0}
                  <div class="mt-1.5 text-xs text-gray-600">
                    <strong>Sala:</strong> {event.venues[0].name} — {event.venues[0].city}
                  </div>
                {/if}
                {#if event.description}
                  <div class="mt-2 prose max-w-none text-xs text-gray-700 line-clamp-3">{@html event.description}</div>
                {/if}
              {:else}
                <div class="text-center py-8">
                  <h2 class="text-xl font-semibold">No se puede cargar el evento</h2>
                  <p class="text-sm text-gray-600 mt-2">{data.error?.message ?? 'Ha ocurrido un error al cargar el evento.'}</p>
                  <div class="mt-4">
                    <a href="/events" class="inline-block px-4 py-2 bg-[#003333] text-white rounded-lg">Volver a eventos</a>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        {/if}

        <!-- Checkout summary -->
        <div class="bg-white rounded-xl shadow-[0_4px_24px_0_#003333] overflow-hidden w-full max-w-sm mx-auto">
          <!-- Header -->
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
                      <span class="text-xs text-gray-400 ml-auto">{formatMoney(group.ticket.price_cents, 'EUR')} c/u</span>
                    </div>
                    <div class="space-y-1 ml-5">
                      {#each group.seats as seat}
                        <div class="flex justify-between items-center text-sm">
                          <span class="text-gray-600">Fila {seat.row}, Asiento {seat.number}</span>
                          <button
                            class="text-red-400 hover:text-red-600 text-lg leading-none px-1"
                            on:click={() => removeSeat(seat.seatId)}
                            aria-label="Quitar asiento Fila {seat.row} Asiento {seat.number}"
                          >
                            &times;
                          </button>
                        </div>
                      {/each}
                    </div>
                    <div class="flex justify-between text-sm mt-2 ml-5 text-gray-500 border-b border-gray-100 pb-2">
                      <span>Subtotal ({group.seats.length})</span>
                      <span>{formatMoney(group.ticket.price_cents * group.seats.length, 'EUR')}</span>
                    </div>
                  </div>
                {/each}
              </div>

              <div class="mt-4 flex justify-between font-bold text-base text-gray-900">
                <span>Total</span>
                <span>{formatMoney($cartTotal, 'EUR')}</span>
              </div>

              <!-- Clear cart button -->
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
                Pagar {formatMoney($cartTotal, 'EUR')}
              {:else}
                Pagar
              {/if}
            </button>
          </div>
        </div>
      </aside>
    </div>
  </div>
</div>