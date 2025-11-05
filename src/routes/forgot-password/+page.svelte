<script>
  import '../../app.css';
  import { goto } from '$app/navigation';
  
  let email = '';
  let loading = false;
  let success = false;
  let error = '';
  
  async function handleResetPassword() {
    if (!email) {
      error = 'Por favor, ingresa tu email';
      return;
    }
    
    loading = true;
    error = '';
    
    try {
      // Simulación de API call para reset de contraseña
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Password reset requested for:', email);
      success = true;
      
    } catch (err) {
      error = 'Error al enviar el email. Inténtalo de nuevo.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Recuperar Contraseña - TicketsDMK</title>
  <meta name="description" content="Recupera tu contraseña de TicketsDMK." />
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
      Recuperar Contraseña
    </h2>
    <p class="mt-2 text-center text-sm text-gray-600">
      Te enviaremos un enlace para restablecer tu contraseña
    </p>
  </div>

  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      
      {#if success}
        <!-- Mensaje de éxito -->
        <div class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">
                Email enviado
              </h3>
              <div class="mt-2 text-sm text-green-700">
                <p>Hemos enviado un enlace de recuperación a <strong>{email}</strong>. Revisa tu bandeja de entrada y sigue las instrucciones.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex space-x-3">
          <a href="/login" class="flex-1 bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium text-center hover:bg-green-700 transition-colors">
            Volver al Login
          </a>
          <button on:click={() => { success = false; email = ''; }} class="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors">
            Enviar otro email
          </button>
        </div>
      {:else}
        <!-- Formulario -->
        <form on:submit|preventDefault={handleResetPassword}>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div class="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                bind:value={email}
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          {#if error}
            <div class="mt-4 rounded-md bg-red-50 p-4">
              <div class="flex">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          {/if}

          <div class="mt-6">
            <button
              type="submit"
              disabled={loading}
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-800 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
            </button>
          </div>
        </form>
      {/if}

      <!-- Enlaces de navegación -->
      <div class="mt-6 flex justify-center space-x-4 text-sm">
        <a href="/login" class="text-green-800 hover:text-green-600 font-medium">
          ← Volver al Login
        </a>
        <span class="text-gray-300">|</span>
        <a href="/register" class="text-green-800 hover:text-green-600 font-medium">
          Crear cuenta
        </a>
      </div>
    </div>
  </div>
</div>