/* JANKS storefront behaviour: scroll-reveal, hero slideshow, testimonial rotation, small form helpers.
   Every initialiser is idempotent and re-runs when a section is (re)loaded in the Theme Editor. */
(function () {
  'use strict';

  var io = 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.01 })
    : null;

  function reveal(root) {
    (root || document).querySelectorAll('.jt-reveal:not([data-jt-r])').forEach(function (el) {
      el.setAttribute('data-jt-r', '1');
      if (io) io.observe(el); else el.classList.add('is-in');
    });
  }

  function hero(root) {
    (root || document).querySelectorAll('[data-jt-hero]:not([data-jt-ready])').forEach(function (el) {
      el.setAttribute('data-jt-ready', '1');
      var slides = el.querySelectorAll('[data-jt-slide]');
      var dots = el.querySelectorAll('[data-jt-dot]');
      var copy = el.querySelector('[data-jt-hero-copy]');
      var h1 = el.querySelector('[data-jt-hero-h1]');
      var sub = el.querySelector('[data-jt-hero-sub]');
      if (slides.length < 2) return;
      var i = 0, timer;
      function go(n) {
        if (n === i) return;
        slides[i].classList.remove('is-active');
        if (dots[i]) { dots[i].classList.remove('is-active'); dots[i].removeAttribute('aria-current'); }
        i = n;
        slides[i].classList.add('is-active');
        if (dots[i]) { dots[i].classList.add('is-active'); dots[i].setAttribute('aria-current', 'true'); }
        if (copy && h1 && sub) {
          copy.classList.add('is-out');
          setTimeout(function () {
            h1.textContent = slides[i].getAttribute('data-headline') || '';
            sub.textContent = slides[i].getAttribute('data-sub') || '';
            copy.classList.remove('is-out');
          }, 350);
        }
      }
      function start() { stop(); timer = setInterval(function () { go((i + 1) % slides.length); }, 5000); }
      function stop() { if (timer) clearInterval(timer); }
      dots.forEach(function (d, n) { d.addEventListener('click', function () { go(n); start(); }); });
      start();
    });
  }

  function testimonials(root) {
    (root || document).querySelectorAll('[data-jt-testimonials]:not([data-jt-ready])').forEach(function (el) {
      el.setAttribute('data-jt-ready', '1');
      var items = el.querySelectorAll('[data-jt-quote]');
      var dots = el.querySelectorAll('[data-jt-tdot]');
      if (items.length < 2) return;
      var i = 0, timer;
      function go(n) {
        items[i].classList.remove('is-active');
        if (dots[i]) { dots[i].classList.remove('is-active'); dots[i].removeAttribute('aria-current'); }
        i = n;
        items[i].classList.add('is-active');
        if (dots[i]) { dots[i].classList.add('is-active'); dots[i].setAttribute('aria-current', 'true'); }
      }
      function start() { if (timer) clearInterval(timer); timer = setInterval(function () { go((i + 1) % items.length); }, 4000); }
      dots.forEach(function (d, n) { d.addEventListener('click', function () { go(n); start(); }); });
      start();
    });
  }

  function init(root) { reveal(root); hero(root); testimonials(root); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
  else init();
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();
