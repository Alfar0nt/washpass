export class Hero {
  constructor(container, options = {}) {
    this.container = container;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <section class="hero" aria-labelledby="hero-title">
        <div class="container">
          <div class="hero__content">
            <div class="hero__text">
              <div class="hero__badge hero-stagger-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>Antar Jemput Gratis Se-Jabodetabek • Garansi Cuci Ulang</span>
              </div>
              <h1 id="hero-title" class="hero__title hero-stagger-2">Sepatu Bersih Seperti Baru, Tanpa Repot Keluar Rumah</h1>
              <p class="hero__subtitle hero-stagger-3">Perawatan premium khusus bahan kulit, suede, hingga canvas. Kurir kami jemput di depan pintu dan antar kembali dalam kondisi higienis, bersih tuntas, dan wangi segar.</p>
              <div class="hero__actions hero-stagger-4">
                <a href="/order" class="hero__cta-primary">
                  <span>Pesan Antar Jemput</span>
                  <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                <a href="#how-it-works" class="hero__cta-secondary">
                  <span>Lihat Cara Kerja</span>
                </a>
              </div>
            </div>
            <div class="hero__visual hero-stagger-4">
              <div class="hero__card">
                <div class="hero__card-header">
                  <div class="hero__card-avatar" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div class="hero__card-info">
                    <h4>Semudah 3 Langkah</h4>
                    <p>Tanpa repot keluar rumah</p>
                  </div>
                </div>
                <ol class="hero__steps">
                  <li class="hero__step">
                    <span class="hero__step-num">1</span>
                    <div>
                      <h5>Pesan &amp; Jemput</h5>
                      <p>Booking online, kurir menjemput di depan pintu</p>
                    </div>
                  </li>
                  <li class="hero__step">
                    <span class="hero__step-num">2</span>
                    <div>
                      <h5>Dicuci Sesuai Bahan</h5>
                      <p>Perawatan khusus kulit, suede, canvas, hingga sandal</p>
                    </div>
                  </li>
                  <li class="hero__step">
                    <span class="hero__step-num">3</span>
                    <div>
                      <h5>Diantar Kembali</h5>
                      <p>Sepatu bersih, wangi, dan siap dipakai lagi</p>
                    </div>
                  </li>
                </ol>
                <a href="/track" class="hero__card-link">Sudah pesan? Lacak status pesanan</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

export function initHero(container) {
  return new Hero(container);
}