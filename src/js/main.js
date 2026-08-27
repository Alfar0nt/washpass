import { initNavbar } from './components/navbar.js';
import { initFAQ } from './components/faq.js';
import { initHero } from './components/hero.js';
import { initHowItWorks } from './components/how-it-works.js';
import { initWhyUs } from './components/why-us.js';
import { initPriceTable } from './components/price-table.js';
import { initFooter } from './components/footer.js';
import { initNavbarHeightOffset } from './utils/navbar-height.js';

function init() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <header id="navbar"></header>
    <main id="main">
      <section id="hero"></section>
      <section id="how-it-works"></section>
      <section id="why-us"></section>
      <section id="pricing"></section>
      <section id="faq"></section>
    </main>
    <footer id="footer"></footer>
  `;

  initNavbar(document.getElementById('navbar'));
  initNavbarHeightOffset('.navbar');
  initHero(document.getElementById('hero'));
  initHowItWorks(document.getElementById('how-it-works'));
  initWhyUs(document.getElementById('why-us'));
  initPriceTable(document.getElementById('pricing'));
  
  initFAQ(document.getElementById('faq'), {
    faqs: [
      {
        question: 'Berapa minimal order?',
        answer: 'Minimal order adalah 2 pasang. Anda bisa kombinasi sepatu dan sandal (contoh: 1 pasang sepatu + 1 pasang sandal).'
      },
      {
        question: 'Berapa lama proses pencucian?',
        answer: 'Cuci Kering (Fast Clean): 1-2 hari kerja. Cuci Basah (Deep Clean): 3-5 hari kerja. Estimasi waktu tergantung pada volume order.'
      },
      {
        question: 'Apakah pickup & delivery benar-benar gratis?',
        answer: 'Ya, gratis untuk area couverture kami (Depok, Jakarta Selatan, Jakarta Barat bagian). Untuk area di luar couverture, akan ada biaya tambahan yang dikonfirmasi sebelum pickup.'
      },
      {
        question: 'Bagaimana cara pembayaran?',
        answer: 'Pembayaran dilakukan via transfer bank/e-wallet setelah order dikonfirmasi via WhatsApp. Detail rekening akan dikirim saat konfirmasi.'
      },
      {
        question: 'Apakah aman untuk sepatu branded/premium?',
        answer: 'Sangat aman. Kami menggunakan deterjen khusus per bahan (kain, kulit, suede, mesh) dan metode pencucian yang disesuaikan. Sepatu premium mendapatkan perlakuan khusus (Fast Clean direkomendasikan).'
      },
      {
        question: 'Apa yang perlu disiapkan sebelum pickup?',
        answer: 'Hanya perlu menyerahkan sepatu/sandal ke tim pickup. Foto & catatan sudah di-upload saat order. Tim kami akan membawa tas khusus untuk pengiriman.'
      }
    ],
    allowMultiple: false
  });
  
  initFooter(document.getElementById('footer'));
  
  console.log('WashPass Landing Page loaded');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}