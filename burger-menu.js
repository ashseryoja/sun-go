/**
 * Burger Menu - Responsive Navigation
 * 
 * Features:
 * - Toggle navigation menu on mobile/tablet
 * - Smooth slide-in animation
 * - Close on overlay click
 * - Close on navigation link click
 * - Prevent body scroll when menu is open
 */

(function() {
  'use strict';

  /* ================================
     DOM ELEMENTS
     ================================ */
  const burgerMenu = document.getElementById('burgerMenu');
  const navList = document.getElementById('navList');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('.nav-link');
  const body = document.body;

  /* ================================
     STATE VARIABLES
     ================================ */
  let isMenuOpen = false;

  /* ================================
     CORE FUNCTIONS
     ================================ */

  /**
   * Open the navigation menu
   */
  function openMenu() {
    if (isMenuOpen) return;
    
    isMenuOpen = true;
    burgerMenu.classList.add('active');
    navList.classList.add('active');
    if (navOverlay) navOverlay.classList.add('active');
    body.style.overflow = 'hidden'; // Prevent body scroll
  }

  /**
   * Close the navigation menu
   */
  function closeMenu() {
    if (!isMenuOpen) return;
    
    isMenuOpen = false;
    burgerMenu.classList.remove('active');
    navList.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    body.style.overflow = ''; // Restore body scroll
  }

  /**
   * Toggle the navigation menu
   */
  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  /* ================================
     EVENT HANDLERS
     ================================ */

  /**
   * Handle burger menu button click
   */
  function handleBurgerClick(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu();
  }

  /**
   * Handle overlay click to close menu
   */
  function handleOverlayClick() {
    closeMenu();
  }

  /**
   * Handle navigation link click to close menu
   */
  function handleNavLinkClick() {
    closeMenu();
  }

  /**
   * Handle escape key to close menu
   */
  function handleEscapeKey(e) {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  }

  /**
   * Handle window resize to close menu on large screens
   */
  function handleResize() {
    if (window.innerWidth > 1024 && isMenuOpen) {
      closeMenu();
    }
  }

  /* ================================
     INITIALIZATION
     ================================ */

  /**
   * Initialize burger menu functionality
   */
  function init() {
    // Validate required elements
    if (!burgerMenu || !navList) {
      console.error('Required burger menu elements not found');
      return;
    }

    // Attach event listeners
    burgerMenu.addEventListener('click', handleBurgerClick);
    
    if (navOverlay) {
      navOverlay.addEventListener('click', handleOverlayClick);
    }

    // Close menu when clicking on navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', handleNavLinkClick);
    });

    // Close menu on escape key
    document.addEventListener('keydown', handleEscapeKey);

    // Close menu on window resize (if screen becomes large)
    window.addEventListener('resize', handleResize);

    console.log('Burger menu initialized successfully');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

