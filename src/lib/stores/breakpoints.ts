import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// Breakpoints siguiendo Tailwind CSS
const breakpoints = {
  sm: 640,
  md: 768, 
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Store reactivo para el ancho de ventana
function createWindowWidth() {
  const { subscribe, set } = writable(browser ? window.innerWidth : 1024);
  
  if (browser) {
    const updateWidth = () => set(window.innerWidth);
    window.addEventListener('resize', updateWidth);
    
    return {
      subscribe,
      destroy: () => window.removeEventListener('resize', updateWidth)
    };
  }
  
  return { subscribe };
}

export const windowWidth = createWindowWidth();

// Stores derivados para cada breakpoint
export const isMobile = derived(windowWidth, $width => $width < breakpoints.md);
export const isTablet = derived(windowWidth, $width => $width >= breakpoints.md && $width < breakpoints.lg);
export const isDesktop = derived(windowWidth, $width => $width >= breakpoints.lg);

export const breakpointStores = {
  sm: derived(windowWidth, $width => $width >= breakpoints.sm),
  md: derived(windowWidth, $width => $width >= breakpoints.md),
  lg: derived(windowWidth, $width => $width >= breakpoints.lg),
  xl: derived(windowWidth, $width => $width >= breakpoints.xl),
  '2xl': derived(windowWidth, $width => $width >= breakpoints['2xl'])
};

// Helper functions
export function isBreakpoint(bp: Breakpoint, width?: number): boolean {
  const currentWidth = width ?? (browser ? window.innerWidth : 1024);
  return currentWidth >= breakpoints[bp];
}

export function getCurrentBreakpoint(width?: number): Breakpoint | null {
  const currentWidth = width ?? (browser ? window.innerWidth : 1024);
  
  if (currentWidth >= breakpoints['2xl']) return '2xl';
  if (currentWidth >= breakpoints.xl) return 'xl';
  if (currentWidth >= breakpoints.lg) return 'lg';
  if (currentWidth >= breakpoints.md) return 'md';
  if (currentWidth >= breakpoints.sm) return 'sm';
  
  return null;
}

// Utility para obtener valores responsive
export function getResponsiveValue<T>(
  values: Partial<Record<Breakpoint | 'base', T>>,
  width?: number
): T | undefined {
  const currentWidth = width ?? (browser ? window.innerWidth : 1024);
  const currentBp = getCurrentBreakpoint(currentWidth);
  
  // Buscar el valor más específico disponible
  if (currentBp && values[currentBp]) return values[currentBp];
  
  // Fallback a breakpoints menores
  const orderedBreakpoints: (Breakpoint | 'base')[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'base'];
  
  for (const bp of orderedBreakpoints) {
    if (bp === 'base') return values.base;
    if (breakpoints[bp] <= currentWidth && values[bp]) {
      return values[bp];
    }
  }
  
  return values.base;
}