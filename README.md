# WashPass

Website jasa cuci sepatu & sandal profesional dengan sistem pickup & delivery.

## Status: Core Implementation Complete ✅

**Completed:** Phase 1 (Setup), 2 (Backend), 4 (Order Flow), 5 (Admin), 6 (Utilities)  
**Pending:** Phase 3 (Landing Page), 7 (Polish), 8 (Assets)

## Tech Stack
- **Frontend**: Vite + Vanilla JS (ES Modules)
- **Backend**: Express.js + SQLite (better-sqlite3)
- **Maps**: Leaflet.js + OpenStreetMap
- **Location**: Browser Geolocation API + Nominatim reverse geocoding
- **CSS**: Vanilla CSS + Custom Properties (Design Tokens)
- **Fonts**: Plus Jakarta Sans + Inter (Google Fonts)

## Development

```bash
# Install dependencies
npm install

# Development (runs both frontend & backend)
npm run dev:all

# Frontend only (Vite dev server on port 5173)
npm run dev

# Backend only (Express on port 3000)
npm run dev:server

# Production build
npm run build

# Production server (serves dist/ + API)
npm run start
```

## Project Structure
```
washpass/
├── src/                    # Frontend (Vite)
│   ├── index.html          # Landing page (empty - Phase 3 pending)
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
├── vite.config.js
└── package.json
```

## Implemented Features

### Order Flow (`/order`) ✅
- 7-step wizard: Category → Material → Wash Type → Photos → Cart → Customer → Review
- GPS location picker with Leaflet mini-map preview
- Drag & drop photo upload with preview/remove
- Cart with min 2 items validation
- WhatsApp redirect after server-side order save

### Admin Panel (`/admin`) ✅
- Order list (responsive table on desktop, cards on mobile)
- Enhanced status: `pending` → `picked_up` → `in_progress` → `done`
- Order detail modal with Leaflet map (if GPS shared)
- Status dropdown with transition validation
- WhatsApp clickable links

### Backend API ✅
- `POST /api/orders` — Submit order (multipart: customer + items + photos + lat/lng)
- `GET /api/orders` — List orders (with lat/lng, filterable by status)
- `GET /api/orders/:id` — Order detail with items & photos
- `PATCH /api/orders/:id/status` — Update status with transition validation
- SQLite with `orders`, `order_items`, `order_photos` tables

### Utilities ✅
- Pricing config (single source of truth)
- Cart state management (event-driven)
- Step manager for multi-step forms
- Image compression (Canvas API)
- Form validators, formatters (currency, dates, phone)
- WhatsApp message generator
- Geolocation wrapper with error handling
- Leaflet map utilities
- Status constants & helpers

## What's Working Now
| URL | Status |
|-----|--------|
| `http://localhost:5173/order` | ✅ Full order flow |
| `http://localhost:5173/admin` | ✅ Admin panel |
| `http://localhost:3000/api/orders` | ✅ API endpoints |
| `http://localhost:5173/` | ⚠️ Empty (Phase 3 pending) |

## To Test
```bash
# 1. Create public dir (fixes Vite warning)
mkdir -p public

# 2. Install deps
npm install

# 3. Run both servers
npm run dev:all
```

## Next Steps
1. **Phase 3**: Build landing page (Hero, How It Works, Why Us, Price Table, FAQ, Footer)
2. **Integrate**: Add client-side image compression to photo uploader
3. **Phase 7**: Polish (animations, accessibility, SEO, Lighthouse)
4. **Phase 8**: Assets (logo, illustrations, FAQ content, OG image)