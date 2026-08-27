# WashPass

Website jasa cuci sepatu & sandal profesional dengan sistem pickup & delivery.

## Current Version: v0.0.20

**Status:** Phase 1-6 Complete ✅ | Phase 7-8 Pending  
**Release:** 2026-08-27

See [`docs/CHANGELOG.md`](./docs/CHANGELOG.md) for full changelog and version history.  
See [`.ai/docs/IMPLEMENTED-FEATURES.md`](./.ai/docs/IMPLEMENTED-FEATURES.md) for known issues and bugs.

**Completed:** Phase 1 (Setup), 2 (Backend), 3 (Landing Page), 4 (Order Flow), 5 (Admin), 6 (Utilities)  
**Pending:** Phase 7 (Polish), 8 (Assets)

**v0.0.20:**
- ✅ Fixed admin "Detail Pesanan" modal stuck on loading (added API timeout + guarded render + clear error state)

**v0.0.19:**
- ✅ Fixed `NOT NULL constraint failed: order_items.category` (sandal orders had no category)

**v0.0.18:**
- ✅ Order confirmation happens server-side/website FIRST (button = "Konfirmasi Order")
- ✅ WhatsApp is mock/placeholder with a toggle (`WHATSAPP_MOCK` in `src/js/utils/whatsapp.js`)
- ✅ Fixed "Failed to create order" error surfacing (server returns real message)

**Bug Fixes in v0.0.17:**
- ✅ Fixed identity data lost when changing order (Ubah Data Diri → form repopulates)
- ✅ Fixed order confirmation flow: confirms server-side first, then shows on-page success + WhatsApp button
- ✅ Fixed photos being dropped from submitted orders (now read from live cart)

**Bug Fixes in v0.0.16:**
- ✅ Fixed progress bar stopping before the current section
- ✅ Fixed Keranjang "Tambah Item Lain" wiping previous items

**Bug Fixes in v0.0.15:**
- ✅ Fixed order flow skipping sections (foto/keranjang skipped)
- ✅ Fixed Data Diri stuck after "Review Pesanan"

**Bug Fixes in v0.0.14:**
- ✅ Fixed Cara Kerja connecting line alignment on landing page

**Bug Fixes in v0.0.13:**
- ✅ Fixed progress bar alignment & position (fills exactly to active step icon)

**New Feature in v0.0.12:**
- ✅ Added back to previous section buttons in item selection steps
- ✅ Fixed progress bar positioning (sticky top bar)

**New Feature in v0.0.11:**
- ✅ Added back to home button in order flow

**Bug Fixes in v0.0.10:**
- ✅ Fixed port conflict error (EADDRINUSE) with helpful error messages
- ✅ Added graceful shutdown handling for development servers

**Bug Fixes in v0.0.9:**
- ✅ Enhanced geolocation HTTPS error handling
- ✅ Improved location picker error messages

**Bug Fixes in v0.0.8:**
- ✅ Fixed photo upload UI issue (wash type appearing in wrong step)
- ✅ Fixed DOM element scoping in photo uploader

**Bug Fixes in v0.0.7:**
- ✅ Fixed step navigation stuck after customer form
- ✅ Added console logging for order flow debugging

**Completed:** Phase 1 (Setup), 2 (Backend), 3 (Landing Page), 4 (Order Flow), 5 (Admin), 6 (Utilities)  
**Pending:** Phase 7 (Polish), 8 (Assets)

For detailed feature documentation, see [`.ai/docs/IMPLEMENTED-FEATURES.md`](./.ai/docs/IMPLEMENTED-FEATURES.md).

## Tech Stack
- **Frontend**: Vite + Vanilla JS (ES Modules)
- **Backend**: Express.js + SQLite (`sqlite3` + `sqlite` wrapper, async)
- **Maps**: Leaflet.js + OpenStreetMap
- **Location**: Browser Geolocation API + Nominatim reverse geocoding
- **CSS**: Vanilla CSS + Custom Properties (Design Tokens)
- **Fonts**: Plus Jakarta Sans + Inter (Google Fonts)

## Development (using pnpm)

```bash
# Install dependencies
pnpm install

# Development (runs both frontend & backend)
pnpm run dev:all

# Frontend only (Vite dev server on port 5173)
pnpm run dev

# Backend only (Express on port 3000)
pnpm run dev:server

# Production build
pnpm run build

# Production server (serves dist/ + API)
pnpm run start
```

## Project Structure
```
washpass/
├── src/                    # Frontend (Vite)
│   ├── index.html          # Landing page (✅ complete)
│   ├── order.html          # Order flow (✅ complete)
│   ├── admin.html          # Admin panel (✅ complete)
│   ├── css/                # Stylesheets (19 files)
│   ├── js/                 # JavaScript modules (26 files)
│   └── assets/             # Images, icons
├── server/                 # Backend (Express)
│   ├── index.js            # Entry point
│   ├── db/                 # SQLite setup (database.js, schema.js)
│   ├── routes/             # API routes (orders.js)
│   ├── middleware/         # Multer upload
│   └── uploads/            # Uploaded photos (gitignored)
├── public/                 # Vite public assets (created)
├── .ai/                    # AI documentation (PRD, tasks, tech-stack)
│   └── docs/               # Implemented features documentation
├── docs/                   # User-facing documentation
│   └── CHANGELOG.md        # Version history and changelog
├── vite.config.js
└── package.json
```

## What's Working Now
| URL | Status |
|-----|--------|
| `http://localhost:5173/` | ✅ Landing page |
| `http://localhost:5173/order` | ✅ Full order flow |
| `http://localhost:5173/admin` | ✅ Admin panel |
| `http://localhost:3000/api/orders` | ✅ API endpoints |

## Quick Troubleshooting

### Port Conflict Errors

If you see `EADDRINUSE: address already in use :::3000`:

```bash
# Quick fix - clear all ports
pnpm clean:ports

# Or manually kill processes
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

The server now automatically retries on ports 3001, 3002, etc. if port 3000 is busy.

## To Test
```bash
# 1. Install deps
pnpm install

# 2. Run both servers
pnpm run dev:all
```

## Next Steps
1. **Phase 7**: Polish (animations, accessibility, SEO, Lighthouse audit)
2. **Phase 8**: Assets (logo, illustrations, OG image, favicon, web manifest)
3. **Production deployment** — Build & deploy to Railway/Render/VPS
