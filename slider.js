// Product Slider - Clean Implementation
(function() {
  'use strict';

  // Slider data
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

  let currentSlide = 0;
  let isTransitioning = false;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  // DOM elements
  const slider = document.getElementById('productSlider');
  const sliderTrack = document.getElementById('sliderTrack');
  const productTitle = document.getElementById('productTitle');
  const prevButton = document.getElementById('prevSlide');
  const nextButton = document.getElementById('nextSlide');
  
  // Product info elements
  const productCategory = document.querySelector('.product-category');
  const productName = document.querySelector('.product-name');
  const productDescription = document.querySelector('.product-description');

  // Update product info
  function updateProductInfo(index) {
    const slide = slides[index];
    productTitle.textContent = slide.title;
    if (productCategory) productCategory.textContent = slide.category;
    if (productName) productName.textContent = slide.name;
    if (productDescription) productDescription.textContent = slide.description;
  }

  // Move to slide
  function goToSlide(index, smooth = true) {
    if (isTransitioning || index < 0 || index >= slides.length) return;
    
    if (!smooth) {
      sliderTrack.style.transition = 'none';
    } else {
      sliderTrack.style.transition = 'transform 0.4s ease-out';
    }
    
    currentSlide = index;
    const offset = -currentSlide * 100;
    sliderTrack.style.transform = `translateX(${offset}%)`;
    
    updateProductInfo(currentSlide);
    
    if (!smooth) {
      // Force reflow
      sliderTrack.offsetHeight;
      sliderTrack.style.transition = 'transform 0.4s ease-out';
    }
  }

  // Next slide
  function nextSlide() {
    if (isTransitioning) return;
    const nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex);
  }

  // Previous slide
  function prevSlide() {
    if (isTransitioning) return;
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prevIndex);
  }

  // Touch/Mouse start
  function handleStart(clientX) {
    if (isTransitioning) return;
    isDragging = true;
    startX = clientX;
    currentX = clientX;
    sliderTrack.style.transition = 'none';
  }

  // Touch/Mouse move
  function handleMove(clientX) {
    if (!isDragging) return;
    
    currentX = clientX;
    const diff = currentX - startX;
    const currentOffset = -currentSlide * 100;
    const movePercent = (diff / slider.offsetWidth) * 100;
    
    sliderTrack.style.transform = `translateX(${currentOffset + movePercent}%)`;
  }

  // Touch/Mouse end
  function handleEnd() {
    if (!isDragging) return;
    
    isDragging = false;
    const diff = currentX - startX;
    const threshold = slider.offsetWidth * 0.15; // 15% threshold
    
    sliderTrack.style.transition = 'transform 0.4s ease-out';
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped right - previous
        prevSlide();
      } else {
        // Swiped left - next
        nextSlide();
      }
    } else {
      // Return to current slide
      goToSlide(currentSlide);
    }
    
    startX = 0;
    currentX = 0;
  }

  // Touch events
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

  // Mouse events
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

  // Initialize
  function init() {
    if (!slider || !sliderTrack || !productTitle) {
      console.error('Required slider elements not found');
      return;
    }

    // Set initial state
    goToSlide(0, false);
    
    // Add cursor style
    slider.style.cursor = 'grab';
    slider.style.userSelect = 'none';

    // Button events
    if (prevButton) prevButton.addEventListener('click', prevSlide);
    if (nextButton) nextButton.addEventListener('click', nextSlide);

    // Touch events
    slider.addEventListener('touchstart', handleTouchStart, { passive: true });
    slider.addEventListener('touchmove', handleTouchMove, { passive: false });
    slider.addEventListener('touchend', handleTouchEnd);

    // Mouse events
    slider.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    slider.addEventListener('mouseleave', handleMouseLeave);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    });

    // Transition lock
    sliderTrack.addEventListener('transitionstart', () => {
      isTransitioning = true;
    });
    
    sliderTrack.addEventListener('transitionend', () => {
      isTransitioning = false;
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
