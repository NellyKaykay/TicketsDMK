/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts,jsx,tsx}'],
  safelist: [
    // Containers
    'max-w-7xl', 'max-w-5xl', 'max-w-8xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'xl:px-12',
    // Section paddings
    'py-12', 'lg:py-16', 'py-16', 'lg:py-24', 'py-8', 'lg:py-12',
    // Grids
    'grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'sm:grid-cols-2', 'lg:grid-cols-4', 'xl:grid-cols-4',
    'gap-4', 'gap-6', 'lg:gap-8', 'gap-8', 'lg:gap-12',
    // Flex
    'flex', 'flex-col', 'flex-row', 'sm:flex-row', 'md:flex-row', 'justify-center', 'items-center', 'gap-2', 'sm:gap-3', 'gap-4', 'sm:gap-6', 'gap-6', 'sm:gap-8',
    'justify-between', 'justify-around', 'justify-evenly', 'items-start', 'items-end', 'items-stretch',
    // Typography
    'text-4xl', 'sm:text-5xl', 'lg:text-6xl', 'font-bold', 'text-3xl', 'sm:text-4xl', 'text-xl', 'sm:text-2xl', 'text-base', 'sm:text-lg',
    // Visibility
    'block', 'md:hidden', 'hidden', 'md:block', 'sm:block', 'lg:block',
    // Button sizes
    'px-3', 'py-1.5', 'text-sm', 'px-4', 'py-2', 'sm:px-6', 'sm:py-3', 'sm:text-base', 'px-6', 'py-3', 'lg:px-8', 'lg:py-4', 'lg:text-lg',
    // Icon sizes
    'w-4', 'h-4', 'sm:w-5', 'sm:h-5', 'w-5', 'h-5', 'sm:w-6', 'sm:h-6', 'w-6', 'h-6', 'sm:w-8', 'sm:h-8',
    // Card
    'rounded-2xl', 'rounded-t-2xl', 'border', 'border-[#003333]/25', 'bg-white/95', 'backdrop-blur-sm',
    // Shadows
    'shadow-[0_28px_100px_rgba(0,0,0,0.65)]', 'hover:shadow-[0_40px_160px_rgba(0,0,0,0.85)]',
    // Misc
    'transition-transform', 'transition-shadow', 'duration-500', 'ease-out', 'hover:-translate-y-8',
    // Responsive helpers
    'mt-[-18rem]', 'sm:mt-[-24rem]', 'lg:mt-[-32rem]', 'w-full', 'sm:w-4/5', 'lg:w-3/5', 'bg-transparent',
  ],
  // Patrones para clases generadas dinámicamente (ej. class={cond ? 'bg-red-500' : 'bg-blue-500'})
  // Añadir patrones evita que Tailwind purgue estas clases en producción.
  safelistPatterns: [
    // Color utilities with optional variant prefixes (sm:, md:, lg:, hover:, focus:, dark:, etc.)
    /^(?:(?:sm|md|lg|xl|2xl|hover|focus|active|disabled|dark):)*(?:bg|text|border|from|to|ring|stroke|fill)-(?:red|blue|green|yellow|indigo|purple|pink|gray|orange|teal|cyan|amber|lime|rose|emerald)-\d{3}$/,
    // Arbitrary value utilities like bg-[#123456] or text-[var(--color)]
    /^(?:(?:sm|md|lg|xl|2xl|hover|focus|active|disabled|dark):)*bg-\[.*\]$/,
    /^(?:(?:sm|md|lg|xl|2xl|hover|focus|active|disabled|dark):)*text-\[.*\]$/,
    /^(?:(?:sm|md|lg|xl|2xl|hover|focus|active|disabled|dark):)*border-\[.*\]$/,
    // Width/height fractions and common spacing classes
    /^(?:(?:sm|md|lg|xl|2xl):)?w-(?:full|\d+\/\d+)$/,
    /^(?:(?:sm|md|lg|xl|2xl):)?h-(?:full|\d+\/\d+)$/
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    },
  },
  plugins: [],
};
