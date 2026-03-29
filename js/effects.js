/* ============================================================
   Premium Effects — violin-hime
   ============================================================ */
(function () {
  'use strict';

  /* ── Page Load Overlay ── */
  function initPageLoad() {
    const _lang  = localStorage.getItem('siteLanguage') || 'ja';
    const _title = _lang === 'en' ? 'Music World'
                 : _lang === 'zh' ? '音乐世界'
                 : 'ミュージックワールド';
    const overlay = document.createElement('div');
    overlay.id = 'fx-load-overlay';
    overlay.innerHTML =
      '<div class="fx-load-title">♪ &nbsp; ' + _title + ' &nbsp; ♪</div>' +
      '<div class="fx-load-note">𝄞</div>' +
      '<div class="fx-load-bar"><div class="fx-load-bar-fill"></div></div>';
    document.body.appendChild(overlay);
    window.addEventListener('load', function () {
      setTimeout(function () { overlay.classList.add('fx-hidden'); }, 400);
      setTimeout(function () { if (overlay.parentNode) overlay.remove(); }, 1200);
    });
  }

  /* ── Aurora Background ── */
  function initAurora() {
    const layer = document.createElement('div');
    layer.className = 'aurora-layer';
    layer.innerHTML =
      '<div class="aurora-blob"></div>' +
      '<div class="aurora-blob"></div>' +
      '<div class="aurora-blob"></div>';
    document.body.prepend(layer);
  }

  /* ── Custom Cursor ── */
  function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.body.classList.add('has-custom-cursor');

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    let mx = 0, my = 0, rx = 0, ry = 0;
    let lastTrailTime = 0;
    const trailColors = ['#c9a227', '#e8c96a', '#f48fb1', '#e8d5f5'];

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';

      const now = Date.now();
      if (now - lastTrailTime > 40) {
        lastTrailTime = now;
        spawnTrail(mx, my);
      }
    });

    (function animRing() {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    })();

    var interactiveSel = 'a, button, .card, .btn, input, select, [role="button"], label';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(interactiveSel)) {
        ring.classList.add('on-interactive');
        dot.style.transform = 'translate(-50%,-50%) scale(1.8)';
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(interactiveSel)) {
        ring.classList.remove('on-interactive');
        dot.style.transform = 'translate(-50%,-50%) scale(1)';
      }
    });
  }

  function spawnTrail(x, y) {
    var colors = ['#c9a227', '#e8c96a', '#f48fb1', '#e8d5f5', '#ffffff'];
    var t = document.createElement('div');
    t.className = 'cursor-trail';
    var size = Math.random() * 5 + 3;
    t.style.width  = size + 'px';
    t.style.height = size + 'px';
    t.style.left = (x + (Math.random() - 0.5) * 14) + 'px';
    t.style.top  = (y + (Math.random() - 0.5) * 14) + 'px';
    t.style.background = colors[Math.floor(Math.random() * colors.length)];
    t.style.boxShadow = '0 0 4px ' + t.style.background;
    document.body.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.remove(); }, 560);
  }

  /* ── Card 3D Tilt + Gloss ── */
  function initCardTilt() {
    document.querySelectorAll('.card, .info-card').forEach(function (card) {
      // inject gloss element
      if (!card.querySelector('.card-gloss')) {
        var gloss = document.createElement('div');
        gloss.className = 'card-gloss';
        card.appendChild(gloss);
      }

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var xPct = (e.clientX - rect.left) / rect.width;
        var yPct = (e.clientY - rect.top)  / rect.height;
        var rotX = (yPct - 0.5) * -12;
        var rotY = (xPct - 0.5) *  12;
        card.style.transform =
          'perspective(900px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale(1.025)';
        card.style.zIndex = '2';
        var gloss = card.querySelector('.card-gloss');
        if (gloss) {
          gloss.style.setProperty('--gx', (xPct * 100) + '%');
          gloss.style.setProperty('--gy', (yPct * 100) + '%');
        }
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.zIndex = '';
      });
    });
  }

  /* ── Ripple on Buttons/Cards ── */
  function initRipple() {
    document.addEventListener('click', function (e) {
      var target = e.target.closest('.btn, button, .opening-modal__btn');
      if (!target) return;
      var rect = target.getBoundingClientRect();
      var r = document.createElement('span');
      r.className = 'fx-ripple';
      var size = Math.max(rect.width, rect.height);
      r.style.width  = size + 'px';
      r.style.height = size + 'px';
      r.style.left   = (e.clientX - rect.left  - size / 2) + 'px';
      r.style.top    = (e.clientY - rect.top   - size / 2) + 'px';
      // ensure button has position:relative
      var pos = window.getComputedStyle(target).position;
      if (pos === 'static') target.style.position = 'relative';
      target.style.overflow = 'hidden';
      target.appendChild(r);
      setTimeout(function () { if (r.parentNode) r.remove(); }, 700);
    });
  }

  /* ── Header Scroll Shadow ── */
  function initHeaderScroll() {
    var header = document.querySelector('header');
    if (!header) return;
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function () {
    initPageLoad();
    initAurora();
    initCursor();
    initRipple();
    initHeaderScroll();
    // Tilt needs layout settled
    setTimeout(initCardTilt, 150);
  });

})();
