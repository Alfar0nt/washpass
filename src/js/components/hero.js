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
              <div class="hero__badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>Pickup & Delivery Gratis • Minimal 2 Pasang</span>
              </div>
              <h1 id="hero-title" class="hero__title">Sepatu Bersih, Tinggal Duduk Manis</h1>
              <p class="hero__subtitle">Layanan cuci sepatu & sandal profesional dengan sistem jemput-antar ke depan pintu. Harga transparan, kualitas terjamin, tanpa ribet.</p>
              <div class="hero__actions">
                <a href="/order" class="btn btn-primary btn-lg hero__cta-primary">
                  <span>Pesan Sekarang</span>
                  <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                <a href="#how-it-works" class="btn btn-outline btn-lg hero__cta-secondary">
                  <span>Cara Kerja</span>
                </a>
              </div>
            </div>
            <div class="hero__visual">
              <div class="hero__card">
                <div class="hero__card-header">
                  <div class="hero__card-avatar">SR</div>
                  <div class="hero__card-info">
                    <h4>Sarah Putri</h4>
                    <p>Mahasiswa, Depok</p>
                  </div>
                </div>
                <div class="hero__stats">
                  <div class="hero__stat">
                    <div class="hero__stat-number">3×</div>
                    <div class="hero__stat-label">Sudah Pesan</div>
                  </div>
                  <div class="hero__stat">
                    <div class="hero__stat-number">2 Hari</div>
                    <div class="hero__stat-label">Proses Cepat</div>
                  </div>
                  <div class="hero__stat">
                    <div class="hero__stat-number">Rp 70rb</div>
                    <div class="hero__stat-label">Hemat/bulan</div>
                  </div>
                </div>
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