<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  let status: 'loading' | 'success' | 'error' = 'loading';
  let orderData: any = null;
  let errorMsg = '';

  onMount(async () => {
    const sessionId = $page.url.searchParams.get('session_id');
    if (!sessionId) {
      status = 'error';
      errorMsg = 'No se encontró la sesión de pago';
      return;
    }

    try {
      const res = await fetch(`/api/checkout/status?session_id=${sessionId}`);
      const data = await res.json();
      if (res.ok && data.status === 'complete') {
        orderData = data;
        status = 'success';
      } else {
        status = 'error';
        errorMsg = data.error || 'No se pudo verificar el pago';
      }
    } catch {
      status = 'error';
      errorMsg = 'Error de conexión';
    }
  });
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
  {#if status === 'loading'}
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-[#003333] border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="mt-4 text-gray-600">Verificando tu pago...</p>
    </div>

  {:else if status === 'success'}
    <div class="bg-white rounded-2xl shadow-[0_4px_24px_0_rgba(0,51,51,0.15)] max-w-lg w-full overflow-hidden">
      <!-- Header -->
      <div class="bg-[#003333] text-white text-center py-8 px-6">
        <div class="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold">¡Compra exitosa!</h1>
        <p class="text-emerald-200 mt-2">Tus entradas están en camino</p>
      </div>

      <!-- Info -->
      <div class="p-6 space-y-4">
        {#if orderData}
          <div class="bg-gray-50 rounded-xl p-4">
            <h2 class="font-semibold text-gray-900 text-lg">{orderData.event_title || 'Evento'}</h2>
            {#if orderData.event_date}
              <p class="text-sm text-gray-500 mt-1">📅 {new Date(orderData.event_date).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}</p>
            {/if}
            {#if orderData.venue}
              <p class="text-sm text-gray-500 mt-1">📍 {orderData.venue}</p>
            {/if}
          </div>

          {#if orderData.seats?.length}
            <div class="space-y-2">
              <h3 class="text-sm font-semibold text-gray-700">Tus asientos:</h3>
              {#each orderData.seats as seat}
                <div class="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  <span class="w-2 h-2 rounded bg-[#003333]"></span>
                  <span>{seat.zone} — Fila {seat.row}, Asiento {seat.number}</span>
                </div>
              {/each}
            </div>
          {/if}

          {#if orderData.total}
            <div class="flex justify-between items-center pt-2 border-t border-gray-100">
              <span class="font-semibold text-gray-700">Total pagado</span>
              <span class="text-lg font-bold text-[#003333]">{orderData.total}</span>
            </div>
          {/if}
        {/if}

        <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <p class="text-sm text-emerald-800">
            📧 Hemos enviado tus entradas con código QR al email proporcionado. 
            Revisa tu bandeja de entrada (y spam).
          </p>
        </div>

        <div class="flex gap-3 pt-2">
          <a
            href="/events"
            class="flex-1 text-center py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
          >
            Ver más eventos
          </a>
          <a
            href="/"
            class="flex-1 text-center py-3 bg-[#003333] hover:bg-[#002626] text-white rounded-xl font-medium transition-colors"
          >
            Inicio
          </a>
        </div>
      </div>
    </div>

  {:else}
    <div class="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 class="text-xl font-bold text-gray-900">Error en el pago</h1>
      <p class="text-gray-500 mt-2">{errorMsg}</p>
      <a href="/events" class="mt-6 inline-block px-6 py-3 bg-[#003333] text-white rounded-xl font-medium hover:bg-[#002626] transition-colors">
        Volver a eventos
      </a>
    </div>
  {/if}
</div>
