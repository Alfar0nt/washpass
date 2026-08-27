# WashPass — Changelog

---

## [v0.0.6] - 2026-08-27

### Added
- Added `docs/` folder with changelog and versioning
- Added `IMPLEMENTED-FEATURES.md` documentation
- Enhanced order status flow (pending → picked_up → in_progress → done)
- GPS location sharing with reverse geocoding via Nominatim
- Leaflet map integration for admin panel (pickup location preview)
- Canvas API client-side image compression
- Dynamic navbar height offset calculation (ResizeObserver)
- Mobile responsive admin panel (card view on mobile)

### Fixed
- Order page blank page issue (added missing `stepContent` container)
- Fixed mobile navbar content blocking on scroll

### Changed
- Backend database library: `better-sqlite3` → `sqlite3` + `sqlite` (async, Node.js 26+ compatible)
- Status field names: `pending` → `picked_up` → `in_progress` → `done`

---

## [v0.0.5] - 2026-08-27

### Added
- Admin panel with order list and detail modal
- Backend Express.js server
- SQLite database with orders, order_items, order_photos tables
- Order submission API endpoint with photo upload (Multer)
- Order status update API with transition validation

### Fixed
- Fixed order page blank page issue (added missing stepContent container)

### Changed
- Backend database library: `better-sqlite3` → `sqlite3` + `sqlite` (async, Node.js 26+ compatible)
- Status field names: `pending` → `picked_up` → `in_progress` → `done`

---

## [v0.0.4] - 2026-08-27

### Added
- Order flow page with 7-step wizard
- Category selection (Sepatu / Sandal)
- Material selection (Kanvas, Mesh/Knit, Kulit, Suede/Nubuck)
- Wash type selection (Cuci Kering / Cuci Basah)
- Photo uploader with drag & drop
- Cart management with minimum 2 items validation
- Customer form with WhatsApp validation
- WhatsApp redirect after order submission
- Image compression preview (original vs compressed size)

---

## [v0.0.3] - 2026-08-27

### Added
- Landing page with all sections:
  - Navbar (sticky, transparent on hero)
  - Hero section with glassmorphism badge
  - How It Works (3-step flow)
  - Why Us (4 feature cards)
  - Price Table (tabbed Sepatu/Sandal)
  - FAQ (accordion)
  - Footer
- Dynamic navbar height offset calculation

---

## [v0.0.2] - 2026-08-26

### Added
- Backend Express.js setup
- SQLite database schema (orders, order_items, order_photos)
- Order API endpoints:
  - POST /api/orders
  - GET /api/orders
  - GET /api/orders/:id
  - PATCH /api/orders/:id/status
- Multer middleware for file upload
- Static file serving for uploads/

### Fixed
- Fixed order page blank page issue (added missing stepContent container)

### Changed
- Backend database library: `better-sqlite3` → `sqlite3` + `sqlite` (async, Node.js 26+ compatible)
- Status field names: `pending` → `picked_up` → `in_progress` → `done`

---

## [v0.0.1] - 2026-08-25

### Added
- Project initialization with Vite + vanilla JS
- Folder structure setup (frontend + backend)
- CSS design tokens (variables.css)
- Button component styles
- Google Fonts integration (Plus Jakarta Sans + Inter)
- Package.json scripts (dev, dev:server, dev:all, build, start)
- Vite config with API proxy to Express
- Landing page entry point

---
