/* =================================================================
   ALEKSANDAR ANIČIĆ — PORTFOLIO
   Vanilla JS — no libraries.
   ================================================================= */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer        = window.matchMedia('(pointer: fine)').matches;

  /* ---------------------------------------------------------------
     1. PAGE LOADER — premium counter + progress bar
     --------------------------------------------------------------- */
  const loader         = document.getElementById('loader');
  const loaderCount    = document.getElementById('loaderCount');
  const loaderProgress = document.getElementById('loaderProgress');

  if (loader && !prefersReducedMotion) {
    // Glatko punjenje 0 → 100 za 1.5s (kao GSAP power2.inOut)
    const duration = 2600;
    const exitDelay = 450;
    const startTime = performance.now();

    // power2.inOut ease - sporo start, brzo sredina, sporo kraj
    const ease = (t) => t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const tick = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const pct = ease(t) * 100;

      const display = Math.floor(pct);
      if (loaderCount) {
        loaderCount.textContent = display < 10 ? '0' + display : String(display);
      }
      if (loaderProgress) {
        loaderProgress.style.width = pct + '%';
      }

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        // Punjenje zavrseno - kratak delay pa exit
        setTimeout(() => {
          loader.classList.add('is-done');
          document.body.classList.add('is-ready');
          setTimeout(() => loader.remove(), 1200);
        }, exitDelay);
      }
    };
    requestAnimationFrame(tick);
  } else if (loader) {
    loader.remove();
    document.body.classList.add('is-ready');
  }

  /* ---------------------------------------------------------------
     2. CUSTOM CURSOR
     --------------------------------------------------------------- */
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (dot && ring && isFinePointer) {
    let mx = window.innerWidth / 2,  my = window.innerHeight / 2;
    let dx = mx, dy = my;
    let rx = mx, ry = my;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      dot.classList.add('is-hidden');
      ring.classList.add('is-hidden');
    });
    document.addEventListener('mouseenter', () => {
      dot.classList.remove('is-hidden');
      ring.classList.remove('is-hidden');
    });

    const render = () => {
      dx += (mx - dx) * 0.35;
      dy += (my - dy) * 0.35;
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform  = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(render);
    };
    render();

    const linkSel = 'a, button, [data-cursor="link"], [data-cursor="view"]';
    document.querySelectorAll(linkSel).forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('is-link');
        ring.classList.add('is-link');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('is-link');
        ring.classList.remove('is-link');
      });
    });
  }

  /* ---------------------------------------------------------------
     3. STICKY HEADER
     --------------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScrollHeader = () => {
      if (window.scrollY > 30) header.classList.add('is-scrolled');
      else                     header.classList.remove('is-scrolled');
    };
    window.addEventListener('scroll', onScrollHeader, { passive: true });
    onScrollHeader();
  }

  /* ---------------------------------------------------------------
     4. MAGNETIC HOVER
     --------------------------------------------------------------- */
  if (isFinePointer && !prefersReducedMotion) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      const strength = 0.25;
      const max = 8;

      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * strength;
        const y = (e.clientY - (r.top  + r.height / 2)) * strength;
        const cx = Math.max(-max, Math.min(max, x));
        const cy = Math.max(-max, Math.min(max, y));
        el.style.transform = `translate(${cx}px, ${cy}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ---------------------------------------------------------------
     5. HERO CARD PARALLAX
     --------------------------------------------------------------- */
  const heroCard = document.getElementById('heroCard');
  if (heroCard && !prefersReducedMotion) {
    const onScrollParallax = () => {
      const y = window.scrollY;
      const offset = Math.min(y * 0.18, 200);
      heroCard.style.translate = `0 ${offset}px`;
    };
    window.addEventListener('scroll', onScrollParallax, { passive: true });
    onScrollParallax();
  }

  /* ---------------------------------------------------------------
     5b. GENERIC DATA-PARALLAX
     --------------------------------------------------------------- */
  const parallaxItems = Array.from(document.querySelectorAll('[data-parallax]'));
  if (parallaxItems.length && !prefersReducedMotion) {
    let viewportH = window.innerHeight;
    window.addEventListener('resize', () => { viewportH = window.innerHeight; }, { passive: true });

    const updateParallax = () => {
      for (const el of parallaxItems) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > viewportH + 200) continue;

        const strength = parseFloat(el.dataset.parallax) || 0.1;
        const elCenter = rect.top + rect.height / 2;
        const viewCenter = viewportH / 2;
        const delta = (elCenter - viewCenter) * -strength;

        const target = el.querySelector('img') || el;
        target.style.transform = `translate3d(0, ${delta.toFixed(2)}px, 0)`;
      }
    };

    let ticking = false;
    const onScrollParallaxItems = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScrollParallaxItems, { passive: true });
    updateParallax();
  }

  /* ---------------------------------------------------------------
     5c. VIDEO PLAYER
     --------------------------------------------------------------- */
  const vplayer = document.getElementById('vplayer');
  const vvideo  = document.getElementById('vplayerVideo');

  if (vplayer && vvideo) {
    const muteBtn = vplayer.querySelector('.vplayer__mute');

    const togglePlay = () => {
      if (vvideo.paused || vvideo.ended) {
        const p = vvideo.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
        vplayer.classList.add('is-playing');
      } else {
        vvideo.pause();
        vplayer.classList.remove('is-playing');
      }
    };

    const toggleMute = (e) => {
      if (e) e.stopPropagation();
      vvideo.muted = !vvideo.muted;
      vplayer.setAttribute('aria-pressed', vvideo.muted ? 'true' : 'false');
    };

    vplayer.addEventListener('click', (e) => {
      if (e.target.closest('.vplayer__mute')) return;
      togglePlay();
    });

    vplayer.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        togglePlay();
      }
    });

    if (muteBtn) {
      muteBtn.addEventListener('click', toggleMute);
    }

    const offscreenObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && !vvideo.paused) {
          vvideo.pause();
          vplayer.classList.remove('is-playing');
        }
      });
    }, { threshold: 0 });
    offscreenObs.observe(vplayer);

    vvideo.addEventListener('play',  () => vplayer.classList.add('is-playing'));
    vvideo.addEventListener('pause', () => vplayer.classList.remove('is-playing'));
    vvideo.addEventListener('ended', () => vplayer.classList.remove('is-playing'));

    vplayer.setAttribute('aria-pressed', vvideo.muted ? 'true' : 'false');
  }

  /* ---------------------------------------------------------------
     6. SPLIT TEXT
     --------------------------------------------------------------- */
  const splitTargets = document.querySelectorAll('[data-split]');
  splitTargets.forEach(el => {
    const splitNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text.trim()) return [node];
        const frag = document.createDocumentFragment();
        const words = text.split(/(\s+)/);
        words.forEach(w => {
          if (w.trim() === '') {
            frag.appendChild(document.createTextNode(w));
          } else {
            const span = document.createElement('span');
            span.className = 'split-word';
            span.textContent = w;
            frag.appendChild(span);
          }
        });
        node.parentNode.replaceChild(frag, node);
        return Array.from(frag.childNodes);
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const children = Array.from(node.childNodes);
        children.forEach(splitNode);
      }
      return [node];
    };

    const blockChildren = Array.from(el.children).filter(c =>
      getComputedStyle(c).display === 'block' || c.classList.contains('line')
    );

    if (blockChildren.length > 0) {
      blockChildren.forEach(line => {
        line.classList.add('split-line');
        Array.from(line.childNodes).forEach(splitNode);
      });
    } else {
      const line = document.createElement('span');
      line.className = 'split-line';
      while (el.firstChild) line.appendChild(el.firstChild);
      el.appendChild(line);
      Array.from(line.childNodes).forEach(splitNode);
    }

    const words = el.querySelectorAll('.split-word');
    words.forEach((w, i) => {
      w.style.transitionDelay = `${i * 35}ms`;
    });
  });

  /* ---------------------------------------------------------------
     7. INTERSECTION OBSERVER — reveals + split lines
     --------------------------------------------------------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      if (el.matches('[data-reveal]')) {
        el.classList.add('is-in');
      }

      if (el.matches('.split-line')) {
        el.classList.add('is-in');
      }

      io.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('[data-reveal], .split-line').forEach(el => io.observe(el));

  /* ---------------------------------------------------------------
     7b. COUNT-UP OBSERVER
     --------------------------------------------------------------- */
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const countObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        statsSection.querySelectorAll('.count').forEach(el => {
          if (!el.dataset.animated) {
            el.dataset.animated = 'true';
            animateCount(el);
          }
        });
        countObs.unobserve(entry.target);
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -50px 0px' });
    countObs.observe(statsSection);
  }

  /* ---------------------------------------------------------------
     7c. SAFETY FALLBACK za count animaciju
     --------------------------------------------------------------- */
  const safetyCheck = () => {
    if (!statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      statsSection.querySelectorAll('.count').forEach(el => {
        if (!el.dataset.animated) {
          el.dataset.animated = 'true';
          animateCount(el);
        }
      });
      window.removeEventListener('scroll', safetyCheck);
    }
  };
  window.addEventListener('scroll', safetyCheck, { passive: true });
  setTimeout(safetyCheck, 500);

  /* ---------------------------------------------------------------
     8. COUNT-UP
     --------------------------------------------------------------- */
  function animateCount(el) {
    if (prefersReducedMotion) {
      el.textContent = el.dataset.target;
      return;
    }
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 1500;
    const start = performance.now();

    const ease = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const v = Math.floor(ease(t) * target);
      el.textContent = v;
      if (t < 1) requestAnimationFrame(step);
      else      el.textContent = target;
    };
    requestAnimationFrame(step);
  }

  /* ---------------------------------------------------------------
     9. SAFETY — ako loader ostane zaglavljen
     --------------------------------------------------------------- */
  setTimeout(() => {
    const l = document.getElementById('loader');
    if (l) {
      l.classList.add('is-done');
      document.body.classList.add('is-ready');
      setTimeout(() => l.remove && l.remove(), 1200);
    } else {
      document.body.classList.add('is-ready');
    }
  }, 4000);
/* =====================================================================
   MOBILE NAV — TOGGLE HANDLER
   ---------------------------------------------------------------------
   Dodaje se na KRAJ js/main.js, ODMAH PRE poslednje zatvarajuce
   })(); strele (tj. pre kraja IIFE-a).
   ===================================================================== */

  /* ---------------------------------------------------------------
     10. MOBILE NAV OVERLAY
     --------------------------------------------------------------- */
  const mnavToggle  = document.getElementById('mnavToggle');
  const mnavOverlay = document.getElementById('mnavOverlay');

  if (mnavToggle && mnavOverlay) {

    const openMenu = () => {
      mnavOverlay.setAttribute('data-open', 'true');
      mnavOverlay.setAttribute('aria-hidden', 'false');
      mnavToggle.setAttribute('aria-expanded', 'true');
      mnavToggle.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('mnav-open');
    };

    const closeMenu = () => {
      mnavOverlay.setAttribute('data-open', 'false');
      mnavOverlay.setAttribute('aria-hidden', 'true');
      mnavToggle.setAttribute('aria-expanded', 'false');
      mnavToggle.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('mnav-open');
    };

    const toggleMenu = () => {
      const isOpen = mnavToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeMenu();
      else        openMenu();
    };

    mnavToggle.addEventListener('click', toggleMenu);

    /* Klik na bilo koji link u overlay-u zatvara meni */
    mnavOverlay.querySelectorAll('[data-mnav-link]').forEach((a) => {
      a.addEventListener('click', () => {
        /* Mali delay da se native scroll trigger uhvati pre nestanka overlay-a */
        setTimeout(closeMenu, 50);
      });
    });

    /* Escape zatvara meni */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' &&
          mnavToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        mnavToggle.focus();
      }
    });

    /* Ako se prozor proširi preko mobile breakpoint-a — zatvori meni */
    const mqDesktop = window.matchMedia('(min-width: 769px)');
    const onMqChange = (ev) => {
      if (ev.matches) closeMenu();
    };
    if (typeof mqDesktop.addEventListener === 'function') {
      mqDesktop.addEventListener('change', onMqChange);
    } else if (typeof mqDesktop.addListener === 'function') {
      mqDesktop.addListener(onMqChange);
    }
  }
})();