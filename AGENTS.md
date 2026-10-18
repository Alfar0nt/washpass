# WashPass — Agent Instructions

Instruksi dan standar kerja autonomous agent di codebase WashPass.

## Project Status
**MVP Ready** — audit remediasi P0–P5 selesai (tracking, admin ops, status batal, SEO, keamanan, tooling). Tersisa **P6 (Brand Assets)** & **P7 (Payment/Auth — ditunda pasca-launch)**. Rujukan: `.ai/IMPLEMENTATION-PLAN.md`.

## Core Agent Rules & Environment

1. **Browser Testing & Lighthouse (Manjaro Linux)**:
   - Mesin lokal menggunakan **Brave Browser** (`/bin/brave`).
   - Gunakan Brave untuk pengujian audit Lighthouse, responsivitas tampilan, dan cross-browser testing.
   - Contoh command Lighthouse headless / devtools via Brave:
     ```bash
     brave --headless --remote-debugging-port=9222 http://localhost:5173
     # atau npx lighthouse-ci / npx lighthouse http://localhost:5173 --chrome-flags="--headless"
     ```
     (Atur binary path Chrome ke `/bin/brave` jika tool mengasumsikan lokasi Google Chrome default: `CHROME_PATH=/bin/brave`).

2. **Komunikasi & Konfirmasi Bebas Halusinasi**:
   - **Selalu tanyakan dan konfirmasi ke user** setelah menerima prompt jika terdapat instruksi yang ambigu, tidak lengkap, atau memiliki lebih dari satu arah implementasi.
   - Jangan berasumsi atau membuat kesimpulan sendiri pada requirement yang samar untuk mencegah halusinasi.
   
3. gunakan command nvm use 24.20.0 terlebih dahulu jika ingin menggunakan command nodejs/npm

## Tech Stack Overview
- **Frontend Build**: Vite (Vanilla JS, ES Modules)
- **Backend**: Express.js (Node.js)
- **Database**: SQLite via `sqlite3` + `sqlite` (async wrapper, Node.js 20+ compatible)
- **File Upload**: Multer (server-side) + Canvas API compression (client-side)
- **Maps**: Leaflet.js + OpenStreetMap
- **Location**: Browser Geolocation API + Nominatim reverse geocoding
- **Language**: JavaScript ES2022+ (No TypeScript)
- **CSS**: Vanilla CSS + Custom Properties (Design Tokens), BEM-inspired
- **Fonts**: Plus Jakarta Sans (Headings), Inter (Body)
- **Icons**: Lucide Icons (Inline SVG)

## Project Structure
```
washpass/
├── server/                 # Express backend
│   ├── index.js            # Entry point & API routes
│   ├── db/
│   │   ├── database.js     # SQLite connection
│   │   ├── schema.js       # Auto schema tables
│   │   └── washpass.db     # SQLite DB file (auto-generated)
│   ├── routes/
│   │   └── orders.js       # CRUD /api/orders
│   ├── middleware/
│   │   └── upload.js       # Multer multipart config
│   └── uploads/            # Direktori foto order (gitignored)
├── src/                    # Frontend source (Vite)
│   ├── index.html          # Landing page
│   ├── order.html          # Multi-step order flow
│   ├── admin.html          # Admin management panel
│   ├── track.html          # Halaman lacak status pesanan
│   ├── privacy.html        # Kebijakan privasi (HTML statis)
│   ├── terms.html          # Syarat dan ketentuan (HTML statis)
│   ├── 404.html            # Halaman tidak ditemukan
│   ├── css/
│   │   ├── reset.css
│   │   ├── variables.css   # Single source of truth untuk design tokens
│   │   ├── global.css
│   │   ├── components/     # CSS modular komponen
│   │   └── pages/          # CSS per halaman (landing, order, admin, legal)
│   ├── js/
│   │   ├── main.js         # Landing page entry point
│   │   ├── order.js        # Order flow logic
│   │   ├── admin.js        # Admin page logic
│   │   ├── track.js        # Lacak pesanan logic
│   │   ├── legal.js        # Legal pages bootstrap (footer)
│   │   ├── config/pricing.js # Source of truth harga & katalog
│   │   ├── components/     # Reusable UI component modules
│   │   ├── services/api.js # API client HTTP
│   │   └── utils/          # Helper modules (+ *.test.js Vitest)
│   └── assets/
├── public/                 # Static assets (favicon, manifest, og-image, icons, sitemap.xml, robots.txt)
├── .ai/                    # Dokumentasi terstruktur proyek
│   ├── PRD.md              # Product Requirement Document
│   ├── TRD.md              # Technical Requirements Document
│   ├── APP-FLOW.md         # Wireframe, Sitemap & User Flow
│   ├── IMPLEMENTATION-PLAN.md # Roadmap & tracking implementasi
│   └── DESIGN.md           # Design tokens, komponen UI & styling specs
├── AGENTS.md               # Pedoman agent (file ini)
├── README.md               # Dokumentasi umum repo
├── docs/CHANGELOG.md       # Riwayat versi
├── eslint.config.js        # ESLint flat config
├── vitest.config.js        # Konfigurasi Vitest
├── .env.example            # Contoh environment variables
└── vite.config.js
```

## API Endpoints
| Method | Endpoint | Fungsi |
|---|---|---|
| `POST` | `/api/orders` | Buat order baru (multipart: data + items + foto + GPS) |
| `GET` | `/api/orders` | Ambil daftar semua order (support `?status=`) |
| `GET` | `/api/orders/stats` | Statistik agregat (count per status, order & pendapatan hari ini) |
| `GET` | `/api/orders/track/:id` | Lacak order publik (field terbatas, tanpa PII) |
| `GET` | `/api/orders/:id` | Ambil detail spesifik order |
| `PATCH` | `/api/orders/:id/status` | Update status (`pending` → `picked_up` → `in_progress` → `done`, atau `cancelled` dari `pending`/`picked_up`) |
| `GET` | `/uploads/:filename` | Sajikan foto sepatu yang diunggah |

## Development Commands
```bash
pnpm install         # Install dependencies
pnpm run dev:all     # Jalankan frontend (Vite :5173) & backend (Express :3000) bersamaan
pnpm run dev         # Frontend saja
pnpm run dev:server  # Backend Express saja
pnpm run build       # Build bundle frontend ke folder dist/
pnpm run start       # Jalankan server Express production (melayani API + dist/)
pnpm run lint        # ESLint (flat config)
pnpm run format      # Prettier (write)
pnpm test            # Vitest (unit test utils)
pnpm run clean:ports # Bersihkan port 3000 & 5173 jika hang/bentrok
```

## Referensi Dokumentasi
- `.ai/PRD.md` — Deskripsi produk & fungsional
- `.ai/TRD.md` — Detail teknis arsitektur, API contract & skema DB
- `.ai/APP-FLOW.md` — Alur kerja aplikasi, sitemap, wireframe & edge cases
- `.ai/IMPLEMENTATION-PLAN.md` — Task list & riwayat implementasi
- `.ai/DESIGN.md` — Design system, palet warna, tipografi & token
