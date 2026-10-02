/* ============================================================
   Music World — Premium Interactions
   css/premium.css とセット。外せば旧デザインに戻ります。
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var isTop = document.body.classList.contains('page-top');

  function ss(key, val) {
    try {
      if (val === undefined) return sessionStorage.getItem(key);
      sessionStorage.setItem(key, val);
    } catch (e) { return null; }
  }

  /* ── 共通SVG定義（金グラデーション） ── */
  function injectDefs() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    svg.innerHTML =
      '<defs><linearGradient id="pm-gold-grad" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#e7799f"/><stop offset="0.5" stop-color="#e8c96a"/><stop offset="1" stop-color="#c9a227"/>' +
      '</linearGradient></defs>';
    document.body.appendChild(svg);
  }

  /* ── 幕開け（セッション初回のみ） ── */
  function initCurtain() {
    if (reduceMotion || ss('pm_curtain_seen')) return;
    ss('pm_curtain_seen', '1');
    var c = document.createElement('div');
    c.className = 'pm-curtain';
    c.setAttribute('aria-hidden', 'true');
    c.innerHTML =
      '<div class="pm-curtain__panel pm-curtain__panel--l"></div>' +
      '<div class="pm-curtain__panel pm-curtain__panel--r"></div>' +
      '<div class="pm-curtain__center">' +
        '<img class="pm-curtain__logo" src="images/logos/title-logo.webp" alt="">' +
        '<div class="pm-curtain__staff"></div>' +
      '</div>';
    document.body.appendChild(c);
    var opened = false;
    function open() {
      if (opened) return; opened = true;
      c.classList.add('is-open');
      setTimeout(function () { c.remove(); }, 1500);
    }
    var t0 = Date.now();
    window.addEventListener('load', function () {
      setTimeout(open, Math.max(0, 1100 - (Date.now() - t0)));
    });
    setTimeout(open, 2600); // 画像が重いページでも待たせすぎない
  }

  /* ── ヘッダー：スクロール状態・自動格納・進捗バー ── */
  function initHeader() {
    var header = document.querySelector('header');
    var bar = document.createElement('div');
    bar.className = 'pm-progress';
    bar.innerHTML = '<div class="pm-progress__bar"></div>';
    document.body.appendChild(bar);
    var fill = bar.firstChild;

    var ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, y / max) : 0;
      fill.style.setProperty('--p', p.toFixed(4));
      document.documentElement.style.setProperty('--pm-scroll-p', p.toFixed(4));
      // ヘッダーは常に表示（スクロール位置で見た目だけ切り替え）
      if (header) header.classList.toggle('scrolled', y > 30);
      if (totop) totop.classList.toggle('is-on', y > window.innerHeight * 0.8);
      if (totop) totop.style.setProperty('--p', p.toFixed(4));
    }
    var totop = initBackToTop();
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  function initBackToTop() {
    var b = document.createElement('button');
    b.className = 'pm-totop';
    b.type = 'button';
    b.setAttribute('aria-label', 'ページの先頭へ戻る');
    b.innerHTML =
      '<svg viewBox="0 0 52 52" aria-hidden="true"><circle class="pm-totop__track" cx="26" cy="26" r="23"/>' +
      '<circle class="pm-totop__ring" cx="26" cy="26" r="23"/></svg><span class="pm-totop__icon" aria-hidden="true">♪</span>';
    b.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });
    document.body.appendChild(b);
    return b;
  }

  /* ── ナビ：ロゴ・インジケーター・モバイルメニュー ── */
  function initNav() {
    var logo = document.querySelector('.nav-logo');
    if (logo && !logo.querySelector('.pm-logo-link')) {
      var a = document.createElement('a');
      a.href = 'index.html';
      a.className = 'pm-logo-link';
      a.setAttribute('aria-label', 'Music World トップへ');
      var emblem = document.createElement('span');
      emblem.className = 'pm-nav-emblem';
      emblem.setAttribute('aria-hidden', 'true');
      emblem.innerHTML = '<img src="images/logos/favicon.webp" alt="" width="38" height="38">';
      var txt = document.createElement('span');
      while (logo.firstChild) txt.appendChild(logo.firstChild);
      txt.style.display = 'block';
      a.appendChild(emblem); a.appendChild(txt);
      logo.appendChild(a);
    }

    var nav = document.querySelector('nav');
    var ul = nav && nav.querySelector('ul');
    var burger = document.querySelector('.hamburger');
    if (!nav || !ul) return;

    /* スライドするインジケーター（PC） */
    var ind = document.createElement('span');
    ind.className = 'pm-nav-indicator';
    ind.setAttribute('aria-hidden', 'true');
    ul.appendChild(ind);
    function moveTo(el) {
      if (!el || el.classList.contains('nav-support') || el.classList.contains('nav-supporters')) { ind.style.opacity = '0'; return; }
      ind.style.width = el.offsetWidth + 'px';
      ind.style.setProperty('--x', el.offsetLeft + 'px');
      ind.style.opacity = '1';
    }
    var active = ul.querySelector('a.active');
    ul.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('mouseenter', function () { moveTo(a); });
      a.addEventListener('focus', function () { moveTo(a); });
    });
    ul.addEventListener('mouseleave', function () { moveTo(active); });
    window.addEventListener('load', function () { moveTo(active); });
    window.addEventListener('resize', function () { moveTo(active); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveTo(active); });

    /* モバイルメニューの状態を body / aria に反映 */
    if (burger) {
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-controls', 'pm-main-nav');
      if (!nav.id) nav.id = 'pm-main-nav';
      new MutationObserver(function () {
        var open = nav.classList.contains('open');
        document.body.classList.toggle('pm-nav-open', open);
        burger.setAttribute('aria-expanded', String(open));
      }).observe(nav, { attributes: true, attributeFilter: ['class'] });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('open')) nav.classList.remove('open');
      });
    }
  }

  /* ── 下層ページのヒーロー装飾 ── */
  function initPageHero() {
    var hero = document.querySelector('.page-hero');
    if (!hero) return;
    var sub = hero.querySelector('.subtitle');
    var h1 = hero.querySelector('h1');
    // 英字の見出しがあればそれを、なければサブタイトルの最後の単語を透かし文字に
    var h1Text = h1 ? h1.textContent.trim() : '';
    var src = /^[\x20-\x7E]+$/.test(h1Text) ? h1Text : (sub ? sub.textContent : '');
    var word = src.trim().split(/\s+/).slice(-1)[0] || '';
    if (/^[A-Za-z]{3,12}$/.test(word)) hero.setAttribute('data-watermark', word.toUpperCase());
    if (h1 && !hero.querySelector('.pm-flourish')) {
      h1.insertAdjacentHTML('afterend',
        '<svg class="pm-flourish" viewBox="0 0 280 28" aria-hidden="true">' +
        '<path d="M2 14 C 40 14, 60 4, 100 12 S 128 22, 134 14"/>' +
        '<path d="M278 14 C 240 14, 220 4, 180 12 S 152 22, 146 14"/>' +
        '<path class="pm-flourish__gem" d="M140 6 L146 14 L140 22 L134 14 Z"/></svg>');
    }
  }

  /* ── スクロール出現（stagger） ── */
  function initReveal() {
    var groups = new Map();
    document.querySelectorAll('.fade-in, .pm-reveal').forEach(function (el) {
      var p = el.parentElement;
      var n = groups.get(p) || 0;
      if (!el.style.getPropertyValue('--i')) el.style.setProperty('--i', Math.min(n, 6));
      groups.set(p, n + 1);
    });
    var targets = document.querySelectorAll('.pm-reveal');
    if (!('IntersectionObserver' in window)) { targets.forEach(function (el) { el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ── アナウンス帯 → ティッカー ── */
  function initTicker() {
    document.querySelectorAll('.announcement-band').forEach(function (src) {
      var ticker = document.createElement('div');
      ticker.className = 'pm-ticker';
      ticker.setAttribute('aria-hidden', 'true');
      var track = document.createElement('div');
      track.className = 'pm-ticker__track';
      ticker.appendChild(track);
      function build() {
        var parts = src.innerHTML.split('|').map(function (s) {
          return s.replace(/✦|&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
        }).filter(Boolean);
        var html = '';
        for (var k = 0; k < 4; k++) {
          parts.forEach(function (p) { html += '<span class="pm-ticker__item">✦&ensp;' + p + '</span>'; });
        }
        track.innerHTML = html + html;
      }
      build();
      src.classList.add('pm-ticker-src');
      src.parentNode.insertBefore(ticker, src.nextSibling);
      new MutationObserver(build).observe(src, { childList: true, characterData: true, subtree: true });
    });
  }

  /* ── フッター装飾 ── */
  function initFooter() {
    var f = document.querySelector('footer');
    if (!f || f.querySelector('.pm-footer-staff')) return;
    var staff = document.createElement('div');
    staff.className = 'pm-footer-staff';
    staff.setAttribute('aria-hidden', 'true');
    var notes = ['♪', '♫', '♩', '♬', '♪'];
    notes.forEach(function (n, i) {
      var s = document.createElement('span');
      s.textContent = n;
      s.style.top = (i % 3) * 9 - 6 + 'px';
      s.style.animationDelay = (-i * 4.4) + 's';
      staff.appendChild(s);
    });
    f.prepend(staff);
  }

  /* ── マグネティックボタン ── */
  function initMagnetic() {
    if (!finePointer || reduceMotion) return;
    document.querySelectorAll('.btn, .hm-round-btn').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.setProperty('--mag-x', ((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1) + 'px');
        b.style.setProperty('--mag-y', ((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1) + 'px');
      });
      b.addEventListener('pointerleave', function () {
        b.style.setProperty('--mag-x', '0px');
        b.style.setProperty('--mag-y', '0px');
      });
    });
  }

  /* ── カード：スポットライト / ホロ ── */
  function initSpotlight() {
    if (!finePointer) return;
    document.addEventListener('pointermove', function (e) {
      var el = e.target.closest && e.target.closest('.card, .char-icon, .hm-pillar');
      if (!el) return;
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
      el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      el.style.setProperty('--hp', (20 + x * 60).toFixed(1) + '%');
    }, { passive: true });
  }

  /* ── キャラクターアイコンをキーボード操作可能に ── */
  function initA11y() {
    document.querySelectorAll('.char-icon, .gallery-item').forEach(function (el) {
      if (el.tagName === 'A' || el.tagName === 'BUTTON') return;
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
      });
    });
  }

  /* ── クリックで音符がはじける ── */
  function initBurst() {
    if (reduceMotion) return;
    var glyphs = ['♪', '♫', '✦', '♩', '✧', '♬'];
    var colors = ['#c9a227', '#e7799f', '#e8c96a', '#b098c8', '#f48fb1'];
    document.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      if (e.target.closest('input, textarea, select, video, .bgm-player, .ovc-topbar, .opening-video__controls')) return;
      var ring = document.createElement('span');
      ring.className = 'pm-burst-ring';
      ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px';
      document.body.appendChild(ring);
      setTimeout(function () { ring.remove(); }, 650);
      var n = 7;
      for (var i = 0; i < n; i++) {
        var s = document.createElement('span');
        s.className = 'pm-burst';
        s.textContent = glyphs[(Math.random() * glyphs.length) | 0];
        var a = (Math.PI * 2 * i) / n + Math.random() * 0.6;
        var d = 36 + Math.random() * 46;
        s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px';
        s.style.setProperty('--dx', (Math.cos(a) * d).toFixed(0) + 'px');
        s.style.setProperty('--dy', (Math.sin(a) * d - 18).toFixed(0) + 'px');
        s.style.setProperty('--r', ((Math.random() - 0.5) * 120).toFixed(0) + 'deg');
        s.style.setProperty('--s', (11 + Math.random() * 10).toFixed(0) + 'px');
        s.style.setProperty('--c', colors[(Math.random() * colors.length) | 0]);
        document.body.appendChild(s);
        setTimeout(function (el) { el.remove(); }.bind(null, s), 950);
      }
    });
  }

  /* ── 星屑キャンバス（背景） ── */
  function makeSparkleField(canvas, opts) {
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, parts = [], mx = 0, my = 0, running = true, raf = 0;
    var palette = opts.palette;
    function resize() {
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(Math.min(opts.max, (w * h) / opts.density));
      parts = [];
      for (var i = 0; i < count; i++) parts.push(spawn(true));
    }
    function spawn(initial) {
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + 10,
        z: 0.3 + Math.random() * 0.9,
        r: 0.8 + Math.random() * opts.size,
        vy: -(0.08 + Math.random() * opts.speed),
        tw: Math.random() * Math.PI * 2,
        c: palette[(Math.random() * palette.length) | 0],
        star: Math.random() < 0.35
      };
    }
    function drawStar(x, y, r) {
      ctx.beginPath();
      ctx.moveTo(x, y - r * 2.6);
      ctx.quadraticCurveTo(x, y, x + r * 2.6, y);
      ctx.quadraticCurveTo(x, y, x, y + r * 2.6);
      ctx.quadraticCurveTo(x, y, x - r * 2.6, y);
      ctx.quadraticCurveTo(x, y, x, y - r * 2.6);
      ctx.fill();
    }
    function frame(t) {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.y += p.vy * p.z;
        p.x += Math.sin((t / 2400) + p.tw) * 0.12 * p.z;
        if (p.y < -12) parts[i] = p = spawn(false);
        var a = 0.35 + 0.65 * Math.abs(Math.sin(t / 900 + p.tw));
        var x = p.x + mx * p.z * 14, y = p.y + my * p.z * 10;
        ctx.globalAlpha = a * opts.alpha;
        ctx.fillStyle = p.c;
        if (p.star) drawStar(x, y, p.r * 0.8);
        else { ctx.beginPath(); ctx.arc(x, y, p.r, 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }
    resize();
    window.addEventListener('resize', resize);
    if (finePointer) window.addEventListener('pointermove', function (e) {
      mx = e.clientX / window.innerWidth - 0.5; my = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });
    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running) { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
    });
    if (opts.observe && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        running = es[0].isIntersecting && !document.hidden;
        if (running) { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
      }).observe(opts.observe);
    }
    raf = requestAnimationFrame(frame);
  }

  function initStardust() {
    if (reduceMotion) return;
    var c = document.createElement('canvas');
    c.className = 'pm-stardust';
    c.setAttribute('aria-hidden', 'true');
    document.body.prepend(c);
    makeSparkleField(c, {
      palette: ['#c9a227', '#e8c96a', '#f48fb1', '#d7b8ee'],
      density: 26000, max: 60, size: 1.4, speed: 0.22, alpha: 0.55
    });
  }

  /* ============================================================
     HOME
     ============================================================ */
  function initHomeHero() {
    var hero = document.querySelector('.hm-hero');
    if (!hero) return;
    var sp = hero.querySelector('.hm-hero__sparkles');
    if (sp && !reduceMotion) {
      makeSparkleField(sp, {
        palette: ['#fff3cf', '#ffd36e', '#ffd0e0', '#ffffff'],
        density: 14000, max: 90, size: 1.6, speed: 0.35, alpha: 0.9, observe: hero
      });
    }
    if (reduceMotion) return;
    var tx = 0, ty = 0, cx = 0, cy = 0, sy = 0, raf = 0;
    if (finePointer) {
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * -24;
        ty = ((e.clientY - r.top) / r.height - 0.5) * -16;
        kick();
      });
      hero.addEventListener('pointerleave', function () { tx = 0; ty = 0; kick(); });
    }
    window.addEventListener('scroll', function () { kick(); }, { passive: true });
    function kick() { if (!raf) raf = requestAnimationFrame(loop); }
    function loop() {
      raf = 0;
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      var y = Math.min(window.scrollY, window.innerHeight * 1.2);
      sy = y * 0.35;
      hero.style.setProperty('--px', cx.toFixed(2) + 'px');
      hero.style.setProperty('--py', cy.toFixed(2) + 'px');
      hero.style.setProperty('--sy', sy.toFixed(1) + 'px');
      hero.style.setProperty('--sz', (y / window.innerHeight * 0.08).toFixed(4));
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) raf = requestAnimationFrame(loop);
    }
  }

  function initKingdoms() {
    var list = document.querySelector('.hm-kingdoms__list');
    if (!list) return;
    var items = Array.prototype.slice.call(list.querySelectorAll('.hm-kingdom'));
    function activate(el) {
      items.forEach(function (k) {
        var on = k === el;
        k.classList.toggle('is-active', on);
        k.setAttribute('aria-expanded', String(on));
      });
    }
    items.forEach(function (k) {
      if (finePointer) k.addEventListener('mouseenter', function () { activate(k); });
      k.addEventListener('focus', function () { activate(k); });
      k.addEventListener('click', function (e) {
        // 閉じているパネルは最初のタップで開くだけ
        if (!k.classList.contains('is-active')) { e.preventDefault(); activate(k); }
      });
    });
  }

  /* ── キャスト：自動で流れる無限ループ＋ドラッグ（慣性つき） ── */
  function initCast() {
    var track = document.querySelector('.hm-cast__track');
    var rail = track && track.querySelector('.hm-cast__rail');
    if (!rail) return;
    var originals = Array.prototype.slice.call(rail.children);

    // ループ用の複製（読み上げ・Tab移動の対象外）
    function cloneSet() {
      originals.forEach(function (el) {
        var c = el.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        c.setAttribute('tabindex', '-1');
        c.classList.add('is-clone');
        rail.appendChild(c);
      });
    }
    cloneSet(); cloneSet();
    var cards = Array.prototype.slice.call(rail.children);

    var setW = 0;
    function measure() {
      var first = originals[0], firstClone = rail.children[originals.length];
      setW = firstClone.offsetLeft - first.offsetLeft;
    }
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);

    var AUTO = reduceMotion ? 0 : 38;   // px/秒（右→左へゆっくり）
    var HOVER = reduceMotion ? 0 : 10;  // ホバー中は減速
    var x = 0, v = 0, speed = AUTO, targetSpeed = AUTO;
    var tween = 0;                      // 矢印ボタンでの移動残り
    var dragging = false, moved = 0, lastX = 0, lastT = 0, pid = null;
    var visible = true, last = performance.now();

    function wrap() {
      if (!setW) return;
      while (x <= -setW) x += setW;
      while (x > 0) x -= setW;
    }
    function frame(t) {
      var dt = Math.min(0.05, (t - last) / 1000); last = t;
      if (!dragging) {
        speed += (targetSpeed - speed) * Math.min(1, dt * 4);
        x -= speed * dt;
        if (Math.abs(v) > 1) { x += v * dt; v *= Math.pow(0.04, dt); } else v = 0;
        if (tween) { var step = tween * Math.min(1, dt * 7); x += step; tween -= step; if (Math.abs(tween) < 0.5) tween = 0; }
      }
      wrap();
      rail.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      if (visible) requestAnimationFrame(frame);
    }
    function start() { last = performance.now(); requestAnimationFrame(frame); }

    // 画面外・タブ非表示では止める
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        var was = visible; visible = es[0].isIntersecting && !document.hidden;
        if (visible && !was) start();
      }).observe(track);
    }
    document.addEventListener('visibilitychange', function () {
      var was = visible; visible = !document.hidden;
      if (visible && !was) start();
    });

    // ドラッグ（マウス・タッチ共通）
    track.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      dragging = true; moved = 0; v = 0; tween = 0;
      lastX = e.clientX; lastT = performance.now(); pid = e.pointerId;
    });
    window.addEventListener('pointermove', function (e) {
      if (!dragging || e.pointerId !== pid) return;
      var now = performance.now(), dx = e.clientX - lastX;
      moved += Math.abs(dx);
      if (moved > 6 && !track.classList.contains('is-drag')) {
        track.classList.add('is-drag');
        try { track.setPointerCapture(pid); } catch (err) {}
      }
      x += dx;
      var inst = dx / Math.max(1, now - lastT) * 1000;
      v = v * 0.6 + inst * 0.4;
      lastX = e.clientX; lastT = now;
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('is-drag');
      if (performance.now() - lastT > 80) v = 0; // 止めてから離した時は慣性なし
      v = Math.max(-3000, Math.min(3000, v));
    }
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    // ドラッグ後のクリックでページ遷移しない
    track.addEventListener('click', function (e) {
      if (moved > 6) { e.preventDefault(); e.stopPropagation(); }
    }, true);
    track.addEventListener('dragstart', function (e) { e.preventDefault(); });

    // ホバーで減速、離れたら元の速度
    if (finePointer) {
      track.addEventListener('mouseenter', function () { targetSpeed = HOVER; });
      track.addEventListener('mouseleave', function () { targetSpeed = AUTO; });
    }

    // 矢印ボタン・キーボード
    function cardStep() { return cards[0].getBoundingClientRect().width + 22; }
    var prev = document.querySelector('[data-cast-prev]');
    var next = document.querySelector('[data-cast-next]');
    if (prev) prev.addEventListener('click', function () { tween += cardStep(); });
    if (next) next.addEventListener('click', function () { tween -= cardStep(); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); tween += cardStep(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); tween -= cardStep(); }
    });
    track.addEventListener('focusin', function () { targetSpeed = 0; });
    track.addEventListener('focusout', function () { targetSpeed = AUTO; });

    // カードの立体傾き
    if (finePointer && !reduceMotion) {
      cards.forEach(function (c) {
        c.addEventListener('pointermove', function (e) {
          if (dragging) return;
          var r = c.getBoundingClientRect();
          c.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(2) + 'deg');
          c.style.setProperty('--rx', (((e.clientY - r.top) / r.height - 0.5) * -8).toFixed(2) + 'deg');
        });
        c.addEventListener('pointerleave', function () { c.style.setProperty('--ry', '0deg'); c.style.setProperty('--rx', '0deg'); });
      });
    }
    start();
  }

  function initCounters() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target, to = parseInt(el.getAttribute('data-count'), 10), t0 = performance.now();
        if (reduceMotion) { el.textContent = to; return; }
        (function tick(t) {
          var k = Math.min(1, (t - t0) / 1600);
          el.textContent = Math.round(to * (1 - Math.pow(1 - k, 4)));
          if (k < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { el.textContent = '0'; io.observe(el); });
  }

  /* ── BGM：再生中のイコライザー表示 ── */
  function initBgmEq() {
    var audio = document.getElementById('bgm-audio');
    var title = document.querySelector('.bgm-title');
    if (!audio || !title) return;
    if (!title.querySelector('.pm-eq')) title.insertAdjacentHTML('beforeend', '<span class="pm-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>');
    function sync() { document.body.classList.toggle('pm-bgm-playing', !audio.paused); }
    ['play', 'playing', 'pause', 'ended'].forEach(function (ev) { audio.addEventListener(ev, sync); });
    sync();
  }

  /* ── Init ── */
  initCurtain(); // できるだけ早く幕を張る
  function init() {
    injectDefs();
    initHeader();
    initNav();
    initPageHero();
    initTicker();
    initReveal();
    initFooter();
    initMagnetic();
    initSpotlight();
    initA11y();
    initBurst();
    initStardust();
    initHomeHero();
    initKingdoms();
    initCast();
    initCounters();
    initBgmEq();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
