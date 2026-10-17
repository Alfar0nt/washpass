# WashPass — Implementation Plan

Status komprehensif implementasi proyek WashPass. Pekerjaan tertunda diletakkan di bagian atas, diikuti ringkasan terkompresi dari fase yang sudah selesai.

---

## ⏳ PENDING & NEXT TASKS (Prioritas Utama)

### 1. Phase 7: Polish & Optimization
- [ ] **7.1 Smooth Scroll & Micro-interactions**: Verifikasi konsistensi smooth scrolling lintas browser di landing page.
- [ ] **7.2 Testing & Device Compatibility**:
  - [ ] Cross-browser check (Brave/Chromium di Manjaro, Firefox, WebKit/Safari mobile view).
  - [ ] Mobile & Tablet responsive viewport audit (<768px, 768-1024px, >1024px).
- [ ] **7.3 Performance & Quality Audits**:
  - [ ] Lighthouse audit (target $\ge 90$ untuk Performance, Accessibility, Best Practices, SEO) menggunakan Brave browser.
  - [ ] Accessibility contrast & keyboard navigation review (WCAG AA).

### 2. Phase 8.1: Brand Assets
- [ ] **Asset Desain**:
  - [ ] Logo resmi WashPass (vector SVG).
  - [ ] Ilustrasi visual hero section.
  - [ ] Custom SVG iconography untuk material sepatu (kanvas, kulit, suede, mesh, rubber).
  - [ ] Step visual iconography pada section Cara Kerja.

### 3. Phase 9: Payment Gateway (Midtrans Snap)
- [ ] **9.1 Backend Setup**:
  - [ ] Install dependensi `midtrans-client`.
  - [ ] Setup `server/config/midtrans.js` & router `server/routes/payment.js`.
  - [ ] Endpoint `/api/payment/create`, webhook `/api/payment/notification`, `/api/payment/status/:orderId`.
  - [ ] Migrasi tabel `orders`: tambah `payment_status` (`unpaid`, `paid`, `failed`, `expired`) & `snap_token`.
- [ ] **9.2 Frontend Integration**:
  - [ ] Integrasi Snap redirect flow pada checkout.
  - [ ] Buat `src/payment-success.html` (halaman konfirmasi status pembayaran).

---

## ✅ COMPLETED PHASES (Ringkasan Terkompresi)

| Phase | Ruang Lingkup | Status | Rangkuman Hasil |
|---|---|---|---|
| **Phase 1: Project Setup** | Vite + Express + SQLite setup | ✅ Selesai | Struktur monorepo mini, script dev/build, reset CSS & variable tokens, Google Fonts. |
| **Phase 2: Backend API** | Express REST & Database | ✅ Selesai | SQLite schema (`orders`, `order_items`, `order_photos`), Multer multipart upload, CRUD `/api/orders`, status patch transition validation. |
| **Phase 3: Landing Page** | 7 Section Halaman Utama | ✅ Selesai | Navbar sticky dinamis (`ResizeObserver`), Hero dengan trust badge, Cara Kerja, Keunggulan, Tabel Harga dengan tab toggle, FAQ accordion, Footer. |
| **Phase 4: Order Flow** | Form Pemesanan Multi-step | ✅ Selesai | 7 step wizard, validasi minimal 2 pasang, upload foto + Canvas API compression, Geolocation GPS + reverse geocoding OSM, integrasi fallback WhatsApp. |
| **Phase 5: Admin Panel** | Manajemen Pesanan | ✅ Selesai | Tabel list pesanan filterable status, modal detail dengan Leaflet.js interactive map, preview foto sepatu, update status real-time. |
| **Phase 6: Logic & Utilities** | Reusable Modules | ✅ Selesai | `pricing.js`, `cart.js`, `step-manager.js`, `image-compressor.js`, `validators.js`, `formatters.js`, `wa-generator.js`, `api.js`. |
| **Phase 8.2: Content & Legal** | Halaman Statis & Metadata | ✅ Selesai | SEO Meta tags, Web Manifest & Favicon, Open Graph banner, Halaman Kebijakan Privasi (`/privacy`), Syarat & Ketentuan (`/terms`), Screenshot README. |
