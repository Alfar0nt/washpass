# WashPass — Implemented Features

> **Last Updated:** 2026-08-27  
> **Version:** v0.0.20 (Phase 1-6 Complete + Bug Fixes)

---

## Status: Phase 1-6 Complete ✅ | Phase 7-8 Pending

**Completed:** Phase 1 (Setup), 2 (Backend), 3 (Landing Page), 4 (Order Flow), 5 (Admin), 6 (Utilities)  
**Pending:** Phase 7 (Polish), 8 (Assets)

---

## Tech Stack

- **Frontend**: Vite + Vanilla JS (ES Modules)
- **Backend**: Express.js + SQLite (`sqlite3` + `sqlite` wrapper, async)
- **Maps**: Leaflet.js + OpenStreetMap
- **Location**: Browser Geolocation API + Nominatim reverse geocoding
- **CSS**: Vanilla CSS + Custom Properties (Design Tokens)
- **Fonts**: Plus Jakarta Sans + Inter (Google Fonts)

---

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

---

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
├── vite.config.js
└── package.json
```

---

## Implemented Features

### Landing Page (`/`) ✅

- **Navbar**: Responsive, sticky, transparent→solid on scroll, hamburger menu
- **Hero**: Gradient background, glassmorphism trust badge card, dual CTAs
- **How It Works**: 3-step flow with icons, connecting line (centered on circles), hover animations
- **Why Us**: 4 feature cards (Pickup Gratis, Profesional, Transparan, Garansi)
- **Price Table**: Tabbed Sepatu/Sandal, responsive table, from-price highlight
- **FAQ**: Accordion with 6 items, smooth animations, single-open
- **Footer**: Brand, navigation, contact info, social links, copyright

### Order Flow (`/order`) ✅

- 7-step wizard: Category → Material → Wash Type → Photos → Cart → Customer → Review (strictly linear; sandals skip Material)
- GPS location picker with Leaflet mini-map preview + reverse geocoding
- Drag & drop photo upload with preview/remove, **Canvas API compression** (shows original→compressed size)
- Cart with min 2 items validation, add/remove items
- WhatsApp redirect after server-side order save
- **Back to Home button** in header bar (visible on all steps) — navigate back to landing page
- **Back to Previous Section buttons** in item selection steps (material, wash type) — for correcting wrong selections
- **Sticky top progress/step indicator** — progress bar fixed at top of page, with a background track, vertically centered on the icons, and the fill ending exactly at the active step's icon

### Admin Panel (`/admin`) ✅

- Order list (responsive table on desktop, cards on mobile)
- Enhanced status: `pending` → `picked_up` → `in_progress` → `done` (with transition validation)
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
- Cart state management (event-driven, localStorage persistence)
- Step manager for multi-step forms
- Image compression (Canvas API, quality 0.8, max 1200px)
- Form validators, formatters (currency, dates, phone)
- WhatsApp message generator
- Geolocation wrapper with error handling + reverse geocoding
- Leaflet map utilities (initMap, addMarker, createMiniMap)
- Status constants & helpers

---

## What's Working Now

| URL | Status |
|-----|--------|
| `http://localhost:5173/` | ✅ Landing page |
| `http://localhost:5173/order` | ✅ Full order flow |
| `http://localhost:5173/admin` | ✅ Admin panel |
| `http://localhost:3000/api/orders` | ✅ API endpoints |

---

## To Test

```bash
# 1. Install deps
pnpm install

# 2. Run both servers
pnpm run dev:all
```

---

## Next Steps

1. **Phase 7**: Polish (animations, accessibility, SEO, Lighthouse audit)
2. **Phase 8**: Assets (logo, illustrations, OG image, favicon, web manifest)
3. **Production deployment** — Build & deploy to Railway/Render/VPS

---

## Known Issues / Bugs ⚠️

### Issue #1: Step Navigation Stuck After Customer Form ❌ **FIXED**

**Severity:** High (FIXED in v0.0.7)  
**Location:** `src/js/order.js` lines 528-558

**Original Symptoms:**
- User fills in customer form (name, WA, address)
- Clicks "Review Pesanan" button
- Page stuck on customer form
- Form data disappears on refresh
- Admin panel shows empty (no orders saved)

**Root Cause:**
- Cart items included `photos` arrays with File objects
- File objects cannot be serialized to JSON
- When order data saved to sessionStorage, photos were lost
- No debugging logging to trace navigation flow

**Fix Applied (v0.0.7):**
- Map cart items to exclude File objects
- Add `photoCount` field instead of full photos array
- Add comprehensive console logging
- Add validation for step navigation success

**Verification:**
- ✅ Successfully navigates from Customer step to Review step
- ✅ Form data persists in sessionStorage
- ✅ Admin panel shows saved orders
- ✅ Order submission works end-to-end

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

## Immediate Action Items (Before v0.0.7)

- [ ] Debug step navigation issue (#1) - most critical
- [ ] Fix photo upload UI issue (#2) 
- [ ] Document HTTP/HTTPS geolocation limitation (#3)
- [ ] Add browser console error logging for easier debugging
- [ ] Test order submission flow end-to-end with real data
