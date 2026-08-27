export class Footer {
  constructor(container, options = {}) {
    this.container = container;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <footer class="footer" role="contentinfo">
        <div class="container">
          <div class="footer__grid">
            <div class="footer__brand">
              <div class="footer__logo">
                <div class="footer__logo-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                  </svg>
                </div>
                <span class="footer__logo-text">WashPass</span>
              </div>
              <p class="footer__description">Layanan cuci sepatu & sandal profesional dengan sistem pickup & delivery gratis. Sepatu bersih, tinggal duduk manis.</p>
              <div class="footer__social">
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener" class="footer__social-link" aria-label="WhatsApp">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener" class="footer__social-link" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 class="footer__column-title">Navigasi</h3>
              <ul class="footer__links">
                <li><a href="/" class="footer__link">Beranda</a></li>
                <li><a href="/order" class="footer__link">Pesan Sekarang</a></li>
                <li><a href="#pricing" class="footer__link">Harga</a></li>
                <li><a href="#how-it-works" class="footer__link">Cara Kerja</a></li>
                <li><a href="#faq" class="footer__link">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 class="footer__column-title">Layanan</h3>
              <ul class="footer__links">
                <li><a href="#" class="footer__link">Cuci Sepatu</a></li>
                <li><a href="#" class="footer__link">Cuci Sandal</a></li>
                <li><a href="#" class="footer__link">Cuci Kering (Fast Clean)</a></li>
                <li><a href="#" class="footer__link">Cuci Basah (Deep Clean)</a></li>
                <li><a href="#" class="footer__link">Area Layanan</a></li>
              </ul>
            </div>
            <div>
              <h3 class="footer__column-title">Kontak</h3>
              <ul class="footer__contact">
                <li class="footer__contact-item">
                  <svg class="footer__contact-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Jl. Contoh No. 123, Kelurahan Contoh, Kecamatan Contoh, Kota Depok</span>
                </li>
                <li class="footer__contact-item">
                  <svg class="footer__contact-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <a href="https://wa.me/6281234567890" class="footer__link">0812-3456-7890</a>
                </li>
                <li class="footer__contact-item">
                  <svg class="footer__contact-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  <span>Senin - Minggu: 08.00 - 20.00 WIB</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="footer__bottom">
            <p class="footer__copyright">&copy; 2024 WashPass. Semua hak dilindungi.</p>
            <nav class="footer__legal" aria-label="Legal links">
              <a href="#" class="footer__legal-link">Kebijakan Privasi</a>
              <a href="#" class="footer__legal-link">Syarat & Ketentuan</a>
            </nav>
          </div>
        </div>
      </footer>
    `;
  }
}

export function initFooter(container) {
  return new Footer(container);
}