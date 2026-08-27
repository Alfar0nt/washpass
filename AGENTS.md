# WashPass — Agent Instructions

## Project Status
**Core Implementation Complete** — Phase 1, 2, 4, 5, 6 done. Phase 3 (Landing Page), 7 (Polish), 8 (Assets) pending.

## Tech Stack (from `.ai/tech-stack.md`)
- **Frontend Build**: Vite (vanilla JS, ES Modules)
- **Backend**: Express.js (Node.js)
- **Database**: SQLite via `better-sqlite3` (file-based, zero-config)
- **File Upload**: Multer (server-side) + Canvas API compression (client-side)
- **Maps**: Leaflet.js + OpenStreetMap
- **Location**: Browser Geolocation API + Nominatim reverse geocoding
- **Language**: JavaScript ES2022+ (no TypeScript)
- **CSS**: Vanilla CSS + Custom Properties (design tokens), BEM-inspired + utility hybrid
- **Fonts**: Plus Jakarta Sans (headings), Inter (body) — Google Fonts
- **Icons**: Lucide Icons (inline SVG)
- **Deploy**: Railway / Render / VPS (needs Node.js runtime)

## Project Structure (implemented)
```
washpass/
├── server/                 # Backend
│   ├── index.js            # Express entry point
│   ├── db/
│   │   ├── database.js     # SQLite connection
│   │   ├── schema.js       # Table creation
│   │   └── washpass.db     # DB file (auto-created)
│   ├── routes/
│   │   └── orders.js       # /api/orders CRUD
│   ├── middleware/
│   │   └── upload.js       # Multer config
│   └── uploads/            # Photo files (gitignored)
├── src/                    # Frontend (Vite)
│   ├── index.html          # Landing page (empty - Phase 3 pending)
│   ├── order.html          # Order flow (✅ complete)
│   ├── admin.html          # Admin order list (✅ complete)
│   ├── css/
│   │   ├── reset.css
│   │   ├── variables.css   # Design tokens
│   │   ├── global.css
│   │   ├── components/     # 13 component CSS files
│   │   └── pages/          # landing.css, order.css, admin.css
│   ├── js/
│   │   ├── main.js         # Landing entry (imports only)
│   │   ├── order.js        # Order flow entry (✅ complete)
│   │   ├── admin.js        # Admin page entry (✅ complete)
│   │   ├── config/pricing.js
│   │   ├── components/     # 10 JS components
│   │   ├── services/api.js # HTTP client for backend
│   │   └── utils/          # 9 utility modules
│   └── assets/
├── vite.config.js
├── package.json
├── public/                 # (create before running: mkdir -p public)
└── .gitignore
```

## Key Architectural Decisions
| Decision | Rationale |
|----------|-----------|
| Vanilla JS, no framework | Multi-page site + forms; no complex state management needed |
| Multi-page (3 HTML) | Landing (SEO), Order (heavy JS), Admin (separate concern) |
| Express.js + SQLite | Lightweight backend; SQLite = file-based DB, zero-config |
| `better-sqlite3` | Synchronous API, simpler code, no async/await for DB |
| Multer for uploads | Standard Express file upload middleware |
| Cart state in memory | Class-based, event-driven; lost on refresh (OK for MVP) |
| Photo upload to server | Compress client-side → upload via multipart → stored in uploads/ |
| WhatsApp integration | `wa.me/{number}?text={encoded}`; triggered AFTER server save |
| Admin without auth | MVP constraint; admin URL is "secret" |

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/orders` | Submit new order (multipart: customer + items + photos + lat/lng) |
| `GET` | `/api/orders` | List all orders (admin, filterable by status) |
| `GET` | `/api/orders/:id` | Order detail (admin) |
| `PATCH` | `/api/orders/:id/status` | Update order status (pending→picked_up→in_progress→done) |
| `GET` | `/uploads/:filename` | Serve uploaded photos |

## Database Tables
- `orders` — customer info, totals, **latitude, longitude**, status (pending/picked_up/in_progress/done), timestamps
- `order_items` — category, material, wash type, price per item, notes
- `order_photos` — filename, original name, linked to order_item

## Business Rules (from `.ai/PRD.md`)
- **Minimum order**: 2 pairs (shoes + sandals combinable)
- **Shoe materials**: canvas, mesh-knit, leather, suede-nubuck, rubber-eva
- **Wash types**: fast-clean (dry), deep-clean (wet)
- **Sandal pricing**: flat rate regardless of material
- **Order flow**: Submit to server → WhatsApp redirect
- **Admin**: Can view orders + update status (pending/picked_up/in_progress/done)
- **Location sharing**: Optional GPS via browser Geolocation API, shown on Leaflet map in admin

## Implementation Phases (from `.ai/tasks.md`)
1. **Setup** ✅ — Vite init, Express init, folder structure, CSS tokens (~30 min)
2. **Backend** ✅ — SQLite schema, Express routes, Multer upload, API CRUD (~2-3 hr)
3. **Landing Page** ⏳ — 7 sections: Navbar, Hero, How It Works, Why Us, Price Table, FAQ, Footer (~2-3 hr)
4. **Order Flow** ✅ — 7 steps with step indicator, validation, cart, GPS location, API submit (~3-4 hr)
5. **Admin Page** ✅ — Order list table, order detail modal with map, status dropdown with validation (~2-3 hr)
6. **Utilities** ✅ — pricing config, cart class, step manager, image compressor, validators, formatters, WA generator, API client, location, map, status (~1-2 hr)
7. **Polish** ⏳ — animations, accessibility, Lighthouse, cross-browser (~1-2 hr)
8. **Assets** ⏳ — logo, illustrations, icons, content (~1 hr)

## Commands
```bash
# After package.json exists:
npm run dev          # Vite dev server (frontend, port 5173)
npm run dev:server   # Express dev server (backend, port 3000)
npm run dev:all      # Both concurrently
npm run build        # Production build (Vite)
npm run start        # Production server (Express serves dist/ + API)
```

## Dev Architecture
```
Development:
  Vite (port 5173) ──proxy──► Express (port 3000)
    /api/*          →           /api/*
    /uploads/*      →           /uploads/*

Production:
  Express (port 3000)
    /api/*          →  API routes
    /uploads/*      →  Static files
    /*              →  Vite dist/ (static frontend)
```

## Files to Reference
- `.ai/tech-stack.md` — Full tech decisions, design tokens, project structure, implementation status
- `.ai/PRD.md` — Product requirements, user flows, pricing matrix, WA message template, DB schema, admin spec
- `.ai/ux-flow.md` — Wireframes, interaction specs, validation rules, edge cases
- `.ai/tasks.md` — Detailed task breakdown with checkboxes (updated with current status)

## Gotchas for Agents
- **Landing page is empty** — `src/index.html` has empty `#app`, `main.js` only imports components but doesn't render them (Phase 3)
- **Design tokens defined in tech-stack.md** — Use those exact CSS custom properties
- **Pricing is single-source** — All prices in `src/js/config/pricing.js` only
- **WhatsApp number** — Hardcoded in config, easy to change
- **State not persisted client-side** — Cart clears on refresh (MVP constraint)
- **Mobile-first** — Breakpoints: <768px, 768-1024px, >1024px
- **SQLite DB auto-created** — Schema runs on server start, no migration needed
- **uploads/ is gitignored** — Photos stored on server filesystem only
- **Admin has no auth** — Anyone with the URL can access (MVP)
- **Order submit is dual** — Save to SQLite + redirect to WhatsApp
- **Photo compression not integrated** — `image-compressor.js` exists but photo uploader in `order.js` uses raw Files
- **No `public/` directory** — Create before running: `mkdir -p public`
- **Order flow steps inline** — Steps rendered directly in `order.js` instead of modular components