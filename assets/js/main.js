/* ==========================================================================
   WorshipDuo & TEAM — interactions
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- year ---------- */
  var yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- nav: scrolled state ---------- */
  var nav = $('#nav');
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');

    var t = $('#toTop');
    if (window.scrollY > 600) t.classList.add('is-show');
    else t.classList.remove('is-show');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var toggle = $('#navToggle');
  var links = $('#navLinks');
  function closeMenu() {
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('#navLinks a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- hero reveal on load ---------- */
  var hero = $('#hero');
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { hero.classList.add('is-in'); });
  });

  /* ---------- reveal on scroll ---------- */
  var revealEls = $$('[data-reveal]').filter(function (el) { return !hero.contains(el); });
  var gitems = $$('.gitem');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });

    // stagger gallery items
    var gio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var idx = gitems.indexOf(en.target);
          en.target.style.transitionDelay = ((idx % 3) * 0.08) + 's';
          en.target.classList.add('is-in');
          gio.unobserve(en.target);
        }
      });
    }, { threshold: 0.08 });
    gitems.forEach(function (el) { gio.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
    gitems.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- scrollspy (active nav link) ---------- */
  var sections = ['about', 'concerts', 'gallery', 'involved', 'roles', 'give']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navMap = {};
  $$('#navLinks a').forEach(function (a) {
    var h = a.getAttribute('href');
    if (h && h.charAt(0) === '#') navMap[h.slice(1)] = a;
  });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          Object.keys(navMap).forEach(function (k) { navMap[k].classList.remove('is-active'); });
          if (navMap[en.target.id]) navMap[en.target.id].classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- gallery filter ---------- */
  var chips = $$('.chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('is-active'); });
      chip.classList.add('is-active');
      var f = chip.getAttribute('data-filter');
      gitems.forEach(function (it) {
        var show = f === 'all' || it.getAttribute('data-cat') === f;
        it.classList.toggle('is-hidden', !show);
      });
      rebuildLightboxList();
    });
  });

  /* ---------- lightbox ---------- */
  var lb = $('#lightbox');
  var lbImg = $('#lbImg');
  var lbCap = $('#lbCap');
  var lbList = [];
  var lbIndex = 0;
  var lastFocused = null;

  function rebuildLightboxList() {
    lbList = gitems.filter(function (it) { return !it.classList.contains('is-hidden'); });
  }
  rebuildLightboxList();

  function showLb(i) {
    if (!lbList.length) return;
    lbIndex = (i + lbList.length) % lbList.length;
    var it = lbList[lbIndex];
    var full = it.getAttribute('data-full');
    var img = it.querySelector('img');
    lbImg.src = full;
    lbImg.alt = img ? img.alt : '';
    lbCap.innerHTML = it.getAttribute('data-caption') || '';
    // preload neighbours
    [1, -1].forEach(function (d) {
      var n = lbList[(lbIndex + d + lbList.length) % lbList.length];
      if (n) { var p = new Image(); p.src = n.getAttribute('data-full'); }
    });
  }

  function openLb(it) {
    rebuildLightboxList();
    lastFocused = document.activeElement;
    showLb(lbList.indexOf(it));
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('#lbClose').focus();
  }
  function closeLb() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  gitems.forEach(function (it) {
    it.setAttribute('tabindex', '0');
    it.setAttribute('role', 'button');
    it.addEventListener('click', function () { openLb(it); });
    it.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(it); }
    });
  });

  $('#lbClose').addEventListener('click', closeLb);
  $('#lbNext').addEventListener('click', function () { showLb(lbIndex + 1); });
  $('#lbPrev').addEventListener('click', function () { showLb(lbIndex - 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowRight') showLb(lbIndex + 1);
    else if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
  });

  // basic swipe on touch
  var tx = 0;
  lb.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) showLb(lbIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* ---------- to-top ---------- */
  $('#toTop').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
})();
