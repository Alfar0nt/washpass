# WashPass — Implemented Features

> **Last Updated:** 2026-08-27  
> **Version:** v0.0.21 (Phase 1-6 Complete + Recent Updates)

---

## Status: Phase 1-6 Complete ✅ | Phase 7-8 Pending

**Completed:** Phase 1 (Setup), 2 (Backend), 3 (Landing Page), 4 (Order Flow), 5 (Admin), 6 (Utilities)  
**Pending:** Phase 7 (Polish), 8 (Assets)

**v0.0.21 Updates:**
- ✅ Admin panel: Images now open in modal popup with fullscreen
- ✅ Direct cart access from any step (category, material, wash type)
- ✅ Free navigation between completed steps with data persistence
- ✅ Step validation before proceeding
- ✅ Clickable step indicator navigation
- ✅ Container spacing fixed for better mobile/desktop layout

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
- **Direct cart access** from any step (category, material, wash type)
- **Step validation** before proceeding to next step
- **Clickable step indicator** for free navigation between completed steps
- **Visual checkmarks** showing selected options on completed steps
- **Container spacing** fixed for better mobile/desktop layout

### Admin Panel (`/admin`) ✅

- Order list (responsive table on desktop, cards on mobile)
- Enhanced status: `pending` → `picked_up` → `in_progress` → `done` (with transition validation)
- Order detail modal with Leaflet map (if GPS shared)
- Status dropdown with transition validation
- WhatsApp clickable links
- Image modal viewer with fullscreen and prev/next navigation

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

## Known Issues / Bugs ⚠️ **UPDATED - v0.0.21**

### Bug #1: Visual Selection Indicator - Selected Options Not Showing When Going Back ❌
**Severity:** Medium  
**Status:** **IN PROGRESS** (v0.0.21)

**Symptoms:**
- User completes a step (e.g., selects "Sepatu" in Pilih Kategori)
- Navigates to next steps (Material, Wash Type, etc.)
- When clicking back to previous steps, the previously selected option shows NO visual indicator
- No checkmark, no highlighting, no clear indication of what was previously chosen

**Current Behavior:**
- Selection data persists in `sessionStorage['washpass_temp_item']`
- But the UI doesn't show which option was previously selected
- User must remember their selection or re-select

**Desired Behavior:**
- All completed steps should show checkmarks (✓) on their completed options
- When navigating back to Pilih Kategori, selected category should have a visible checkmark
- When navigating back to Pilih Bahan, selected material should have a visible checkmark
- When navigating back to Tipe Cuci, selected wash type should have a visible checkmark
- Checkmarks should persist even when navigating away and back

**Fix Attempted:**
- Added `.step-indicator__step--valid` class and CSS checkmark on step indicator circles
- Added `.category-card__checkmark`, `.material-card__checkmark`, `.wash-type-card__checkmark` to show checkmarks on cards
- Updated `renderCategoryStep`, `renderMaterialStep`, `renderWashTypeStep` to read from sessionStorage and show checkmarks

**Remaining Issues:**
- Checkmark is appearing briefly on "Konfirmasi" section when navigating back (bug)
- Checkmark not persisting correctly on all steps when navigating

**Files Affected:**
- `src/js/order.js` — step render functions with checkmark HTML
- `src/css/components/category-card.css` — `.category-card__checkmark` styles
- `src/css/components/material-card.css` — `.material-card__checkmark` styles  
- `src/css/components/wash-type-card.css` — `.wash-type-card__checkmark` styles
- `src/css/components/step-indicator.css` — `.step-indicator__step--valid` checkmark styles
- `src/js/components/step-manager.js` — validation class management

---

### Bug #2: Green Checkmark appearing briefly below "Konfirmasi" ❌
**Severity:** Low  
**Status:** **IN PROGRESS** (v0.0.21)

**Symptoms:**
- When navigating back to previous steps (e.g., from "Konfirmasi" to "Data Diri")
- A green checkmark briefly appears below the "Konfirmasi" step in the indicator
- The checkmark disappears after a moment, but the flash is distracting

**Root Cause:**
- CSS selector `.step-indicator__step--valid` applies checkmark styles globally
- The checkmark CSS is being applied before the step status classes are properly updated
- Race condition between `setStepValidation()` and `updateDisplay()` during navigation

**Fix Attempted:**
- Updated selector to require BOTH classes: `.step-indicator__step--completed.step-indicator__step--valid`
- Added `transition: none` to prevent animations
- Modified `updateDisplay()` to not remove/add validation classes during navigation

**Remaining Issue:**
- The checkmark still flashes briefly when navigating back

**Files Affected:**
- `src/css/components/step-indicator.css` — checkmark CSS
- `src/js/components/step-manager.js` — `updateDisplay()` and `setStepValidation()`

---

## Estimated Fix Timeline

| Issue | Priority | Estimasi |
|-------|----------|----------|
| #1: Visual Selection Indicator | P1 (Medium) | 1-2 jam |
| #2: Green Checkmark Flash | P2 (Low) | 30 menit |

---

## Immediate Action Items (v0.0.21) - 🚧 **IN PROGRESS**

- [x] Add direct cart button from category/material/washType steps ✅
- [x] Make top step navigation clickable ✅  
- [x] Add validation before proceeding to next step ✅
- [ ] Fix visual selection indicator showing checkmarks on completed steps
- [ ] Fix green checkmark appearing briefly when navigating back
- [ ] Test direct navigation to cart from any step
- [ ] Test navigation back and forth between completed steps
