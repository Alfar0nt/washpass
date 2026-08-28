import { initFooter } from './components/footer.js';

const SECTIONS = [
  {
    title: '1. Data yang Kami Kumpulkan',
    paragraphs: [
      'Saat Anda menggunakan layanan WashPass, kami mengumpulkan beberapa data berikut untuk memproses pesanan Anda:',
    ],
    bullets: [
      'Data identitas: nama, nomor WhatsApp, dan alamat untuk keperluan pickup & delivery.',
      'Data pesanan: kategori, bahan, tipe pencucian, catatan khusus, dan foto sepatu/sandal.',
      'Data lokasi: koordinat GPS (latitude & longitude) yang Anda bagikan secara opsional agar tim kami mudah menemukan alamat pickup.',
      'Data teknis: informasi perangkat, browser, dan alamat IP yang dikumpulkan secara otomatis untuk keperluan keamanan dan analisis.',
    ],
  },
  {
    title: '2. Cara Kami Menggunakan Data',
    paragraphs: [
      'Data pribadi Anda hanya digunakan untuk tujuan berikut:',
    ],
    bullets: [
      'Memproses, mengelola, dan memenuhi pesanan cuci Anda.',
      'Menjadwalkan dan melaksanakan pickup & delivery.',
      'Berkomunikasi dengan Anda terkait status pesanan melalui WhatsApp.',
      'Meningkatkan kualitas layanan, keamanan, dan pengalaman pengguna.',
    ],
  },
  {
    title: '3. Penyimpanan Data',
    paragraphs: [
      'Data pesanan Anda disimpan dalam sistem kami secara aman. Foto sepatu/sandal yang di-upload disimpan di server kami dan hanya digunakan untuk menilai kondisi serta memproses pencucian.',
      'Kami menyimpan data selama diperlukan untuk memenuhi tujuan layanan dan mematuhi kewajiban hukum yang berlaku.',
    ],
  },
  {
    title: '4. Berbagi Data dengan Pihak Ketiga',
    paragraphs: [
      'Kami tidak menjual, menyewakan, atau memperdagangkan data pribadi Anda kepada pihak lain. Data hanya dibagikan kepada pihak ketiga yang terpercaya dan semata-mata untuk mendukung operasional layanan, seperti: layanan pemetaan untuk navigasi pickup serta layanan pembayaran untuk memproses transaksi Anda.',
    ],
  },
  {
    title: '5. Keamanan Data',
    paragraphs: [
      'Kami menerapkan langkah-langkah keamanan yang wajar untuk melindungi data Anda dari akses, penggunaan, pengubahan, atau pengungkapan yang tidak sah. Namun, perlu Anda ketahui bahwa tidak ada metode transmisi data melalui internet yang sepenuhnya aman.',
    ],
  },
  {
    title: '6. Hak Anda',
    paragraphs: [
      'Anda memiliki hak untuk mengakses, memperbaiki, atau meminta penghapusan data pribadi Anda. Untuk menggunakan hak ini, silakan hubungi kami melalui kontak WhatsApp yang tersedia di situs kami.',
    ],
  },
  {
    title: '7. Perubahan Kebijakan',
    paragraphs: [
      'Kami dapat memperbarui Kebijakan Privasi ini sewaktu-waktu. Perubahan akan diumumkan melalui halaman ini, dan tanggal pembaruan terakhir akan dicantumkan di bagian bawah kebijakan ini.',
    ],
  },
];

function render() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <header class="legal-header">
      <a href="/" class="legal-header__brand" aria-label="Washpass beranda">
        <span class="legal-header__mark" aria-hidden="true">👟</span>
        <span class="legal-header__logo">WashPass</span>
      </a>
      <a href="/" class="legal-header__back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>Kembali ke Beranda</span>
      </a>
    </header>

    <main id="main" class="legal-main">
      <div class="container">
        <div class="legal-hero">
          <h1 class="legal-hero__title">Kebijakan Privasi</h1>
          <p class="legal-hero__subtitle">WashPass menghargai dan melindungi privasi Anda. Dokumen ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan menjaga data pribadi Anda.</p>
        </div>

        <div class="legal-content">
          ${SECTIONS.map((section) => `
            <section class="legal-section">
              <h2 class="legal-section__title">${section.title}</h2>
              ${section.paragraphs.map((p) => `<p class="legal-section__text">${p}</p>`).join('')}
              ${section.bullets ? `
                <ul class="legal-section__list">
                  ${section.bullets.map((b) => `<li>${b}</li>`).join('')}
                </ul>
              ` : ''}
            </section>
          `).join('')}

          <p class="legal-updated">Terakhir diperbarui: 28 Agustus 2026</p>
        </div>
      </div>
    </main>

    <footer id="footer"></footer>
  `;

  initFooter(document.getElementById('footer'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', render);
} else {
  render();
}
