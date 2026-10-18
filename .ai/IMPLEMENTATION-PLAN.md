# WashPass — Implementation Plan

Status komprehensif implementasi proyek WashPass. Pekerjaan tertunda diletakkan di bagian atas (terurut prioritas P0 → P7), diikuti ringkasan terkompresi dari fase yang sudah selesai di bagian bawah.

Diperbarui: 2026-10-18 — hasil audit menyeluruh codebase dari perspektif customer baru & admin, ditulis ulang dengan prioritas berbasis temuan audit.

---

## ⏳ PENDING & NEXT TASKS (Prioritas Utama)

### P0 — Bug Kritis & Backend Hygiene ✅ Selesai (2026-10-18)
- [x] **Fix graceful shutdown bug**: simpan referensi server ke module scope; `gracefulShutdown` kini menutup DB + server dengan benar (verifikasi SIGTERM = clean exit).
- [x] **API 404 JSON handler** untuk `/api/*` (dev & prod) — `{ error: "API endpoint not found" }`, tidak lagi jatuh ke catch-all `index.html`.
- [x] **Hapus error.message leak** di catch `POST /api/orders` — kini generic `{ error: "Failed to create order" }`.
- [x] **Validasi input server-side**: guard `JSON.parse(items)` → 400, range lat/lng (-90..90 / -180..180), format whatsapp Indonesia, panjang field (nama 2-100, alamat 5-500, catatan ≤300), item category/material/wash_type/price/photoCount tervalidasi, `total_price`/`total_items` integer non-negatif, max 6 item.
- [x] **Rate limiting** (`express-rate-limit`: 300/15m untuk `/api`, 30/15m untuk POST order) + security headers (`helmet`, CSP dikonfigurasi untuk unpkg/Leaflet, Google Fonts, OSM tiles, Nominatim).
- [x] **Config via env**: `VITE_WHATSAPP_NUMBER` & `VITE_WHATSAPP_MOCK` (default mock `true` di dev, `false` di production).
- [x] **Buat `.env.example`**.
- [x] ~~Hapus file test ter-commit di `server/uploads/`~~ — ternyata sudah untracked & gitignored; tidak perlu aksi.
- [x] **Sinkronkan dokumen**: PRD (palet, engine, schema), TRD (id INTEGER, `address_note`, category `shoe`, `size_bytes`, API contract), README status, APP-FLOW durasi cuci, AGENTS status.

> **Keputusan (2026-10-18)**: admin **TANPA autentikasi** untuk MVP. Risiko `PATCH /api/orders/:id/status` terbuka dicatat sebagai *accepted risk* (mitigasi: ID order tidak diprediksi mudah, halaman `/admin` noindex). Auth ditunda ke iterasi setelah launch.

### P1 — Customer: Janji Produk yang Hilang
- [ ] **Halaman `/track`**: customer input order ID → tampilkan status, timeline status, ringkasan items (label, qty), total harga, tanggal order. Tanpa data sensitif berlebihan (tanpa alamat lengkap / GPS).
- [ ] **Endpoint `GET /api/orders/track/:id`** (public): field terbatas — `status`, items label, `total_price`, `total_items`, `created_at`, `updated_at`. 404 jika tidak ada.
- [ ] **Ganti placeholder**: nomor WA bisnis & alamat footer — generate placeholder konsisten brand sementara (siap ganti nyata kapan saja).
- [ ] **Hapus testimoni "Sarah Putri"** dari hero (`src/js/components/hero.js` + CSS terkait) — social proof palsu.
Skill: `ui-ux-pro-max` (desain halaman /track), `brand` (copy placeholder).

### P2 — Admin Operations ( hasil audit perspektif admin)
- [ ] **Pencarian** input teks di atas tabel: filter by nama / WhatsApp / order ID (client-side pada data yang sudah dimuat).
- [ ] **Filter tanggal** (Hari ini / 7 hari / Semua) + **toggle sort** (terbaru/terlama).
- [ ] **Kartu statistik**: count per status + order hari ini + total revenue hari ini → endpoint baru `GET /api/orders/stats` (aggregate `COUNT`/`SUM`/`GROUP BY` di SQLite).
- [ ] **Konfirmasi dialog** sebelum update status (order-detail) — cegah accidental click, transisi tidak bisa dibatalkan.
- [ ] **Tampilkan `updated_at`** ("Terakhir diperbarui") di detail + badge waktu selesai di list (field sudah ada di schema & sudah di-set PATCH, hanya tidak pernah dirender).
- [ ] **Auto-refresh polling ringan** (30 detik; pause saat tab hidden via `visibilitychange`).
- [ ] **Tombol copy order ID** (Clipboard API + feedback "Tersalin").
Skill: `ui-ux-pro-max` (pattern admin dashboard).

### P3 — Order Lifecycle: Status Batal + Migrasi
- [ ] **Tambah status `cancelled`**: schema CHECK constraint, `VALID_STATUSES` di server (`orders.js`), `ORDER_STATUSES` di `status.js`, transisi `pending→cancelled` dan `picked_up→cancelled`.
- [ ] **Sistem migrasi minimal** via `PRAGMA user_version` (ubah CHECK constraint SQLite = rebuild table; sekalian menutup gap "tidak ada migration system" — diperlukan juga untuk P4 manifest/schema berikutnya bila perlu).
- [ ] **UI admin**: tombol "Batalkan" + badge `cancelled` + opsi filter.

### P4 — SEO & Halaman
- [ ] **`public/sitemap.xml`** (dirujuk `robots.txt` tapi belum ada; 5 halaman + `/track` setelah P1).
- [ ] **Halaman 404 custom** (`404.html` + Vite MPA input + catch-all handler server yang benar di production untuk non-API routes).
- [ ] **Konversi `/privacy` & `/terms` ke HTML statis** (hapus render via `privacy.js`/`terms.js`; pindahkan konten ke HTML langsung; keep `legal.css` + SEO tags).
- [ ] **PWA manifest**: lengkapi icon 192×192 & 512×512 + `purpose: maskable`; samakan `theme_color` dengan design token `#0284C7` (saat ini manifest `#0D9488` vs CSS `#0284C7` — brand color drift).
Skill: `seo`.

### P5 — Quality & Polish (gabungan Security Backlog + Phase 7 lama)
- [ ] **ESLint + Prettier**: setup config + script `lint`/`format`.
- [ ] **Test minimal (vitest)**: `validators.js`, `cart.js` (min 2 pasang, merge item), status transitions, pricing helpers.
- [ ] **Fix N+1** di `GET /api/orders/:id` (fetch items + photos dengan 2 query + map, bukan loop per item).
- [ ] **Multer hardening**: upgrade `multer@1.4.5-lts` → `2.x` (kerentanan di-patch di 2.x; breaking change) + magic-byte check untuk upload image (mimetype-only bisa dipalsukan). Upgrade `uuid@9` → versi terbaru (deprecated).
- [ ] **Lighthouse audit ≥90** (Performance, Accessibility, Best Practices, SEO) via Brave (`CHROME_PATH=/bin/brave`).
- [ ] **WCAG AA review**: contrast, keyboard navigation, focus states, aria-live region untuk error form.
- [ ] **Cross-browser & responsive audit**: Brave/Firefox + WebKit/Safari mobile view; viewport <768 / 768-1024 / >1024.
Skill: `web-quality-audit` (Lighthouse/perf), `accessibility` (WCAG AA).

### P6 — Brand Assets (Phase 8.1)
- [ ] Logo resmi WashPass (vector SVG).
- [ ] Ilustrasi visual hero section (ganti kartu hero saat ini).
- [ ] Custom SVG iconography material sepatu (kanvas, kulit, suede, mesh, rubber) — ganti emoji di label `pricing.js`.
- [ ] Step visual iconography section Cara Kerja.
Skill: `design` (generasi logo/icon).

### P7 — TUNDA (setelah MVP launch)
- [ ] ~~Phase 9: Payment Gateway Midtrans Snap~~ — **DITUNDA** per keputusan 2026-10-18. Saat diaktifkan: install `midtrans-client`, `server/config/midtrans.js`, `server/routes/payment.js`, endpoint `/api/payment/create` + webhook `/api/payment/notification` + `/api/payment/status/:orderId`, migrasi `orders.payment_status` & `snap_token`, Snap redirect, `src/payment-success.html`. Gunakan skill `veritrans/midtrans-agent-skills@integrate-midtrans-payments` (belum terpasang).
- [ ] Auth admin (login/token) — jika setelah launch dibutuhkan.
- [ ] Fitur future PRD: notifikasi, scheduling pickup, review/rating, blog, multi-bahasa.

---

## ✅ COMPLETED PHASES (Ringkasan Terkompresi)

| Phase | Ruang Lingkup | Status | Rangkuman Hasil |
|---|---|---|---|
| **Phase 0: Housekeeping & Cleanup** | Repo hygiene & language stats | ✅ Selesai (2026-10-17) | Hapus `.opencode/skills` duplikat (byte-identik `.agents/skills`) + `__pycache__`; hapus `SKILL.md` rusak (209 KB HTML); `.gitattributes linguist-vendored` fix deteksi ~70% Python; fix Leaflet JS tak termuat di admin/order; hapus dep `leaflet` & 12 debug `console.log`; track `find-skills` + `skills-lock.json`. |
| **Phase 0.5: UI/UX Redesign, Mobile-First & Motion Revamp** | Design system & motion | ✅ Selesai (2026-10-17) | Palet Electric Clean Blue `#0284C7`/`#0369A1`, netral `#0F172A`/`#F8FAFC`, amber accent; token motion Kowalski (`--ease-out/in-out`, durasi 150/250/400ms) + `prefers-reduced-motion`; navbar glassmorphism sticky, sticky mobile summary bar, touch target ≥44px; scroll progress bar, scroll reveal stagger, hero entrance, back-to-top; build production sukses. |
| **Phase 1: Project Setup** | Vite + Express + SQLite setup | ✅ Selesai | Struktur monorepo mini, script dev/build, reset CSS & variable tokens, Google Fonts. |
| **Phase 2: Backend API** | Express REST & Database | ✅ Selesai | SQLite schema (`orders`, `order_items`, `order_photos`), Multer multipart upload, CRUD `/api/orders`, status patch transition validation. |
| **Phase 3: Landing Page** | 7 Section Halaman Utama | ✅ Selesai | Navbar sticky dinamis (`ResizeObserver`), Hero dengan trust badge, Cara Kerja, Keunggulan, Tabel Harga dengan tab toggle, FAQ accordion, Footer. |
| **Phase 4: Order Flow** | Form Pemesanan Multi-step | ✅ Selesai | 7 step wizard, validasi minimal 2 pasang, upload foto + Canvas API compression, Geolocation GPS + reverse geocoding OSM, integrasi fallback WhatsApp. |
| **Phase 5: Admin Panel** | Manajemen Pesanan | ✅ Selesai | Tabel list pesanan filterable status, modal detail dengan Leaflet.js interactive map, preview foto sepatu, update status real-time. |
| **Phase 6: Logic & Utilities** | Reusable Modules | ✅ Selesai | `pricing.js`, `cart.js`, `step-manager.js`, `image-compressor.js`, `validators.js`, `formatters.js`, `wa-generator.js`, `api.js`. |
| **Phase 8.2: Content & Legal** | Halaman Statis & Metadata | ✅ Selesai | SEO Meta tags, Web Manifest & Favicon, Open Graph banner, Halaman Kebijakan Privasi (`/privacy`), Syarat & Ketentuan (`/terms`), Screenshot README. |
