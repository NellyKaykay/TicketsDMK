# Guía de Utilidades Responsive

Esta guía explica cómo usar las utilidades responsive para evitar repetir código en el proyecto TicketsDMK.

## 📁 Estructura

```
src/lib/
├── components/layout/          # Componentes de layout reutilizables
│   ├── Container.svelte       # Contenedor responsive
│   ├── ResponsiveGrid.svelte  # Grid responsive
│   ├── ResponsiveText.svelte  # Tipografía responsive
│   ├── Stack.svelte          # Flexbox responsive
│   └── Show.svelte           # Mostrar/ocultar por breakpoint
├── utils/responsive.ts        # Utilidades CSS responsive
└── stores/breakpoints.ts      # Stores reactivos para breakpoints
```

## 🎯 Componentes de Layout

### Container
Contenedor responsive con variantes predefinidas:

```svelte
<script>
  import Container from '$lib/components/layout/Container.svelte';
</script>

<!-- Contenedor por defecto -->
<Container>
  <h1>Mi contenido</h1>
</Container>

<!-- Contenedor estrecho -->
<Container variant="tight" padding="large">
  <p>Contenido más estrecho</p>
</Container>

<!-- Sin padding vertical -->
<Container padding="none" className="bg-gray-100">
  <div>Contenido personalizado</div>
</Container>
```

**Props:**
- `variant`: 'default' | 'tight' | 'wide'
- `padding`: 'default' | 'large' | 'small' | 'none'
- `className`: string adicional

### ResponsiveGrid
Grid que se adapta automáticamente:

```svelte
<script>
  import ResponsiveGrid from '$lib/components/layout/ResponsiveGrid.svelte';
</script>

<!-- Grid de 3 columnas responsive -->
<ResponsiveGrid columns={3} gap="large">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</ResponsiveGrid>

<!-- Grid auto-fit -->
<ResponsiveGrid columns="auto">
  <div>Auto 1</div>
  <div>Auto 2</div>
</ResponsiveGrid>
```

**Props:**
- `columns`: 2 | 3 | 4 | 'auto'
- `gap`: 'small' | 'medium' | 'large'
- `className`: string adicional

### ResponsiveText
Tipografía que escala automáticamente:

```svelte
<script>
  import ResponsiveText from '$lib/components/layout/ResponsiveText.svelte';
</script>

<!-- Título hero responsive -->
<ResponsiveText variant="hero" tag="h1" color="text-white">
  Mi título principal
</ResponsiveText>

<!-- Subtítulo -->
<ResponsiveText variant="subtitle" tag="h2" className="mb-4">
  Subtítulo que escala
</ResponsiveText>
```

**Props:**
- `variant`: 'hero' | 'title' | 'subtitle' | 'body'
- `tag`: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
- `color`: string de color
- `className`: string adicional

### Stack
Flexbox responsive para layouts:

```svelte
<script>
  import Stack from '$lib/components/layout/Stack.svelte';
</script>

<!-- Stack responsive (columna en móvil, fila en desktop) -->
<Stack direction="responsive" align="center" justify="between">
  <div>Elemento izquierdo</div>
  <div>Elemento derecho</div>
</Stack>

<!-- Stack vertical siempre -->
<Stack direction="column" gap="large">
  <button>Botón 1</button>
  <button>Botón 2</button>
</Stack>
```

**Props:**
- `direction`: 'column' | 'row' | 'responsive'
- `align`: 'start' | 'center' | 'end' | 'stretch'
- `justify`: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
- `gap`: 'small' | 'medium' | 'large'
- `className`: string adicional

### Show
Mostrar/ocultar contenido por breakpoint:

```svelte
<script>
  import Show from '$lib/components/layout/Show.svelte';
</script>

<!-- Solo en móvil -->
<Show on="mobile">
  <button>Menú hamburguesa</button>
</Show>

<!-- Solo en desktop -->
<Show on="desktop">
  <nav>Navegación completa</nav>
</Show>

<!-- En múltiples breakpoints -->
<Show on={['tablet', 'desktop']}>
  <div>Visible en tablet y desktop</div>
</Show>
```

**Props:**
- `on`: 'mobile' | 'tablet' | 'desktop' | 'all' | Array<'mobile' | 'tablet' | 'desktop'>
- `className`: string adicional

## 🛠️ Utilidades CSS

### Presets Responsive
Clases predefinidas comunes:

```svelte
<script>
  import { responsivePresets } from '$lib/utils/responsive';
</script>

<!-- Usar presets directamente -->
<div class={responsivePresets.container.default}>
  <h1 class={responsivePresets.text.hero}>Título</h1>
  <div class={responsivePresets.grid.responsive3}>
    <!-- Grid de 3 columnas -->
  </div>
</div>
```

**Presets disponibles:**
- `container`: default, tight, wide
- `sectionPadding`: default, large, small
- `grid`: responsive2, responsive3, responsive4, autoFit
- `flex`: stackToRow, centerResponsive, spaceBetween
- `text`: hero, title, subtitle, body
- `visibility`: mobileOnly, desktopOnly, tabletUp, desktopUp
- `button`: small, medium, large
- `icon`: small, medium, large

### Crear clases responsive personalizadas:

```svelte
<script>
  import { createResponsiveClasses, combineResponsive } from '$lib/utils/responsive';
  
  // Clases responsive personalizadas
  const customClasses = createResponsiveClasses({
    base: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  });
  
  // Combinar múltiples configuraciones
  const combinedClasses = combineResponsive(
    'bg-white rounded-lg',
    { base: 'p-4', md: 'p-6', lg: 'p-8' },
    'shadow-lg'
  );
</script>

<div class={customClasses}>Texto responsive</div>
<div class={combinedClasses}>Card responsive</div>
```

## 📱 Stores de Breakpoints

### Usar breakpoints reactivos:

```svelte
<script>
  import { isMobile, isTablet, isDesktop, breakpointStores } from '$lib/stores/breakpoints';
</script>

{#if $isMobile}
  <div>Vista móvil</div>
{:else if $isTablet}
  <div>Vista tablet</div>
{:else if $isDesktop}
  <div>Vista desktop</div>
{/if}

<!-- Usar breakpoints específicos -->
{#if $breakpointStores.lg}
  <div>Visible desde lg en adelante</div>
{/if}
```

### Funciones utility:

```svelte
<script>
  import { isBreakpoint, getCurrentBreakpoint, getResponsiveValue } from '$lib/stores/breakpoints';
  
  // Verificar breakpoint
  const isLarge = isBreakpoint('lg');
  
  // Obtener breakpoint actual
  const currentBp = getCurrentBreakpoint();
  
  // Obtener valor responsive
  const fontSize = getResponsiveValue({
    base: '16px',
    md: '18px',
    lg: '20px'
  });
</script>
```

## 💡 Ejemplos de Refactorización

### Antes (código repetitivo):
```svelte
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
  <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
    Mi título
  </h1>
  <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
    <button>Botón 1</button>
    <button>Botón 2</button>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </div>
</div>
```

### Después (con utilidades):
```svelte
<script>
  import { Container, ResponsiveText, Stack, ResponsiveGrid } from '$lib';
</script>

<Container>
  <ResponsiveText variant="hero" tag="h1" className="mb-6">
    Mi título
  </ResponsiveText>
  
  <Stack direction="responsive" justify="center" align="center">
    <button>Botón 1</button>
    <button>Botón 2</button>
  </Stack>
  
  <ResponsiveGrid columns={3} className="mt-12">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </ResponsiveGrid>
</Container>
```

## 🎨 Mejores Prácticas

1. **Usa containers**: Siempre envuelve contenido en `<Container>` para consistencia
2. **Prefiere componentes**: Usa `ResponsiveText`, `Stack`, etc. antes que clases manuales
3. **Combina presets**: Usa `responsivePresets` para casos comunes
4. **Stores reactivos**: Usa stores de breakpoints para lógica condicional
5. **Componente Show**: Para mostrar/ocultar contenido por breakpoint
6. **Clases personalizadas**: Usa `createResponsiveClasses` para casos específicos

## 🔄 Migración Gradual

Puedes migrar componentes existentes gradualmente:

1. Importa las utilidades necesarias
2. Reemplaza patrones repetitivos con componentes de layout
3. Usa presets para clases comunes
4. Implementa stores de breakpoints para lógica condicional

Esta arquitectura hace que el código sea más mantenible, consistente y fácil de actualizar.