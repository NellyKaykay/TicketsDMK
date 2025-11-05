<script>
  import '../../app.css';
  import { goto } from '$app/navigation';
  
  let firstName = '';
  let lastName = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let acceptTerms = false;
  let loading = false;
  let error = '';
  
  // Validación de contraseña
  $: passwordsMatch = password === confirmPassword;
  $: passwordValid = password.length >= 8;
  
  // Registro tradicional
  async function handleRegister() {
    // Validaciones
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      error = 'Por favor, completa todos los campos';
      return;
    }
    
    if (!passwordValid) {
      error = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }
    
    if (!passwordsMatch) {
      error = 'Las contraseñas no coinciden';
      return;
    }
    
    if (!acceptTerms) {
      error = 'Debes aceptar los términos y condiciones';
      return;
    }
    
    loading = true;
    error = '';
    
    try {
      // Simulación de API call - aquí integrarías con tu backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Registro tradicional:', { firstName, lastName, email, password });
      
      // Simulación de registro exitoso
      const newUser = {
        email,
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        loginMethod: 'traditional'
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Redirigir al inicio
      goto('/');
      
    } catch (err) {
      error = 'Error al crear la cuenta. Inténtalo de nuevo.';
    } finally {
      loading = false;
    }
  }
  
  // Registro con Google
  async function handleGoogleRegister() {
    loading = true;
    error = '';
    
    try {
      console.log('Iniciando registro con Google...');
      
      // Simulación de Google register
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const googleUser = {
        email: 'nuevousuario@gmail.com',
        name: 'Nuevo Usuario Google',
        avatar: 'https://via.placeholder.com/100',
        loginMethod: 'google'
      };
      
      localStorage.setItem('user', JSON.stringify(googleUser));
      goto('/');
      
    } catch (err) {
      error = 'Error al registrarse con Google';
    } finally {
      loading = false;
    }
  }
  
  // Registro con Facebook
  async function handleFacebookRegister() {
    loading = true;
    error = '';
    
    try {
      console.log('Iniciando registro con Facebook...');
      
      // Simulación de Facebook register
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const facebookUser = {
        email: 'nuevousuario@facebook.com',
        name: 'Nuevo Usuario Facebook',
        avatar: 'https://via.placeholder.com/100',
        loginMethod: 'facebook'
      };
      
      localStorage.setItem('user', JSON.stringify(facebookUser));
      goto('/');
      
    } catch (err) {
      error = 'Error al registrarse con Facebook';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Registrarse - TicketsDMK</title>
  <meta name="description" content="Crea tu cuenta en TicketsDMK y accede a los mejores eventos musicales." />
</svelte:head>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
      Crear Cuenta
    </h2>
    <p class="mt-2 text-center text-sm text-gray-600">
      ¿Ya tienes cuenta?
      <a href="/login" class="font-medium text-green-800 hover:text-green-600">
        Inicia sesión aquí
      </a>
    </p>
  </div>

  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      
      <!-- Botones de registro social -->
      <div class="space-y-3">
        <button
          on:click={handleGoogleRegister}
          disabled={loading}
          class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Conectando...' : 'Registrarse con Google'}
        </button>

        <button
          on:click={handleFacebookRegister}
          disabled={loading}
          class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-[#1877F2] hover:bg-[#166FE5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          {loading ? 'Conectando...' : 'Registrarse con Facebook'}
        </button>
      </div>

      <!-- Separador -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">O regístrate con email</span>
          </div>
        </div>
      </div>

      <!-- Formulario tradicional -->
      <form class="mt-6 space-y-6" on:submit|preventDefault={handleRegister}>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <div class="mt-1">
              <input
                id="firstName"
                name="firstName"
                type="text"
                autocomplete="given-name"
                required
                bind:value={firstName}
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Nombre"
              />
            </div>
          </div>

          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700">
              Apellido
            </label>
            <div class="mt-1">
              <input
                id="lastName"
                name="lastName"
                type="text"
                autocomplete="family-name"
                required
                bind:value={lastName}
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Apellido"
              />
            </div>
          </div>
        </div>

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

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <div class="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              bind:value={password}
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Mínimo 8 caracteres"
            />
          </div>
          {#if password && !passwordValid}
            <p class="mt-1 text-sm text-red-600">La contraseña debe tener al menos 8 caracteres</p>
          {/if}
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
            Confirmar Contraseña
          </label>
          <div class="mt-1">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              bind:value={confirmPassword}
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Confirma tu contraseña"
            />
          </div>
          {#if confirmPassword && !passwordsMatch}
            <p class="mt-1 text-sm text-red-600">Las contraseñas no coinciden</p>
          {/if}
        </div>

        <div class="flex items-center">
          <input
            id="accept-terms"
            name="accept-terms"
            type="checkbox"
            bind:checked={acceptTerms}
            class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label for="accept-terms" class="ml-2 block text-sm text-gray-900">
            Acepto los
            <a href="/terms" class="text-green-800 hover:text-green-600 font-medium">términos y condiciones</a>
            y la
            <a href="/privacy" class="text-green-800 hover:text-green-600 font-medium">política de privacidad</a>
          </label>
        </div>

        {#if error}
          <div class="rounded-md bg-red-50 p-4">
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

        <div>
          <button
            type="submit"
            disabled={loading}
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-800 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </div>
      </form>

      <!-- Enlaces adicionales -->
      <div class="mt-6">
        <div class="text-center">
          <a href="/" class="text-sm text-gray-600 hover:text-gray-900">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  </div>
</div>