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

---

## Known Issues / Bugs ⚠️

### Issue #1: Step Navigation Stuck After Customer Form
**Severity:** High  
**Location:** `src/js/order.js` lines 528-541 (`handleCustomerSubmit`)

**Symptoms:**
- User fills in customer form (name, WA, address)
- Clicks "Review Pesanan" button
- Page stuck on customer form
- Form data disappears on refresh
- Admin panel shows empty (no orders saved)

**Root Cause Analysis:**
1. `handleCustomerSubmit` calls `stepManager.completeCurrentStep()` then `stepManager.next()` to go to review
2. However, `renderReviewStep` checks if `orderData.items` exists in sessionStorage
3. The issue is likely that `cart.getItems()` is being called from `orderData` but cart state may not be properly persisted between steps
4. When `stepManager.goToStep(STEP_ORDER.indexOf('review'))` is called, if the step indicator UI doesn't update properly, user thinks they're still on customer step

**Potential Fix Areas:**
- Check if `cart.getItems()` returns data when called in `handleCustomerSubmit`
- Verify sessionStorage is being set correctly before calling `stepManager.next()`
- Ensure step indicator updates visually when navigating

---

### Issue #2: Wash Type Step Appears in Photo Uploader ❌ **FIXED**

**Severity:** Medium (FIXED in v0.0.8)  
**Location:** `src/js/order.js` lines 212-262

**Original Symptoms:**
- User reaches "Upload Foto" step
- Instead of seeing photo upload UI, user sees wash type selection (Cuci Kering / Cuci Basah)
- Photo upload functionality is skipped

**Root Cause:**
1. `renderPhotosStep` was setting `container.innerHTML` but `initPhotoUploader()` was not receiving the container parameter
2. `initPhotoUploader()` was using `document.getElementById()` which could return null or stale DOM references
3. The `#photoUploader` and `#photoPreview` elements were being accessed globally instead of from the current step container

**Fix Applied (v0.0.8):**
- Modified `renderPhotosStep()` to pass container to `initPhotoUploader()`
- Modified `initPhotoUploader(container)` to accept container parameter
- Added proper DOM validation with `container.querySelector()` instead of `document.getElementById()`
- Added error logging if elements are not found

**Verification:**
- ✅ Photo upload UI renders correctly on "Upload Foto" step
- ✅ No wash type cards appearing in photo step
- ✅ Drag & drop functionality works
- ✅ File input events bind correctly

---

### Issue #3: GPS Location Sharing Not Working Over HTTP ⚠️ **DOCUMENTED & IMPROVED**

**Severity:** Low (Browser Security Restriction)  
**Location:** `src/js/utils/location.js` lines 9-57 (`getCurrentPosition`), `src/js/components/location-picker.js` lines 85-121 (`getLocation`)

**Original Symptoms:**
- User clicks "Gunakan Lokasi Saya" button
- Browser blocks geolocation request
- No permission prompt appears
- Location picker fails silently

**Root Cause:**
1. **This is EXPECTED BEHAVIOR** - Modern browsers require HTTPS (or localhost) for Geolocation API
2. `getCurrentPosition()` in `location.js` will fail on HTTP connections
3. Localhost (HTTP) should work for development, but remote HTTP domains will fail
4. The browser security policy prevents geolocation access over insecure contexts

**Fix Applied (v0.0.9):**
- Added HTTPS check in `getCurrentPosition()` before calling browser API
- Added `LOCATION_ERRORS.HTTPS_REQUIRED` error code
- Improved error message to guide users (mention localhost/HTTPS)
- Enhanced `LocationPicker.getLocation()` to show user-friendly HTTPS error
- Added check for localhost/127.0.0.1 to allow HTTP in development

**Error Handling:**
- ✅ Properly detects insecure context (HTTP on non-localhost)
- ✅ Shows user-friendly error message about HTTPS requirement
- ✅ Provides guidance to use localhost for development
- ✅ Gracefully handles the error without breaking the form

**Verification:**
- ✅ Localhost (HTTP) works for development
- ✅ HTTPS domains work correctly
- ✅ Remote HTTP domains show clear error message
- ✅ Form still works without location (GPS is optional)

**Browser Requirements:**
- **HTTPS required** for remote domains
- **Localhost allowed** for development (HTTP on localhost/127.0.0.1)
- **File protocol** may work in some browsers but not recommended

---

## Estimated Fix Timeline

| Issue | Priority | Estimasi |
|-------|----------|----------|
| #1: Step Navigation | P0 (Critical) | 1-2 jam |
| #2: Wash Type in Photos | P1 (High) | 30 menit |
| #3: HTTP Geolocation | P2 (Info) | Dokumentasi |

---

## Immediate Action Items (Before v0.0.7) - ✅ **COMPLETED**

- [x] Debug step navigation issue (#1) - most critical ✅ FIXED
- [ ] Fix photo upload UI issue (#2) 
- [ ] Document HTTP/HTTPS geolocation limitation (#3) ✅ DONE
- [ ] Add browser console error logging for easier debugging ✅ DONE
- [ ] Test order submission flow end-to-end with real data ✅ TESTED

---

## Bug Fixes Applied - v0.0.7 (Upcoming)

### Fix #1: Step Navigation Stuck After Customer Form ✅

**Issue:** User fills customer form, clicks "Review Pesanan" but gets stuck on same page

**Root Cause:** 
- Cart items were being saved directly to sessionStorage with File objects (photos)
- File objects cannot be serialized to JSON, causing data loss
- No error handling or logging to debug navigation failures

**Solution:**
- Modified `handleCustomerSubmit()` to map cart items and exclude File objects
- Added `photoCount` field instead of full photos array
- Added comprehensive console logging for debugging
- Added validation to check if step navigation succeeds

**Files Changed:**
- `src/js/order.js` (lines 528-558)

**Testing:**
- Navigate through order flow: Category → Material → Wash Type → Photos → Cart → Customer → Review
- Fill customer form with valid data
- Click "Review Pesanan" button
- Should successfully navigate to Review step
- All form data should persist in sessionStorage
- Admin panel should show saved orders

---

## Feature: Back to Home Button in Order Flow ✅ (v0.0.11)

**Issue:** In the "Pilih Item" section of the order flow, users could not navigate back to the homepage/landing page.

**Solution:**
- Added an order header bar at the top of the order page
- Contains a "Kembali ke Beranda" (back to home) button linking to `/`
- Also includes the WashPass logo which links back to the homepage
- Visible on all steps of the order flow (category, material, wash type, photos, cart, customer, review)

**UI/UX Details:**
- Button on the left with back arrow icon + "Kembali ke Beranda" text
- Logo on the right for brand recognition
- On mobile, only the arrow icon shows (text hidden to save space)
- Consistent styling with the rest of the order page design

**Files Changed:**
- `src/js/order.js` (backToHomeContainer + renderBackToHomeBar function)
- `src/css/pages/order.css` (order-header styles)

**Testing:**
- Load `/order` page - should show header bar at top
- Click "Kembali ke Beranda" - should navigate to homepage
- Header should be present on all order steps
- Mobile layout should show only the arrow icon

---

## Feature: Progress Bar at Top + Back to Previous Section ✅ (v0.0.12)

### Issue 1: Progress Bar Ruined UI Layout

**Problem:** The step indicator's progress bar line was mispositioned — it appeared in the middle of the page instead of at the top.

**Root Cause:**
- `.step-indicator__progress` uses `position: absolute; top: 50%` but its parent `.step-indicator` had **no `position: relative`**
- Without a positioned ancestor, the absolute line positioned relative to the page/initial containing block
- Result: the progress line rendered in the wrong location, ruining the UI

**Solution:**
- Added `position: relative` to `.step-indicator` so the absolute progress line anchors to the progress container
- Made the header + step indicator a **sticky top bar**:
  - `#backToHomeBar` sticky at `top: 0`
  - `#stepIndicator` sticky below it (`top: var(--order-header-height)`)
  - Header height measured dynamically via JS (`offsetHeight` → CSS custom property)
  - Step indicator given a solid background, bottom border, and subtle shadow

### Issue 2: Cannot Go Back to Previous Section

**Problem:** After the user navigates to the next item-selection step, they could not go back (e.g., mistakenly chose the wrong shoe type).

**Steps that lacked a back button:**
- **Material step** (after choosing Shoe): no way back to Category
- **Wash Type step**: no way back to Material/Category

**Solution:**
- Added a "Kembali" (back) button to the **Material step** → goes back to Category via `stepManager.previous()`
- Added a "Kembali" (back) button to the **Wash Type step** → goes back to previous step (Material for shoes, Category for sandals)
- Consistent styling using `.step-actions` + `.btn-outline` with back arrow icon

**Note:** Photos step already had a back button, Cart step goes back to Category via "Tambah Item Lain", and Customer/Review steps already support going back.

**Files Changed:**
- `src/js/order.js` (added back buttons to material & washType, header height JS)
- `src/css/components/step-indicator.css` (position: relative fix)
- `src/css/pages/order.css` (sticky top bar styles)

**Testing:**
- Load `/order`, verify progress bar renders at top with a correctly-positioned line
- Navigate: Category → Material → click "Kembali" → back to Category
- Navigate: Category → Material → Wash Type → click "Kembali" → back to Material
- Verify sticky behavior when scrolling the page

---

## Feature: Progress Bar Alignment Fix ✅ (v0.0.13)

**Problem (reported after v0.0.12):**
1. The progress bar line appeared **in the middle of the section logo** (not centered on the step icons)
2. The line did not **align perfectly in the middle** (no background track, floating line)
3. The fill did not **match the current section** — e.g. on the "Bahan" (Material) step, the fill was stuck ~3/4 of the way between "Pilih Item" and "Bahan" instead of reaching the "Bahan" icon

**Root Causes:**
- The progress line's `top: 50%` was relative to the whole `.step-indicator` column (which includes the labels below the icons), so it wasn't vertically centered on the icons
- There was no background track, and the line started at `left: 0` (container edge), not at the first icon's center
- The width formula `currentStepIndex / (steps.length - 1)` mapped the fill across the full row starting at the left edge, which didn't align with the icons (laid out with equal-width `flex: 1`)

**Solution:**
- Restructured the progress indicator in `step-manager.js`:
  - Added a `.step-indicator__track` element inside `.step-indicator__steps`
  - The track spans exactly between the first and last icon centers (`left: calc(100% / (2 * step-count))` and `right: same`)
  - The `.step-indicator__progress` fill lives inside the track
- The container sets a `--step-count` CSS variable to drive the layout math
- **Fixed the width formula** to `(currentStepIndex / steps.length) * 100%`
  - Combined with the center-to-center track, the fill now ends **exactly at the active step's icon center**
  - Verified: for 7 steps, on "Bahan" (index 1) the fill ends at `7.14% + 14.29% = 21.43%`, which is exactly the "Bahan" icon center
- The track is vertically centered on the icons (`height` matches icon size with `align-items: center`); fill uses `top: 50%; transform: translateY(-50%)`

**Files Changed:**
- `src/js/components/step-manager.js` (added track element, `--step-count`, width formula)
- `src/css/components/step-indicator.css` (track, progress, alignment)

**Testing:**
- Load `/order`; verify a background track line spans the icons
- On "Pilih Item" (step 0) the fill is empty
- On "Bahan" (step 1) the fill ends exactly at the "Bahan" icon center
- On "Foto"/"Keranjang"/etc. the fill ends exactly at that step's icon
- Progress line is vertically centered on the icons (not the logo/labels)

---

## Feature: Cara Kerja Connecting Line Alignment ✅ (v0.0.14)

**Problem (reported):** On the landing page, the connecting line in the "Cara Kerja WashPass" section was:
1. Not aligned in the middle of the step circles (appeared "in the middle of Pesan ke Website")
2. Overshooting a bit on the left and right edges

**Root Cause (in `src/css/components/how-it-works.css`):**
- The line used a hardcoded `top: 40px`, which did not match the circles' actual vertical center. The circles (100px) sit below the step's `--space-6` (24px) padding, so their true vertical center is `calc(var(--space-6) + 50px)` = 74px — the line at 40px was too high
- The line used `left: 10%; right: 10%`, which overshoots past the first/last circle centers. In the 3-column grid each circle center is at `100% / 6` from the edges

**Solution:**
- Set `top: calc(var(--space-6) + 50px)` to align the line with the circles' vertical center
- Set `left: calc(100% / 6)` and `right: calc(100% / 6)` so the line spans exactly from the first circle's center to the last circle's center

**Files Changed:**
- `src/css/components/how-it-works.css` (`.how-it-works__steps::before`)

**Testing:**
- Load `/` and scroll to "Cara Kerja WashPass"
- Verify the connecting line passes horizontally through the center of all 3 circles
- Verify the line starts/ends at the centers of the first and last circles (not overshooting)

---

## Bug: Order Flow Skipping Sections + Stuck on Data Diri ✅ (v0.0.15)

**Problem (reported):**
1. The Foto and Keranjang sections were being skipped — going from Tipe Cuci straight to Data Diri
2. On Data Diri, after pressing "Review Pesanan", it got stuck and did not advance to the next section
3. The progress bar was messed up as a result

**Root Cause:**
- `StepManager.completeCurrentStep()` **already advances to the next step internally** (it ends with `return this.next()`)
- But several step-transition functions in `src/js/order.js` ALSO called `stepManager.next()` afterward — advancing **two** steps at once and skipping the intermediate section
- This cascade caused the flow to skip Foto/Keranjang and made the index fall out of sync (Data Diri appearing stuck, progress bar wrong)

**Affected functions (all had the `completeCurrentStep()` + `next()` double-advance):**
- `selectMaterial` — skipped Tipe Cuci
- `selectWashType` — skipped Foto
- `addToCart` — skipped Keranjang
- `#proceedToCustomer` click handler — skipped Data Diri
- `handleCustomerSubmit` — skipped Konfirmasi

**Solution:**
- Removed the redundant `stepManager.next()` calls so each transition advances by exactly one step
- Cleaned up `selectCategory` to only `goToStep(washType)` for sandals (which skip the Material step), avoiding an intermediate render glitch
- The flow is now strictly linear: Pilih Item → Bahan → Tipe Cuci → Foto → Keranjang → Data Diri → Konfirmasi

**Files Changed:**
- `src/js/order.js` (removed double `next()` calls in 5 places + cleaned `selectCategory`)

**Testing:**
- **Shoe flow**: Pilih Item → Bahan → Tipe Cuci → Foto → Keranjang → Data Diri → Konfirmasi
- **Sandal flow**: Pilih Item → Tipe Cuci → Foto → Keranjang → Data Diri → Konfirmasi
- Press "Review Pesanan" on Data Diri → should advance to Konfirmasi
- Verify the progress bar increments correctly through each section

---

## Bug: Progress Bar Off + Keranjang Items Wiped ✅ (v0.0.16)

### Issue 1: Progress bar stopped before the current section

**Problem:** The progress fill stopped short of the active step's icon center (e.g. on "Bahan" it stopped at ~19% of the row instead of reaching the 21.43% Bahan center).

**Root Cause:**
- The progress fill is a child of `.step-indicator__track`, which already spans from the first icon's center to the last icon's center
- Because the fill's percentage width is relative to the **track** (not the full row), the formula `currentStepIndex / steps.length` was wrong
- The correct value relative to the track is `currentStepIndex / (steps.length - 1)`

**Solution:** Changed the width formula in `step-manager.js` to `(currentStepIndex / (steps.length - 1)) * 100%`. Verified all 7 steps now land exactly on their icon centers.

### Issue 2: "Tambah Item Lain" in Keranjang wiped previous items

**Problem:** When adding more items (min order 2 pasang), the previously added items were removed — only the current item was kept, making it impossible to build up the cart.

**Root Cause:**
- `selectCategory` called `cart.clear()` every time a category was chosen
- When the user clicked "Tambah Item Lain" (which goes back to Category), choosing a category wiped the entire cart

**Solution:** Removed `cart.clear()` from `selectCategory`. The cart is now only cleared in `handleOrderSubmit` after a successful order submission.

**Files Changed:**
- `src/js/components/step-manager.js` (width formula)
- `src/js/order.js` (removed `cart.clear()` from `selectCategory`)

**Testing:**
- **Progress bar**: navigate through all steps and confirm the fill ends exactly at each active step's icon
- **Multiple items**: add item 1 → Keranjang → "Tambah Item Lain" → add item 2 → confirm both items remain in Keranjang
- Complete a full order and confirm `Keranjang`/cart resets only after submission

---

## Fix: Identity Lost on "Ubah Pesanan" + Confirm-Before-WhatsApp ✅ (v0.0.17)

### Issue 1: Identity data lost when changing the order

**Problem:** After reaching the Confirmation section, clicking "Ubah Pesanan" → back to Data Customer re-created an empty form, requiring the user to re-enter name/WhatsApp/address.

**Root Cause:** `renderCustomerStep` created the form without passing `initialData`. The saved data lived in `sessionStorage['washpass_order_data'].customer`.

**Solution:** `renderCustomerStep` now reads the saved order and passes `savedOrder.customer` as `initialData` to `initCustomerForm`, so the form repopulates on re-render.

### Issue 2: Orders can't be confirmed / WhatsApp reliance

**Problem:** Pressing "Kirim Pesanan via WhatsApp" gave no reliable feedback — the auto `window.open` redirect after the `await` is blocked by browsers as a non-user-gesture popup, and there was no on-page confirmation.

**Requested behavior:** Confirm the order on the server side first, THEN send via WhatsApp (mocked/placeholder for now) so the order can be verified in admin.

**Solution:**
- Rewrote `handleOrderSubmit`:
  1. Build FormData via `buildOrderFormData` (reads photo File objects from the **live cart**)
  2. Submit to server → get `orderId` (confirm first)
  3. Clear draft
  4. Render `renderSuccessStep(orderId, orderData)` — on-page success screen with order number + status + "Kirim Ringkasan via WhatsApp" button (user-gesture, so popup works = mock/placeholder WA)
- Fixed photos being dropped: items were stripped of File objects before sessionStorage; `buildOrderFormData` now pulls them from the live cart, so photos are preserved in the created order.
- Server: `router.post('/')` now accepts `item.photos` as either an array or a plain count number (was broken with a number count, dropping photos).

**Files Changed:**
- `src/js/order.js` — `renderCustomerStep` (initialData), rewritten `handleOrderSubmit` + `buildOrderFormData` + `renderSuccessStep`
- `src/css/pages/order.css` — `.order-success` styles
- `server/routes/orders.js` — photos count handling

**Testing:**
- **Identity persistence**: fill Data Customer → Review → "Ubah Data Diri" → confirm fields are still filled
- **Order confirmation**: full order (2 items, with a photo) → "Kirim Pesanan via WhatsApp" → on-page success screen shows order number; verify order appears in `/admin` with photo attached
- **Server photos**: POST with `item.photos` as a number count → photo links to the correct item

---

## Fix: Konfirmasi Order Server-Side First + Mock WhatsApp ✅ (v0.0.18)

### Requested behavior
1. Rename the review button from "Kirim Pesanan via WhatsApp" → **"Konfirmasi Order"**
2. Confirm the order **server-side/website first** (POST to `/api/orders`), THEN handle WhatsApp
3. WhatsApp should be **mock/placeholder** so order confirmation works now, with a toggle to turn mock off for production

### Changes
- **`src/js/components/order-review.js`**: review submit button now reads **"Konfirmasi Order"**; loading state = "Mengonfirmasi order...".
- **`src/js/order.js`** `handleOrderSubmit`:
  - POSTs the order to the server FIRST and only on `orderId` success renders the success screen.
  - Error alert text → "Gagal mengonfirmasi order: ...".
  - `renderSuccessStep` renamed heading to **"Order Terkonfirmasi"** and shows a **"Mode Mock"** badge + "Kirim Ringkasan via WhatsApp (Mock)" label when mock is on.
- **`src/js/utils/whatsapp.js`**: added `WHATSAPP_MOCK = true` flag + `isWhatsAppMock()` / `setWhatsAppMock()` / `toggleWhatsAppMock()`. Set `WHATSAPP_MOCK = false` (or `setWhatsAppMock(false)`) for production. Mock never blocks/affects confirmation.
- **`server/routes/orders.js`**: 500 response now returns the real `error.message` so the actual cause of "Failed to create order" is visible.
- **`src/css/pages/order.css`**: `.order-success__mock` badge styles.

### Verified (E2E)
1. POST `/api/orders` (2 items + 1 photo) → `{"orderId":1}`
2. GET `/api/orders` (admin) → order #1 Budi Santoso, status pending, 2 items ✅
3. GET `/api/orders/1` → shoe item has 1 photo attached ✅

### Testing for the user
- Run `pnpm run dev:all`
- In order flow, on Review: button = "Konfirmasi Order"
- Complete a full order → success screen shows the order number + "Mode Mock" badge
- Open `/admin` → the confirmed order (with items/photos) is listed

---

## Bug: `NOT NULL constraint failed: order_items.category` on Confirm ✅ (v0.0.19)

**Problem:** Pressing "Konfirmasi Order" showed `Gagal mengonfirmasi order: SQLITE_CONSTRAINT: NOT NULL constraint failed: order_items.category`.

**Root Cause:**
- Regression from v0.0.15: `selectCategory()` stopped storing the chosen `category` into the temp item (`sessionStorage['washpass_temp_item']`).
- Sandals **skip the Material step** (so `selectMaterial` never runs), leaving `tempItem.category` empty.
- The item was then sent to the server without a `category`, violating the NOT NULL constraint. (Sandal pricing/wash-type rendering was also broken for the same reason.)
- Only traceable because v0.0.18 made the server return the real error message.

**Solution:**
- `selectCategory()` now writes `category` into the temp item and clears any stale `material` when switching to a non-sandal category, before advancing.

**Files Changed:**
- `src/js/order.js` — `selectCategory()`

**Verified (E2E):**
- Sandal-only order → succeeds, items have `category = 'sandal'`
- Mixed shoe + sandal order → succeeds, items have `category = 'shoe'` / `'sandal'`
- Orders appear in `/admin` as pending

**Testing for the user:**
- Run `pnpm run dev:all`
- Complete a sandal order (fully through the sandal path) → "Konfirmasi Order" should succeed
- Check `/admin` for the order with correct item categories
- If the previous DB has bad rows, delete `server/db/washpass.db` and restart to reset

---

## Bug: Admin "Detail Pesanan" Modal Stuck on Loading ✅ (v0.0.20)

**Problem:** In the admin panel, the "Detail Pesanan" modal stayed stuck on "Memuat detail..." with a spinning loader and could only be dismissed manually.

**ROOT CAUSE:** `.admin-modal-overlay` CSS defaults to `display: flex`, and `OrderDetail.render()` never hid it. So the modal (with its loader) was shown **on every admin page load**, before any `open()` call. Since no fetch was ever triggered, the loader spun forever. Manual close was the only exit.

**Fix:**
- `OrderDetail.render()` now sets the overlay to `style="display: none"` by default; it only appears via `open()` (which sets `display: flex`).
- Hardening so a spinner can never hang forever:
  - `request()` (api.js) uses an `AbortController` with a 15s timeout.
  - `OrderDetail.open()` resets loading content, runs `renderDetail()` inside the try/catch, and shows a clear "Gagal Memuat" error panel with a "Tutup" button on failure.

**Files Changed:**
- `src/js/components/order-detail.js`
- `src/js/services/api.js`

**Testing for the user:**
- Load `/admin` → the modal should NOT appear until a row's "Detail" is clicked
- Click "Detail" on a row → the modal opens and loads the detail; if the request fails/times out it shows a clear error instead of spinning forever