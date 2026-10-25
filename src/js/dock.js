/* Accessible magnification for the shared dock.
   Both pointer hover and keyboard focus trigger the magnify effect, so
   keyboard users get the same feedback as pointer users.

   The magnification profile now matches the flipped codepen dock:
     distance 0  →  scale 1.5 / translateY  10
     distance 1  →  scale 1.2 / translateY   6
     distance 2  →  scale 1.1 / translateY   0
     distance > 2 → untouched

   The effect is skipped entirely for touch / reduced-motion users. */

document.querySelectorAll('.site-dock').forEach((dock) => {
  const links = Array.from(dock.querySelectorAll('a'));

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  if (reduceMotion || coarse) return;

  const SCALE_AT    = [1.5, 1.2, 1.1];
  const TRANSLATE_AT = [10, 6, 0];

  function applyMagnify(index) {
    links.forEach((link, i) => {
      const img = link.querySelector('img');
      if (!img) return;
      const distance = Math.abs(i - index);
      if (distance <= 2) {
        img.style.transform =
          `scale(${SCALE_AT[distance]}) translateY(${TRANSLATE_AT[distance]}px)`;
      } else {
        img.style.transform = '';
      }
    });
  }

  function resetMagnify() {
    links.forEach((link) => {
      const img = link.querySelector('img');
      if (img) img.style.transform = '';
    });
  }

  links.forEach((link, index) => {
    link.addEventListener('pointerenter', () => applyMagnify(index));
    link.addEventListener('focus', () => applyMagnify(index));
  });

  dock.addEventListener('pointerleave', resetMagnify);
  dock.addEventListener('focusout', (event) => {
    if (!dock.contains(event.relatedTarget)) resetMagnify();
  });
});

/* Automatically mark the link that matches the current page, so the
   running-app dot (a[aria-current="page"]::after in dock.css) appears
   under the correct icon without touching page markup.

   Manual `aria-current="page"` on a link takes precedence. */
(function markCurrentPage() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-dock a').forEach((link) => {
    if (link.hasAttribute('aria-current')) return;
    const href = link.getAttribute('href');
    if (!href) return;
    if (href.split('/').pop() === current) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();
