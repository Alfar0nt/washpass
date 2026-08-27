export class HowItWorks {
  constructor(container, options = {}) {
    this.container = container;
    this.steps = options.steps || [
      {
        number: 1,
        icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M21 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /><path d="M21 8.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>',
        title: 'Pesan via Website',
        description: 'Pilih jenis sepatu/sandal, bahan, tipe cuci, upload foto, dan isi alamat pickup. Proses hanya butuh 3 menit.'
      },
      {
        number: 2,
        icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /><path d="M5 12a7 7 0 1 0 14 0" /></svg>',
        title: 'Kami Jemput Sepatu Anda',
        description: 'Tim kami datang ke alamat Anda sesuai jadwal. Gratis ongkir pickup & delivery untuk area couverture.'
      },
      {
        number: 3,
        icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>',
        title: 'Bersih, Kami Antar Kembali',
        description: 'Sepatu dicuci profesional sesuai tipe yang dipilih. Diantar kembali ke pintu rumah Anda dalam kondisi bersih & wangi.'
      }
    ];
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <section id="how-it-works" class="section how-it-works" aria-labelledby="how-it-works-title">
        <div class="container">
          <div class="section-header">
            <h2 id="how-it-works-title" class="section-header__title">Cara Kerja WashPass</h2>
            <p class="section-header__description">3 langkah sederhana untuk sepatu bersih tanpa ribet</p>
          </div>
          <div class="how-it-works__steps" role="list">
            ${this.steps.map(step => `
              <article class="how-it-works__step" role="listitem">
                <div class="how-it-works__icon-wrapper">
                  <span class="how-it-works__number">${step.number}</span>
                  ${step.icon}
                </div>
                <h3 class="how-it-works__title">${step.title}</h3>
                <p class="how-it-works__description">${step.description}</p>
              </article>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
}

export function initHowItWorks(container, options) {
  return new HowItWorks(container, options);
}