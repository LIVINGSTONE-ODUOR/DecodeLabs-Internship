/**
 * Nexify - Modern SaaS Platform JavaScript
 * Interactive features, smooth animations, and dynamic behavior
 */

// =============================================================================
// 1. NAVBAR SCROLL EFFECT
// =============================================================================

const header = document.getElementById('mainHeader');
let lastScrollY = 0;
let ticking = false;

function updateHeader() {
  const scrollY = window.scrollY;
  
  if (scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScrollY = scrollY;
  ticking = false;
}

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(updateHeader);
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
updateHeader(); // Initial check

// =============================================================================
// 2. MOBILE MENU TOGGLE
// =============================================================================

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav-link');
const body = document.body;

function toggleMobileMenu() {
  const isActive = mainNav.classList.toggle('active');
  const icon = mobileMenuBtn.querySelector('i');
  
  mobileMenuBtn.setAttribute('aria-expanded', isActive);
  
  if (isActive) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-xmark');
    body.classList.add('no-scroll');
  } else {
    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
    body.classList.remove('no-scroll');
  }
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);
}

// Close mobile menu when clicking on a nav link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (mainNav.classList.contains('active')) {
      toggleMobileMenu();
    }
  });
});

// Close menu on window resize if open
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
    toggleMobileMenu();
  }
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (mainNav.classList.contains('active') && 
      !mainNav.contains(e.target) && 
      !mobileMenuBtn.contains(e.target)) {
    toggleMobileMenu();
  }
});

// =============================================================================
// 3. SMOOTH SCROLLING FOR NAVIGATION
// =============================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerHeight = header.offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// =============================================================================
// 4. TOAST NOTIFICATION SYSTEM
// =============================================================================

function showToast(message, type = 'info', duration = 3000) {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.toast');
  existingToasts.forEach(toast => toast.remove());
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="toast-close" aria-label="Close notification" style="background:none;border:none;color:inherit;cursor:pointer;margin-left:12px;font-size:1.1rem;">&times;</button>
  `;
  
  document.body.appendChild(toast);
  
  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  // Close button handler
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  });
  
  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// =============================================================================
// 5. BUTTON CLICK INTERACTIONS
// =============================================================================

const heroCtaBtn = document.getElementById('heroCtaBtn');
const getStartedNavBtn = document.getElementById('getStartedNavBtn');
const finalCtaBtn = document.getElementById('finalCtaBtn');
const signInBtn = document.getElementById('signInBtn');
const watchDemoBtn = document.getElementById('watchDemoBtn');
const contactSalesBtn = document.getElementById('contactSalesBtn');

if (heroCtaBtn) {
  heroCtaBtn.addEventListener('click', () => {
    showToast('✨ Welcome! Your free trial has been activated. Check your email for next steps.', 'success');
  });
}

if (getStartedNavBtn) {
  getStartedNavBtn.addEventListener('click', () => {
    showToast('🚀 Let\'s get started! Redirecting to signup...', 'success');
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  });
}

if (finalCtaBtn) {
  finalCtaBtn.addEventListener('click', () => {
    showToast('🎉 Thank you! Your journey with Nexify begins now.', 'success');
  });
}

if (signInBtn) {
  signInBtn.addEventListener('click', () => {
    showToast('🔐 Sign in portal opening. Demo: demo@nexify.com / password', 'info');
  });
}

if (watchDemoBtn) {
  watchDemoBtn.addEventListener('click', () => {
    showToast('🎬 Playing interactive demo tour. Experience the future!', 'info');
  });
}

if (contactSalesBtn) {
  contactSalesBtn.addEventListener('click', () => {
    showToast('📧 Opening contact form. Our team will reach out within 24 hours.', 'info');
  });
}

// =============================================================================
// 6. SCROLL REVEAL ANIMATIONS (Intersection Observer)
// =============================================================================

const revealElements = document.querySelectorAll('[data-reveal]');

const revealObserverOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, revealObserverOptions);

revealElements.forEach(el => {
  revealObserver.observe(el);
});

// =============================================================================
// 7. TESTIMONIAL SLIDER
// =============================================================================

const testimonialTrack = document.getElementById('testimonialTrack');
const prevSlideBtn = document.getElementById('prevSlide');
const nextSlideBtn = document.getElementById('nextSlide');
const sliderDots = document.getElementById('sliderDots');

let currentIndex = 0;
let testimonialsCount = 0;
let autoSlideInterval;
let testimonialCards = [];

if (testimonialTrack) {
  testimonialCards = document.querySelectorAll('.testimonial-card');
  testimonialsCount = testimonialCards.length;
  
  // Create dots
  if (sliderDots && testimonialsCount > 0) {
    for (let i = 0; i < testimonialsCount; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.setAttribute('tabindex', i === 0 ? '0' : '-1');
      dot.addEventListener('click', () => goToSlide(i));
      sliderDots.appendChild(dot);
    }
  }
  
  function updateSlider() {
    if (testimonialTrack && testimonialCards.length > 0) {
      const cardWidth = testimonialCards[0].offsetWidth + 32; // including margin
      testimonialTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      
      // Update dots
      const dots = document.querySelectorAll('.dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
        dot.setAttribute('aria-selected', idx === currentIndex);
        dot.setAttribute('tabindex', idx === currentIndex ? '0' : '-1');
      });
    }
  }
  
  function goToSlide(index) {
    currentIndex = index;
    updateSlider();
    resetAutoSlide();
  }
  
  function nextSlide() {
    currentIndex = (currentIndex + 1) % testimonialsCount;
    updateSlider();
    resetAutoSlide();
  }
  
  function prevSlide() {
    currentIndex = (currentIndex - 1 + testimonialsCount) % testimonialsCount;
    updateSlider();
    resetAutoSlide();
  }
  
  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      nextSlide();
    }, 6000);
  }
  
  if (prevSlideBtn) prevSlideBtn.addEventListener('click', prevSlide);
  if (nextSlideBtn) nextSlideBtn.addEventListener('click', nextSlide);
  
  // Keyboard navigation for slider
  if (sliderDots) {
    sliderDots.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prevSlide();
      }
    });
  }
  
  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateSlider();
    }, 100);
  });
  
  // Start auto-sliding
  resetAutoSlide();
  
  // Pause on hover
  const sliderContainer = document.querySelector('.testimonials-slider');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    sliderContainer.addEventListener('mouseleave', resetAutoSlide);
  }
}

// =============================================================================
// 8. STATS COUNTER ANIMATION
// =============================================================================

const statNumbers = document.querySelectorAll('.stat-number[data-count]');

const counterObserverOptions = {
  threshold: 0.5
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, counterObserverOptions);

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  
  const suffix = element.nextElementSibling?.textContent || '';
  
  function updateCounter() {
    current += step;
    if (current < target) {
      element.textContent = Math.floor(current).toLocaleString();
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target.toLocaleString();
    }
  }
  
  updateCounter();
}

statNumbers.forEach(stat => {
  counterObserver.observe(stat);
});

// =============================================================================
// 9. PARALLAX EFFECT ON HERO (subtle)
// =============================================================================

const heroSection = document.querySelector('.hero');

if (heroSection && window.innerWidth > 768) {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroContent && scrolled < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
    
    if (heroImage && scrolled < window.innerHeight) {
      heroImage.style.transform = `translateY(${scrolled * 0.05}px)`;
    }
  }, { passive: true });
}

// =============================================================================
// 10. LOGO CLICK - BACK TO TOP
// =============================================================================

const logo = document.querySelector('.logo');
if (logo) {
  logo.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =============================================================================
// 11. ACTIVE NAV LINK HIGHLIGHTING
// =============================================================================

const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
  const scrollY = window.scrollY;
  
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
    
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLink?.classList.add('active');
    } else {
      navLink?.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', highlightNavLink, { passive: true });
highlightNavLink(); // Initial check

// =============================================================================
// 12. FEATURE CARD INTERACTIVE EFFECTS
// =============================================================================

const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    const icon = card.querySelector('.feature-icon i');
    if (icon) {
      icon.style.transform = 'scale(1.15) rotate(5deg)';
    }
  });
  
  card.addEventListener('mouseleave', () => {
    const icon = card.querySelector('.feature-icon i');
    if (icon) {
      icon.style.transform = 'scale(1) rotate(0deg)';
    }
  });
});

// =============================================================================
// 13. MAGNETIC BUTTON EFFECT (subtle attraction on hover)
// =============================================================================

const magneticButtons = document.querySelectorAll('.btn-primary, .btn-outline');

magneticButtons.forEach(button => {
  button.addEventListener('mousemove', (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = '';
  });
});

// =============================================================================
// 14. SMOOTH FADE-IN ON PAGE LOAD
// =============================================================================

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  // Trigger initial animations
  setTimeout(() => {
    const heroElements = document.querySelectorAll('.hero [data-reveal]');
    heroElements.forEach(el => el.classList.add('is-visible'));
  }, 100);
});

// =============================================================================
// 15. ESCAPE KEY HANDLER
// =============================================================================

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mainNav.classList.contains('active')) {
    toggleMobileMenu();
  }
});

// =============================================================================
// 16. PRELOADER (optional - for smoother initial load)
// =============================================================================

// Create and manage preloader
const preloader = document.createElement('div');
preloader.className = 'preloader';
preloader.innerHTML = `
  <div class="preloader-spinner"></div>
  <style>
    .preloader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #020617;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      transition: opacity 0.5s ease, visibility 0.5s ease;
    }
    .preloader.hidden {
      opacity: 0;
      visibility: hidden;
    }
    .preloader-spinner {
      width: 48px;
      height: 48px;
      border: 3px solid rgba(13, 148, 136, 0.2);
      border-top-color: #0D9488;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
`;

document.body.prepend(preloader);

window.addEventListener('load', () => {
  setTimeout(() => {
    preloader.classList.add('hidden');
    setTimeout(() => preloader.remove(), 500);
  }, 300);
});

// =============================================================================
// 17. PERFORMANCE OPTIMIZATION - DEBOUNCE & THROTTLE
// =============================================================================

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// =============================================================================
// 18. FORM VALIDATION (for future form implementations)
// =============================================================================

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// =============================================================================
// INITIALIZATION
// =============================================================================

console.log('🚀 Nexify — Fully loaded and ready to impress!');

// Log performance metrics in development
if (window.performance && window.performance.timing) {
  window.addEventListener('load', () => {
    const timing = window.performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    console.log(`⚡ Page load time: ${loadTime}ms`);
  });
}