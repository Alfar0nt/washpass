export class Navbar {
  constructor(container, options = {}) {
    this.container = container;
    this.onCtaClick = options.onCtaClick || (() => {});
    
    this.render();
    this.bindEvents();
    this.handleScroll();
  }

  render() {
    this.container.innerHTML = `
      <header class="navbar" id="navbar">
        <div class="container">
          <div class="navbar__content">
            <a href="/" class="navbar__logo" aria-label="WashPass - Beranda">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
              </svg>
              <span>WashPass</span>
            </a>
            
            <nav class="navbar__nav" id="navbarNav" aria-label="Navigasi utama">
              <a href="#how-it-works" class="navbar__link">Cara Kerja</a>
              <a href="#why-us" class="navbar__link">Keunggulan</a>
              <a href="#pricing" class="navbar__link">Harga</a>
              <a href="#faq" class="navbar__link">FAQ</a>
              <a href="/order" class="navbar__cta btn btn-primary">Pesan Sekarang</a>
            </nav>
            
            <button type="button" class="navbar__toggle" id="navbarToggle" aria-label="Buka menu" aria-expanded="false" aria-controls="navbarNav">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    `;

    this.navbar = this.container.querySelector('#navbar');
    this.nav = this.container.querySelector('#navbarNav');
    this.toggle = this.container.querySelector('#navbarToggle');
  }

  bindEvents() {
    this.toggle.addEventListener('click', () => this.toggleMenu());
    
    this.nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    
    document.addEventListener('click', (e) => {
      if (!this.navbar.contains(e.target)) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    const isOpen = this.nav.classList.toggle('navbar__nav--open');
    this.toggle.setAttribute('aria-expanded', isOpen);
    this.toggle.innerHTML = isOpen ? `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ` : `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    `;
  }

  closeMenu() {
    this.nav.classList.remove('navbar__nav--open');
    this.toggle.setAttribute('aria-expanded', 'false');
    this.toggle.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    `;
  }

  handleScroll() {
    if (window.scrollY > 20) {
      this.navbar.classList.add('navbar--scrolled');
    } else {
      this.navbar.classList.remove('navbar__scrolled');
    }
  }
}

export function initNavbar(container, options) {
  return new Navbar(container, options);
}