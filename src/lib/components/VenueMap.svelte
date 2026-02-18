<script lang="ts">
  import { cartSeatIds, toggleSeat, type CartSeat } from '$lib/stores/cart';

  export let ticketTypes: { zone_code?: string; color?: string; name?: string; price_cents?: number }[] = [];
  export let soldSeats: Set<string> = new Set();
  export let maxPerZone: Record<string, number> = {};

  // Map zone_code to zone label for CartSeat
  const ZONE_LABELS: Record<string, 'VIP' | 'PREFERENTE' | 'GENERAL'> = {
    A: 'VIP',
    B: 'PREFERENTE',
    C: 'GENERAL',
  };

  $: selectedSeats = $cartSeatIds;

  interface SeatData {
    id: string;
    zone_code: string;
    row: string;
    seat_number: number;
    x: number;
    y: number;
  }

  const rowLabels = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'];

  function getZoneColor(code: string) {
    const t = ticketTypes.find(x => x.zone_code === code);
    return t?.color || '#cbd5e1';
  }

  function getZonePrice(code: string): string {
    const t = ticketTypes.find(x => x.zone_code === code);
    if (!t || !t.price_cents) return '';
    return (t.price_cents / 100).toFixed(2) + ' EUR';
  }

  function seatTooltip(seat: SeatData): string {
    if (soldSeats.has(seat.id)) return `Fila ${seat.row}, Asiento ${seat.seat_number} — Vendido`;
    const price = getZonePrice(seat.zone_code);
    const zone = ZONE_LABELS[seat.zone_code] || seat.zone_code;
    return `Fila ${seat.row}, Asiento ${seat.seat_number} — ${zone}${price ? ' — ' + price : ''}`;
  }

  function generateZoneSeats(
    zone_code: string,
    startRowIndex: number,
    rowCount: number,
    seatsPerRow: number,
    cx: number,
    startY: number,
    ySpacing: number,
    xSpacing: number
  ): SeatData[][] {
    const rows: SeatData[][] = [];
    for (let r = 0; r < rowCount; r++) {
      const rowLabel = rowLabels[startRowIndex + r];
      const cy = startY + r * ySpacing;
      const startX = cx - ((seatsPerRow - 1) * xSpacing) / 2;
      const seats: SeatData[] = [];
      for (let s = 0; s < seatsPerRow; s++) {
        seats.push({
          id: `${zone_code}-${rowLabel}-${s + 1}`,
          zone_code,
          row: rowLabel,
          seat_number: s + 1,
          x: startX + s * xSpacing,
          y: cy,
        });
      }
      rows.push(seats);
    }
    return rows;
  }

  const vipRows = generateZoneSeats('A', 0, 4, 14, 400, 195, 25, 22);
  const prefRows = generateZoneSeats('B', 4, 5, 20, 400, 315, 25, 22);
  const genRows = generateZoneSeats('C', 9, 6, 24, 400, 465, 25, 22);

  function handleSeatClick(seat: SeatData) {
    if (soldSeats.has(seat.id)) return;

    // If already selected, toggle will remove — always allow
    if (!selectedSeats.has(seat.id)) {
      // Check zone capacity
      const zoneMax = maxPerZone[seat.zone_code] ?? Infinity;
      let zoneCount = 0;
      for (const sid of selectedSeats) {
        if (sid.startsWith(seat.zone_code + '-')) zoneCount++;
      }
      if (zoneCount >= zoneMax) return;
    }

    const tt = ticketTypes.find(x => x.zone_code === seat.zone_code);
    const cartSeat: CartSeat = {
      seatId: seat.id,
      row: seat.row,
      number: seat.seat_number,
      zone: ZONE_LABELS[seat.zone_code] || 'GENERAL',
      priceCents: tt?.price_cents || 0,
    };
    toggleSeat(cartSeat);
  }

  function seatFill(seat: SeatData): string {
    if (soldSeats.has(seat.id)) return '#d1d5db';
    return getZoneColor(seat.zone_code);
  }

  function seatOpacity(seat: SeatData): number {
    if (soldSeats.has(seat.id)) return 0.3;
    if (selectedSeats.has(seat.id)) return 1.0;
    return 0.45;
  }

  function seatStroke(seat: SeatData): string {
    if (soldSeats.has(seat.id)) return 'transparent';
    if (selectedSeats.has(seat.id)) return '#111827';
    return getZoneColor(seat.zone_code);
  }

  function seatStrokeWidth(seat: SeatData): number {
    return selectedSeats.has(seat.id) ? 2 : 0.5;
  }

  function seatCursor(seat: SeatData): string {
    return soldSeats.has(seat.id) ? 'not-allowed' : 'pointer';
  }

  function hasSelectedInZone(zone: string): boolean {
    for (const sid of selectedSeats) {
      if (sid.startsWith(zone + '-')) return true;
    }
    return false;
  }
</script>

<div class="venue-map-wrapper">
  <svg viewBox="0 0 800 660" class="venue-svg" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="stageGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1a1a2e" />
        <stop offset="100%" stop-color="#16213e" />
      </linearGradient>
      <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f8fafc" />
        <stop offset="100%" stop-color="#e2e8f0" />
      </linearGradient>
      <filter id="stageShadow" x="-2%" y="-10%" width="104%" height="130%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.25" />
      </filter>
      <filter id="selectedGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#003333" flood-opacity="0.5" />
      </filter>
    </defs>

    <!-- Background -->
    <rect x="0" y="0" width="800" height="660" rx="16" fill="url(#floorGrad)" />

    <!-- Walls -->
    <rect x="30" y="60" width="740" height="580" rx="12" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="6 3" />

    <!-- Stage -->
    <path
      d="M 180,80 Q 400,30 620,80 L 620,130 Q 400,145 180,130 Z"
      fill="url(#stageGrad)"
      filter="url(#stageShadow)"
    />
    <text x="400" y="108" text-anchor="middle" fill="white" font-size="18" font-weight="700" letter-spacing="4">
      ESCENARIO
    </text>

    <!-- Stage lights -->
    {#each [220, 310, 400, 490, 580] as lx}
      <circle cx={lx} cy="72" r="3" fill="#fbbf24" opacity="0.8" />
    {/each}

    <!-- VIP Zone background -->
    <rect
      x="85" y="175" width="630" height="115" rx="8"
      fill={getZoneColor('A')}
      opacity={hasSelectedInZone('A') ? 0.15 : 0.08}
      stroke="none"
    />

    <!-- VIP seats -->
    {#each vipRows as row}
      <text x="78" y={row[0].y + 4} text-anchor="end" fill="#64748b" font-size="10" font-weight="600">{row[0].row}</text>
      <text x="722" y={row[0].y + 4} text-anchor="start" fill="#64748b" font-size="10" font-weight="600">{row[0].row}</text>
      {#each row as seat}
        <rect
          x={seat.x - 8} y={seat.y - 8} width="16" height="16" rx="3"
          fill={seatFill(seat)}
          opacity={seatOpacity(seat)}
          stroke={seatStroke(seat)}
          stroke-width={seatStrokeWidth(seat)}
          style="cursor: {seatCursor(seat)}"
          class="seat"
          class:seat-selected={selectedSeats.has(seat.id)}
          class:seat-sold={soldSeats.has(seat.id)}
          filter={selectedSeats.has(seat.id) ? 'url(#selectedGlow)' : 'none'}
          on:click={() => handleSeatClick(seat)}
          on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSeatClick(seat)}
          tabindex={soldSeats.has(seat.id) ? -1 : 0}
          role="button"
          aria-label="Fila {seat.row}, Asiento {seat.seat_number}"
          aria-disabled={soldSeats.has(seat.id)}
        >
          <title>{seatTooltip(seat)}</title>
        </rect>
      {/each}
    {/each}

    <!-- VIP label -->
    <text x="400" y="168" text-anchor="middle" fill="#334155" font-size="11" font-weight="700" letter-spacing="2">VIP {getZonePrice('A') ? '— ' + getZonePrice('A') : ''}</text>

    <!-- Aisle -->
    <line x1="100" y1="298" x2="700" y2="298" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="4 4" />

    <!-- Preferente Zone background -->
    <rect
      x="65" y="300" width="670" height="130" rx="8"
      fill={getZoneColor('B')}
      opacity={hasSelectedInZone('B') ? 0.15 : 0.08}
      stroke="none"
    />

    <!-- Preferente seats -->
    {#each prefRows as row}
      <text x="58" y={row[0].y + 4} text-anchor="end" fill="#64748b" font-size="10" font-weight="600">{row[0].row}</text>
      <text x="742" y={row[0].y + 4} text-anchor="start" fill="#64748b" font-size="10" font-weight="600">{row[0].row}</text>
      {#each row as seat}
        <rect
          x={seat.x - 8} y={seat.y - 8} width="16" height="16" rx="3"
          fill={seatFill(seat)}
          opacity={seatOpacity(seat)}
          stroke={seatStroke(seat)}
          stroke-width={seatStrokeWidth(seat)}
          style="cursor: {seatCursor(seat)}"
          class="seat"
          class:seat-selected={selectedSeats.has(seat.id)}
          class:seat-sold={soldSeats.has(seat.id)}
          filter={selectedSeats.has(seat.id) ? 'url(#selectedGlow)' : 'none'}
          on:click={() => handleSeatClick(seat)}
          on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSeatClick(seat)}
          tabindex={soldSeats.has(seat.id) ? -1 : 0}
          role="button"
          aria-label="Fila {seat.row}, Asiento {seat.seat_number}"
          aria-disabled={soldSeats.has(seat.id)}
        >
          <title>{seatTooltip(seat)}</title>
        </rect>
      {/each}
    {/each}

    <!-- Preferente label -->
    <text x="400" y="308" text-anchor="middle" fill="#334155" font-size="11" font-weight="700" letter-spacing="2">PREFERENTE {getZonePrice('B') ? '— ' + getZonePrice('B') : ''}</text>

    <!-- Aisle -->
    <line x1="80" y1="445" x2="720" y2="445" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="4 4" />

    <!-- General Zone background -->
    <rect
      x="50" y="448" width="700" height="160" rx="8"
      fill={getZoneColor('C')}
      opacity={hasSelectedInZone('C') ? 0.15 : 0.08}
      stroke="none"
    />

    <!-- General seats -->
    {#each genRows as row}
      <text x="40" y={row[0].y + 4} text-anchor="end" fill="#64748b" font-size="10" font-weight="600">{row[0].row}</text>
      <text x="760" y={row[0].y + 4} text-anchor="start" fill="#64748b" font-size="10" font-weight="600">{row[0].row}</text>
      {#each row as seat}
        <rect
          x={seat.x - 8} y={seat.y - 8} width="16" height="16" rx="3"
          fill={seatFill(seat)}
          opacity={seatOpacity(seat)}
          stroke={seatStroke(seat)}
          stroke-width={seatStrokeWidth(seat)}
          style="cursor: {seatCursor(seat)}"
          class="seat"
          class:seat-selected={selectedSeats.has(seat.id)}
          class:seat-sold={soldSeats.has(seat.id)}
          filter={selectedSeats.has(seat.id) ? 'url(#selectedGlow)' : 'none'}
          on:click={() => handleSeatClick(seat)}
          on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSeatClick(seat)}
          tabindex={soldSeats.has(seat.id) ? -1 : 0}
          role="button"
          aria-label="Fila {seat.row}, Asiento {seat.seat_number}"
          aria-disabled={soldSeats.has(seat.id)}
        >
          <title>{seatTooltip(seat)}</title>
        </rect>
      {/each}
    {/each}

    <!-- General label -->
    <text x="400" y="458" text-anchor="middle" fill="#334155" font-size="11" font-weight="700" letter-spacing="2">GENERAL {getZonePrice('C') ? '— ' + getZonePrice('C') : ''}</text>

    <!-- Exit indicators -->
    <text x="45" y="648" text-anchor="start" fill="#94a3b8" font-size="9" font-weight="600" letter-spacing="1">SALIDA</text>
    <text x="755" y="648" text-anchor="end" fill="#94a3b8" font-size="9" font-weight="600" letter-spacing="1">SALIDA</text>

    <!-- Legend -->
    <g transform="translate(80, 630)">
      <rect x="0" y="0" width="10" height="10" rx="2" fill={getZoneColor('A')} opacity="0.5" />
      <text x="14" y="9" fill="#475569" font-size="9">VIP</text>
      <rect x="80" y="0" width="10" height="10" rx="2" fill={getZoneColor('B')} opacity="0.5" />
      <text x="94" y="9" fill="#475569" font-size="9">Preferente</text>
      <rect x="200" y="0" width="10" height="10" rx="2" fill={getZoneColor('C')} opacity="0.5" />
      <text x="214" y="9" fill="#475569" font-size="9">General</text>
      <rect x="320" y="0" width="10" height="10" rx="2" fill="#2563eb" opacity="1" stroke="#111827" stroke-width="1" />
      <text x="334" y="9" fill="#475569" font-size="9">Seleccionado</text>
      <rect x="440" y="0" width="10" height="10" rx="2" fill="#d1d5db" opacity="0.4" />
      <text x="454" y="9" fill="#475569" font-size="9">Vendido</text>
    </g>
  </svg>
</div>
