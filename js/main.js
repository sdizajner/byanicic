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
        (Skip na mobilnom — preloader off za uske ekrane)
        (Skip i kad se prelazi sa linka unutar sajta — preloader se
         pokrece samo jednom, pri stvarnom ulasku na byanicic.com,
         a ne pri svakom klikom na interni link/podstranicu)
     --------------------------------------------------------------- */
  const loader         = document.getElementById('loader');
  const loaderCount    = document.getElementById('loaderCount');
  const loaderProgress = document.getElementById('loaderProgress');

  // Mobile detection — ista granica kao @media (max-width: 768px)
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  // Da li je posetilac vec "usao" na sajt u ovoj sesiji (tab-u)?
  // sessionStorage prezivljava navigaciju izmedju stranica, ali se
  // gasi kad se tab/browser zatvori — tako da se preloader ponovo
  // pokrece samo pri sledecem stvarnom ulasku na sajt.
  let hasEnteredSite = false;
  try {
    hasEnteredSite = sessionStorage.getItem('bacSiteEntered') === '1';
  } catch (e) {
    // privatni mod / blokiran storage — ponasaj se kao da nije ulazio
    hasEnteredSite = false;
  }
  try {
    sessionStorage.setItem('bacSiteEntered', '1');
  } catch (e) { /* ignorisi ako storage nije dostupan */ }

  if (isMobile || hasEnteredSite) {
    // Na mobilnom, ili kad je posetilac vec usao na sajt ranije u ovoj
    // sesiji (dosao je klikom sa neke druge stranice sajta) — ne
    // pokrecemo preloader animaciju, odmah aktiviramo hero stanje.
    if (loader) loader.remove();
    document.body.classList.add('is-ready');
  } else if (loader && !prefersReducedMotion) {
    // Desktop sa animacijama — originalna premium animacija ostaje.
    const duration = 2600;
    const exitDelay = 450;
    const startTime = performance.now();

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

    const playBtn = vplayer.querySelector('.vplayer__play');

    /* Pristupacno ime dugmeta prati stanje (WCAG 4.1.2).
       Tekst se cita iz data- atributa pa radi na oba jezika. */
    const labelPlay  = (playBtn && playBtn.dataset.labelPlay)  || 'Play video';
    const labelPause = (playBtn && playBtn.dataset.labelPause) || 'Pause video';

    const syncPlayLabel = () => {
      if (!playBtn) return;
      playBtn.setAttribute('aria-label', vvideo.paused ? labelPlay : labelPause);
    };

    const togglePlay = () => {
      if (vvideo.paused || vvideo.ended) {
        const p = vvideo.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
        vplayer.classList.add('is-playing');
      } else {
        vvideo.pause();
        vplayer.classList.remove('is-playing');
      }
      syncPlayLabel();
    };

    const toggleMute = (e) => {
      if (e) e.stopPropagation();
      vvideo.muted = !vvideo.muted;
      /* aria-pressed pripada samom dugmetu, ne omotacu */
      if (muteBtn) muteBtn.setAttribute('aria-pressed', vvideo.muted ? 'true' : 'false');
    };

    /* Omotac vise nije role="button" — klik mišem i dalje radi,
       ali je pravi kontrol <button class="vplayer__play">, pa nema
       ugnjezdenih interaktivnih elemenata. */
    vplayer.addEventListener('click', (e) => {
      if (e.target.closest('.vplayer__mute')) return;
      togglePlay();
    });

    if (muteBtn) {
      muteBtn.addEventListener('click', toggleMute);
    }

    syncPlayLabel();

    const offscreenObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && !vvideo.paused) {
          vvideo.pause();
          vplayer.classList.remove('is-playing');
        }
      });
    }, { threshold: 0 });
    offscreenObs.observe(vplayer);

    vvideo.addEventListener('play',  () => { vplayer.classList.add('is-playing'); syncPlayLabel(); });
    vvideo.addEventListener('pause', () => { vplayer.classList.remove('is-playing'); syncPlayLabel(); });
    vvideo.addEventListener('ended', () => { vplayer.classList.remove('is-playing'); syncPlayLabel(); });

    if (muteBtn) muteBtn.setAttribute('aria-pressed', vvideo.muted ? 'true' : 'false');
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

  /* ---------------------------------------------------------------
     10. MOBILE NAV OVERLAY
     --------------------------------------------------------------- */
  const mnavToggle  = document.getElementById('mnavToggle');
  const mnavOverlay = document.getElementById('mnavOverlay');

  if (mnavToggle && mnavOverlay) {

    /* Natpisi za citace ekrana — uzimaju se iz data- atributa dugmeta
       da bi radili i na srpskoj verziji; fallback je engleski. */
    const labelOpen  = mnavToggle.dataset.labelOpen  || 'Open menu';
    const labelClose = mnavToggle.dataset.labelClose || 'Close menu';

    const FOCUSABLE =
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const focusablesIn = () =>
      Array.from(mnavOverlay.querySelectorAll(FOCUSABLE))
        .filter(el => el.offsetParent !== null || el.getClientRects().length);

    const openMenu = () => {
      mnavOverlay.setAttribute('data-open', 'true');
      mnavOverlay.setAttribute('aria-hidden', 'false');
      mnavToggle.setAttribute('aria-expanded', 'true');
      mnavToggle.setAttribute('aria-label', labelClose);
      document.body.classList.add('mnav-open');

      /* Fokus ulazi u meni (WCAG 2.4.3). Overlay ima CSS tranziciju,
         pa prvi element postaje fokusabilan tek posle nje. */
      window.setTimeout(() => {
        const first = focusablesIn()[0];
        if (first) first.focus();
      }, 60);
    };

    const closeMenu = () => {
      mnavOverlay.setAttribute('data-open', 'false');
      mnavOverlay.setAttribute('aria-hidden', 'true');
      mnavToggle.setAttribute('aria-expanded', 'false');
      mnavToggle.setAttribute('aria-label', labelOpen);
      document.body.classList.remove('mnav-open');

      /* Ako je fokus bio u meniju, vrati ga na dugme koje ga je otvorilo */
      if (mnavOverlay.contains(document.activeElement)) mnavToggle.focus();
    };

    /* Zadrzavanje fokusa unutar otvorenog menija — bez toga Tab odlazi
       na sadrzaj iza overlay-a koji korisnik ne vidi. */
    mnavOverlay.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      if (mnavToggle.getAttribute('aria-expanded') !== 'true') return;

      const items = focusablesIn();
      if (!items.length) return;

      const first = items[0];
      const last  = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    const toggleMenu = () => {
      const isOpen = mnavToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeMenu();
      else        openMenu();
    };

    mnavToggle.addEventListener('click', toggleMenu);

    /* Klik na bilo koji link u overlay-u zatvara meni */
    mnavOverlay.querySelectorAll('a[href]').forEach((a) => {
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
/* LANGUAGE FLOAT — pamcenje izbora jezika */
  const langFloatLinks = document.querySelectorAll('.language-float__item[data-lang-switch]');
  if (langFloatLinks.length) {
    langFloatLinks.forEach((link) => {
      link.addEventListener('click', () => {
        try {
          localStorage.setItem('preferredLang', link.dataset.langSwitch);
        } catch (e) {}
      });
    });

    try {
      const saved = localStorage.getItem('preferredLang');
      const currentIsSerbian = document.documentElement.lang.startsWith('sr');
      const justRedirected = sessionStorage.getItem('langRedirected');

      if (saved && !justRedirected) {
        if (saved === 'sr' && !currentIsSerbian) {
          sessionStorage.setItem('langRedirected', '1');
          window.location.replace('sr/index.html');
        } else if (saved === 'en' && currentIsSerbian) {
          sessionStorage.setItem('langRedirected', '1');
          window.location.replace('../index.html');
        }
      }
    } catch (e) {}
  }
  /* ---------------------------------------------------------------
   LANGUAGE SWITCHER — pamcenje izbora jezika
   Dodaje se unutar postojeceg (() => { ... })(); bloka u main.js,
   neposredno PRE zatvarajuceg })();
   Pokriva i floating dugme i hamburger-meni varijantu.
   --------------------------------------------------------------- */
  const langLinks = document.querySelectorAll(
    '.language-float__item[data-lang-switch], .mnav-overlay__lang-item[data-lang-switch]'
  );

  if (langLinks.length) {
    langLinks.forEach((link) => {
      link.addEventListener('click', () => {
        try {
          localStorage.setItem('preferredLang', link.dataset.langSwitch);
        } catch (e) {}
      });
    });

    try {
      const saved = localStorage.getItem('preferredLang');
      const currentIsSerbian = document.documentElement.lang.startsWith('sr');
      const justRedirected = sessionStorage.getItem('langRedirected');

      if (saved && !justRedirected) {
        if (saved === 'sr' && !currentIsSerbian) {
          sessionStorage.setItem('langRedirected', '1');
          window.location.replace('sr/index.html');
        } else if (saved === 'en' && currentIsSerbian) {
          sessionStorage.setItem('langRedirected', '1');
          window.location.replace('../index.html');
        }
      }
    } catch (e) {}
  }

  /* ---------------------------------------------------------------
     HERO STRIP — blagi auto-scroll karusel (samo mobilni)
     Traka se sama, sporo pomera; cim je korisnik dodirne/prevuce
     prstom (ili scroll-uje misem), auto-pomeranje pauzira na par
     sekundi i ostavlja mu punu rucnu kontrolu (native scroll).
     --------------------------------------------------------------- */
  (() => {
    const carousel = document.querySelector('.hero__strip-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.hero__strip-track');
    if (!track) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const SPEED = 0.32; // px po frejmu — namerno sporo, "premium" tempo
    const RESUME_DELAY = 2600; // ms pauze posle poslednjeg dodira

    let rafId = null;
    let paused = false;
    let resumeTimer = null;

    const isMobileNow = () => window.matchMedia('(max-width: 768px)').matches;

    function step() {
      if (!paused && isMobileNow()) {
        const half = track.scrollWidth; // sirina jednog (od dva identicna) seta linkova
        carousel.scrollLeft += SPEED;
        if (carousel.scrollLeft >= half) {
          carousel.scrollLeft -= half;
        }
      }
      rafId = requestAnimationFrame(step);
    }

    function pauseForAWhile() {
      paused = true;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { paused = false; }, RESUME_DELAY);
    }

    carousel.addEventListener('touchstart', pauseForAWhile, { passive: true });
    carousel.addEventListener('pointerdown', pauseForAWhile);
    carousel.addEventListener('wheel', pauseForAWhile, { passive: true });

    if (isMobileNow()) {
      rafId = requestAnimationFrame(step);
    }

    window.addEventListener('resize', () => {
      if (!isMobileNow() && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      } else if (isMobileNow() && !rafId) {
        rafId = requestAnimationFrame(step);
      }
    });
  })();

  /* ---------------------------------------------------------------
     TRUST CENTER — expandable cards
     Radi na svakoj stranici koja sadrzi .tcard blokove (trust-center.html,
     sr/trust-center.html i sve buduce Trust podstranice).
     Pristupacnost: pravi kontrol je <button aria-expanded>, panel se
     povezuje preko aria-controls, a klik bilo gde po headeru kartice
     samo prosledjuje akciju tom dugmetu.
     --------------------------------------------------------------- */
  (() => {
    const cards = Array.from(document.querySelectorAll('.tcard'));
    if (!cards.length) return;

    const setOpen = (card, open) => {
      const btn = card.querySelector('.tcard__toggle');
      if (!btn) return;
      card.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    cards.forEach((card) => {
      const btn = card.querySelector('.tcard__toggle');
      const head = card.querySelector('.tcard__head');
      if (!btn) return;

      const toggle = () => setOpen(card, btn.getAttribute('aria-expanded') !== 'true');

      btn.addEventListener('click', toggle);

      /* Ceo header je klikabilan, ali klik na samo dugme ne duplira akciju */
      if (head) {
        head.addEventListener('click', (e) => {
          if (e.target.closest('.tcard__toggle')) return;
          if (e.target.closest('a')) return;
          toggle();
        });
      }
    });

    /* Deep link: /trust-center.html#privacy otvara i fokusira tu sekciju */
    const openFromHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const card = document.getElementById(id);
      if (!card || !card.classList.contains('tcard')) return;
      setOpen(card, true);
      card.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'center'
      });
    };

    openFromHash();
    window.addEventListener('hashchange', openFromHash);
  })();
})();