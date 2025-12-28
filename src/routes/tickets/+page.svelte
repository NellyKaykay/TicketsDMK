<script>
  // import { user } from '$lib/stores/user';
  // const tickets = [];
</script>

<section class="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
  <div class="w-full max-w-2xl">
    <h1 class="text-2xl font-semibold mb-8 text-center text-gray-900 tracking-tight">Mis Entradas</h1>
    <div class="space-y-6">
      <!-- Ticket 1 -->
      <div class="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center gap-6">
        <div class="flex-1">
          <div class="text-base font-bold text-gray-900 mb-1">Concierto de Ejemplo</div>
          <div class="text-gray-600 text-sm mb-1">Madrid · 20 Ene 2026 · 20:00</div>
          <div class="text-gray-800 text-sm mb-2">Butaca: Fila 5, Asiento 12</div>
          <span class="inline-block bg-[#e6f7f7] text-[#003333] text-xs px-2 py-1 rounded-full">Disponible</span>
        </div>
        <div class="flex flex-col items-center">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Ticket-12345" alt="QR Ticket 1" class="w-20 h-20 md:w-24 md:h-24 object-contain" />
          <span class="text-xs text-gray-400 mt-2">#12345</span>
        </div>
      </div>
      <!-- Ticket 2 -->
      <div class="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center gap-6 opacity-60">
        <div class="flex-1">
          <div class="text-base font-bold text-gray-900 mb-1">Festival Primavera</div>
          <div class="text-gray-600 text-sm mb-1">Barcelona · 10 Feb 2026 · 18:00</div>
          <div class="text-gray-800 text-sm mb-2">Butaca: Fila 2, Asiento 8</div>
          <span class="inline-block bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">Usada</span>
        </div>
        <div class="flex flex-col items-center">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Ticket-54321" alt="QR Ticket 2" class="w-20 h-20 md:w-24 md:h-24 object-contain" />
          <span class="text-xs text-gray-400 mt-2">#54321</span>
        </div>
      </div>
    </div>
  </div>
</section>
