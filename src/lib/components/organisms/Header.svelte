<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  // Atomic components
  import Logo from '$lib/components/atoms/Logo.svelte';
  import HamburgerButton from '$lib/components/atoms/HamburgerButton.svelte';
  import LanguageSelector from '$lib/components/atoms/LanguageSelector.svelte';
  
  // Molecular components
  import Navigation from '$lib/components/molecules/Navigation.svelte';
  import UserMenu from '$lib/components/molecules/UserMenu.svelte';
  import MobileMenu from '$lib/components/molecules/MobileMenu.svelte';
  
  // State
  let isMobileMenuOpen = false;
  
  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }
  
  function closeMobileMenu() {
    isMobileMenuOpen = false;
  }
  
  // Close mobile menu on escape key
  onMount(() => {
    if (!browser) return;
    
    function handleEscape(event) {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    }
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  });
</script>

<header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      
      <!-- Logo -->
      <div class="flex-shrink-0">
        <Logo size="md" />
      </div>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-8">
        <Navigation variant="desktop" />
      </div>
      
      <!-- Desktop Right Side -->
      <div class="hidden md:flex items-center space-x-4">
        <LanguageSelector />
        <UserMenu variant="desktop" />
      </div>
      
      <!-- Mobile Hamburger -->
      <div class="md:hidden">
        <HamburgerButton 
          isOpen={isMobileMenuOpen} 
          onClick={toggleMobileMenu} 
        />
      </div>
      
    </div>
  </div>
</header>

<!-- Mobile Menu -->
<MobileMenu 
  isOpen={isMobileMenuOpen} 
  onClose={closeMobileMenu}
/>
