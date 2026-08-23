/**
 * portfolio.js
 * Handles: Particle Canvas | Portfolio Filter | Skill Bar Animations | AOS init
 */
(function () {
  'use strict';

  /* ── 1. AOS Init ─────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof AOS !== 'undefined') {
      AOS.init({ duration: 700, once: true, offset: 70, easing: 'ease-out-cubic' });
    }
  });

  /* ── 2. Particle Canvas ──────────────────────────── */
  window.addEventListener('load', function () {
    var canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, particles = [], raf;
    var COLORS = ['rgba(124,58,237,', 'rgba(6,182,212,', 'rgba(236,72,153,'];
    var COUNT  = Math.min(Math.floor(window.innerWidth / 14), 75);
    var DIST   = 120;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function Particle() { this.reset(true); }
    Particle.prototype.reset = function (init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 5;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = -(Math.random() * 0.35 + 0.1);
      this.r  = Math.random() * 1.6 + 0.5;
      this.a  = Math.random() * 0.5 + 0.2;
      var c   = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.col = c + this.a + ')';
      this.lcol = c + '0.14)';
    };
    Particle.prototype.update = function () {
      this.x += this.vx; this.y += this.vy;
      if (this.y < -5 || this.x < -5 || this.x > W + 5) this.reset(false);
    };
    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.col;
      ctx.fill();
    };

    for (var i = 0; i < COUNT; i++) particles.push(new Particle());

    function loop() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var d  = Math.sqrt(dx * dx + dy * dy);
          if (d < DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(124,58,237,' + (1 - d / DIST) * 0.16 + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(loop);
    }
    loop();

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) cancelAnimationFrame(raf);
      else loop();
    });
  });

  /* ── 3. Portfolio Filter ─────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    var btns  = document.querySelectorAll('.filter-btn');
    var items = document.querySelectorAll('.portfolio-item');
    if (!btns.length) return;

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var filter = btn.getAttribute('data-filter');

        items.forEach(function (item) {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = '';
            setTimeout(function () { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.92)';
            setTimeout(function () { item.style.display = 'none'; }, 350);
          }
        });
      });
    });
  });

  /* ── 4. Skill Bars (animate on scroll into view) ─── */
  document.addEventListener('DOMContentLoaded', function () {
    var fills = document.querySelectorAll('.skill-fill');
    if (!fills.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          setTimeout(function () {
            el.style.width = el.getAttribute('data-width') + '%';
          }, 200);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    fills.forEach(function (f) { observer.observe(f); });
  });

})();
