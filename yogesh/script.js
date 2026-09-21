// ===== PRELOADER =====
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
    initAnimations();
  }, 2200);
});

document.body.style.overflow = 'hidden';

// ===== CUSTOM CURSOR =====
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
});

function animateCursorRing() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  cursorRing.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
  requestAnimationFrame(animateCursorRing);
}
animateCursorRing();

// Cursor hover effects
document.querySelectorAll('a, button, .project-card, .skill-card, .service-card, .award-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

// ===== PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  const count = 40;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100 + 50}%`;
    particle.style.animationDelay = `${Math.random() * 8}s`;
    particle.style.animationDuration = `${6 + Math.random() * 6}s`;
    particle.style.width = `${1 + Math.random() * 2}px`;
    particle.style.height = particle.style.width;
    container.appendChild(particle);
  }
}
createParticles();

// ===== NAVIGATION =====
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// Scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  if (currentScroll > 80) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  lastScroll = currentScroll;

  // Update active nav link
  updateActiveNav();
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('[data-nav]').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// Active nav link tracking
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 200;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav__link[href="#${id}"]`);

    if (link) {
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000;
    const start = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      counter.textContent = current + '+';

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

// ===== SCROLL REVEAL ANIMATIONS =====
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Animate skill bars when visible
        const skillBars = entry.target.querySelectorAll('.skill-card__bar-fill');
        skillBars.forEach(bar => {
          const width = bar.getAttribute('data-width');
          setTimeout(() => {
            bar.style.width = `${width}%`;
          }, 300);
        });

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .timeline__item').forEach(el => {
    observer.observe(el);
  });
}

// ===== TESTIMONIALS SLIDER =====
function initTestimonialsSlider() {
  const track = document.getElementById('testimonialsTrack');
  const dots = document.querySelectorAll('.testimonials__dot');
  let currentIndex = 0;
  let autoSlideInterval;

  function goToSlide(index) {
    currentIndex = index;
    track.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.getAttribute('data-index')));
      resetAutoSlide();
    });
  });

  function autoSlide() {
    autoSlideInterval = setInterval(() => {
      const next = (currentIndex + 1) % dots.length;
      goToSlide(next);
    }, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlide();
  }

  autoSlide();

  // Touch / swipe support
  let startX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
  });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < dots.length - 1) {
        goToSlide(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        goToSlide(currentIndex - 1);
      }
      resetAutoSlide();
    }
  });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const position = target.offsetTop - offset;
      window.scrollTo({
        top: position,
        behavior: 'smooth'
      });
    }
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const submitBtn = document.getElementById('formSubmit');
  const originalText = submitBtn.textContent;

  submitBtn.textContent = 'Sending...';
  submitBtn.style.opacity = '0.7';
  submitBtn.disabled = true;

  // Simulate form submission
  setTimeout(() => {
    submitBtn.textContent = '✓ Message Sent!';
    submitBtn.style.opacity = '1';
    submitBtn.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';

    contactForm.reset();

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 3000);
  }, 1500);
});

// ===== PARALLAX EFFECTS =====
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;

  // Parallax on hero image
  const heroImage = document.querySelector('.hero__image-wrapper');
  if (heroImage) {
    heroImage.style.transform = `translateY(${scrolled * 0.08}px)`;
  }

  // Parallax on grid lines
  const gridLines = document.querySelector('.hero__grid-lines');
  if (gridLines) {
    gridLines.style.transform = `perspective(500px) rotateX(2deg) translateY(${-scrolled * 0.15}px)`;
  }
});

// ===== MAGNETIC EFFECT ON BUTTONS =====
document.querySelectorAll('.btn-primary, .btn-outline, .nav__cta').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});

// ===== TILT EFFECT ON CARDS =====
document.querySelectorAll('.skill-card, .service-card, .award-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * 8;
    const tiltY = (x - 0.5) * -8;

    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ===== TEXT TYPING EFFECT FOR HERO TITLE =====
function typeEffect(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// ===== INITIALIZE ALL ANIMATIONS =====
function initAnimations() {
  initScrollReveal();
  initTestimonialsSlider();

  // Delay counter animation
  setTimeout(animateCounters, 500);

  // Type effect on hero title
  const heroTitle = document.querySelector('.hero__title');
  if (heroTitle) {
    const text = heroTitle.textContent;
    typeEffect(heroTitle, text, 40);
  }
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
  }
});

// ===== FORM INPUT ANIMATIONS =====
document.querySelectorAll('.form__input, .form__textarea').forEach(input => {
  input.addEventListener('focus', () => {
    input.parentElement.querySelector('.form__label').style.color = '#c9a96e';
  });

  input.addEventListener('blur', () => {
    input.parentElement.querySelector('.form__label').style.color = '';
  });
});

// ===== PAGE VISIBILITY API (pause animations when tab is not active) =====
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.querySelectorAll('.marquee__track').forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  } else {
    document.querySelectorAll('.marquee__track').forEach(el => {
      el.style.animationPlayState = 'running';
    });
  }
});
