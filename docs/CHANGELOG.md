# WashPass — Changelog

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
