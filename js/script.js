/* ============================================================
   THE NOISE LAB — MASTER SCRIPT
   ============================================================ */

(function () {
  'use strict';

  /* ── CURSOR ────────────────────────────────────────────── */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (dot && ring) {
    let mx = -100, my = -100, rx = -100, ry = -100;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    (function lerp() {
      rx += (mx - rx) * .12;
      ry += (my - ry) * .12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(lerp);
    })();

    document.querySelectorAll('a, button, .gallery-item, .track-card, .release-card, .show-item, .event-row, .past-card, .filter-btn, .platform-btn')
      .forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });

    document.querySelectorAll('.hero-dj-frame, .about-portrait, .gallery-item img')
      .forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-img'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-img'));
      });
  }

  /* ── SPLASH ────────────────────────────────────────────── */
  const splash = document.getElementById('splash');
  const splashBtn = document.getElementById('splash-enter');
  const progressBar = document.querySelector('.splash-progress-bar');

  if (splash) {
    // Particles
    const container = splash.querySelector('.splash-particles');
    if (container) {
      for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        p.className = 'splash-particle';
        p.style.cssText = `
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100 + 100}%;
          width: ${Math.random() * 3 + 1}px;
          height: ${Math.random() * 3 + 1}px;
          animation-duration: ${Math.random() * 8 + 6}s;
          animation-delay: ${Math.random() * 5}s;
          opacity: ${Math.random() * .6 + .2};
        `;
        container.appendChild(p);
      }
    }

    let progress = 0;
    const duration = 3800;
    const start = Date.now();

    const tick = () => {
      progress = Math.min(((Date.now() - start) / duration) * 100, 100);
      if (progressBar) progressBar.style.width = progress + '%';
      if (progress < 100) requestAnimationFrame(tick);
      else enterSite();
    };
    requestAnimationFrame(tick);

    function enterSite() {
      splash.classList.add('hide');
      sessionStorage.setItem('visited', '1');
      setTimeout(() => splash.remove(), 900);
    }

    if (splashBtn) splashBtn.addEventListener('click', enterSite);
  }

  /* ── NAVBAR ────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Highlight active link
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    navbar.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });

    // Mobile menu
    const hamburger = navbar.querySelector('.nav-hamburger');
    const mobileNav = document.querySelector('.nav-mobile');
    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', () => {
        const open = navbar.classList.toggle('nav-open');
        mobileNav.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
      });
      mobileNav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          navbar.classList.remove('nav-open');
          mobileNav.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }
  }

  /* ── SCROLL REVEAL ─────────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── COUNTER ANIMATION ─────────────────────────────────── */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1800;
      const start = Date.now();
      const suffix = el.dataset.suffix || '';
      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      tick();
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  /* ── PAGE TRANSITIONS ──────────────────────────────────── */
  const overlay = document.getElementById('page-transition');
  if (overlay) {
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
      a.addEventListener('click', e => {
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 420);
      });
    });
    window.addEventListener('pageshow', () => {
      overlay.classList.remove('active');
    });
  }

  /* ── TILT EFFECT ───────────────────────────────────────── */
  document.querySelectorAll('.pillar-card, .release-card, .set-card, .past-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - .5;
      const y = (e.clientY - rect.top)  / rect.height - .5;
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── GALLERY ───────────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        galleryItems.forEach(item => {
          const show = filter === 'all' || item.dataset.cat === filter;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ── LIGHTBOX ──────────────────────────────────────────── */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const counter  = lightbox.querySelector('.lightbox-counter');
    const imgWrap  = lightbox.querySelector('.lightbox-img-placeholder');
    const items    = Array.from(galleryItems);
    let currentIndex = 0;

    function openLightbox(index) {
      currentIndex = index;
      const item = items[index];

      // Get image src from the gallery item
      const img = item.querySelector('img');
      const src = img ? img.src : null;
      const alt = img ? img.alt : '';

      // Clear and rebuild lightbox content
      if (imgWrap) {
        imgWrap.innerHTML = '';
        if (src) {
          const el = document.createElement('img');
          el.src = src;
          el.alt = alt;
          el.style.cssText = 'max-width:100%;max-height:80vh;border-radius:12px;display:block;object-fit:contain;';
          imgWrap.appendChild(el);
          imgWrap.style.cssText = 'display:flex;align-items:center;justify-content:center;background:transparent;border:none;';
        } else {
          imgWrap.innerHTML = '<span style="color:#fff;opacity:.4">Sin imagen</span>';
        }
      }

      if (counter) counter.textContent = `${index + 1} / ${items.length}`;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
    });

    lightbox.querySelector('.lightbox-backdrop')?.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);

    lightbox.querySelector('.lightbox-prev')?.addEventListener('click', e => {
      e.stopPropagation();
      openLightbox((currentIndex - 1 + items.length) % items.length);
    });

    lightbox.querySelector('.lightbox-next')?.addEventListener('click', e => {
      e.stopPropagation();
      openLightbox((currentIndex + 1) % items.length);
    });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  openLightbox((currentIndex - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') openLightbox((currentIndex + 1) % items.length);
    });
  }

  /* ── BOOKING FORM ──────────────────────────────────────── */
  const form = document.getElementById('booking-form');
  if (form) {
    const successEl = document.querySelector('.form-success');

    function validate(field) {
      const value = field.value.trim();
      const errEl = field.parentElement.querySelector('.form-error');
      let error = '';
      if (field.required && !value) error = 'This field is required.';
      else if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Enter a valid email.';
      field.classList.toggle('error', !!error);
      if (errEl) errEl.textContent = error;
      return !error;
    }

    form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(f => {
      f.addEventListener('blur', () => validate(f));
      f.addEventListener('input', () => {
        if (f.classList.contains('error')) validate(f);
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const fields = form.querySelectorAll('.form-input, .form-select, .form-textarea');
      let valid = true;
      fields.forEach(f => { if (!validate(f)) valid = false; });
      if (!valid) return;
      const submitBtn = form.querySelector('.form-submit');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;
      setTimeout(() => {
        form.style.display = 'none';
        if (successEl) successEl.classList.add('show');
      }, 1200);
    });
  }

  /* ── TRACK PLAY TOGGLE ─────────────────────────────────── */
  document.querySelectorAll('.track-play').forEach(btn => {
    btn.addEventListener('click', () => {
      const wasPlaying = btn.classList.contains('playing');
      document.querySelectorAll('.track-play').forEach(b => {
        b.classList.remove('playing');
        b.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
      });
      if (!wasPlaying) {
        btn.classList.add('playing');
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
      }
    });
  });

  /* ── LAZY IMAGES ───────────────────────────────────────── */
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (!img.dataset.src) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        img.src = img.dataset.src;
        obs.unobserve(img);
      }
    });
    obs.observe(img);
  });

})();