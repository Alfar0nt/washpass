# WashPass — Changelog

---

## [v0.0.29] - 2026-10-18

Branch `demo` — versi live demo statis untuk Cloudflare Pages (tanpa backend/database).

### Added
- **Mock API localStorage** (`src/js/services/api.js`): seluruh 6 endpoint dipindah ke client-side dengan kontrak ekspor identik — caller (`order.js`, `order-list.js`, `order-detail.js`, `track.js`) tidak berubah. Foto dikompres ulang ke data URL 640px/q0.6; penanganan quota `QuotaExceededError` (strip foto → retry).
- **Seed data demo** (`src/js/services/mock-data.js`): 10 order awal campuran semua status (pending/picked_up/in_progress/done/cancelled), harga dari katalog `PRICING`, alamat + koordinat Jabodetabek, foto placeholder SVG.
- **Badge `DEMO`** di navbar landing, header order, header track, dan header admin.
- **Tombol "Reset Demo"** di header admin — kembalikan data ke seed awal.
- **Test mock API** (`src/js/services/api.test.js`, 9 test): seed, sanitasi track (tanpa PII), transisi status, stats, submit, validasi WhatsApp, reset.

### Changed
- **Header keamanan statis** (`public/_headers`): CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy — parity dengan `helmet` yang tidak aktif di mode statis.
- **Domain demo** `demo-washpass.dhiarharianto.work` di `public/sitemap.xml` & `public/robots.txt`; production branch Cloudflare Pages diset ke `demo`.
- **WhatsApp mock default**: `VITE_WHATSAPP_MOCK` kini default `true` di branch demo (redirect `wa.me` hanya jika `VITE_WHATSAPP_MOCK=false` eksplisit).
- **Backend `server/` tidak di-deploy**: tetap di repo untuk referensi/full-stack asli; Cloudflare Pages hanya melayani hasil `pnpm run build` (`dist/`).

---

## [v0.0.28] - 2026-10-18

### Added
- **Halaman Lacak Pesanan (`/track`)**: input nomor pesanan → status, timeline 4 tahap, rincian item, total, tanggal. Endpoint publik `GET /api/orders/track/:id` (tanpa PII).
- **Statistik Admin**: endpoint `GET /api/orders/stats` + kartu ringkasan (count per status, order & pendapatan hari ini).
- **Pencarian, filter tanggal, dan sort** pada daftar pesanan admin + auto-refresh 30 detik.
- **Status `cancelled`** dengan transisi `pending`/`picked_up → cancelled`, tombol "Batalkan Pesanan", badge + kartu statistik.
- **Sistem migrasi database** minimal via `PRAGMA user_version` (rebuild tabel `orders` untuk CHECK status baru).
- **Halaman 404** custom, `public/sitemap.xml`, ikon PWA 192/512 + maskable.
- **Tooling kualitas**: ESLint (flat config), Prettier, Vitest (21 test) + script `lint`, `format`, `test`.
- **`.env.example`** (`PORT`, `NODE_ENV`, `VITE_WHATSAPP_NUMBER`, `VITE_WHATSAPP_MOCK`).

### Changed
- **Legal pages** (`/privacy`, `/terms`) dikonversi ke HTML statis (SEO-friendly) — `privacy.js`/`terms.js` dihapus, footer via `legal.js`.
- **Google Fonts** dipindah dari `@import` CSS ke `<link>` (memutus rantai render-blocking).
- **Keamanan backend**: helmet + CSP, rate limiting, validasi input menyeluruh, magic-byte check upload, API 404 JSON, perbaikan graceful shutdown.
- **WhatsApp number** bersumber dari satu env (`VITE_WHATSAPP_NUMBER`).
- **Dependency**: `multer` 2.x, `uuid` 14.

### Fixed
- Bug graceful shutdown (`server` undefined), kebocoran pesan error internal, N+1 query di detail order.
- Badge status tak berwarna (kelas Tailwind yang tidak ada) → kelas CSS semantik.
- Heading order hero (h1→h4) dan brand color drift (`theme-color`, manifest).
- Placeholder nomor WA/alamat footer; testimoni hero palsu dihapus.

---

## [v0.0.27] - 2026-10-18

### Added
- **Skills Ekosistem**: Menambahkan skill `animate` (Emil Kowalski Animation Philosophy) dan `copywriting` (`coreyhaines31/marketingskills`).
- **Scroll & Motion Interactive**:
  - Top scroll reading progress bar (`.scroll-progress`) dinamis di puncak layar landing page.
  - Floating back-to-top button (`.back-to-top`) dengan transisi fade & translate saat scroll $> 300\text{px}$.
  - Scroll reveal stagger menggunakan `IntersectionObserver` ringan pada section Cara Kerja, Keunggulan, Tabel Harga, dan FAQ.
  - Stagger entrance animation (`.hero-stagger-1` s/d `4`) pada hero section saat render pertama kali.

### Fixed
- **WCAG AA Color Contrast & Visibility**:
  - Memperbaiki konflik teks putih di atas latar belakang terang di hero section (`.hero__cta-primary`, `.hero__card`, stat badges).
  - Memperbaiki margin, padding, dan alignment tombol CTA Hero dan FAQ accordion agar tidak mepet ke border/background container.
  - Menyelaraskan touch target minimal $\ge 44 \times 44\text{px}$ pada seluruh button dan link navigasi.

### Changed
- **Design System & Color Tokens (`DESIGN.md` & `variables.css`)**:
  - Mengubah brand primary ke Clean Modern Aqua (`#0284C7`), dark hover (`#0369A1`), tint wash (`#E0F2FE`), slate background (`#F8FAFC`), dan deep slate text (`#0F172A`).
  - Menetapkan physics motion tokens (`--ease-out`, `--ease-in-out`, durasi 150ms/250ms/400ms) dengan dukungan otomatis `prefers-reduced-motion`.
- **High-Converting Copywriting & Typography**:
  - Mengubah headline dan copy hero section menjadi lebih berorientasi pada benefit nyata pelanggan ("Sepatu Bersih Seperti Baru, Tanpa Repot Keluar Rumah").
  - Memperbaiki copywriting benefit dan alur langkah Cara Kerja agar lebih meyakinkan dan bebas dari frasa klise/kering.
- **Mobile-First UX Optimization**:
  - Menambahkan mobile sticky summary bar pada formulir order di layar resolusi $< 768\text{px}`.
  - Memperbaiki layout navbar sticky dengan glassmorphism blur dan menu toggle responsif.

---

## [v0.0.26] - 2026-10-17

### Removed
- Folder `.opencode/skills/` duplikat (byte-identik dengan `.agents/skills/`) beserta 3 artefak `__pycache__/*.pyc` yang ter-track.
- File `.agents/skills/SKILL.md` rusak (209 KB halaman HTML GitHub, hasil unduhan gagal).
- Dependency npm `leaflet` yang tidak lagi diimpor (Leaflet dilayani via CDN).

### Fixed
- **Peta Leaflet tidak dirender**: Leaflet JS tidak pernah dimuat (hanya CSS). Menambahkan `<script>` CDN Leaflet 1.9.4 + SRI pada `src/admin.html` dan `src/order.html`.
- Menghapus 12 `console.log` debug pada alur order (`src/js/order.js`) dan landing (`src/js/main.js`).

### Changed
- Menambahkan `.gitattributes`: `.agents/skills/** linguist-vendored` agar GitHub Linguist tidak menghitung Python dari skill pack (memperbaiki deteksi bahasa repo yang sebelumnya ~70% Python).
- `.gitignore`: menambahkan `__pycache__/` dan `*.pyc`.
- Menambahkan tracking `.agents/skills/find-skills/` + `.agents/skills/skills-lock.json` agar skill tersedia di mesin lain/kolaborator.

### Added
- Skill global untuk Phase 7.3: `accessibility`, `web-quality-audit`, `seo` (dari `addyosmani/web-quality-skills`).

---

## [v0.0.25] - 2026-10-17

### Changed
- **Refactoring Dokumentasi `.ai/`**:
  - `ux-flow.md` → direfaktor menjadi `.ai/APP-FLOW.md` (arsitektur alur, state machine pesanan, sitemap, wireframe, penanganan edge cases).
  - `tech-stack.md` → direfaktor menjadi `.ai/TRD.md` (arsitektur sistem, stack dependensi, skema DB SQLite lengkap, kontrak REST API).
  - `tasks.md` → direfaktor menjadi `.ai/IMPLEMENTATION-PLAN.md` (fase yang selesai dikompresi ringkas, task pending Phase 7, 8.1, 9 diposisikan di paling atas).
  - Menambahkan `.ai/DESIGN.md` merangkum design tokens aktif (palette warna, skala tipografi, spacing, radius, shadow, komponen).
  - Menghapus file usang `.ai/ux-flow.md`, `.ai/tech-stack.md`, dan `.ai/tasks.md`.
- **Standar Autonomous Agent (`AGENTS.md`)**:
  - Menambahkan konfigurasi default browser pengujian: Brave Browser (`/bin/brave`) di Linux Manjaro untuk audit Lighthouse dan testing responsivitas.
  - Menetapkan aturan wajib konfirmasi ke user setelah prompt jika terdapat instruksi ambigu untuk mencegah halusinasi.
- **Root README & Dokumen Pendukung**:
  - Memperbarui tautan referensi dokumentasi di `README.md` mengarah ke file `.ai/` baru.
  - Kompresi changelog riwayat rilis terdahulu.

---

## [v0.0.24] - 2026-08-28

### Added
- Phase 8.2 Content Creation: Open Graph banner (`public/og-image.png`, 1200×630).
- Halaman Kebijakan Privasi (`/privacy` → `src/privacy.html`, `src/js/privacy.js`) & Syarat Ketentuan (`/terms` → `src/terms.html`, `src/js/terms.js`).
- Shared styling legal pages `src/css/pages/legal.css`.

### Changed
- `vite.config.js` & `server/index.js`: Clean-URL rewrite MPA untuk rute `/order`, `/admin`, `/privacy`, `/terms`.
- `README.md`: Screenshot showcase & tabel rute halaman.

---

## [v0.0.23] - 2026-08-28

### Fixed
- Progress indicator tidak ter-reset saat pengguna mundur dan mengubah pilihan kategori/bahan/tipe cuci.
- Menambahkan method `resetFrom(index)` pada `StepManager` dan integrasi di handler pemilihan `src/js/order.js`.

---

## [v0.0.22] - 2026-08-28

### Added
- Phase 7 Polish UX: Micro-animations, loading state submission, touch targets min 44px, smooth scroll support.
- Accessibility fixes: Focus states, kontras warna, WCAG compliance.
- SEO & Web Manifest: Favicon SVG, `manifest.webmanifest`, Open Graph tags.

---

## [v0.0.21] - 2026-08-27

### Added & Fixed
- Admin modal preview foto pesanan popup internal (bukan tab baru) dengan keyboard navigation & fullscreen toggle.
- Akses keranjang langsung dari setiap step order wizard.
- Navigasi step order bebas dengan persistensi form di `sessionStorage`.
- Bottom sheet modal view untuk tampilan admin mobile.

---

## [v0.0.20] - 2026-08-27

### Fixed
- Admin detail modal stuck di loading spinner karena default overlay style flex.
- Menambahkan AbortController 15 detik timeout di client API `src/js/services/api.js`.

---

## [v0.0.19] - 2026-08-27

### Fixed
- Error `SQLITE_CONSTRAINT: NOT NULL constraint failed: order_items.category` pada pemesanan kategori sandal.

---

## [v0.0.18] - 2026-08-27

### Changed & Fixed
- Server-side confirmation first sebelum alur WhatsApp. Tombol menjadi "Konfirmasi Order".
- Toggle mode mock WhatsApp (`WHATSAPP_MOCK = true`).
- Pesan error internal SQLite ditampilkan transparan di response JSON API.

---

## [v0.0.17] - 2026-08-27

### Fixed
- Data diri hilang saat klik "Ubah Data Diri" dari step konfirmasi.
- Upload foto terputus di submission multipart form data; sekarang disinkronkan langsung dari keranjang aktif.

---

## [v0.0.11 - v0.0.16] - 2026-08-27

### Fixed & Added
- Sinkronisasi kalkulasi progress bar wizard order flow (`currentStepIndex / (steps.length - 1)`).
- Penanganan multi-item keranjang: pencegahan penghapusan item saat tambah pasang kedua.
- Pencegahan double-advance step wizard navigation.
- Presisi alignment garis horizontal section "Cara Kerja" di landing page.
- Tombol navigasi "Kembali ke Beranda" & sticky header order flow.

---

## [v0.0.7 - v0.0.10] - 2026-08-27

### Fixed & Added
- Auto-retry port backend alternatif jika port 3000 terpakai + script `pnpm clean:ports`.
- Deteksi context HTTPS / localhost untuk Geolocation API.
- Pemisahan isolasi scope DOM photo uploader component.
- Serialisasi JSON keranjang untuk sanitasi objek file binary.

---

## [v0.0.1 - v0.0.6] - 2026-08-25 s.d. 2026-08-27

### Added
- **Fondasi Proyek & Backend**: Inisialisasi Vite MPA, Express REST API, migrasi ke `sqlite3` + `sqlite` async.
- **Landing Page**: 7 section modular (Navbar, Hero, Cara Kerja, Keunggulan, Tabel Harga, FAQ, Footer).
- **Order Wizard Flow**: 7 step pemesanan, kompresi foto Canvas API, GPS Geolocation + Nominatim OSM.
- **Admin Panel**: Dashboard list order, detail modal, preview koordinat Leaflet.js, mutasi status pesanan.
