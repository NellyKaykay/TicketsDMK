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

<header class="shadow-sm border-b sticky top-0 z-40 text-xl" style="height:112px; background-color: var(--bg); border-color: var(--border); color: var(--text);">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div class="flex justify-between items-center" style="height:100%;">
      <!-- Logo -->
      <div class="flex-shrink-0 flex items-center mr-4 xl:mr-12" style="height:100%;">
        <Logo size="header" />
      </div>
      <!-- Desktop Navigation -->
      <div class="hidden lg:flex items-center space-x-4 xl:space-x-8">
        <Navigation variant="desktop" />
      </div>
      <!-- Desktop Right Side -->
      <div class="hidden lg:flex items-center space-x-3 xl:space-x-6">
        <LanguageSelector />
        <UserMenu variant="desktop" />
      </div>
      <!-- Mobile Hamburger -->
      <div class="lg:hidden">
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
