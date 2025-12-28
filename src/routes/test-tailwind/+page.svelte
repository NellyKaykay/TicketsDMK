<script>
  
</script>

<svelte:head>
  <title>Test Tailwind CSS</title>
</svelte:head>

<!-- Test básico de colores -->
<div style="padding: 20px; background-color: red; color: white; text-align: center;">
  <h1 style="font-size: 24px; font-weight: bold;">Test SIN Tailwind (CSS inline)</h1>
  <p>Si ves esto rojo, el CSS básico funciona</p>
</div>

<!-- Test de Tailwind CSS -->
<div class="p-8 bg-blue-500 text-white text-center">
  <h1 class="text-3xl font-bold">Test CON Tailwind CSS</h1>
  <p class="mt-4 text-lg">Si ves este texto en blanco sobre fondo azul, Tailwind está funcionando.</p>
  
  <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="bg-red-500 p-6 rounded-lg">
      <h3 class="font-bold">Rojo</h3>
      <p class="text-sm">bg-red-500</p>
    </div>
    <div class="bg-[#003333] p-6 rounded-lg">
      <h3 class="font-bold">Verde</h3>
      <p class="text-sm">bg-#003333</p>
    </div>
    <div class="bg-yellow-500 p-6 rounded-lg">
      <h3 class="font-bold">Amarillo</h3>
      <p class="text-sm">bg-yellow-500</p>
    </div>
  </div>
  
  <div class="mt-8 space-x-4">
    <button class="bg-white text-blue-500 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
      Botón Blanco
    </button>
    <button class="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors">
      Botón Oscuro
    </button>
  </div>
  
  <!-- Test de responsive -->
  <div class="mt-8">
    <div class="block md:hidden bg-purple-500 p-4 rounded">
      <p class="font-bold">Solo visible en MÓVIL</p>
    </div>
    <div class="hidden md:block bg-orange-500 p-4 rounded">
      <p class="font-bold">Solo visible en ESCRITORIO</p>
    </div>
  </div>
</div>

<!-- Test de flexbox -->
<div class="p-8 bg-gray-100">
  <h2 class="text-2xl font-bold text-gray-800 mb-6">Test de Flexbox y Grid</h2>
  
  <div class="flex flex-col md:flex-row gap-4 mb-8">
    <div class="flex-1 bg-indigo-500 text-white p-4 rounded">Flex Item 1</div>
    <div class="flex-1 bg-pink-500 text-white p-4 rounded">Flex Item 2</div>
    <div class="flex-1 bg-teal-500 text-white p-4 rounded">Flex Item 3</div>
  </div>
  
  <!-- Test de tipografía -->
  <div class="space-y-4">
    <h1 class="text-4xl font-bold text-gray-900">Heading 1 - text-4xl</h1>
    <h2 class="text-3xl font-bold text-gray-800">Heading 2 - text-3xl</h2>
    <h3 class="text-2xl font-bold text-gray-700">Heading 3 - text-2xl</h3>
    <p class="text-lg text-gray-600">Párrafo normal - text-lg</p>
    <p class="text-sm text-gray-500">Texto pequeño - text-sm</p>
  </div>
</div>