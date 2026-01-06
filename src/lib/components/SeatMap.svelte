<script lang="ts">
  export let layout: {
    capacity: number;
    zones: {
      code: string;
      name: string;
      color: string;
      rows: string[];
      seats_per_row: number;
      price_cents: number;
    }[];
  };

  let selected = new Set<string>();

  function toggle(seatId: string) {
    if (selected.has(seatId)) selected.delete(seatId);
    else selected.add(seatId);
    selected = new Set(selected);
  }

  const euro = (cents: number) => (cents / 100).toFixed(2) + ' €';
</script>

<div class="seatmap">
  <div class="stage">ESCENARIO</div>

  {#each layout.zones as zone}
    <section class="zone">
      <h3 style="color:{zone.color}">
        {zone.name} · {euro(zone.price_cents)}
      </h3>

      {#each zone.rows as row}
        <div class="row">
          <span class="row-label">{row}</span>

          {#each Array(zone.seats_per_row) as _, i}
            {@const seatId = `${zone.code}-${row}-${i + 1}`}
            <button
              class:selected={selected.has(seatId)}
              style="border-color:{zone.color}"
              on:click={() => toggle(seatId)}
            >
              {i + 1}
            </button>
          {/each}
        </div>
      {/each}
    </section>
  {/each}
</div>

<style>
  .seatmap {
    display: grid;
    gap: 2rem;
  }

  .stage {
    text-align: center;
    padding: 1rem;
    background: #111;
    color: white;
    font-weight: bold;
    border-radius: 8px;
  }

  .zone h3 {
    margin-bottom: 0.5rem;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
    flex-wrap: wrap;
  }

  .row-label {
    width: 24px;
    font-weight: bold;
  }

  button {
    width: 28px;
    height: 28px;
    border-radius: 4px;
    border: 2px solid #ccc;
    background: white;
    cursor: pointer;
    font-size: 11px;
  }

  button.selected {
    background: #2563eb;
    color: white;
  }
</style>
