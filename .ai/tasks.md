# WashPass — Task Breakdown

> **Versi:** 1.3  
> **Tanggal:** 27 Agustus 2026  
> **Status:** Phase 1, 2, 3, 4, 5, 6 Completed — Phase 7, 8 Remaining  
> **Update:** Landing page completed, image compression integrated

---

## Phase 1: Project Setup & Foundation ✅ **COMPLETED**

- [x] Inisialisasi project Vite (vanilla JS) di folder `src/`
- [x] Setup folder structure sesuai tech-stack.md (frontend + backend)
- [x] Install dependencies: `vite`, `express`, `better-sqlite3`, `multer`, `cors`, `uuid`, `leaflet`
- [x] Setup `package.json` scripts: `dev`, `dev:server`, `dev:all`, `build`, `start`
- [x] Setup Vite config dengan proxy `/api` dan `/uploads` ke Express
- [x] Setup CSS reset + design tokens (variables.css)
- [x] Setup Google Fonts (Plus Jakarta Sans + Inter)
- [x] Setup global styles + typography scale
- [x] Buat komponen button styles (primary, secondary, outline, ghost)

---

## Phase 2: Backend (Express + SQLite) ✅ **COMPLETED**

### 2.1 Database Setup
- [x] Setup `better-sqlite3` connection di `server/db/database.js`
- [x] Buat schema SQLite: `orders`, `order_items`, `order_photos` di `server/db/schema.js`
  - [x] **Tambah kolom `latitude` dan `longitude` di tabel `orders`** (REAL, nullable)
  - [x] **Update enum status**: `pending` | `picked_up` | `in_progress` | `done`
- [x] Auto-create tables on server start
- [x] Test: insert + query manual

### 2.2 Express Server
- [x] Setup Express app di `server/index.js`
- [x] Setup CORS middleware (untuk development)
- [x] Setup static file serving untuk `uploads/`
- [x] Setup Multer middleware untuk file upload di `server/middleware/upload.js`

### 2.3 API Routes
- [x] `POST /api/orders` — Submit order baru
  - [x] Terima multipart form data (customer info + items JSON + foto files + **latitude, longitude**)
  - [x] Validasi server-side (nama, WA, alamat, min 2 items)
  - [x] Simpan order ke SQLite (include **latitude, longitude**)
  - [x] Simpan items ke SQLite
  - [x] Simpan foto ke `uploads/` + record di SQLite
  - [x] Return `{ orderId, status: 'success' }`
- [x] `GET /api/orders` — List semua order
  - [x] Include item count, total price, **latitude, longitude**
  - [x] Sorted by created_at DESC (terbaru dulu)
  - [x] Optional query param: `?status=pending`
- [x] `GET /api/orders/:id` — Detail satu order
  - [x] Include semua items + foto URLs + **latitude, longitude**
- [x] `PATCH /api/orders/:id/status` — Update status order
  - [x] Body: `{ status: 'picked_up' | 'in_progress' | 'done' }` **(status enhanced)**
  - [x] Validasi transisi status yang valid (pending → picked_up → in_progress → done)
- [x] Test semua endpoint dengan curl / Postman

### 2.4 Production Setup
- [x] Express serve Vite build output (`dist/`) untuk production
- [x] Graceful shutdown handling
- [x] `.gitignore` untuk `uploads/`, `*.db`

---

## Phase 3: Landing Page ✅ **COMPLETED**

### 3.1 Navbar
- [x] Layout navbar responsive (hamburger di mobile)
- [x] Sticky navbar dengan efek transparan → solid on scroll
- [x] Logo + navigation links
- [x] CTA button "Pesan Sekarang"
- [x] Smooth scroll ke section
- [x] **Integrated into landing page**
- [x] **Dynamic height offset calculation (JS) — ResizeObserver + body paddingTop**
- [x] **Fixed mobile content blocking on scroll**

### 3.2 Hero Section
- [x] Background gradient / pattern
- [x] Heading + subheading + tagline
- [x] CTA button utama (link ke /order)
- [x] Glassmorphism card overlay (statistik/trust badges)
- [x] Responsive layout (stack di mobile)
- [x] Hero illustration/background (trust badge card)

### 3.3 How It Works Section
- [x] 3-step flow dengan ikon
- [x] Step 1: Pesan via Website
- [x] Step 2: Kami Jemput Sepatu Anda
- [x] Step 3: Bersih, Kami Antar Kembali
- [x] Connecting line / arrow antar step (CSS pseudo-element)
- [x] Animasi masuk (hover effects)

### 3.4 Why Us Section
- [x] 4 keunggulan dalam card grid
  - Pickup & Delivery Gratis
  - Dikerjakan Profesional
  - Harga Transparan
  - Garansi Kepuasan
- [x] Ikon untuk setiap keunggulan
- [x] Hover animation pada cards

### 3.5 Price Table Section
- [x] Tabel harga ringkas
- [x] Tab toggle: Sepatu / Sandal (accessible tabs)
- [x] Responsive table (card-based di mobile)
- [x] Highlight "mulai dari Rp XX.000"

### 3.6 FAQ Section
- [x] Accordion component
- [x] 6 FAQ items dengan konten lengkap
- [x] Smooth open/close animation
- [x] Hanya 1 item terbuka pada satu waktu
- [x] **Integrated into landing page**

### 3.7 Footer
- [x] Logo + deskripsi singkat
- [x] Link navigasi (Beranda, Pesan, Harga, Cara Kerja, FAQ)
- [x] Kontak (WhatsApp, Instagram, Alamat, Jam operasional)
- [x] Copyright
- [x] Responsive layout

---

## Phase 4: Order Flow Page ✅ **COMPLETED** (Core Flow)

### 4.1 Step Indicator / Progress Bar
- [x] Visual progress bar di atas form
- [x] Step labels (Pilih Item → Detail → Keranjang → Data Diri → Konfirmasi)
- [x] Active, completed, dan upcoming state
- [x] Responsive (compact di mobile)

### 4.2 Step 1 — Pilih Kategori
- [x] Dua card besar: Sepatu dan Sandal
- [x] Visual ikon/gambar untuk masing-masing
- [x] Hover dan selected state
- [x] Transisi ke step berikutnya

### 4.3 Step 2 — Pilih Bahan (Sepatu only)
- [x] 4-5 material cards dengan gambar
- [x] Nama bahan + contoh sepatu
- [x] Selected state yang jelas
- [x] Skip otomatis jika sandal
- [x] Animasi transisi

### 4.4 Step 3 — Pilih Tipe Cuci
- [x] 2 card: Cuci Kering & Cuci Basah
- [x] Deskripsi, estimasi waktu, harga (dinamis sesuai bahan)
- [x] Compare-style layout
- [x] Selected state

### 4.5 Step 4 — Upload Foto & Catatan
- [x] Drag & drop zone
- [x] Click to upload alternative
- [x] Preview thumbnail foto yang di-upload (client-side)
- [x] Remove foto button
- [x] **Client-side image compression (Canvas API) — INTEGRATED**
- [x] Limit: 1-3 foto per item
- [x] Limit ukuran: max 5MB per foto (sebelum kompresi)
- [x] Text area untuk catatan khusus (opsional)
- [x] Compression info display (original → compressed size)

### 4.6 Step 5 — Keranjang / Order Summary
- [x] List semua item yang ditambahkan
- [x] Thumbnail foto + detail (bahan, tipe cuci, harga)
- [x] Tombol hapus per item
- [x] Validasi minimal 2 pasang
- [x] Pesan warning jika kurang dari 2
- [x] Tombol "Tambah Item Lain" → kembali ke step 1

### 4.7 **Fixed: Order Page Blank Page Issue**
- [x] Added missing `stepContent` container (`<main id="stepContent">`) in `order.js` init()
- [x] Container created dynamically and appended to `#app` before rendering steps
- [x] All 7 steps now render correctly
- [x] Kalkulasi total harga
- [x] Tombol "Lanjut ke Data Diri"

### 4.7 Step 6 — Form Data Customer
- [x] Input: Nama Lengkap (required)
- [x] Input: Nomor WhatsApp (required, validasi 08xx / +62)
- [x] Textarea: Alamat Pickup (required)
- [x] Textarea: Catatan Alamat (opsional)
- [x] **Button "Gunakan Lokasi Saya" — Ambil koordinat GPS via Browser Geolocation API**
  - [x] Request permission lokasi ke browser
  - [x] Tampilkan loading state saat mengambil lokasi
  - [x] Tampilkan preview lokasi di mini-peta (Leaflet) atau teks koordinat
  - [x] Handle error: permission denied, GPS tidak tersedia, timeout
  - [x] Simpan latitude, longitude ke form state
  - [x] Opsional: Reverse geocoding untuk isi otomatis alamat
- [x] Inline validation dengan pesan error
- [x] Tombol "Review Pesanan"

### 4.8 Step 7 — Review & Konfirmasi
- [x] Summary lengkap semua item
- [x] Data customer
- [x] Total harga
- [x] Tombol "Ubah Pesanan" (kembali ke keranjang)
- [x] Tombol "Ubah Data Diri" (kembali ke form)
- [x] Tombol utama "Kirim Pesanan via WhatsApp" ✅
- [x] Submit order ke backend (POST /api/orders) dengan loading state
- [x] Handle response: success → generate WA + redirect, error → tampilkan pesan
- [x] Generate pesan WA terformat
- [x] Redirect ke wa.me

---

## Phase 5: Admin Order List Page (Enhanced) ✅ **COMPLETED**

### 5.1 Order List View
- [x] Fetch orders dari `GET /api/orders`
- [x] Tampilkan dalam tabel/card list
- [x] Kolom: ID, Nama, No. WA, Jumlah Item, Total Harga, Tanggal, **Status (enhanced)**, **Lokasi (ikon peta jika ada GPS)**
- [x] Sorted by terbaru dulu (default)
- [x] **Status badge berwarna**: 
  - `pending` = kuning (belum diambil)
  - `picked_up` = biru (sudah diambil)
  - `in_progress` = orange (lagi dikerjakan)
  - `done` = hijau (selesai)
- [x] No. WA clickable → buka WhatsApp
- [x] **Ikon lokasi clickable → buka detail dengan peta** (jika ada latitude/longitude)
- [x] Responsive: table di desktop, card list di mobile
- [x] Empty state jika belum ada order

### 5.2 Order Detail Modal/View
- [x] Klik order → tampilkan detail lengkap
- [x] Data customer (nama, WA, alamat, catatan alamat)
- [x] Semua items dengan: kategori, bahan, tipe cuci, harga, catatan
- [x] Foto-foto yang di-upload (dari server, bisa di-klik untuk full view)
- [x] Timestamp order masuk
- [x] **Peta lokasi pickup (Leaflet + OpenStreetMap)** — tampilkan marker jika ada latitude/longitude
- [x] **Dropdown update status order** (PATCH /api/orders/:id/status) dengan validasi transisi:
  - `pending` → `picked_up` → `in_progress` → `done`
- [x] Tombol kembali ke list

### 5.3 Styling
- [x] Navbar sederhana (logo + "Admin Panel" badge)
- [x] Consistent dengan design system yang sama
- [x] Dark mode-friendly (opsional)
- [x] Responsive untuk akses dari HP pemilik bisnis
- [x] **Leaflet CSS integration** untuk peta

---

## Phase 6: Utility & Logic ✅ **COMPLETED**

- [x] `pricing.js` — Data katalog & harga (single source of truth, shared client-side)
- [x] `cart.js` — Cart state management class (event-driven, localStorage persistence)
- [x] `step-manager.js` — Multi-step form navigation logic
- [x] `image-compressor.js` — Canvas-based photo compression (sebelum upload)
- [x] `validators.js` — Form validation (nama, WA, alamat, file)
- [x] `formatters.js` — Format currency (Rp), format nomor WA, format tanggal
- [x] `whatsapp.js` — Generate pesan WA + redirect logic
- [x] `api.js` — HTTP client: `submitOrder()`, `getOrders()`, `getOrderDetail()`, `updateOrderStatus()`
- [x] **`location.js`** — Geolocation wrapper: `getCurrentPosition()`, `watchPosition()`, error handling, reverse geocoding
- [x] **`map.js`** — Leaflet map initialization: `initMap()`, `addMarker()`, `fitBounds()`, createMiniMap
- [x] **`status.js`** — Status constants & helpers: `ORDER_STATUSES`, `getStatusLabel()`, `getStatusColor()`, `canTransition()`

---

## Phase 7: Polish & Optimization ⏳ **PENDING**

- [ ] Micro-animations (hover, transisi, scroll-in)
- [ ] Loading states untuk upload foto & submit order
- [ ] Error states yang user-friendly (termasuk API error handling)
- [ ] Empty states yang informatif
- [ ] Smooth scroll behavior
- [ ] Touch-friendly interactions (min 44px targets)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile testing (responsive)
- [ ] Tablet testing
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit (contrast, labels, focus)
- [ ] SEO meta tags + Open Graph
- [ ] Favicon + web manifest

---

## Phase 8: Content & Assets ⏳ **PENDING**

- [ ] Generate/buat logo WashPass
- [ ] Generate ilustrasi hero section
- [ ] Generate/buat ikon untuk bahan sepatu (canvas, mesh, kulit, suede)
- [ ] Generate/buat ikon untuk how-it-works steps
- [ ] Tulis konten FAQ (5-6 items) — **Done in code**
- [ ] Tulis meta description
- [ ] Buat Open Graph image
- [ ] Screenshot untuk README

---

## Estimasi Timeline

| Phase | Status | Estimasi |
|-------|--------|----------|
| Phase 1: Setup | ✅ Done | ~30 menit |
| Phase 2: Backend | ✅ Done | ~2.5-3.5 jam |
| Phase 3: Landing Page | ✅ Done | ~2-3 jam |
| Phase 4: Order Flow | ✅ Done | ~3.5-4.5 jam |
| Phase 5: Admin Page | ✅ Done | ~2.5-3.5 jam |
| Phase 6: Logic | ✅ Done | ~1.5-2.5 jam |
| Phase 7: Polish | ⏳ Pending | ~1-2 jam |
| Phase 8: Content | ⏳ Pending | ~1 jam |
| **Total** | | **~14-20 jam kerja** |

---

## Catatan Prioritas

1. **P0 (Must Have):** Backend API + Landing page + Order flow + WA redirect + Order storage + Location sharing + Enhanced status flow
2. **P1 (Should Have):** Admin order list + Responsive design + Validasi form + Photo upload ke server + Map di admin + Status dropdown + Image compression
3. **P2 (Nice to Have):** Scroll animations, glassmorphism effects, loading states, status update

---

## Next Steps (Priority Order)

1. **Phase 7: Polish** — Animations, loading states, accessibility, SEO, Lighthouse audit
2. **Phase 8: Content & Assets** — Logo, illustrations, OG image, favicon, web manifest
3. **Production deployment** — Build & deploy to Railway/Render/VPS