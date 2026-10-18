# WashPass — Implementation Plan

Status komprehensif implementasi proyek WashPass. Pekerjaan tertunda diletakkan di bagian atas, diikuti ringkasan terkompresi dari fase yang sudah selesai.

---

## ⏳ PENDING & NEXT TASKS (Prioritas Utama)

### 0. UI/UX Redesign, Mobile-First & Motion Revamp (Selesai Implementasi)
- [x] **0.1 Design System & Token Overhaul (`DESIGN.md` & `variables.css`)**:
  - Terapkan palet baru: Electric Clean Blue / Modern Aqua (`#0284C7` / `#0369A1`), Crisp Neutral Dark Slate (`#0F172A`), Light Slate Canvas (`#F8FAFC`), Vibrant Amber Accent (`#F59E0B`).
  - Update tipografi: Heading `Plus Jakarta Sans` (bold modern display), Body `Inter` (neutral legible).
  - Setup token motion kurva Emil Kowalski (`--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`, `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)`), durasi mikro (`150ms`, `250ms`, `400ms`).
  - Dukungan native `prefers-reduced-motion` token fallback.
- [x] **0.2 Mobile-First Navigation & Layout Architecture**:
  - Navbar responsive dengan fluid glassmorphism blur (`backdrop-filter: blur(12px)`), menu dropdown mobile accessible.
  - Sticky mobile summary bar pada alur order `< 768px` (`.order-mobile-bar`), safe-area compliant.
  - Sentuhan target interaktif $\ge 44 \times 44$ px, feedback haptic visual tap (active transform scale `0.98` & `0.96`).
- [x] **0.3 Animasi & Motion Enhancements**:
  - **Scroll Progress Bar**: Top reading progress indicator dinamis di puncak layar landing page (`.scroll-progress`).
  - **Scroll Reveal / Stagger**: Menggunakan native CSS + `IntersectionObserver` ringan (`.reveal` $\rightarrow$ `.reveal--visible`) pada section How It Works, Why Us, Price Table, dan FAQ.
  - **Hero Entrance**: Stagger fade-in + slide-up (`.hero-stagger-1` s/d `.hero-stagger-4`) saat landing pertama kali dimuat.
  - **Back-to-Top Button**: Tombol floating interaktif pojok kanan bawah dengan transisi smooth saat scroll $> 300\text{px}$.
- [x] **0.4 Review Kualitas & Production Build**:
  - Build Vite production sukses tanpa error (`pnpm run build` berhasil menghasilkan bundle `dist/`).

### 1. Security Backlog
- [ ] **Dependency Upgrade**: `multer@1.4.5-lts` punya kerentanan yang dipatch di 2.x, dan `uuid@9` sudah deprecated. Upgrade bersifat breaking → dikerjakan terpisah.

### 2. Phase 7: Polish & Optimization
- [ ] **7.1 Smooth Scroll & Micro-interactions**: Verifikasi konsistensi smooth scrolling lintas browser di landing page.
- [ ] **7.2 Testing & Device Compatibility**:
  - [ ] Cross-browser check (Brave/Chromium di Manjaro, Firefox, WebKit/Safari mobile view).
  - [ ] Mobile & Tablet responsive viewport audit (<768px, 768-1024px, >1024px).
- [ ] **7.3 Performance & Quality Audits**:
  - [ ] Lighthouse audit (target $\ge 90$ untuk Performance, Accessibility, Best Practices, SEO) menggunakan Brave browser.
  - [ ] Accessibility contrast & keyboard navigation review (WCAG AA).

### 3. Phase 8.1: Brand Assets
- [ ] **Asset Desain**:
  - [ ] Logo resmi WashPass (vector SVG).
  - [ ] Ilustrasi visual hero section.
  - [ ] Custom SVG iconography untuk material sepatu (kanvas, kulit, suede, mesh, rubber).
  - [ ] Step visual iconography pada section Cara Kerja.

### 4. Phase 9: Payment Gateway (Midtrans Snap)
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
| **Phase 0: Housekeeping & Cleanup** | Repo hygiene & language stats | ✅ Selesai (2026-10-17) | Hapus `.opencode/skills` duplikat (byte-identik `.agents/skills`) + `__pycache__`; hapus `SKILL.md` rusak (209 KB HTML); `.gitattributes linguist-vendored` fix deteksi ~70% Python; fix Leaflet JS tak termuat di admin/order; hapus dep `leaflet` & 12 debug `console.log`; track `find-skills` + `skills-lock.json`. |
| **Phase 1: Project Setup** | Vite + Express + SQLite setup | ✅ Selesai | Struktur monorepo mini, script dev/build, reset CSS & variable tokens, Google Fonts. |
| **Phase 2: Backend API** | Express REST & Database | ✅ Selesai | SQLite schema (`orders`, `order_items`, `order_photos`), Multer multipart upload, CRUD `/api/orders`, status patch transition validation. |
| **Phase 3: Landing Page** | 7 Section Halaman Utama | ✅ Selesai | Navbar sticky dinamis (`ResizeObserver`), Hero dengan trust badge, Cara Kerja, Keunggulan, Tabel Harga dengan tab toggle, FAQ accordion, Footer. |
| **Phase 4: Order Flow** | Form Pemesanan Multi-step | ✅ Selesai | 7 step wizard, validasi minimal 2 pasang, upload foto + Canvas API compression, Geolocation GPS + reverse geocoding OSM, integrasi fallback WhatsApp. |
| **Phase 5: Admin Panel** | Manajemen Pesanan | ✅ Selesai | Tabel list pesanan filterable status, modal detail dengan Leaflet.js interactive map, preview foto sepatu, update status real-time. |
| **Phase 6: Logic & Utilities** | Reusable Modules | ✅ Selesai | `pricing.js`, `cart.js`, `step-manager.js`, `image-compressor.js`, `validators.js`, `formatters.js`, `wa-generator.js`, `api.js`. |
| **Phase 8.2: Content & Legal** | Halaman Statis & Metadata | ✅ Selesai | SEO Meta tags, Web Manifest & Favicon, Open Graph banner, Halaman Kebijakan Privasi (`/privacy`), Syarat & Ketentuan (`/terms`), Screenshot README. |
