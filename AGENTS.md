# WashPass — Agent Instructions

Instruksi dan standar kerja autonomous agent di codebase WashPass.

## Project Status
**Phase 1-6 & 8.2 Selesai** — Phase 7 (Polish/Lighthouse), 8.1 (Brand Assets), 9 (Payment Midtrans) pending. Rujukan roadmap: `.ai/IMPLEMENTATION-PLAN.md`.

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
│   ├── privacy.html        # Kebijakan privasi
│   ├── terms.html          # Syarat dan ketentuan
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
│   │   ├── config/pricing.js # Source of truth harga & katalog
│   │   ├── components/     # Reusable UI component modules
│   │   ├── services/api.js # API client HTTP
│   │   └── utils/          # Helper modules (cart, formatters, validators, dll.)
│   └── assets/
├── public/                 # Static assets (favicon, manifest, og-image)
├── .ai/                    # Dokumentasi terstruktur proyek
│   ├── PRD.md              # Product Requirement Document
│   ├── TRD.md              # Technical Requirements Document
│   ├── APP-FLOW.md         # Wireframe, Sitemap & User Flow
│   ├── IMPLEMENTATION-PLAN.md # Roadmap & tracking implementasi
│   └── DESIGN.md           # Design tokens, komponen UI & styling specs
├── AGENTS.md               # Pedoman agent (file ini)
├── README.md               # Dokumentasi umum repo
└── vite.config.js
```

## API Endpoints
| Method | Endpoint | Fungsi |
|---|---|---|
| `POST` | `/api/orders` | Buat order baru (multipart: data + items + foto + GPS) |
| `GET` | `/api/orders` | Ambil daftar semua order (support `?status=`) |
| `GET` | `/api/orders/:id` | Ambil detail spesifik order |
| `PATCH` | `/api/orders/:id/status` | Update status (`pending` → `picked_up` → `in_progress` → `done`) |
| `GET` | `/uploads/:filename` | Sajikan foto sepatu yang diunggah |

## Development Commands
```bash
pnpm install         # Install dependencies
pnpm run dev:all     # Jalankan frontend (Vite :5173) & backend (Express :3000) bersamaan
pnpm run dev         # Frontend saja
pnpm run dev:server  # Backend Express saja
pnpm run build       # Build bundle frontend ke folder dist/
pnpm run start       # Jalankan server Express production (melayani API + dist/)
pnpm run clean:ports # Bersihkan port 3000 & 5173 jika hang/bentrok
```

## Referensi Dokumentasi
- `.ai/PRD.md` — Deskripsi produk & fungsional
- `.ai/TRD.md` — Detail teknis arsitektur, API contract & skema DB
- `.ai/APP-FLOW.md` — Alur kerja aplikasi, sitemap, wireframe & edge cases
- `.ai/IMPLEMENTATION-PLAN.md` — Task list & riwayat implementasi
- `.ai/DESIGN.md` — Design system, palet warna, tipografi & token
