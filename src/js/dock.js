/* Accessible magnification for the shared dock. */
document.querySelectorAll('.site-dock').forEach((dock) => {
  const links = Array.from(dock.querySelectorAll('a'));
  const icons = links.map((link) => link.querySelector('img'));

  const resetIcons = () => {
    icons.forEach((item) => {
      if (item) item.style.transform = "scale(1) translateY(0px)";
    });
  };

  const focus = (index) => {
    resetIcons();
    const transformations = [
      { idx: index - 2, scale: 1.1, translateY: 0 },
      { idx: index - 1, scale: 1.2, translateY: 6 },
      { idx: index, scale: 1.5, translateY: 10 },
      { idx: index + 1, scale: 1.2, translateY: 6 },
      { idx: index + 2, scale: 1.1, translateY: 0 }
    ];

    transformations.forEach(({ idx, scale, translateY }) => {
      if (icons[idx]) {
        icons[idx].style.transform = `scale(${scale}) translateY(${translateY}px)`;
      }
    });
  };

  links.forEach((link, index) => {
    link.addEventListener("mouseover", () => focus(index));
    link.addEventListener("focus", () => focus(index));
    link.addEventListener("mouseleave", resetIcons);
    link.addEventListener("blur", resetIcons);
  });

  dock.addEventListener("mouseleave", resetIcons);
});

/* Automatically mark the active page */
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
