# WashPass — Tech Stack

> **Versi:** 1.2  
> **Tanggal:** 27 Agustus 2026  
> **Update:** Core implementation complete — Phase 1, 2, 4, 5, 6 done. Phase 3 (Landing Page), 7 (Polish), 8 (Assets) pending.

---

## Frontend — Build & Framework

| Kategori | Pilihan | Alasan |
|----------|---------|--------|
| **Build Tool** | Vite | Cepat, modern, HMR instan, konfigurasi minimal |
| **Framework** | Vanilla JS (ES Modules) | Tidak butuh framework berat untuk MVP. Ringan, cepat, SEO-friendly |
| **Bahasa** | JavaScript (ES2022+) | Tidak perlu TypeScript untuk MVP skala ini |

## Backend — Server & Database

| Kategori | Pilihan | Alasan |
|----------|---------|--------|
| **Runtime** | Node.js | Sama dengan frontend tooling (Vite), satu ekosistem |
| **Server** | Express.js | Paling populer, minimalis, banyak middleware |
| **Database** | SQLite (via `better-sqlite3`) | File-based, zero-config, tidak perlu install DB server terpisah. Sangat ringan, cocok untuk volume kecil-sedang |
| **File Upload** | Multer | Middleware Express untuk handle `multipart/form-data` |
| **File Storage** | Filesystem (folder `uploads/`) | Simpel, tidak perlu cloud storage untuk MVP |
| **CORS** | cors (npm) | Untuk development (frontend & backend di port berbeda) |

### Mengapa SQLite?
- **Zero configuration** — Tidak perlu install MySQL/PostgreSQL, tidak perlu manage service
- **File-based** — Database adalah 1 file `.db`, mudah di-backup (copy file saja)
- **Sangat ringan** — Library `better-sqlite3` ~3MB, synchronous API (tidak perlu async/await)
- **Cukup untuk skala ini** — Hingga ribuan order tidak masalah
- **Portable** — Bisa dipindah antar server dengan mudah

## Styling

| Kategori | Pilihan | Alasan |
|----------|---------|--------|
| **CSS** | Vanilla CSS + CSS Custom Properties | Kontrol penuh, tidak ada dependency ekstra |
| **Metodologi** | BEM-inspired + Utility-first hybrid | Struktur class yang jelas, reusable |
| **Animasi** | CSS Animations + Transitions | Performa native, tidak perlu library |

## Fonts & Icons

| Kategori | Pilihan | Sumber |
|----------|---------|--------|
| **Font Heading** | Plus Jakarta Sans | Google Fonts |
| **Font Body** | Inter | Google Fonts |
| **Icons** | Lucide Icons (SVG inline) | https://lucide.dev — MIT license, ringan |

## Maps & Location

| Kategori | Pilihan | Alasan |
|----------|---------|--------|
| **Map Library** | Leaflet.js | Lightweight (~42KB gzipped), no API key needed, OpenStreetMap tiles free |
| **Map Tiles** | OpenStreetMap (via Leaflet) | Gratis, tidak perlu API key, coverage global |
| **Geolocation** | Browser Geolocation API (navigator.geolocation) | Native, tidak perlu library, HTTPS required (localhost OK) |
| **Reverse Geocoding** | Nominatim (OpenStreetMap) | Gratis, rate-limited, untuk isi otomatis alamat dari koordinat |

## Media & Upload

| Kategori | Pilihan | Alasan |
|----------|---------|--------|
| **Client-side Compression** | Browser-native Canvas API | Kompresi foto sebelum upload ke server |
| **Upload UI** | FileReader API + drag & drop | Native browser, tidak perlu library |
| **Server Upload** | Multer + Express | Handle multipart form data |
| **Storage** | Filesystem (`uploads/`) | File disimpan dengan nama unik (UUID/timestamp) |
| **Image Format** | JPEG (output kompresi) | Ukuran kecil setelah kompresi |

## Deployment

| Kategori | Pilihan | Alasan |
|----------|---------|--------|
| **Hosting** | Railway / Render / VPS | Perlu server Node.js (bukan static hosting lagi) |
| **Alternatif** | DigitalOcean App Platform / Fly.io | Murah untuk small Node.js apps |
| **Domain** | Custom (TBD) | Bisa pakai subdomain gratis dulu |

> **Catatan:** Karena ada backend, tidak bisa deploy ke GitHub Pages/Netlify (static-only). Perlu hosting yang support Node.js.

---

## Struktur Proyek

```
washpass/
├── .ai/                        # Dokumentasi AI (PRD, tasks, tech-stack, ux-flow)
│   ├── PRD.md
│   ├── tasks.md
│   ├── tech-stack.md
│   └── ux-flow.md
│
├── server/                     # ─── BACKEND ───
│   ├── index.js                # Express server entry point
│   ├── db/
│   │   ├── schema.js           # SQLite table creation
│   │   ├── database.js         # DB connection + helper
│   │   └── washpass.db         # SQLite database file (auto-created)
│   ├── routes/
│   │   └── orders.js           # /api/orders routes (CRUD)
│   ├── middleware/
│   │   └── upload.js           # Multer configuration
│   └── uploads/                # Uploaded photo files (gitignored)
│
├── src/                        # ─── FRONTEND (Vite) ───
│   ├── index.html              # Landing Page entry
│   ├── order.html              # Order Flow entry
│   ├── admin.html              # Admin Order List entry
│   ├── css/
│   │   ├── reset.css
│   │   ├── variables.css       # CSS Custom Properties (design tokens)
│   │   ├── global.css
│   │   ├── components/
│   │   │   ├── navbar.css
│   │   │   ├── hero.css
│   │   │   ├── how-it-works.css
│   │   │   ├── price-table.css
│   │   │   ├── why-us.css
│   │   │   ├── faq.css
│   │   │   ├── footer.css
│   │   │   ├── step-indicator.css
│   │   │   ├── category-card.css
│   │   │   ├── material-card.css
│   │   │   ├── wash-type-card.css
│   │   │   ├── photo-uploader.css
│   │   │   ├── cart-summary.css
│   │   │   ├── customer-form.css
│   │   │   ├── order-review.css
│   │   │   ├── admin-table.css
│   │   │   └── buttons.css
│   │   └── pages/
│   │       ├── landing.css
│   │       ├── order.css
│   │       └── admin.css
│   ├── js/
│   │   ├── main.js             # Landing page entry
│   │   ├── order.js            # Order flow entry
│   │   ├── admin.js            # Admin page entry
│   │   ├── config/
│   │   │   └── pricing.js      # Data harga & katalog (single source of truth)
│   │   ├── components/
│   │   │   ├── navbar.js
│   │   │   ├── faq.js
│   │   │   ├── step-manager.js     # Multi-step form logic
│   │   │   ├── category-selector.js
│   │   │   ├── material-selector.js
│   │   │   ├── wash-type-selector.js
│   │   │   ├── photo-uploader.js
│   │   │   ├── cart.js             # Cart state management
│   │   │   ├── customer-form.js
│   │   │   ├── order-review.js
│   │   │   ├── order-list.js       # Admin: render order table
│   │   │   ├── order-detail.js     # Admin: render order detail modal
│   │   │   ├── whatsapp.js         # Generate WA message + redirect
│   │   │   └── location-picker.js  # Customer: GPS location picker component
│   │   ├── services/
│   │   │   └── api.js              # HTTP client for backend API calls
│   │   └── utils/
│   │       ├── image-compressor.js # Canvas-based image compression
│   │       ├── validators.js       # Form validation helpers
│   │       ├── formatters.js       # Currency formatting, etc.
│   │       ├── location.js         # Geolocation API wrapper
│   │       ├── map.js              # Leaflet map initialization
│   │       └── status.js           # Order status constants & helpers
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── og-image.png
│
├── vite.config.js              # Vite configuration (proxy API ke Express)
├── package.json                # Shared dependencies
├── .gitignore
├── AGENTS.md
└── README.md
```

## Design Tokens (CSS Custom Properties Plan)

```css
:root {
  /* Colors */
  --color-primary: #0D9488;
  --color-primary-dark: #0F766E;
  --color-primary-light: #14B8A6;
  --color-accent: #F59E0B;
  --color-accent-dark: #D97706;
  --color-bg: #FAFAF9;
  --color-surface: #FFFFFF;
  --color-text: #1C1917;
  --color-text-secondary: #78716C;
  --color-text-muted: #A8A29E;
  --color-success: #22C55E;
  --color-error: #EF4444;
  --color-border: #E7E5E4;
  
  /* Typography */
  --font-heading: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'Inter', sans-serif;
  
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  
  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;
  
  /* Breakpoints (for reference, used in media queries) */
  /* Mobile: < 768px */
  /* Tablet: 768px – 1024px */
  /* Desktop: > 1024px */
  
  /* Layout */
  --max-width: 1200px;
  --container-padding: var(--space-4);
}

@media (min-width: 768px) {
  :root {
    --container-padding: var(--space-8);
  }
}
```

## Key Technical Decisions

### 1. Mengapa Vanilla JS, bukan React/Vue?
- Website ini pada dasarnya adalah **multi-step form + landing page + admin table**
- Tidak butuh state management yang kompleks (Redux/Pinia)
- SEO lebih baik tanpa client-side rendering
- Bundle size minimal, loading cepat
- Vite tetap memberikan DX modern (HMR, ES Modules, build optimization)

### 2. Mengapa Multi-Page (3 HTML files)?
- Landing page, order flow, dan admin punya concern yang berbeda
- Landing page perlu SEO-friendly dan ringan
- Order flow butuh JS yang lebih banyak
- Admin page hanya untuk pemilik, terpisah dari customer flow
- Code splitting natural tanpa konfigurasi router

### 3. State Management untuk Cart
- Menggunakan **JavaScript class** sederhana dengan event-driven pattern
- Cart state disimpan di memory (hilang saat refresh — OK untuk MVP)
- Bisa ditingkatkan ke localStorage di iterasi berikutnya

### 4. Foto Upload Strategy
- Foto di-compress **client-side** dulu menggunakan Canvas API (reduce bandwidth)
- Kemudian dikirim ke server sebagai `multipart/form-data`
- Server menyimpan file di folder `uploads/` dengan nama unik
- Admin bisa melihat foto via halaman admin
- Di pesan WA, disebutkan jumlah foto (foto tetap tidak bisa dikirim via wa.me URL)

### 5. WhatsApp Integration
- Menggunakan `https://wa.me/{nomor}?text={encoded_message}`
- Pesan di-encode dengan `encodeURIComponent()`
- Nomor WA pemilik bisnis di-hardcode di config (mudah diubah)
- WA redirect dilakukan SETELAH order berhasil disimpan ke server

### 6. Mengapa SQLite, bukan MySQL/PostgreSQL?
- **Zero configuration** — Tidak perlu install DB server, tidak perlu manage service/port
- **File-based** — 1 file `.db`, backup = copy file
- **`better-sqlite3`** — Synchronous API, lebih simpel dari `sqlite3` async
- **Sangat ringan** — Cukup untuk ratusan/ribuan order
- **Portable** — Pindah server? Copy folder saja

### 7. Development Architecture (Vite + Express)
- **Development:** Vite dev server (port 5173) + Express server (port 3000)
  - Vite proxy `/api/*` dan `/uploads/*` ke Express
- **Production:** Express serve Vite build output (`dist/`) + API routes
  - Single server, single port

---

## Implementation Status

### ✅ Completed Phases

| Phase | Components | Status |
|-------|------------|--------|
| **Phase 1: Setup** | Vite config, folder structure, package.json, CSS tokens, buttons | ✅ Done |
| **Phase 2: Backend** | Express + SQLite, Multer upload, Orders API (CRUD), enhanced status flow | ✅ Done |
| **Phase 4: Order Flow** | 7-step form, category/material/wash-type selection, photo upload, cart, customer form with GPS location picker, review + WA redirect | ✅ Done |
| **Phase 5: Admin Page** | Order list (table/cards), detail modal with Leaflet map, status dropdown with transition validation | ✅ Done |
| **Phase 6: Utilities** | pricing, cart, step-manager, image-compressor, validators, formatters, whatsapp, api, location, map, status | ✅ Done |

### ⏳ Pending Phases

| Phase | Components | Status |
|-------|------------|--------|
| **Phase 3: Landing Page** | Hero, How It Works, Why Us, Price Table, FAQ integration, Footer, Navbar/FAQ integration | ⏳ Not started |
| **Phase 7: Polish** | Animations, loading states, accessibility, SEO, cross-browser testing | ⏳ Not started |
| **Phase 8: Content & Assets** | Logo, illustrations, icons, FAQ content, OG image | ⏳ Not started |

### ⚠️ Known Issues

1. **Landing page empty** — `src/index.html` has empty `#app`, `main.js` only imports components but doesn't render them
2. **Photo compression not integrated** — `image-compressor.js` exists but photo uploader in `order.js` uses raw Files
3. **No `public/` directory** — Vite config references `../public` which doesn't exist (will warn on dev start)
4. **Order flow components inline** — Steps rendered directly in `order.js` instead of modular components as originally planned
5. **No favicon/OG image/assets** — Missing visual assets for production
