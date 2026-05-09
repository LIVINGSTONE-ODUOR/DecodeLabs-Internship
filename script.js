/**
 * STONE TECH SOLUTIONS — Modern UI interactions
 * Stabilized + deduped script.
 */

// =============================================================================
// Helpers
// =============================================================================

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showToast(message, type = 'info', duration = 3000) {
  const existingToasts = document.querySelectorAll('.toast');
  existingToasts.forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="toast-close" aria-label="Close notification" style="background:none;border:none;color:inherit;cursor:pointer;margin-left:12px;font-size:1.1rem;">&times;</button>
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn?.addEventListener('click', () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// =============================================================================
// 1) Navbar scroll effect
// =============================================================================

const header = document.getElementById('mainHeader');
let ticking = false;

// Remove any accidental legacy globals (previous corrupted builds)
// so the page behaves deterministically.
window.__stoneTechInit = true;


function updateHeader() {
  if (!header) return;
  const scrollY = window.scrollY || 0;
  header.classList.toggle('scrolled', scrollY > 50);
  ticking = false;
}

function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(updateHeader);
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
updateHeader();

// =============================================================================
// 2) Mobile menu toggle
// =============================================================================

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav-link');
const body = document.body;

function toggleMobileMenu() {
  if (!mainNav || !mobileMenuBtn) return;

  const isActive = mainNav.classList.toggle('active');
  mobileMenuBtn.setAttribute('aria-expanded', String(isActive));

  const icon = mobileMenuBtn.querySelector('i');
  if (icon) {
    icon.classList.toggle('fa-xmark', isActive);
    icon.classList.toggle('fa-bars', !isActive);
  }

  body.classList.toggle('no-scroll', isActive);
}

mobileMenuBtn?.addEventListener('click', toggleMobileMenu);
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (mainNav?.classList.contains('active')) toggleMobileMenu();
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && mainNav?.classList.contains('active')) toggleMobileMenu();
});

document.addEventListener('click', (e) => {
  if (!mainNav?.classList.contains('active')) return;
  const target = e.target;
  if (mainNav.contains(target) || mobileMenuBtn.contains(target)) return;
  toggleMobileMenu();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mainNav?.classList.contains('active')) toggleMobileMenu();
});

// =============================================================================
// 3) Smooth scrolling for in-page anchors
// =============================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const targetElement = document.querySelector(href);
    if (!targetElement) return;

    e.preventDefault();

    const headerHeight = header?.offsetHeight ?? 0;
    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth'
    });
  });
});

// =============================================================================
// 4) Scroll reveal animations
// =============================================================================

const revealElements = document.querySelectorAll('[data-reveal]');
if (revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));
}

// =============================================================================
// 5) Testimonials slider
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

  if (sliderDots && testimonialsCount > 0) {
    sliderDots.innerHTML = '';
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
    if (!testimonialTrack || testimonialsCount === 0) return;

    const cardWidth = testimonialCards[0].offsetWidth + 32; // includes margin
    testimonialTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    document.querySelectorAll('.dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
      dot.setAttribute('aria-selected', String(idx === currentIndex));
      dot.setAttribute('tabindex', idx === currentIndex ? '0' : '-1');
    });
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
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 6000);
  }

  prevSlideBtn?.addEventListener('click', prevSlide);
  nextSlideBtn?.addEventListener('click', nextSlide);

  sliderDots?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      prevSlide();
    }
  });

  window.addEventListener('resize', () => updateSlider(), { passive: true });

  // Start
  updateSlider();
  resetAutoSlide();

  const sliderContainer = document.querySelector('.testimonials-slider');
  sliderContainer?.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
  sliderContainer?.addEventListener('mouseleave', resetAutoSlide);
}

// =============================================================================
// 6) Stats counters animation
// =============================================================================

const statNumbers = document.querySelectorAll('.stat-number[data-count]');

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'), 10);
  if (!Number.isFinite(target)) return;

  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

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

if (statNumbers.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(stat => counterObserver.observe(stat));
}

// =============================================================================
// 7) Hero subtle parallax
// =============================================================================

const heroSection = document.querySelector('.hero');

if (heroSection && window.innerWidth > 768 && !prefersReducedMotion()) {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset || 0;
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
// 8) Logo click - back to top
// =============================================================================

document.querySelector('.logo')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
});

// =============================================================================
// 9) Active nav link highlighting
// =============================================================================

const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
  const scrollY = window.scrollY || 0;
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (!navLink) return;

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLink.classList.add('active');
    } else {
      navLink.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', highlightNavLink, { passive: true });
highlightNavLink();

// =============================================================================
// 10) Contact form submit handling
// =============================================================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const formObject = Object.fromEntries(formData.entries());

    if (!formObject.name || !formObject.email || !formObject.message) {
      showToast('❌ Please fill in all required fields.', 'error');
      return;
    }

    if (!validateEmail(formObject.email)) {
      showToast('❌ Please enter a valid email address.', 'error');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';

    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
    }

    try {
      // Demo submission (replace with real API later)
      await new Promise(resolve => setTimeout(resolve, 1500));

      showToast('✅ Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.', 'success');
      contactForm.reset();
    } catch {
      showToast('❌ Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    }
  });
}

// =============================================================================
// 11) AI chat widget
// =============================================================================

const chatWidget = document.getElementById('chatWidget');
const chatToggle = document.getElementById('chatToggle');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

const botResponses = {
  website: 'We build modern, responsive websites using React, Vue.js, and other cutting-edge technologies. Our websites are SEO-optimized and mobile-first. Would you like a quote?',
  mobile: 'We develop native iOS and Android apps, as well as cross-platform solutions with React Native and Flutter. All apps include modern UI/UX design.',
  support: 'Our 24/7 IT support covers troubleshooting, hardware repairs, system maintenance, and remote assistance. We keep your business running smoothly.',
  cybersecurity: 'We provide comprehensive cybersecurity including threat assessment, firewall setup, data encryption, and security audits to protect your business.',
  cloud: 'We help migrate to AWS, Azure, or Google Cloud with hosting, backup solutions, and infrastructure management for scalable operations.',
  ai: 'Our AI automation includes chatbots, process automation, and machine learning solutions to streamline your business operations.',
  quote: "Great! Please fill out our contact form with your project details, and we'll provide a customized quote within 24 hours.",
  default: 'Thank you for your interest in STONE TECH SOLUTIONS! We specialize in software development, IT services, and digital transformation. How can I help you today?'
};

function toggleChat() {
  if (!chatWindow || !chatToggle) return;
  const active = chatWindow.classList.toggle('active');
  chatToggle.setAttribute('aria-expanded', String(active));
  if (active) chatInput?.focus();
}

function closeChat() {
  if (!chatWindow || !chatToggle) return;
  chatWindow.classList.remove('active');
  chatToggle.setAttribute('aria-expanded', 'false');
}

function addMessage(content, type = 'bot') {
  if (!chatMessages) return;

  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}-message ${type === 'user' ? 'user-message' : ''}`.trim();

  const avatar = type === 'bot'
    ? '<i class="fas fa-robot" aria-hidden="true"></i>'
    : '<i class="fas fa-user" aria-hidden="true"></i>';

  messageDiv.innerHTML = `
    <div class="message-avatar">${avatar}</div>
    <div class="message-content"><p>${content}</p></div>
  `;

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotResponse(message) {
  const m = message.toLowerCase();
  // Simple keyword match
  if (m.includes('website')) return botResponses.website;
  if (m.includes('mobile') || m.includes('app')) return botResponses.mobile;
  if (m.includes('support') || m.includes('troubleshoot') || m.includes('repair')) return botResponses.support;
  if (m.includes('cyber') || m.includes('security') || m.includes('hacking')) return botResponses.cybersecurity;
  if (m.includes('cloud') || m.includes('hosting') || m.includes('backup')) return botResponses.cloud;
  if (m.includes('ai') || m.includes('automation') || m.includes('chatbot')) return botResponses.ai;
  if (m.includes('quote') || m.includes('price') || m.includes('estimate')) return botResponses.quote;
  return botResponses.default;
}

function handleChatInput() {
  if (!chatInput) return;
  const message = chatInput.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  chatInput.value = '';

  const response = getBotResponse(message);
  setTimeout(() => addMessage(response, 'bot'), 600 + Math.random() * 700);
}

function handleQuickReply(replyType) {
  const replies = {
    website: 'Tell me more about website development',
    mobile: 'What about mobile app development?',
    support: 'I need IT support services',
    quote: "I'd like to get a quote"
  };

  addMessage(replies[replyType] || 'Tell me more', 'user');
  setTimeout(() => addMessage(botResponses[replyType] || botResponses.default, 'bot'), 700);
}

chatToggle?.addEventListener('click', toggleChat);
chatClose?.addEventListener('click', closeChat);
chatSend?.addEventListener('click', handleChatInput);
chatInput?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleChatInput();
});

document.addEventListener('click', (e) => {
  const target = e.target;
  if (!(target instanceof Element)) return;
  if (!target.classList.contains('quick-reply')) return;
  const replyType = target.getAttribute('data-reply');
  if (!replyType) return;
  handleQuickReply(replyType);
});

document.addEventListener('click', (e) => {
  if (!chatWindow?.classList.contains('active')) return;
  if (!chatWidget) return;
  if (chatWidget.contains(e.target)) return;
  closeChat();
});

// =============================================================================
// 12) Preloader (optional modern feel)
// =============================================================================

(function createPreloader() {
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
      @keyframes spin { to { transform: rotate(360deg);} }
    </style>
  `;

  document.body.prepend(preloader);

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 400);
    }, 250);
  });
})();

// =============================================================================
// 13) Small hover polish (feature cards + magnetic buttons)
// =============================================================================

document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const icon = card.querySelector('.feature-icon i');
    if (icon) icon.style.transform = 'scale(1.15) rotate(5deg)';
  });
  card.addEventListener('mouseleave', () => {
    const icon = card.querySelector('.feature-icon i');
    if (icon) icon.style.transform = 'scale(1) rotate(0deg)';
  });
});

document.querySelectorAll('.btn-primary, .btn-outline').forEach(button => {
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
// 14) Initial smooth reveal on load
// =============================================================================

window.addEventListener('load', () => {
  document.body.classList.add('loaded');

  setTimeout(() => {
    document.querySelectorAll('.hero [data-reveal]').forEach(el => el.classList.add('is-visible'));
  }, 50);
});

console.log('🚀 STONE TECH SOLUTIONS — JS initialized (stabilized).');

