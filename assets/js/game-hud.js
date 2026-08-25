/**
 * Game Dev HUD — Vanilla JS
 * Custom Cursor + Glitch + Card Tilt + Boot Preloader
 * Zero dependencies — Pure JS
 */
(function () {
  'use strict';

  /* ============================================================
     1. CUSTOM HUD CROSSHAIR CURSOR
     ============================================================ */
  const cursorOuter = document.getElementById('hud-cursor-outer');
  const cursorInner = document.getElementById('hud-cursor-inner');

  if (cursorOuter && cursorInner) {
    let mouseX = 0, mouseY = 0;
    let outerX = 0, outerY = 0;
    let rafId;

    // Smooth outer cursor lag
    const animateCursor = () => {
      outerX += (mouseX - outerX) * 0.12;
      outerY += (mouseY - outerY) * 0.12;
      cursorOuter.style.left = outerX + 'px';
      cursorOuter.style.top  = outerY + 'px';
      rafId = requestAnimationFrame(animateCursor);
    };
    animateCursor();

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Inner dot snaps instantly
      cursorInner.style.left = e.clientX + 'px';
      cursorInner.style.top  = e.clientY + 'px';
    });

    // Hover effect on interactive elements
    const hoverTargets = 'a, button, .filter-btn, .portfolio-card, .service-card, input, textarea, .nav-link, .social-icon-btn, .social-link-btn, .ovr-btn, label';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Click effect
    document.addEventListener('mousedown', () => {
      document.body.classList.add('cursor-click');
      cursorInner.classList.add('clicked');
    });
    document.addEventListener('mouseup', () => {
      document.body.classList.remove('cursor-click');
      cursorInner.classList.remove('clicked');
    });

    // Hide cursor when mouse leaves window
    document.addEventListener('mouseleave', () => {
      cursorOuter.style.opacity = '0';
      cursorInner.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorOuter.style.opacity = '1';
      cursorInner.style.opacity = '1';
    });
  }

  /* ============================================================
     2. GAME BOOT PRELOADER
     ============================================================ */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    // Build HUD preloader HTML
    preloader.innerHTML = `
      <div class="preloader-hud">
        <div class="preloader-logo-text">US</div>
        <div class="preloader-system-text">Game Developer Portfolio</div>
        <div style="display:flex;justify-content:space-between;width:100%;align-items:center;">
          <div class="preloader-status" id="pl-status">Initializing systems...</div>
          <div class="preloader-pct" id="pl-pct">0%</div>
        </div>
        <div class="preloader-bar-wrap">
          <div class="preloader-bar-fill" id="pl-bar"></div>
        </div>
        <div class="preloader-granted" id="pl-granted">ACCESS GRANTED</div>
      </div>
    `;

    const bar     = document.getElementById('pl-bar');
    const status  = document.getElementById('pl-status');
    const pct     = document.getElementById('pl-pct');
    const granted = document.getElementById('pl-granted');

    const steps = [
      { pct: 10, msg: 'Loading assets...' },
      { pct: 25, msg: 'Initializing engine...' },
      { pct: 45, msg: 'Compiling shaders...' },
      { pct: 60, msg: 'Loading portfolio data...' },
      { pct: 78, msg: 'Syncing systems...' },
      { pct: 90, msg: 'Authenticating user...' },
      { pct: 100, msg: 'Ready.' },
    ];

    let i = 0;
    const runStep = () => {
      if (i < steps.length) {
        const s = steps[i++];
        bar.style.width    = s.pct + '%';
        status.textContent = s.msg;
        pct.textContent    = s.pct + '%';

        if (s.pct === 100) {
          setTimeout(() => {
            granted.classList.add('show');
            setTimeout(() => {
              preloader.classList.add('hide');
              setTimeout(() => preloader.remove(), 550);
            }, 700);
          }, 300);
        } else {
          setTimeout(runStep, 200 + Math.random() * 250);
        }
      }
    };

    // Start after a tiny delay so page renders first
    setTimeout(runStep, 200);
  }

  /* ============================================================
     3. HERO TITLE GLITCH EFFECT
     ============================================================ */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    // Set data-text for CSS pseudo-elements
    const titleText = heroTitle.textContent.trim();
    heroTitle.setAttribute('data-text', titleText);

    const triggerGlitch = () => {
      heroTitle.classList.add('glitch-active');
      setTimeout(() => heroTitle.classList.remove('glitch-active'), 350);
    };

    // Trigger on load after 1.5s
    setTimeout(triggerGlitch, 1500);
    // Then every 6–12 seconds randomly
    const scheduleGlitch = () => {
      const delay = 6000 + Math.random() * 6000;
      setTimeout(() => {
        triggerGlitch();
        scheduleGlitch();
      }, delay);
    };
    scheduleGlitch();
  }

  /* ============================================================
     4. 3D CARD TILT EFFECT ON PORTFOLIO CARDS
     ============================================================ */
  const initTilt = () => {
    document.querySelectorAll('.portfolio-card').forEach(card => {
      const wrap = card.closest('.portfolio-item') || card;

      wrap.addEventListener('mousemove', (e) => {
        const rect  = card.getBoundingClientRect();
        const x     = e.clientX - rect.left;
        const y     = e.clientY - rect.top;
        const cx    = rect.width  / 2;
        const cy    = rect.height / 2;
        const rotX  = ((y - cy) / cy) * -8;  // max 8deg
        const rotY  = ((x - cx) / cx) *  8;

        card.style.transform   = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
        card.style.transition  = 'transform 0.05s ease';
      });

      wrap.addEventListener('mouseleave', () => {
        card.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
        card.style.transition = 'transform 0.4s ease';
      });
    });
  };

  // Init after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTilt);
  } else {
    initTilt();
  }

  /* ============================================================
     5. SKILL PROGRESS BARS — XP RANK LABELS
     ============================================================ */
  const getXpRank = (pct) => {
    if (pct >= 90) return 'EXPERT';
    if (pct >= 75) return 'SENIOR';
    if (pct >= 60) return 'PROFICIENT';
    if (pct >= 40) return 'JUNIOR';
    return 'NOVICE';
  };

  // Add rank labels to existing skill bars
  document.querySelectorAll('.skill-item').forEach(item => {
    const fill    = item.querySelector('.skill-fill');
    const pctEl   = item.querySelector('.skill-pct');
    if (!fill || !pctEl) return;

    const pctVal  = parseInt(fill.getAttribute('data-width') || '0');
    const rank    = getXpRank(pctVal);

    // Replace pct text with rank badge
    pctEl.textContent  = '';
    pctEl.innerHTML    = `<span class="skill-xp-rank">${rank}</span>`;
    pctEl.style.cssText = 'font-size:0;'; // hide old pct element visually handled by rank

    // Also rename the bar classes for HUD styling
    const bar = item.querySelector('.skill-bar');
    if (bar) {
      bar.classList.add('skill-xp-bar');
    }
    if (fill) {
      fill.classList.add('skill-xp-fill');
    }
  });

  /* ============================================================
     6. SECTION SKILL BADGES — inject below skill bars
     ============================================================ */
  const skillBadges = [
    { name: 'Unity 3D',      tier: 'tier-1' },
    { name: 'Unreal Engine', tier: 'tier-1' },
    { name: 'C#',            tier: 'tier-1' },
    { name: 'Photon',        tier: 'tier-2' },
    { name: 'Mirror Net',    tier: 'tier-2' },
    { name: 'AR Foundation', tier: 'tier-2' },
    { name: 'Oculus SDK',    tier: 'tier-2' },
    { name: 'Vuforia',       tier: 'tier-2' },
    { name: 'Blockchain',    tier: 'tier-3' },
    { name: 'ZED SDK',       tier: 'tier-2' },
    { name: 'ROS / ROS2',    tier: 'tier-3' },
    { name: 'Blender',       tier: 'tier-3' },
  ];

  const skillsWrap = document.querySelector('.skills-wrap');
  if (skillsWrap) {
    const grid = document.createElement('div');
    grid.className = 'skill-badges-grid';
    skillBadges.forEach(b => {
      const badge = document.createElement('span');
      badge.className = `skill-badge ${b.tier}`;
      badge.innerHTML = `<span class="sb-dot"></span>${b.name}`;
      grid.appendChild(badge);
    });
    skillsWrap.appendChild(grid);
  }

  /* ============================================================
     7. ANIMATED ENTRY FOR SKILL BADGES
     ============================================================ */
  const observeBadges = () => {
    if (!window.IntersectionObserver) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const badges = entry.target.querySelectorAll('.skill-badge');
          badges.forEach((b, i) => {
            b.style.opacity   = '0';
            b.style.transform = 'translateY(12px)';
            b.style.transition = `opacity 0.3s ease ${i * 50}ms, transform 0.3s ease ${i * 50}ms`;
            setTimeout(() => {
              b.style.opacity   = '1';
              b.style.transform = 'translateY(0)';
            }, 50);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const grid = document.querySelector('.skill-badges-grid');
    if (grid) observer.observe(grid.parentElement || grid);
  };

  window.addEventListener('load', observeBadges);

  /* ============================================================
     8. HUD STATUS — Live clock (safe, below navbar flex row)
     ============================================================ */
  const updateHudClock = () => {
    // Only on very large screens
    if (window.innerWidth < 1400) return;
    const header = document.getElementById('header');
    if (!header || document.getElementById('hud-clock')) return;
    const clock = document.createElement('div');
    clock.id = 'hud-clock';
    const s = clock.style;
    s.fontFamily    = 'Space Grotesk, monospace';
    s.fontSize      = '0.48rem';
    s.letterSpacing = '2px';
    s.color         = 'rgba(124,58,237,0.45)';
    s.position      = 'absolute';
    s.bottom        = '1px';
    s.left          = '50%';
    s.transform     = 'translateX(-50%)';
    s.pointerEvents = 'none';
    s.zIndex        = '1';
    s.whiteSpace    = 'nowrap';
    const tick = () => {
      const n = new Date();
      const pad = v => String(v).padStart(2, '0');
      clock.textContent = pad(n.getHours()) + ':' + pad(n.getMinutes()) + ':' + pad(n.getSeconds());
    };
    tick();
    setInterval(tick, 1000);
    header.appendChild(clock);
  };
  window.addEventListener('load', updateHudClock);

  /* ============================================================
     9. TERMINAL TEXT EFFECT on Section Tags (typewriter reveal)
     ============================================================ */
  const initSectionTagTypewriter = () => {
    if (!window.IntersectionObserver) return;

    const tags = document.querySelectorAll('.section-tag');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el  = entry.target;
          const txt = el.getAttribute('data-original') || el.textContent.trim();
          el.setAttribute('data-original', txt);
          el.textContent = '';
          let idx = 0;
          const type = () => {
            if (idx <= txt.length) {
              el.textContent = txt.slice(0, idx);
              idx++;
              setTimeout(type, 50);
            }
          };
          type();
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.8 });

    tags.forEach(t => observer.observe(t));
  };
  window.addEventListener('load', initSectionTagTypewriter);

  /* ============================================================
     10. AUDIO FEEDBACK (subtle — on click, only if user interacted)
     ============================================================ */
  let audioCtx = null;
  const playClick = () => {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc    = audioCtx.createOscillator();
      const gain   = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type      = 'square';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) { /* silently fail */ }
  };

  // Play on nav link clicks only — subtle
  document.querySelectorAll('.nav-link.scrollto, .filter-btn').forEach(el => {
    el.addEventListener('click', playClick);
  });

})();
