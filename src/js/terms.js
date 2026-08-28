import { initFooter } from './components/footer.js';

const SECTIONS = [
  {
    title: '1. Penerimaan Syarat',
    paragraphs: [
      'Dengan mengakses dan menggunakan situs serta layanan WashPass, Anda dianggap telah membaca, memahami, dan menyetujui seluruh Syarat & Ketentuan yang tercantum di halaman ini. Jika Anda tidak menyetujui sebagian atau seluruhnya, mohon untuk tidak menggunakan layanan kami.',
    ],
  },
  {
    title: '2. Layanan',
    paragraphs: [
      'WashPass menyediakan jasa pencucian sepatu dan sandal dengan sistem pickup & delivery. Layanan meliputi:',
    ],
    bullets: [
      'Cuci Kering (Fast Clean): pencucian kering dengan estimasi 1-2 hari kerja.',
      'Cuci Basah (Deep Clean): pencucian basah menyeluruh dengan estimasi 3-5 hari kerja.',
      'Pickup & delivery gratis untuk area couverture yang tertera pada situs.',
      'Perawatan karena dapat ditambahkan pada setiap pesanan sesuai kebutuhan.',
    ],
  },
  {
    title: '3. Minimum Order & Kombinasi',
    paragraphs: [
      'Minimum pemesanan adalah 2 pasang. Anda dapat mengombinasikan sepatu dan sandal dalam satu pesanan (contoh: 1 pasang sepatu + 1 pasang sandal) selama total mencapai minimum 2 pasang.',
    ],
  },
  {
    title: '4. Harga & Pembayaran',
    paragraphs: [
      'Seluruh harga tercantum secara transparan pada situs. Harga dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya, namun harga yang berlaku adalah harga pada saat pemesanan.',
      'Pembayaran dapat dilakukan melalui transfer bank atau e-wallet. Detail pembayaran akan dikonfirmasi setelah pesanan dicatat.',
    ],
  },
  {
    title: '5. Kondisi Barang & Tanggung Jawab',
    paragraphs: [
      'Pelanggan diharapkan untuk memeriksa kondisi sepatu/sandal sebelum diserahkan ke tim pickup. WashPass tidak bertanggung jawab atas:',
    ],
    bullets: [
      'Kerusakan yang telah ada sebelumnya (sebelum diserahkan kepada kami).',
      'Barang yang tidak dilaporkan kondisinya saat pickup (misalnya sol terlepas, jahitan sobek).',
      'Barang berharga yang tertinggal di dalam/berdekatan dengan sepatu atau sandal.',
    ],
  },
  {
    title: '6. Foto & Dokumentasi',
    paragraphs: [
      'Foto sepatu/sandal yang Anda unggah digunakan untuk menilai kondisi barang sebelum pencucian serta sebagai dokumentasi. Foto hanya digunakan untuk keperluan layanan dan tidak dipublikasikan tanpa izin Anda.',
    ],
  },
  {
    title: '7. Pembatalan & Perubahan',
    paragraphs: [
      'Pembatalan atau perubahan pesanan dapat dilakukan sebelum proses pickup dimulai. Setelah barang diambil oleh tim kami, pembatalan dikenakan biaya administrasi atau tidak dapat dilakukan, sesuai kebijakan yang berlaku.',
    ],
  },
  {
    title: '8. Batas Tanggung Jawab',
    paragraphs: [
      'Sejauh yang diizinkan oleh hukum yang berlaku, tanggung jawab WashPass dibatasi pada nilai maksimal biaya pesanan yang dibayarkan. Kami tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan layanan kami.',
    ],
  },
  {
    title: '9. Perubahan Syarat & Ketentuan',
    paragraphs: [
      'WashPass dapat memperbarui Syarat & Ketentuan ini sewaktu-waktu. Perubahan akan diumumkan melalui halaman ini, dan tanggal pembaruan terakhir akan dicantumkan di bagian bawah halaman. Penggunaan layanan setelah perubahan dianggap sebagai persetujuan terhadap syarat yang baru.',
    ],
  },
  {
    title: '10. Hukum yang Berlaku & Kontak',
    paragraphs: [
      'Syarat & Ketentuan ini diatur oleh hukum yang berlaku di Republik Indonesia. Untuk pertanyaan, keluhan, atau informasi lebih lanjut mengenai layanan, silakan hubungi kami melalui kontak WhatsApp yang tersedia di situs.',
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
          <h1 class="legal-hero__title">Syarat & Ketentuan</h1>
          <p class="legal-hero__subtitle">Dokumen berikut mengatur penggunaan layanan WashPass. Mohon baca dengan saksama sebelum menggunakannya.</p>
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
