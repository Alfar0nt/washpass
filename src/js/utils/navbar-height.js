let navbarHeight = 0;
let observer = null;

export function initNavbarHeightOffset(navbarSelector = '.navbar') {
  const navbar = document.querySelector(navbarSelector);
  if (!navbar) return;

  function updateOffset() {
    const height = navbar.offsetHeight;
    if (height !== navbarHeight) {
      navbarHeight = height;
      document.body.style.paddingTop = `${navbarHeight}px`;
    }
  }

  // Initial calculation
  updateOffset();

  // Observe navbar for height changes (e.g., when scrolled class is added)
  observer = new ResizeObserver(() => {
    updateOffset();
  });
  observer.observe(navbar);

  // Also recalculate on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateOffset, 50);
  });

  return {
    destroy: () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      window.removeEventListener('resize', updateOffset);
      document.body.style.paddingTop = '';
    },
    getHeight: () => navbarHeight,
  };
}

export function getNavbarHeight() {
  return navbarHeight;
}