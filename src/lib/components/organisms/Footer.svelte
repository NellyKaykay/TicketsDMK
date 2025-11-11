<script>
  import Logo from '../atoms/Logo.svelte';
  import FooterSection from '../molecules/FooterSection.svelte';
  import SocialLinks from '../molecules/SocialLinks.svelte';
  import Container from '../layout/Container.svelte';
  import ResponsiveGrid from '../layout/ResponsiveGrid.svelte';
  import Stack from '../layout/Stack.svelte';
  
  const footerSections = [
    {
      title: 'Eventos',
      links: [
        { text: 'Eventos', href: '/events' },
        { text: 'Teatro', href: '/theater' },
        { text: 'Próximamente', href: '/upcoming' }
      ]
    },
    {
      title: 'Servicios',
      links: [
        { text: 'Venta de entradas', href: '/tickets' },
        { text: 'Vuelos', href: '/flights' },
        { text: 'Hoteles', href: '/hotels' }
      ]
    },
    {
      title: 'Ayuda',
      links: [
        { text: 'Contacto', href: '/contact' },
        { text: 'Devoluciones', href: '/refunds' },
        { text: 'Estado del pedido', href: '/order-status' }
      ]
    }
  ];
  
  const socialLinks = [
    { platform: 'facebook', href: 'https://facebook.com/ticketsdmk', username: 'ticketsdmk' },
    { platform: 'twitter', href: 'https://twitter.com/ticketsdmk', username: 'ticketsdmk' },
    { platform: 'instagram', href: 'https://instagram.com/ticketsdmk', username: 'ticketsdmk' },
    { platform: 'youtube', href: 'https://youtube.com/ticketsdmk', username: 'ticketsdmk' }
  ];
  
  const currentYear = new Date().getFullYear();
</script>

<footer class="bg-white border-t border-gray-200">
  <Container variant="default" padding="none">
    <div class="px-4 sm:px-6 lg:px-8 pt-8 pb-8 lg:pb-12">
    <!-- Main footer content -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-16 lg:gap-20">
      <!-- Company info -->
      <div class="md:col-span-1 space-y-8">
        <div>
          <img 
            src="/logo-ticketsdmk.jpg" 
            alt="TicketsDMK" 
            class="h-32 w-32 object-contain"
          />
          <p class="text-base text-gray-500 max-w-md">
            Tu plataforma de confianza para descubrir y comprar entradas para los mejores eventos musicales. 
            Conectamos artistas, venues y fans para crear experiencias inolvidables.
          </p>
        </div>
        
        <!-- Newsletter signup -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
            Mantente informado
          </h3>
          <p class="text-sm text-gray-500 mb-4">
            Recibe las últimas noticias sobre eventos y ofertas exclusivas.
          </p>
          <form class="flex max-w-md">
            <label for="email-address" class="sr-only">Email</label>
            <input 
              type="email" 
              id="email-address"
              required
              class="flex-1 min-w-0 px-4 py-2 text-base text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:border-transparent" style="--tw-ring-color: #003333; border-color: #003333 !important;"
              placeholder="tu@email.com"
            />
            <button 
              type="submit"
              class="flex-shrink-0 px-4 py-2 border border-transparent text-base font-medium text-white rounded-r-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200" style="background-color: #003333; --tw-ring-color: #003333;"
            >
              Suscribirse
            </button>
          </form>
        </div>
        
        <!-- Social links -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
            Síguenos
          </h3>
          <SocialLinks {socialLinks} />
        </div>
      </div>
      
      <!-- Footer sections -->
      {#each footerSections as section}
        <div class="mt-32">
          <FooterSection title={section.title} links={section.links} />
        </div>
      {/each}
    </div>
    
    <!-- Bottom section -->
    <div class="mt-8 pt-4 border-t border-gray-200">
      <Stack direction="responsive" justify="between" align="center">
        <!-- Copyright -->
        <div class="text-base text-gray-400">
          © {currentYear} TicketsDMK. Todos los derechos reservados.
        </div>
        
        <!-- Legal links -->
        <div class="flex space-x-6">
          <a href="/privacy" class="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200">
            Privacidad
          </a>
          <a href="/terms" class="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200">
            Términos
          </a>
          <a href="/cookies" class="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200">
            Cookies
          </a>
          <a href="/accessibility" class="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200">
            Accesibilidad
          </a>
        </div>
      </Stack>
    </div>
    </div>
  </Container>
</footer>