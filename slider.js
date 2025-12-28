/**
 * Product Slider - Interactive Product Showcase
 * 
 * Features:
 * - Smooth slide transitions
 * - Touch/Swipe support for mobile
 * - Mouse drag support for desktop
 * - Keyboard navigation (Arrow keys)
 * - Automatic content updates
 */

(function() {
  'use strict';

  /* ================================
     CONFIGURATION
     ================================ */
  const slides = [
    {
      title: 'SunMax 360',
      category: 'Solar Panels',
      name: 'Innovative Solar Panels for Your Energy Needs',
      description: 'Discover cutting-edge solar panels designed to maximize energy efficiency and durability. From sleek monocrystalline.'
    },
    {
      title: 'EcoPower Pro',
      category: 'Solar Panels',
      name: 'Professional Grade Solar Solutions',
      description: 'Advanced solar technology designed for commercial and industrial applications with maximum efficiency.'
    },
    {
      title: 'SolarPlus Elite',
      category: 'Solar Panels',
      name: 'Premium Solar Panel Systems',
      description: 'Top-tier solar panels with industry-leading performance and extended warranty coverage for peace of mind.'
    }
  ];

  /* ================================
     STATE VARIABLES
     ================================ */
  let currentSlide = 0;
  let isTransitioning = false;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  /* ================================
     DOM ELEMENTS
     ================================ */
  const slider = document.getElementById('productSlider');
  const sliderTrack = document.getElementById('sliderTrack');
  const productTitle = document.getElementById('productTitle');
  const prevButton = document.getElementById('prevSlide');
  const nextButton = document.getElementById('nextSlide');
  
  // Product info elements
  const productCategory = document.querySelector('.product-category');
  const productName = document.querySelector('.product-name');
  const productDescription = document.querySelector('.product-description');

  /* ================================
     CORE FUNCTIONS
     ================================ */

  /**
   * Update product information based on current slide
   * @param {number} index - Slide index
   */
  function updateProductInfo(index) {
    const slide = slides[index];
    productTitle.textContent = slide.title;
    if (productCategory) productCategory.textContent = slide.category;
    if (productName) productName.textContent = slide.name;
    if (productDescription) productDescription.textContent = slide.description;
  }

  /**
   * Navigate to specific slide
   * @param {number} index - Target slide index
   * @param {boolean} smooth - Enable smooth transition
   */
  function goToSlide(index, smooth = true) {
    if (isTransitioning || index < 0 || index >= slides.length) return;
    
    // Set transition mode
    if (!smooth) {
      sliderTrack.style.transition = 'none';
    } else {
      sliderTrack.style.transition = 'transform 0.4s ease-out';
    }
    
    // Calculate and apply transform
    currentSlide = index;
    const offset = -currentSlide * 100;
    sliderTrack.style.transform = `translateX(${offset}%)`;
    
    // Update product info
    updateProductInfo(currentSlide);
    
    // Restore transition if disabled
    if (!smooth) {
      sliderTrack.offsetHeight; // Force reflow
      sliderTrack.style.transition = 'transform 0.4s ease-out';
    }
  }

  /**
   * Navigate to next slide
   */
  function nextSlide() {
    if (isTransitioning) return;
    const nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex);
  }

  /**
   * Navigate to previous slide
   */
  function prevSlide() {
    if (isTransitioning) return;
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prevIndex);
  }

  /* ================================
     INTERACTION HANDLERS
     ================================ */

  /**
   * Handle drag/swipe start
   * @param {number} clientX - Starting X position
   */
  function handleStart(clientX) {
    if (isTransitioning) return;
    isDragging = true;
    startX = clientX;
    currentX = clientX;
    sliderTrack.style.transition = 'none';
  }

  /**
   * Handle drag/swipe move
   * @param {number} clientX - Current X position
   */
  function handleMove(clientX) {
    if (!isDragging) return;
    
    currentX = clientX;
    const diff = currentX - startX;
    const currentOffset = -currentSlide * 100;
    const movePercent = (diff / slider.offsetWidth) * 100;
    
    sliderTrack.style.transform = `translateX(${currentOffset + movePercent}%)`;
  }

  /**
   * Handle drag/swipe end
   */
  function handleEnd() {
    if (!isDragging) return;
    
    isDragging = false;
    const diff = currentX - startX;
    const threshold = slider.offsetWidth * 0.15; // 15% threshold
    
    sliderTrack.style.transition = 'transform 0.4s ease-out';
    
    // Determine slide change based on swipe distance
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        prevSlide(); // Swiped right
      } else {
        nextSlide(); // Swiped left
      }
    } else {
      goToSlide(currentSlide); // Return to current
    }
    
    startX = 0;
    currentX = 0;
  }

  /* ================================
     TOUCH EVENT HANDLERS
     ================================ */

  function handleTouchStart(e) {
    handleStart(e.touches[0].clientX);
  }

  function handleTouchMove(e) {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  }

  function handleTouchEnd() {
    handleEnd();
  }

  /* ================================
     MOUSE EVENT HANDLERS
     ================================ */

  function handleMouseDown(e) {
    e.preventDefault();
    handleStart(e.clientX);
    slider.style.cursor = 'grabbing';
  }

  function handleMouseMove(e) {
    if (isDragging) {
      handleMove(e.clientX);
    }
  }

  function handleMouseUp() {
    if (isDragging) {
      handleEnd();
      slider.style.cursor = 'grab';
    }
  }

  function handleMouseLeave() {
    if (isDragging) {
      handleEnd();
      slider.style.cursor = 'grab';
    }
  }

  /* ================================
     INITIALIZATION
     ================================ */

  /**
   * Initialize slider functionality
   */
  function init() {
    // Validate required elements
    if (!slider || !sliderTrack || !productTitle) {
      console.error('Required slider elements not found');
      return;
    }

    // Set initial state
    goToSlide(0, false);
    
    // Configure slider appearance
    slider.style.cursor = 'grab';
    slider.style.userSelect = 'none';

    // Attach button event listeners
    if (prevButton) prevButton.addEventListener('click', prevSlide);
    if (nextButton) nextButton.addEventListener('click', nextSlide);

    // Attach touch event listeners
    slider.addEventListener('touchstart', handleTouchStart, { passive: true });
    slider.addEventListener('touchmove', handleTouchMove, { passive: false });
    slider.addEventListener('touchend', handleTouchEnd);

    // Attach mouse event listeners
    slider.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    slider.addEventListener('mouseleave', handleMouseLeave);

    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    });

    // Transition state management
    sliderTrack.addEventListener('transitionstart', () => {
      isTransitioning = true;
    });
    
    sliderTrack.addEventListener('transitionend', () => {
      isTransitioning = false;
    });

    console.log('Product slider initialized successfully');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
