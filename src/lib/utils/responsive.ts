// Utilidades para manejar clases responsive reutilizables

export interface ResponsiveConfig<T = string> {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

/**
 * Genera clases responsive basadas en configuración
 */
export function createResponsiveClasses<T extends string>(config: ResponsiveConfig<T>): string {
  const classes: string[] = [];
  
  if (config.base) classes.push(config.base);
  if (config.sm) classes.push(`sm:${config.sm}`);
  if (config.md) classes.push(`md:${config.md}`);
  if (config.lg) classes.push(`lg:${config.lg}`);
  if (config.xl) classes.push(`xl:${config.xl}`);
  if (config['2xl']) classes.push(`2xl:${config['2xl']}`);
  
  return classes.join(' ');
}

/**
 * Configuraciones predefinidas comunes
 */
export const responsivePresets = {
  // Containers comunes
  container: {
    default: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    tight: 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8',
    wide: 'max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12',
  },
  
  // Spacing vertical
  sectionPadding: {
    default: 'py-12 lg:py-16',
    large: 'py-16 lg:py-24',
    small: 'py-8 lg:py-12',
  },
  
  // Grids comunes
  grid: {
    responsive2: 'grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8',
    responsive3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8',
    responsive4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6',
    autoFit: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
  },
  
  // Flexbox responsive
  flex: {
    stackToRow: 'flex flex-col sm:flex-row gap-4',
    centerResponsive: 'flex flex-col sm:flex-row justify-center items-center gap-4',
    spaceBetween: 'flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0',
  },
  
  // Typography responsive
  text: {
    hero: 'text-4xl sm:text-5xl lg:text-6xl font-bold',
    title: 'text-3xl sm:text-4xl font-bold',
    subtitle: 'text-xl sm:text-2xl',
    body: 'text-base sm:text-lg',
  },
  
  // Visibility helpers
  visibility: {
    mobileOnly: 'block md:hidden',
    desktopOnly: 'hidden md:block',
    tabletUp: 'hidden sm:block',
    desktopUp: 'hidden lg:block',
  },
  
  // Common button sizes
  button: {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base',
    large: 'px-6 py-3 text-base lg:px-8 lg:py-4 lg:text-lg',
  },
  
  // Icon sizes
  icon: {
    small: 'w-4 h-4 sm:w-5 sm:h-5',
    medium: 'w-5 h-5 sm:w-6 sm:h-6',
    large: 'w-6 h-6 sm:w-8 sm:h-8',
  },
} as const;

/**
 * Helper para generar clases de breakpoint específico
 */
export function breakpoint(bp: keyof ResponsiveConfig, classes: string): string {
  if (bp === 'base') return classes;
  return `${bp}:${classes}`;
}

/**
 * Combina múltiples configuraciones responsive
 */
export function combineResponsive(...configs: Array<ResponsiveConfig | string>): string {
  const allClasses: string[] = [];
  
  configs.forEach(config => {
    if (typeof config === 'string') {
      allClasses.push(config);
    } else {
      allClasses.push(createResponsiveClasses(config));
    }
  });
  
  return allClasses.join(' ');
}

/**
 * Variantes responsive para componentes
 */
export type ResponsiveVariant = 'mobile' | 'tablet' | 'desktop' | 'all';

export function getVariantClasses(variant: ResponsiveVariant, classes: string): string {
  switch (variant) {
    case 'mobile':
      return `${classes} md:hidden`;
    case 'tablet':
      return `hidden md:${classes} lg:hidden`;
    case 'desktop':
      return `hidden lg:${classes}`;
    case 'all':
    default:
      return classes;
  }
}