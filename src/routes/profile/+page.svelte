<script>
  import { user } from '$lib/stores/user';
  let activeSection = '';
  let showProfile = false;
  let showEntradas = false;
  $: usuario = $user;
</script>

<section class="min-h-screen bg-gray-50">
  <div class="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 py-12 px-4">
    <!-- Sidebar -->
    <aside class="w-full md:w-72 p-0 flex flex-col gap-6 md:sticky md:top-12 h-fit">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-[#003333] flex items-center justify-center text-lg font-bold text-white">
          {usuario?.user_metadata?.name ? usuario.user_metadata.name.charAt(0).toUpperCase() : (usuario?.email ? usuario.email.charAt(0).toUpperCase() : 'C')}
        </div>
        <div>
          <div class="font-semibold text-lg text-gray-900">
            Hola {usuario?.user_metadata?.name || usuario?.email || 'Cliente'}
          </div>
        </div>
      </div>
      <!-- Separador verde largo debajo del bloque de usuario -->
      <div class="w-full h-0.5 bg-[#003333] rounded my-4"></div>
      <nav class="flex flex-col gap-2 mt-8">
        <button
          type="button"
          on:click={() => { showProfile = !showProfile; activeSection = showProfile ? 'perfil' : ''; }}
          aria-expanded={showProfile}
          class={
            "flex items-center gap-3 px-4 py-3 rounded-md w-full text-left transition-transform duration-150 ease-in-out " +
            (showProfile
              ? 'bg-[#003333] text-white font-semibold shadow-sm'
              : 'text-gray-800 hover:bg-gray-50 hover:translate-x-1 hover:shadow-sm')
          }
        ><span class="text-lg">Mi Perfil</span></button>
        <div class="w-20 my-3 h-0.5 bg-[#003333] rounded mx-auto"></div>

        {#if showProfile}
          <div class="mt-4">
            <div class="py-1">
              <div class="text-sm text-gray-500">Nombre</div>
              <div class="text-2xl text-gray-900 font-semibold">{usuario?.user_metadata?.name || 'Sin nombre'}</div>
            </div>
            <div class="py-1 mt-3">
              <div class="text-sm text-gray-500">Email</div>
              <div class="text-lg text-gray-700">{usuario?.email || 'Sin email'}</div>
            </div>
          </div>
        {/if}

        <button
          type="button"
          on:click={() => { showEntradas = !showEntradas; showProfile = false; activeSection = showEntradas ? 'entradas' : ''; }}
          aria-expanded={showEntradas}
          class={
            "flex items-center gap-3 px-4 py-3 rounded-md w-full text-left transition-transform duration-150 ease-in-out " +
            (showEntradas
              ? 'bg-[#003333] text-white font-semibold shadow-sm'
              : 'text-gray-800 hover:bg-gray-50 hover:translate-x-1 hover:shadow-sm')
          }
        ><span class="text-lg">Mis Entradas</span></button>

        {#if showEntradas}
          <div class="mt-2 space-y-3">
            <div class="flex items-center gap-3 py-4 border-b border-gray-100">
              <div class="flex-1">
                <div class="text-lg font-semibold text-gray-900">Concierto Ejemplo</div>
                <div class="text-sm text-gray-500">20 Ene 2026 · Madrid</div>
              </div>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=Ticket-12345" alt="QR" class="w-16 h-16 md:w-20 md:h-20 object-contain" />
            </div>
            <div class="flex items-center gap-3 py-4 border-b border-gray-100">
              <div class="flex-1">
                <div class="text-lg font-semibold text-gray-900">Festival Primavera</div>
                <div class="text-sm text-gray-500">10 Feb 2026 · Barcelona</div>
              </div>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=Ticket-54321" alt="QR" class="w-16 h-16 md:w-20 md:h-20 object-contain" />
            </div>
          </div>
        {/if}
      </nav>

      
    </aside>
    <!-- Main content -->
    <main class="flex-1">
      {#if activeSection === 'entradas'}
        <!-- Entradas: aquí se pueden listar los tickets con QR -->
      {/if}
    </main>
  </div>
</section>
