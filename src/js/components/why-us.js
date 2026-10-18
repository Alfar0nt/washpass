export class WhyUs {
  constructor(container, options = {}) {
    this.container = container;
    this.features = options.features || [
      {
        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /><path d="M5 12a7 7 0 1 0 14 0" /></svg>',
        title: 'Gratis Ongkir Antar Jemput',
        description: 'Layanan pickup dan delivery tanpa biaya tambahan sepeserpun di wilayah jangkauan kami.'
      },
      {
        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>',
        title: 'Standar Treatment Spesialis',
        description: 'Deterjen ramah material dan teknik treatment presisi untuk kanvas, leather, suede, hingga knit.'
      },
      {
        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>',
        title: 'Pasti Bersih & Transparan',
        description: 'Daftar harga terbuka tanpa biaya tersembunyi. Progres cuci terpantau jelas langsung ke WhatsApp Anda.'
      },
      {
        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>',
        title: '100% Garansi Cuci Ulang',
        description: 'Kurang puas dengan noda yang tersisa? Kami cuci ulang gratis sampai Anda benar-benar puas.'
      }
    ];
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <section id="why-us" class="section why-us reveal" aria-labelledby="why-us-title">
        <div class="container">
          <div class="section-header">
            <h2 id="why-us-title" class="section-header__title">Kenapa WashPass?</h2>
            <p class="section-header__description">Keunggulan layanan cuci sepatu & sandal kami</p>
          </div>
          <div class="why-us__grid" role="list">
            ${this.features.map(feature => `
              <article class="why-us__card reveal" role="listitem">
                <div class="why-us__icon" aria-hidden="true">${feature.icon}</div>
                <h3 class="why-us__title">${feature.title}</h3>
                <p class="why-us__description">${feature.description}</p>
              </article>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
}

export function initWhyUs(container, options) {
  return new WhyUs(container, options);
}