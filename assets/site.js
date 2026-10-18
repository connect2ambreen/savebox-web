// SaveBox — shared site behaviour. Everything here is an enhancement: every
// page reads and works fully with this file missing or JavaScript off.
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  // Theme: follow the system unless the visitor has chosen otherwise.
  var saved = null;
  try { saved = localStorage.getItem('savebox-theme'); } catch (e) {}
  if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var themeBtn = document.querySelector('.theme-btn');
    if (themeBtn) themeBtn.addEventListener('click', function () {
      var dark = root.getAttribute('data-theme') === 'dark' ||
                 (!root.hasAttribute('data-theme') &&
                  matchMedia('(prefers-color-scheme: dark)').matches);
      var next = dark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('savebox-theme', next); } catch (e) {}
    });

    // Mobile menu.
    var header = document.querySelector('.site-header');
    var menuBtn = document.querySelector('.menu-btn');
    if (header && menuBtn) {
      var setMenu = function (open) {
        header.classList.toggle('menu-open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
      };
      menuBtn.addEventListener('click', function () {
        setMenu(!header.classList.contains('menu-open'));
      });
      header.querySelectorAll('.nav a').forEach(function (a) {
        a.addEventListener('click', function () { setMenu(false); });
      });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    }

    // Header gains a border once the page has scrolled.
    if (header) {
      var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Reveal on scroll.
    var items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      items.forEach(function (el) { io.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('in'); });
    }

    var y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());
  });
})();
