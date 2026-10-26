/* ============================================================
   Music World — Motion Layer
   css/motion.css とセット。premium.js の後に読み込む。
   ============================================================ */
(function () {
  'use strict';

  // トップの奥行きレイヤー（試作）。不要なら false にするだけで元に戻ります。
  var PARALLAX = true;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // スクロール処理を1つの rAF にまとめる
  var scrollFns = [];
  function onScroll(fn) {
    scrollFns.push(fn);
    fn();
  }
  var ticking = false;
  function runScroll() { ticking = false; scrollFns.forEach(function (f) { f(); }); }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(runScroll); } }, { passive: true });
  window.addEventListener('resize', function () { if (!ticking) { ticking = true; requestAnimationFrame(runScroll); } });

  /* ══════════════════════════════════════════════════════════
     1. 奥行きカルーセル
     items: [{ card: Element, color: '#hex', caption: fn -> {role, name}, open: fn }]
     ══════════════════════════════════════════════════════════ */
  function DepthCarousel(root, items, opts) {
    opts = opts || {};
    var n = items.length, cur = 0, timer = null, paused = false;
    root.classList.add('mw-car');
    root.setAttribute('role', 'region');
    root.setAttribute('aria-roledescription', 'carousel');
    if (!root.hasAttribute('tabindex')) root.tabIndex = 0;

    var glow = document.createElement('div'); glow.className = 'mw-car__glow';
    var stage = document.createElement('div'); stage.className = 'mw-car__stage';
    var cap = document.createElement('div'); cap.className = 'mw-car__caption'; cap.setAttribute('aria-live', 'polite');
    cap.innerHTML = '<span class="mw-car__role"></span><span class="mw-car__name"></span>';
    var prev = document.createElement('button'); prev.type = 'button'; prev.className = 'mw-car__btn mw-car__btn--prev'; prev.setAttribute('aria-label', '前のキャラクター'); prev.textContent = '←';
    var next = document.createElement('button'); next.type = 'button'; next.className = 'mw-car__btn mw-car__btn--next'; next.setAttribute('aria-label', '次のキャラクター'); next.textContent = '→';
    var count = document.createElement('div'); count.className = 'mw-car__count';
    root.appendChild(glow); root.appendChild(stage);
    items.forEach(function (it, i) {
      it.card.classList.add('mw-car__card');
      it.card.dataset.i = i;
      stage.appendChild(it.card);
    });
    root.appendChild(cap); root.appendChild(count);
    // ページ側に矢印ボタンがあればそれを使う
    if (!opts.extPrev) { root.appendChild(prev); root.appendChild(next); }

    function offset(i) {
      var o = i - cur;
      if (o > n / 2) o -= n;
      if (o < -n / 2) o += n;
      return o;
    }
    function layout() {
      var narrow = window.innerWidth < 640;
      var step = narrow ? 64 : 72;
      items.forEach(function (it, i) {
        var o = offset(i), a = Math.abs(o), c = it.card;
        c.style.transform = 'translate(-50%,-50%) translateX(' + (o * step) + '%) translateZ(' + (-a * 190) + 'px) rotateY(' + (-o * 20) + 'deg)';
        c.style.opacity = a > 3 ? 0 : (1 - a * 0.22).toFixed(2);
        c.style.zIndex = 20 - a;
        c.style.filter = a ? 'brightness(' + (1 - a * 0.16).toFixed(2) + ') saturate(' + (1 - a * 0.15).toFixed(2) + ') blur(' + (a * 0.7).toFixed(1) + 'px)' : 'none';
        c.style.pointerEvents = a > 3 ? 'none' : '';
        c.classList.toggle('is-center', a === 0);
        c.setAttribute('aria-hidden', a > 3 ? 'true' : 'false');
        c.tabIndex = a === 0 ? 0 : -1;
        if (a <= 3 && it.load) it.load();
      });
    }
    function caption(swap) {
      var t = items[cur].caption();
      cap.querySelector('.mw-car__role').textContent = t.role || '';
      cap.querySelector('.mw-car__name').textContent = t.name || '';
      count.textContent = String(cur + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
      if (swap && !reduceMotion) { cap.classList.remove('is-swap'); void cap.offsetWidth; cap.classList.add('is-swap'); }
    }
    function go(i) {
      cur = (i % n + n) % n;
      layout();
      root.style.setProperty('--tint', items[cur].color || '#f48fb1');
      caption(true);
    }
    this.go = go;
    this.refresh = function () { caption(false); };

    prev.addEventListener('click', function () { go(cur - 1); restart(); });
    next.addEventListener('click', function () { go(cur + 1); restart(); });
    if (opts.extPrev) opts.extPrev.addEventListener('click', function () { go(cur - 1); restart(); });
    if (opts.extNext) opts.extNext.addEventListener('click', function () { go(cur + 1); restart(); });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); restart(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); restart(); }
    });

    // スワイプ／ドラッグ
    var sx = null, sy = 0, swiped = false;
    root.addEventListener('pointerdown', function (e) { if (e.button !== 0) return; sx = e.clientX; sy = e.clientY; swiped = false; });
    root.addEventListener('pointerup', function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - sy)) { swiped = true; go(cur + (dx < 0 ? 1 : -1)); restart(); }
      sx = null;
    });
    root.addEventListener('pointercancel', function () { sx = null; });
    root.addEventListener('dragstart', function (e) { e.preventDefault(); });

    // クリック：中央以外は中央へ、中央は開く
    items.forEach(function (it, i) {
      it.card.addEventListener('click', function (e) {
        if (swiped) { e.preventDefault(); e.stopPropagation(); swiped = false; return; }
        if (i !== cur) { e.preventDefault(); e.stopPropagation(); go(i); restart(); return; }
        if (it.open) { e.preventDefault(); e.stopPropagation(); it.open(); }
      });
      it.card.addEventListener('keydown', function (e) {
        if ((e.key === 'Enter' || e.key === ' ') && it.open) { e.preventDefault(); it.open(); }
      });
    });

    // ゆっくり自動送り（ホバー・フォーカス・画面外で停止）
    var visible = false;
    function tick() { if (!paused && visible && !document.hidden) go(cur + 1); }
    function restart() { if (reduceMotion || !opts.auto) return; clearInterval(timer); timer = setInterval(tick, opts.auto); }
    root.addEventListener('mouseenter', function () { paused = true; });
    root.addEventListener('mouseleave', function () { paused = false; });
    root.addEventListener('focusin', function () { paused = true; });
    root.addEventListener('focusout', function () { paused = false; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0.35 }).observe(root);
    } else visible = true;
    window.addEventListener('resize', layout);
    go(0);
    restart();
  }

  // キャラクターページ：アイコン一覧からカルーセルを組み立てる
  var POS = { 'accordion-knights': 32, 'xylophone': 40, 'contrabass-count': 46, 'clarinet-princess': 55, 'castanet': 46, 'pipe-organ-dragon': 50, 'lute-king': 50 };
  function initCharacterCarousel() {
    var icons = $$('.char-icon[data-char]');
    var hero = $('.page-hero');
    if (!icons.length || !hero || !$('.characters-grid')) return;
    var items = [];
    icons.forEach(function (icon) {
      var img = icon.querySelector('.char-avatar-image');
      var m = img && (img.getAttribute('src') || '').match(/icon\/([a-z-]+)-icon\./);
      if (!m) return;
      var slug = m[1];
      var avatar = icon.querySelector('.char-avatar');
      var color = (avatar && avatar.style.borderColor) || '#f48fb1';
      var nameEl = icon.querySelector('.char-name'), roleEl = icon.querySelector('.char-role');
      var card = document.createElement('div');
      card.setAttribute('role', 'button');
      card.style.setProperty('--pos', (POS[slug] || 50) + '%');
      var pic = document.createElement('img');
      pic.alt = nameEl ? nameEl.textContent.trim() : '';
      pic.decoding = 'async';
      pic.draggable = false;
      card.appendChild(pic);
      var loaded = false;
      items.push({
        card: card, color: color,
        load: function () { if (!loaded) { loaded = true; pic.src = 'images/characters/carousel/' + slug + '.webp'; } },
        caption: function () { return { role: roleEl ? roleEl.textContent.trim() : '', name: nameEl ? nameEl.textContent.trim() : '' }; },
        open: function () { icon.click(); }
      });
    });
    if (!items.length) return;
    var band = document.createElement('section');
    band.className = 'mw-car-band';
    band.setAttribute('aria-label', 'キャラクター（左右にスワイプ）');
    var root = document.createElement('div');
    band.appendChild(root);
    var hint = document.createElement('p');
    hint.className = 'mw-car__hint';
    hint.textContent = 'SWIPE · CLICK TO OPEN PROFILE';
    band.appendChild(hint);
    hero.parentNode.insertBefore(band, hero.nextSibling);
    var car = new DepthCarousel(root, items, { auto: 5200 });
    // 言語切替でアイコンの文字が変わったらキャプションも更新
    new MutationObserver(function () { car.refresh(); }).observe($('.section') || document.body, { childList: true, subtree: true, characterData: true });
  }

  // トップ：キャスト（既存カードをそのまま使う）
  var CAST_TINT = ['#f48fb1', '#e3b04a', '#6f9be8', '#9b7be0', '#5fc2b5', '#e2674f', '#d9a8f0', '#8a55c4'];
  function initHomeCast() {
    var track = $('.hm-cast__track[data-mw-carousel]');
    if (!track) return;
    var rail = track.querySelector('.hm-cast__rail');
    var cards = $$('.hm-cast__card:not(.hm-cast__card--more)', rail);
    var more = rail.querySelector('.hm-cast__card--more');
    var items = cards.map(function (c, i) {
      var role = c.querySelector('.hm-cast__role'), name = c.querySelector('.hm-cast__name');
      var img = c.querySelector('img');
      if (img) img.removeAttribute('loading');
      return {
        card: c, color: CAST_TINT[i % CAST_TINT.length],
        caption: function () { return { role: role ? role.textContent.trim() : '', name: name ? name.textContent.trim() : '' }; }
      };
    });
    track.removeAttribute('aria-label');
    track.removeAttribute('tabindex');
    var root = document.createElement('div');
    root.setAttribute('aria-label', 'キャラクター（左右にスワイプ）');
    track.insertBefore(root, rail);
    rail.remove();
    var car = new DepthCarousel(root, items, {
      auto: 4800,
      extPrev: $('[data-cast-prev]'),
      extNext: $('[data-cast-next]')
    });
    if (more) {
      var wrap = document.createElement('div');
      wrap.className = 'mw-cast-more';
      var label = more.querySelector('[data-i18n]');
      var a = document.createElement('a');
      a.href = more.getAttribute('href') || 'characters.html';
      a.className = 'btn hm-btn-ghost';
      var span = document.createElement('span');
      if (label) { span.setAttribute('data-i18n', label.getAttribute('data-i18n')); span.textContent = label.textContent; }
      else span.textContent = 'すべてのキャラクターを見る';
      a.appendChild(span);
      wrap.appendChild(a);
      track.appendChild(wrap);
    }
    // キャプション自身の書き換えで再発火しないよう、カード側だけを監視
    new MutationObserver(function () { car.refresh(); }).observe(root.querySelector('.mw-car__stage'), { childList: true, subtree: true, characterData: true });
  }

  /* ══════════════════════════════════════════════════════════
     2. 全24章：楽章ごとに積み重なるカード
     ══════════════════════════════════════════════════════════ */
  var ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  function initChapterStack() {
    var grid = $('.chapters-grid');
    if (!grid) return;
    var chapters = $$('.chapter-item', grid);
    if (chapters.length < 8) return;
    var per = 6, acts = [];
    grid.classList.add('mw-acts');
    for (var k = 0; k * per < chapters.length; k++) {
      var group = chapters.slice(k * per, k * per + per);
      var first = group[0].querySelector('.chapter-num'), last = group[group.length - 1].querySelector('.chapter-num');
      var act = document.createElement('section');
      act.className = 'mw-act mw-act--' + (k + 1);
      act.style.setProperty('--i', k);
      act.innerHTML =
        '<div class="mw-act__head"><span class="mw-act__mvt">Movement ' + ROMAN[k] + '</span>' +
        '<span class="mw-act__range">CHAPTER ' + (first ? first.textContent.trim() : '') + ' — ' + (last ? last.textContent.trim() : '') + '</span></div>' +
        '<div class="mw-act__list"></div>';
      var list = act.querySelector('.mw-act__list');
      group.forEach(function (c) { c.classList.add('visible'); list.appendChild(c); });
      grid.appendChild(act);
      acts.push(act);
    }
    if (reduceMotion) return;
    // 次のカードが重なってくるほど、下のカードを少し縮めて暗くする
    onScroll(function () {
      acts.forEach(function (a, i) {
        var nx = acts[i + 1];
        if (!nx) return;
        var gap = nx.getBoundingClientRect().top - a.getBoundingClientRect().top;
        var k = clamp(1 - gap / Math.max(1, a.offsetHeight), 0, 1);
        a.style.transform = k > 0 ? 'scale(' + (1 - k * 0.05).toFixed(4) + ')' : '';
        a.style.filter = k > 0 ? 'brightness(' + (1 - k * 0.12).toFixed(3) + ')' : '';
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     3. 読む速さで灯る文字
     ══════════════════════════════════════════════════════════ */
  function initLyricsReveal() {
    var lines = $$('.lyrics-lines p:not(.blank)');
    if (!lines.length) return;
    if (reduceMotion) return;
    lines.forEach(function (p) { p.classList.add('mw-lyric'); });
    onScroll(function () {
      var vh = window.innerHeight;
      var start = vh * 0.78, span = vh * 0.2;
      lines.forEach(function (p) {
        var r = p.getBoundingClientRect();
        var f = clamp((start - r.top) / span, 0, 1);
        p.style.setProperty('--fill', f.toFixed(3));
      });
    });
  }

  function splitChars(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var nodes = [], node, out = [];
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(function (t) {
      if (!t.nodeValue.trim()) return;
      var frag = document.createDocumentFragment();
      t.nodeValue.replace(/\s+/g, ' ').split('').forEach(function (ch) {
        var s = document.createElement('span');
        s.className = 'mw-ch';
        s.textContent = ch;
        frag.appendChild(s);
        out.push(s);
      });
      t.parentNode.replaceChild(frag, t);
    });
    return out;
  }
  function initProjectReveal() {
    var lead = $('.project-lead');
    if (!lead || reduceMotion) return;
    var paras = $$('.project-lead > p, .project-lead > .card > p', lead).filter(function (p) { return !p.closest('.project-cta') && p.textContent.trim().length > 8; });
    var groups = paras.map(function (p) { p.classList.add('mw-chars'); return { el: p, chars: splitChars(p), lit: -1 }; });
    onScroll(function () {
      var vh = window.innerHeight;
      groups.forEach(function (g) {
        var r = g.el.getBoundingClientRect();
        var prog = clamp((vh * 0.88 - r.top) / (r.height + vh * 0.32), 0, 1);
        var lit = Math.round(prog * g.chars.length);
        if (lit === g.lit) return;
        for (var i = 0; i < g.chars.length; i++) g.chars[i].classList.toggle('on', i < lit);
        g.lit = lit;
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     4. 流れ続ける壁
     ══════════════════════════════════════════════════════════ */
  function marqueeRow(row, dir, speed) {
    // 中身を2倍にして、半分の幅でループ
    var w = 0, x = 0, last = performance.now(), base = window.scrollY, slow = 1;
    row.innerHTML += row.innerHTML;
    function measure() { w = row.scrollWidth / 2; }
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    row.addEventListener('mouseenter', function () { slow = 0.15; });
    row.addEventListener('mouseleave', function () { slow = 1; });
    var visible = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(row);
    function frame(t) {
      var dt = Math.min(0.05, (t - last) / 1000); last = t;
      if (visible && w) {
        x += speed * slow * dt;
        var s = (window.scrollY - base) * 0.35; // スクロールに連動して逆方向にずれる
        var pos = ((dir > 0 ? x + s : -(x + s)) % w + w) % w;
        row.style.transform = 'translate3d(' + (-pos).toFixed(1) + 'px,0,0)';
      }
      requestAnimationFrame(frame);
    }
    if (!reduceMotion) requestAnimationFrame(frame);
  }

  function initGalleryWall() {
    var hero = $('.page-hero');
    var items = $$('.gallery-grid .gallery-item:not(.gallery-item--video)');
    if (!hero || items.length < 6) return;
    var pics = [];
    items.forEach(function (it) {
      var src = it.querySelector('picture source[type="image/webp"]');
      var img = it.querySelector('img');
      var url = (src && src.getAttribute('srcset')) || (img && img.getAttribute('src'));
      if (url) pics.push({ url: url, item: it, alt: img ? img.alt : '' });
    });
    pics = pics.slice(0, 20);
    var half = Math.ceil(pics.length / 2);
    var wall = document.createElement('div');
    wall.className = 'mw-wall';
    function rowHtml(list) {
      return list.map(function (p, i) {
        return '<button type="button" class="mw-wall__item" data-k="' + pics.indexOf(p) + '" aria-label="' + (p.alt || '画像') + 'を拡大"><img src="' + p.url + '" alt="" loading="lazy" decoding="async" draggable="false"></button>';
      }).join('');
    }
    wall.innerHTML = '<div class="mw-wall__row">' + rowHtml(pics.slice(0, half)) + '</div><div class="mw-wall__row">' + rowHtml(pics.slice(half)) + '</div>';
    var cap = document.createElement('p');
    cap.className = 'mw-wall__cap';
    cap.textContent = 'CLICK TO VIEW';
    hero.parentNode.insertBefore(wall, hero.nextSibling);
    wall.parentNode.insertBefore(cap, wall.nextSibling);
    var rows = $$('.mw-wall__row', wall);
    marqueeRow(rows[0], 1, 26);
    marqueeRow(rows[1], -1, 22);
    // 複製した側は読み上げ・Tab対象外
    rows.forEach(function (r) {
      var b = $$('.mw-wall__item', r);
      b.slice(b.length / 2).forEach(function (x) { x.setAttribute('aria-hidden', 'true'); x.tabIndex = -1; });
    });
    wall.addEventListener('click', function (e) {
      var b = e.target.closest('.mw-wall__item');
      if (!b) return;
      var p = pics[+b.dataset.k];
      if (p) p.item.click();
    });
  }

  function initSupportersRoll() {
    var list = $('#supporters-list');
    var hero = $('.page-hero');
    if (!list || !hero) return;
    var built = false;
    function build() {
      if (built) return;
      var chips = $$('.supporter-chip', list);
      if (!chips.length) return;
      built = true;
      var names = chips.map(function (c) {
        var clone = c.cloneNode(true);
        $$('.ranking-badge, .chip-crown', clone).forEach(function (x) { x.remove(); });
        return { name: clone.textContent.trim(), tier: c.getAttribute('data-tier') || '' };
      }).filter(function (x) { return x.name; });
      if (!names.length) return;
      // 少人数でも帯が埋まるように繰り返す
      var fill = names.slice();
      while (fill.length < 14) fill = fill.concat(names);
      var a = fill.filter(function (_, i) { return i % 2 === 0; }), b = fill.filter(function (_, i) { return i % 2 === 1; });
      var roll = document.createElement('section');
      roll.className = 'mw-roll';
      roll.setAttribute('aria-hidden', 'true');
      var label = document.createElement('p');
      label.className = 'mw-roll__label';
      label.textContent = 'THANK YOU FOR PLAYING WITH US';
      roll.appendChild(label);
      [a, b].forEach(function (set) {
        var row = document.createElement('div');
        row.className = 'mw-roll__row';
        row.style.setProperty('--dur', Math.max(30, set.length * 5) + 's');
        set.concat(set).forEach(function (s) {
          var span = document.createElement('span');
          span.className = 'mw-roll__name';
          span.setAttribute('data-tier', s.tier);
          span.textContent = s.name;
          row.appendChild(span);
        });
        roll.appendChild(row);
      });
      hero.parentNode.insertBefore(roll, hero.nextSibling);
    }
    new MutationObserver(build).observe(list, { childList: true });
    build();
  }

  /* ══════════════════════════════════════════════════════════
     5. 四つの国の舞台
     ══════════════════════════════════════════════════════════ */
  function initKingdomStage() {
    var cards = $$('.kingdoms-grid .kingdom-card');
    var hero = $('.page-hero');
    if (cards.length < 2 || !hero) return;
    var ROM = ['I', 'II', 'III', 'IV', 'V'];
    var data = cards.map(function (c, i) {
      var src = c.querySelector('picture source[type="image/webp"]');
      var img = c.querySelector('img');
      if (!c.id) c.id = 'kingdom-' + (i + 1);
      return {
        card: c,
        url: (src && src.getAttribute('srcset')) || (img && img.getAttribute('src')) || '',
        name: c.querySelector('.kingdom-name'),
        sub: c.querySelector('.kingdom-subtitle')
      };
    });
    var DUR = 6500;
    var stage = document.createElement('section');
    stage.className = 'mw-stage';
    stage.style.setProperty('--mw-dur', DUR + 'ms');
    stage.setAttribute('aria-label', '四つの音楽の国');
    stage.innerHTML =
      data.map(function (d) { return '<div class="mw-stage__scene" style="background-image:url(\'' + d.url + '\')"></div>'; }).join('') +
      '<div class="mw-stage__info" aria-live="polite"><div class="mw-stage__num"></div><div class="mw-stage__name"></div><div class="mw-stage__sub"></div>' +
      '<button type="button" class="mw-stage__more">この国を詳しく <span aria-hidden="true">↓</span></button></div>' +
      '<div class="mw-stage__tabs" role="tablist">' + data.map(function (d, i) {
        return '<button type="button" class="mw-stage__tab" role="tab" aria-selected="false" data-i="' + i + '"><small>' + ROM[i] + '</small><span></span></button>';
      }).join('') + '</div>';
    hero.parentNode.insertBefore(stage, hero.nextSibling);
    var scenes = $$('.mw-stage__scene', stage), tabs = $$('.mw-stage__tab', stage), info = $('.mw-stage__info', stage);
    var cur = -1, timer = null, paused = false, visible = false;

    function text(el) { return el ? el.textContent.trim() : ''; }
    function labels() { tabs.forEach(function (t, i) { t.querySelector('span').textContent = text(data[i].name); }); }
    function go(i, force) {
      if (i === cur && !force) return;
      cur = i;
      scenes.forEach(function (s, j) { s.classList.toggle('is-on', j === i); });
      tabs.forEach(function (t, j) {
        // 進行バーをリセットしてから伸ばす
        t.setAttribute('aria-selected', 'false');
        if (j === i) { void t.offsetWidth; t.setAttribute('aria-selected', 'true'); }
      });
      info.querySelector('.mw-stage__num').textContent = 'KINGDOM ' + ROM[i];
      info.querySelector('.mw-stage__name').textContent = text(data[i].name);
      info.querySelector('.mw-stage__sub').textContent = text(data[i].sub);
      if (!reduceMotion) { info.classList.remove('is-swap'); void info.offsetWidth; info.classList.add('is-swap'); }
    }
    function restart() {
      clearInterval(timer);
      if (reduceMotion) return;
      timer = setInterval(function () { if (!paused && visible && !document.hidden) go((cur + 1) % data.length); }, DUR);
    }
    tabs.forEach(function (t) { t.addEventListener('click', function () { go(+t.dataset.i); restart(); }); });
    stage.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var j = (cur + (e.key === 'ArrowRight' ? 1 : -1) + data.length) % data.length;
      go(j); tabs[j].focus(); restart();
    });
    $('.mw-stage__more', stage).addEventListener('click', function () {
      data[cur].card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    });
    function setPaused(p) { paused = p; stage.classList.toggle('is-paused', p); }
    stage.addEventListener('mouseenter', function () { setPaused(true); });
    stage.addEventListener('mouseleave', function () { setPaused(false); go(cur, true); restart(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0.3 }).observe(stage);
    else visible = true;
    labels();
    go(0);
    restart();
    new MutationObserver(function () { labels(); go(cur, true); }).observe(data[0].name, { childList: true, characterData: true, subtree: true });
  }

  /* ══════════════════════════════════════════════════════════
     6. 金属の見出し / 7. 支援ボタン
     ══════════════════════════════════════════════════════════ */
  function initCtaMagnet() {
    if (!finePointer || reduceMotion) return;
    // .btn は premium.js が同じ変数で処理済み
    $$('.mw-cta:not(.btn)').forEach(function (b) {
      var zone = b.parentElement;
      zone.addEventListener('pointermove', function (e) {
        if (b.getAttribute('aria-disabled') === 'true') return;
        var r = b.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        var reach = Math.max(120, r.width * 0.6);
        if (Math.abs(dx) > reach || Math.abs(dy) > 90) { b.style.setProperty('--mag-x', '0px'); b.style.setProperty('--mag-y', '0px'); return; }
        var k = b.offsetWidth > 360 ? 0.06 : 0.22; // 横長のボタンは控えめに
        b.style.setProperty('--mag-x', (dx * k).toFixed(1) + 'px');
        b.style.setProperty('--mag-y', (dy * 0.3).toFixed(1) + 'px');
      });
      zone.addEventListener('pointerleave', function () { b.style.setProperty('--mag-x', '0px'); b.style.setProperty('--mag-y', '0px'); });
    });
  }

  /* ══════════════════════════════════════════════════════════
     9. トップの奥行きレイヤー（試作）
     ══════════════════════════════════════════════════════════ */
  function initHeroDepth() {
    var hero = $('.hm-hero');
    if (!PARALLAX || !hero || reduceMotion) return;
    hero.classList.add('mw-depth');
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, t0 = performance.now();
    function loop(t) {
      raf = 0;
      if (!finePointer) {
        // タッチ端末はゆっくり自動で揺らす
        var k = (t - t0) / 3200;
        tx = Math.sin(k) * 0.35; ty = Math.cos(k * 0.8) * 0.25;
      }
      cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07;
      hero.style.setProperty('--dx', cx.toFixed(4));
      hero.style.setProperty('--dy', cy.toFixed(4));
      if (!finePointer || Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
        if (heroVisible) raf = requestAnimationFrame(loop);
      }
    }
    function kick() { if (!raf) raf = requestAnimationFrame(loop); }
    var heroVisible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; if (heroVisible) kick(); }).observe(hero);
    }
    if (finePointer) {
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width - 0.5;
        ty = (e.clientY - r.top) / r.height - 0.5;
        kick();
      });
      hero.addEventListener('pointerleave', function () { tx = 0; ty = 0; kick(); });
    }
    kick();
  }

  function init() {
    initHomeCast();
    initCharacterCarousel();
    initChapterStack();
    initLyricsReveal();
    initProjectReveal();
    initGalleryWall();
    initSupportersRoll();
    initKingdomStage();
    initCtaMagnet();
    initHeroDepth();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
