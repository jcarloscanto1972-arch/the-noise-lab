/* ============================================================
   THE NOISE LAB — MASTER SCRIPT v2
   ============================================================ */

(function () {
  'use strict';

  /* ── CURSOR ─────────────────────────────────────────────── */
  var dot  = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');
  if (dot && ring) {
    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', function(e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });
    (function lerp() {
      rx += (mx - rx) * .12; ry += (my - ry) * .12;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(lerp);
    })();
    document.querySelectorAll('a, .filter-btn, .gallery-item, .duo-card').forEach(function(el) {
      el.addEventListener('mouseenter', function() { document.body.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function() { document.body.classList.remove('cursor-hover'); });
    });
  }

  /* ── SPLASH ─────────────────────────────────────────────── */
  var splash     = document.getElementById('splash');
  var splashBtn  = document.getElementById('splash-enter');
  var progBar    = document.querySelector('.splash-progress-bar');
  if (splash) {
    var container = splash.querySelector('.splash-particles');
    if (container) {
      for (var i = 0; i < 50; i++) {
        var p = document.createElement('div');
        p.className = 'splash-particle';
        p.style.cssText = 'left:' + (Math.random()*100) + '%;top:' + (Math.random()*100+100) + '%;width:' + (Math.random()*3+1) + 'px;height:' + (Math.random()*3+1) + 'px;animation-duration:' + (Math.random()*8+6) + 's;animation-delay:' + (Math.random()*5) + 's;';
        container.appendChild(p);
      }
    }
    var entered = false, prog = 0, rafId, dur = 4000, t0 = Date.now();
    function enterSite() {
      if (entered) return;
      entered = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (progBar) progBar.style.width = '100%';
      sessionStorage.setItem('visited','1');
      splash.classList.add('hide');
      setTimeout(function() { if (splash.parentNode) splash.parentNode.removeChild(splash); }, 900);
    }
    function tick() {
      if (entered) return;
      prog = Math.min(((Date.now()-t0)/dur)*100, 100);
      if (progBar) progBar.style.width = prog + '%';
      if (prog < 100) { rafId = requestAnimationFrame(tick); } else { enterSite(); }
    }
    requestAnimationFrame(tick);
    if (splashBtn) splashBtn.addEventListener('click', enterSite);
  }

  /* ── NAVBAR SCROLL ──────────────────────────────────────── */
  var navbar = document.getElementById('navbar');
  if (navbar) {
    function onScroll() { navbar.classList.toggle('scrolled', window.scrollY > 40); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    var hamburger = navbar.querySelector('.nav-hamburger');
    var mobileNav = document.querySelector('.nav-mobile');
    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', function() {
        var open = navbar.classList.toggle('nav-open');
        mobileNav.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
      });
    }
  }

  /* ── SCROLL REVEAL ──────────────────────────────────────── */
  var revealObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function(el) { revealObs.observe(el); });

  /* ── COUNTERS ───────────────────────────────────────────── */
  var countObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      var target = parseInt(el.dataset.count, 10);
      var suffix = el.dataset.suffix || '';
      var dur2 = 1800, st = Date.now();
      (function tick() {
        var prog2 = Math.min((Date.now()-st)/dur2, 1);
        el.textContent = Math.round((1-Math.pow(1-prog2,3))*target) + suffix;
        if (prog2 < 1) requestAnimationFrame(tick);
      })();
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(function(el) { countObs.observe(el); });

  /* ── PAGE TRANSITION ────────────────────────────────────── */
  var overlay = document.getElementById('page-transition');
  if (overlay) {
    document.querySelectorAll('a[href]').forEach(function(a) {
      var href = a.getAttribute('href');
      // IMPORTANT: skip accordion buttons and anchor links
      if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto')) return;
      // Skip if inside nav-accordion (let accordion handle those)
      if (a.closest('.nav-accordion-menu') || a.closest('.nav-mobile-sub-group')) {
        // Still navigate but without transition delay to avoid conflict
        return;
      }
      a.addEventListener('click', function(e) {
        e.preventDefault();
        overlay.classList.add('active');
        var dest = href;
        setTimeout(function() { window.location.href = dest; }, 300);
      });
    });
    window.addEventListener('pageshow', function() { overlay.classList.remove('active'); });
  }

  /* ── GALLERY FILTERS ────────────────────────────────────── */
  var filterBtns   = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length) {
    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.dataset.filter;
        galleryItems.forEach(function(item) {
          item.style.display = (filter === 'all' || item.dataset.cat === filter) ? '' : 'none';
        });
      });
    });
  }

  /* ── LIGHTBOX ───────────────────────────────────────────── */
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var imgWrap = lightbox.querySelector('.lightbox-img-placeholder');
    var counter = lightbox.querySelector('.lightbox-counter');
    var items   = Array.from(galleryItems);
    var cur = 0;

    function lbOpen(i) {
      cur = i;
      var img = items[i] ? items[i].querySelector('img') : null;
      if (imgWrap) {
        imgWrap.innerHTML = '';
        imgWrap.removeAttribute('style');
        if (img && img.src) {
          var el = document.createElement('img');
          el.src = img.src; el.alt = img.alt || '';
          el.style.cssText = 'max-width:100%;max-height:80vh;border-radius:12px;object-fit:contain;display:block;';
          imgWrap.appendChild(el);
          imgWrap.style.cssText = 'display:flex;align-items:center;justify-content:center;background:transparent;border:none;min-width:60vw;';
        }
      }
      if (counter) counter.textContent = (i+1) + ' / ' + items.length;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function lbClose() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    items.forEach(function(item, i) { item.addEventListener('click', function() { lbOpen(i); }); });
    var lbBackdrop = lightbox.querySelector('.lightbox-backdrop');
    var lbClose_   = lightbox.querySelector('.lightbox-close');
    var lbPrev     = lightbox.querySelector('.lightbox-prev');
    var lbNext     = lightbox.querySelector('.lightbox-next');
    if (lbBackdrop) lbBackdrop.addEventListener('click', lbClose);
    if (lbClose_)   lbClose_.addEventListener('click', lbClose);
    if (lbPrev) lbPrev.addEventListener('click', function(e) { e.stopPropagation(); lbOpen((cur-1+items.length)%items.length); });
    if (lbNext) lbNext.addEventListener('click', function(e) { e.stopPropagation(); lbOpen((cur+1)%items.length); });
    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') lbClose();
      if (e.key === 'ArrowLeft')  lbOpen((cur-1+items.length)%items.length);
      if (e.key === 'ArrowRight') lbOpen((cur+1)%items.length);
    });
  }

  /* ── BOOKING FORM ───────────────────────────────────────── */
  var form = document.getElementById('booking-form');
  if (form) {
    var successEl = document.querySelector('.form-success');
    function validate(field) {
      var val = field.value.trim();
      var errEl = field.parentElement.querySelector('.form-error');
      var error = '';
      if (field.required && !val) error = 'Este campo es requerido.';
      else if (field.type==='email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) error = 'Email inválido.';
      field.classList.toggle('error', !!error);
      if (errEl) errEl.textContent = error;
      return !error;
    }
    form.querySelectorAll('.form-input,.form-select,.form-textarea').forEach(function(f) {
      f.addEventListener('blur', function() { validate(f); });
      f.addEventListener('input', function() { if (f.classList.contains('error')) validate(f); });
    });
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('.form-input,.form-select,.form-textarea').forEach(function(f) { if (!validate(f)) valid = false; });
      if (!valid) return;
      var btn = form.querySelector('.form-submit');
      btn.textContent = 'Enviando…'; btn.disabled = true;
      setTimeout(function() { form.style.display='none'; if (successEl) successEl.classList.add('show'); }, 1200);
    });
  }

})();

/* ── NAV ACCORDION ──────────────────────────────────────────
   Runs AFTER DOM is ready. Handles desktop + mobile accordions.
   Uses stopPropagation so page-transition doesn't interfere.
   ─────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {

  /* Desktop */
  document.querySelectorAll('.nav-accordion-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var menu   = btn.nextElementSibling;
      var isOpen = menu && menu.classList.contains('open');
      /* Close all */
      document.querySelectorAll('.nav-accordion-menu').forEach(function(m) { m.classList.remove('open'); });
      document.querySelectorAll('.nav-accordion-btn').forEach(function(b) { b.setAttribute('aria-expanded','false'); });
      /* Open this one if it was closed */
      if (!isOpen && menu) {
        menu.classList.add('open');
        btn.setAttribute('aria-expanded','true');
      }
    });
  });

  /* Close on outside click */
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-accordion')) {
      document.querySelectorAll('.nav-accordion-menu').forEach(function(m) { m.classList.remove('open'); });
      document.querySelectorAll('.nav-accordion-btn').forEach(function(b) { b.setAttribute('aria-expanded','false'); });
    }
  });

  /* Mobile */
  document.querySelectorAll('.nav-mobile-accordion').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var group  = btn.nextElementSibling;
      var isOpen = group && group.classList.contains('open');
      document.querySelectorAll('.nav-mobile-sub-group').forEach(function(g) { g.classList.remove('open'); });
      document.querySelectorAll('.nav-mobile-accordion').forEach(function(b) { b.setAttribute('aria-expanded','false'); });
      if (!isOpen && group) {
        group.classList.add('open');
        btn.setAttribute('aria-expanded','true');
      }
    });
  });

  /* Close mobile nav when any link inside is clicked */
  var mobileNav = document.querySelector('.nav-mobile');
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        var nb = document.getElementById('navbar');
        if (nb) nb.classList.remove('nav-open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

});
