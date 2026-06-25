/* ===========================
   Lumina - Animations
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Split hero title into words ---- */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const html = heroTitle.innerHTML;
    const parts = html.split(/(<br\s*\/?>)/gi);
    heroTitle.innerHTML = parts.map(part => {
      if (/^<br/i.test(part)) return part;
      return part.split(/\s+/).filter(Boolean).map((word, i) => {
        const baseDelay = 0.15;
        return `<span class="word" style="animation-delay:${(baseDelay + i * 0.08).toFixed(2)}s">${word}</span>`;
      }).join(' ');
    }).join('');
  }


  /* ---- Clip-mask reveal for section titles ---- */
  document.querySelectorAll('.section-title, .insight-title, .cta-title').forEach(el => {
    const text = el.innerHTML;
    el.classList.add('clip-reveal');
    el.innerHTML = `<span class="clip-reveal-inner">${text}</span>`;
  });

  const clipObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        clipObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.clip-reveal').forEach(el => clipObserver.observe(el));


  /* ---- Testimonials carousel (mobile) ---- */
  const track = document.getElementById('carousel-track');
  const dotsContainer = document.getElementById('carousel-dots');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (track) {
    const cards = Array.from(track.querySelectorAll('.testimonial-card'));
    let current = 0;
    let isMobile = window.innerWidth <= 768;

    const buildDots = () => {
      dotsContainer.innerHTML = '';
      cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === current ? ' is-active' : '');
        dot.setAttribute('aria-label', `${i + 1}枚目`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      });
    };

    const goTo = (index) => {
      current = (index + cards.length) % cards.length;
      if (isMobile) {
        cards.forEach((c, i) => c.classList.toggle('is-active', i === current));
        dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
          d.classList.toggle('is-active', i === current);
        });
      }
    };

    const applyMode = () => {
      isMobile = window.innerWidth <= 768;
      if (isMobile) {
        cards.forEach((c, i) => c.classList.toggle('is-active', i === current));
      } else {
        cards.forEach(c => {
          c.classList.remove('is-active');
          c.style.display = '';
        });
      }
    };

    buildDots();
    applyMode();

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));

    window.addEventListener('resize', applyMode, { passive: true });

    // Auto-advance on mobile
    setInterval(() => { if (isMobile) goTo(current + 1); }, 5000);
  }


  /* ---- Navbar: shadow on scroll ---- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });


  /* ---- IntersectionObserver: scroll reveal ---- */
  const revealEls = document.querySelectorAll('[data-reveal], [data-reveal="left"], [data-reveal="right"]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ---- IntersectionObserver: stagger children ---- */
  const staggerContainers = document.querySelectorAll('[data-stagger]');

  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const container = entry.target;
        container.classList.add('is-visible');
        const children = Array.from(container.children);
        children.forEach((child, i) => {
          child.style.transitionDelay = `${i * 0.1}s`;
        });
        staggerObserver.unobserve(container);
      }
    });
  }, { threshold: 0.1 });

  staggerContainers.forEach(el => staggerObserver.observe(el));


  /* ---- Parallax: fullwidth image ---- */
  const parallaxImg = document.getElementById('parallax-img');
  const parallaxSection = document.getElementById('parallax-section');

  if (parallaxImg && parallaxSection) {
    const updateParallax = () => {
      const rect = parallaxSection.getBoundingClientRect();
      const windowH = window.innerHeight;
      if (rect.bottom < 0 || rect.top > windowH) return;

      const progress = (windowH - rect.top) / (windowH + rect.height);
      const offset = (progress - 0.5) * 80;
      parallaxImg.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }


  /* ---- FAQ: accordion ---- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // close all others
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('is-open');
      });

      item.classList.toggle('is-open', !isOpen);
    });
  });


  /* ---- Ripple effect on buttons ---- */
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height);

      const wave = document.createElement('span');
      wave.classList.add('ripple-wave');
      wave.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x - size / 2}px;
        top: ${y - size / 2}px;
      `;
      this.appendChild(wave);
      wave.addEventListener('animationend', () => wave.remove());
    });
  });


  /* ---- Card tilt on mouse move (feature cards) ---- */
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ---- Pricing card tilt ---- */
  document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const scale = card.classList.contains('pricing-card--featured') ? 1.02 : 1;
      card.style.transform = `translateY(-6px) scale(${scale}) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ---- Number counter for pricing ---- */
  const prices = document.querySelectorAll('.price');

  const countUp = (el) => {
    const rawText = el.textContent.trim();
    const match = rawText.match(/[\d,]+/);
    if (!match) return;

    const target = parseInt(match[0].replace(/,/g, ''), 10);
    if (target === 0) return;

    const prefix = rawText.includes('¥') ? '¥' : '';
    const duration = 900;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = prefix + current.toLocaleString('ja-JP');
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  prices.forEach(el => counterObserver.observe(el));


  /* ---- Smooth active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  if (sections.length && navAnchors.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(a => {
            a.style.color = a.getAttribute('href') === `#${id}` ? '#0066FF' : '';
          });
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(s => sectionObserver.observe(s));
  }


  /* ---- Mobile hamburger menu ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileOverlay = document.getElementById('mobile-overlay');

  const toggleMenu = (open) => {
    hamburger.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', open);
    mobileNav.classList.toggle('is-open', open);
    mobileOverlay.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => {
    toggleMenu(!hamburger.classList.contains('is-open'));
  });

  mobileOverlay.addEventListener('click', () => toggleMenu(false));

  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => toggleMenu(false));
  });

  /* ---- Testimonial card quote highlight ---- */
  document.querySelectorAll('.testimonial-card').forEach(card => {
    const text = card.querySelector('.testimonial-text');
    card.addEventListener('mouseenter', () => {
      text.style.transition = 'color 0.3s';
      text.style.color = '#0F172A';
    });
    card.addEventListener('mouseleave', () => {
      text.style.color = '';
    });
  });

});
