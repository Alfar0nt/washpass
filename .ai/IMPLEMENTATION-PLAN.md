# WashPass — Implementation Plan

Status komprehensif implementasi proyek WashPass. Pekerjaan tertunda diletakkan di bagian atas, diikuti ringkasan terkompresi dari pekerjaan yang sudah selesai di bagian bawah.

Diperbarui: 2026-10-18 — audit remediasi P0–P5 selesai (customer + admin), tinggal P6 (brand assets) & P7 (ditunda pasca-MVP).

---

## ⏳ PENDING & NEXT TASKS (Prioritas Utama)

### P6 — Brand Assets
- [ ] Logo resmi WashPass (vector SVG).
- [ ] Ilustrasi visual hero section (ganti kartu hero saat ini).
- [ ] Custom SVG iconography material sepatu (kanvas, kulit, suede, mesh, rubber) — ganti emoji di label `pricing.js`.
- [ ] Step visual iconography section Cara Kerja.
- [ ] (Bonus) Ganti emoji `👟` di header legal/track & favicon bila logo resmi sudah ada.
Skill: `design` (generasi logo/icon).

### P7 — TUNDA (setelah MVP launch)
- [ ] ~~Phase 9: Payment Gateway Midtrans Snap~~ — **DITUNDA** per keputusan 2026-10-18. Saat diaktifkan: install `midtrans-client`, `server/config/midtrans.js`, `server/routes/payment.js`, endpoint `/api/payment/create` + webhook `/api/payment/notification` + `/api/payment/status/:orderId`, migrasi `orders.payment_status` & `snap_token`, Snap redirect, `src/payment-success.html`. Gunakan skill `veritrans/midtrans-agent-skills@integrate-midtrans-payments` (belum terpasang).
- [ ] Auth admin (login/token) — jika setelah launch dibutuhkan.
- [ ] Fitur future PRD: notifikasi, scheduling pickup, review/rating, blog, multi-bahasa.

---

## ✅ COMPLETED (Ringkasan Terkompresi)

### Audit Remediasi (2026-10-18)
| Prioritas | Ruang Lingkup | Status | Rangkuman Hasil |
|---|---|---|---|
| **P0: Bug Kritis & Backend Hygiene** | Keamanan & bug backend | ✅ Selesai | Fix graceful shutdown; API 404 JSON; hapus error.message leak; validasi input server menyeluruh; express-rate-limit (300/15m API, 30/15m POST) + helmet/CSP; config `VITE_WHATSAPP_NUMBER`/`VITE_WHATSAPP_MOCK`; `.env.example`; sinkronisasi dokumen (PRD/TRD/README/APP-FLOW/AGENTS). |
| **P1: Customer (janji produk)** | Tracking & placeholder | ✅ Selesai | Halaman `/track` (timeline + rincian) + endpoint `GET /api/orders/track/:id` (tanpa PII); WA number dari env tunggal; alamat footer diperbaiki; testimoni hero palsu dihapus → kartu "Semudah 3 Langkah". |
| **P2: Admin Operations** | UX operasional admin | ✅ Selesai | Pencarian (nama/WA/ID), filter tanggal, sort; kartu statistik + `GET /api/orders/stats`; konfirmasi ganti status; render `updated_at`; auto-refresh 30s; tombol copy order ID; fix bug filter status. |
| **P3: Order Lifecycle** | Status batal + migrasi | ✅ Selesai | Status `cancelled` (schema/server/frontend); sistem migrasi `PRAGMA user_version` (rebuild tabel); tombol "Batalkan Pesanan"; fix badge status tak berwarna → `status-badge--*`. |
| **P4: SEO & Halaman** | Metadata & halaman | ✅ Selesai | `sitemap.xml`; halaman 404 custom (server status 404); `/privacy` & `/terms` → HTML statis; PWA manifest ikon 192/512 + maskable; `theme_color` diselaraskan `#0284C7`. |
| **P5: Quality & Polish** | Tooling, performa, a11y | ✅ Selesai | ESLint + Prettier + Vitest (21 test); fix N+1 detail order; Multer 2.x + magic-byte check, uuid 14; Lighthouse (Brave) landing 96/100/100/100, order 94/90/100/100; font `@import`→`<link>`, heading order, robots absolut; WCAG AA 90-100. |

### Fase Awal (Phase 0–8.2)
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

### Catatan Penting (Accepted Risks & Follow-up)
- **Tanpa auth admin** (keputusan MVP): `PATCH /api/orders/:id/status` terbuka — *accepted risk*. Auth ditunda ke iterasi pasca-launch.
- **Tracking enumerable**: order ID sekuensial → endpoint `/track` dapat dienumerasi (hanya status/items/harga, tanpa PII). Bisa ditambah verifikasi nomor WA bila perlu.
- **Domain placeholder** `washpass.example.com` di `public/sitemap.xml` + `public/robots.txt` — **ganti saat deploy**.
- `/track` sengaja `noindex` (halaman utilitas) → skor SEO Lighthouse rendah (bukan masalah).
- **Lint**: 26 warning (debt lama kode existing), 0 error. Perapian menyeluruh = pekerjaan tersendiri.
- Verifikasi manual Firefox disarankan (Lighthouse hanya Chromium; audit dijalankan via Brave).
