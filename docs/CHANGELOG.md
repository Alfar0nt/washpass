# WashPass — Changelog

---

## [v0.0.21] - 2026-08-27

### Fixed
- **Admin panel: Images now open in modal popup instead of new tab**:
  - Clicking on order photos opens a modal overlay (same page)
  - Fullscreen toggle button included
  - Prev/Next navigation for multi-photo items
  - Keyboard support (Arrow Left/Right, Escape to close)
  - Click outside modal to close
  - Files: `src/js/components/order-detail.js`, `src/css/components/admin-detail.css`

- **Order flow: Direct cart access from any step**:
  - Added "Keranjang (X item)" button to Pilih Kategori, Pilih Bahan, and Pilih Tipe Cuci steps
  - Users can jump to cart at any time without adding more items
  - Button shows current cart item count

- **Order flow: Free navigation with data persistence**:
  - Users can freely navigate back/forward between steps
  - All form data (category, material, wash type, photos, notes) saved to sessionStorage
  - Navigation back doesn't lose previous selections
  - Files: `src/js/order.js` — all step render functions

- **Order flow: Step validation before proceeding**:
  - Steps must be completed before proceeding to next step
  - Category → Material/WashType → Photos → Cart → Customer → Review
  - Validation set via `stepManager.setStepValid()` on each completion
  - Prevents skipping required steps

- **Order flow: Step indicator clickable navigation**:
  - Users can click on completed steps in the progress bar to jump back
  - Previously completed steps are clickable (green/active)
  - Future steps remain disabled

- **Container spacing fixed**:
  - Added proper padding to prevent content from touching screen edges
  - Mobile: `padding-top: calc(var(--order-header-height, 64px) + 68px)` on `#stepContent`
  - Desktop: `padding-top: var(--space-8)` with container padding on sides
  - Added `.step-content__wrapper` with responsive max-width (768px mobile, 900px desktop)

- **Order flow: Card checkmarks for selected options**:
  - Category step: Shows ✓ on selected category (Sepatu/Sandal)
  - Material step: Shows ✓ on selected material
  - WashType step: Shows ✓ on selected wash type
  - Checkmarks appear in top-right corner of each card

### Changes
- Updated tasks.md to v0.0.21 with new bug reports (visual indicator, green checkmark flash)
- Updated tasks.md to add bugs at top of known issues section
- Files: `src/js/order.js`, `src/js/components/step-manager.js`, `src/css/pages/order.css`, `src/css/components/*.css`

### Known Issues (v0.0.21) - In Progress
- **Bug #1**: Visual selection indicator not persisting on all steps when navigating back
- **Bug #2**: Green checkmark appearing briefly below "Konfirmasi" step when navigating back

---

## [v0.0.20] - 2026-08-27

### Fixed
- **Admin "Detail Pesanan" modal stuck on "Memuat detail..." spinner (had to close manually)**:
  - **ROOT CAUSE:** `.admin-modal-overlay` CSS defaults to `display: flex`, and the `OrderDetail` constructor's `render()` never hid it. So the detail modal — with its spinning "Memuat detail..." loader — was shown **as soon as the admin page loaded**, before any `open()` call. Since no `open()` ever triggered a fetch, the loader spun forever and only a manual close dismissed it.
  - **Fix:** `OrderDetail.render()` now sets the overlay to `style="display: none"` by default, so the modal only appears when the user clicks a row (which calls `open()` → `display: flex`).
  - **Also added hardening** (guards any remaining stall so the spinner can never spin forever):
    - `request()` in `src/js/services/api.js` now uses an `AbortController` with a 15s timeout, throwing a clear message on timeout instead of hanging.
    - `OrderDetail.open()` resets the loading content at open, wraps `renderDetail()` inside the try/catch, and shows a clear error panel ("Gagal Memuat") with a working "Tutup" button on any failure.

### Files Changed
- `src/js/components/order-detail.js` — overlay hidden by default; `showLoading()`/`showError()`; `renderDetail()` inside try/catch; `open()` resets loading state
- `src/js/services/api.js` — AbortController timeout (15s) on all API requests

---

## [v0.0.19] - 2026-08-27

### Fixed
- **`SQLITE_CONSTRAINT: NOT NULL constraint failed: order_items.category`** when confirming an order:
  - **Root cause:** regression from v0.0.15 — `selectCategory()` no longer stored the chosen `category` into the temp item. Sandals skip the Material step (so `selectMaterial` never runs), leaving `tempItem.category` empty. The item was then sent to the server without a `category`, violating the NOT NULL constraint (and sandal pricing/wash-type rendering was also broken).
  - **Solution:** `selectCategory()` now writes `category` (and clears a stale `material` when switching to a non-sandal category) into `sessionStorage['washpass_temp_item']` before advancing. Sandals now correctly set `category: 'sandal'` and route through sandal pricing.
  - Also only possible to trace because v0.0.18 made the server return the real error message (visible as "Gagal mengonfirmasi order: SQLITE_CONSTRAINT...").

### Files Changed
- `src/js/order.js` — `selectCategory()` now persists the category into the temp item.

### Verified (E2E)
- Sandal-only order → succeeds, items have `category = 'sandal'`
- Mixed shoe + sandal order → succeeds, items have `category = 'shoe'` / `'sandal'`
- Orders appear in `/admin` (GET `/api/orders`) as pending

---

## [v0.0.18] - 2026-08-27

### Changed
- **Order confirmation now happens server-side/website first** (not via WhatsApp):
  - Review button renamed from "Kirim Pesanan via WhatsApp" → **"Konfirmasi Order"** (order-review.js + loading state "Mengonfirmasi order...").
  - The order is POSTed to `/api/orders` and confirmed BEFORE any WhatsApp action. Only after a successful server confirm does the success screen render.
  - Success screen renamed to "Order Terkonfirmasi".
- **WhatsApp as mock/placeholder with a toggle**:
  - Added `WHATSAPP_MOCK = true` flag in `src/js/utils/whatsapp.js` (default ON for testing).
  - Helpers: `isWhatsAppMock()`, `setWhatsAppMock()`, `toggleWhatsAppMock()`.
  - Success screen shows a "Mode Mock" badge when mock is on, and the WA button is labeled "Kirim Ringkasan via WhatsApp (Mock)". Set `WHATSAPP_MOCK = false` (or call `setWhatsAppMock(false)`) to disable mock in production.
  - Mock WhatsApp never blocks or affects order confirmation — it only opens a placeholder `wa.me` link on user click.

### Fixed
- **"Failed to create order" error surfaced**:
  - Server 500 response now returns the real error message (`error.message`) instead of the generic "Failed to create order", so the actual cause is visible.
  - Error alert text on the client changed to "Gagal mengonfirmasi order: ...".
- Confirmed end-to-end: server POST returns an `orderId`, the order appears in `/admin` (GET `/api/orders`) with items, and photos (if any) link to the correct item.

---

## [v0.0.17] - 2026-08-27

### Fixed
- **Identity data lost when changing order ("Ubah Data Diri")**:
  - When returning to the Data Customer step (from review), the form re-created empty.
  - `renderCustomerStep` now passes the saved customer data (`sessionStorage['washpass_order_data'].customer`) as `initialData` to `initCustomerForm`, so name/WhatsApp/address/notes repopulate.
- **Order confirmation flicker / unreliable WhatsApp send**:
  - The flow now **confirms the order on the server first** (POST /api/orders) and only on success shows an on-page confirmation screen.
  - Removed the auto `window.open` redirect after an `await` (which browsers block as a non-user-gesture popup, leaving no on-page feedback). WhatsApp sending is now exposed as a user-triggered "Kirim Ringkasan via WhatsApp" button on the success screen (mock/placeholder for now).
- **Photos were silently dropped from submitted orders**:
  - Photo Files can't be JSON-serialized into `sessionStorage`, so `orderData.items` stored only `photoCount`.
  - `handleOrderSubmit` now builds the FormData from the **live cart** (which still holds the File objects), preserving photos in the created order.
- **Server could not link photos to items**: `router.post('/')` expected `item.photos` to be an array (using `item.photos?.length`), but the client sends a count number. The server now accepts either an array or a plain count.

### Changed
- `handleOrderSubmit` rewritten:
  1. Build FormData (`buildOrderFormData`) from live cart + order data
  2. Submit to the server → get `orderId`
  3. Clear draft (sessionStorage)
  4. Render `renderSuccessStep(orderId, orderData)` with order number + status + optional WhatsApp button
- Added `renderSuccessStep(orderId, orderData)` success screen and `.order-success` styles.

---

## [v0.0.16] - 2026-08-27

### Fixed
- **Progress bar stopped before the current section**:
  - The progress fill's width was relative to the track (which already spans first-icon-center to last-icon-center), but the formula used `currentStepIndex / steps.length`. This made the fill stop short of the active step's icon (e.g. on "Bahan" it stopped at ~19% of the row instead of reaching the 21.43% Bahan center).
  - Corrected to `currentStepIndex / (steps.length - 1)`, so the fill now lands exactly on the active step's icon center for every step (verified: all 7 steps match).
- **Keranjang "Tambah Item Lain" wiped previously added items**:
  - `selectCategory` called `cart.clear()` every time a category was chosen, which wiped existing cart items when the user went back to add another item.
  - Removed `cart.clear()` from `selectCategory`. The cart is now only cleared after a successful order submission (`handleOrderSubmit`).
  - This fixes the ability to add multiple items (min 2 order) without losing earlier items.

---

## [v0.0.15] - 2026-08-27

### Fixed
- **Order flow skipping sections** (foto/keranjang skipped, going straight to data diri):
  - Root cause: `completeCurrentStep()` already advances to the next step internally (via `return this.next()`), but several step-transition functions also called `stepManager.next()` a second time — advancing **two** steps at once and skipping sections
  - Fixed these functions (removed the redundant `next()` calls) in `src/js/order.js`:
    - `selectMaterial` — no longer skips Tipe Cuci
    - `selectWashType` — no longer skips Foto
    - `addToCart` — no longer skips Keranjang
    - `#proceedToCustomer` handler — no longer skips Data Diri
    - `handleCustomerSubmit` — no longer skips Konfirmasi (was getting "stuck" on Data Diri)
- **Data Diri stuck after "Review Pesanan"**: caused by the same double-advance bug (advancing past the Konfirmasi step). Now proceeds correctly to the review step.
- **Progress bar messed up**: now reflects the correct, linear step progression.

### Notes
- The flow is now strictly linear: Pilih Item → Bahan → Tipe Cuci → Foto → Keranjang → Data Diri → Konfirmasi
- Sandals still skip the Bahan step (no material selection), going Pilih Item → Tipe Cuci

---

## [v0.0.14] - 2026-08-27

### Fixed
- **Cara Kerja (How It Works) connecting line alignment** on the landing page:
  - Vertically centered the line on the step circles (was aligned too high, appearing "in the middle of Pesan ke Website")
  - Now the line starts exactly at the **first circle's center** and ends at the **last circle's center** (was inset 10%, overshooting past the circles on both sides)
  - Use `top: calc(var(--space-6) + 50px)` to hit the circle centers and `left/right: calc(100% / 6)` to span circle-center-to-circle-center in the 3-column grid

---

## [v0.0.13] - 2026-08-27

### Fixed
- **Progress Bar Alignment & Position**:
  - Progress line is now vertically centered on the step icons (was positioned relative to the whole container including labels, appearing "in the middle of the logo")
  - Added a **background track line** so the progress is visually anchored and aligned
  - Progress fill now ends **exactly at the active step's icon center** — no longer stuck between sections (e.g., on "Bahan" the fill reaches the "Bahan" icon exactly)
  - Fixed the width math: now uses `currentStepIndex / totalSteps` with the track spanning first-to-last icon centers, so the fill correctly matches the current section

### Implementation Notes
- Restructured the progress indicator in `step-manager.js`:
  - Added a `.step-indicator__track` element inside `.step-indicator__steps` (positioned between first and last icon centers)
  - Progress fill lives inside the track
  - Container sets `--step-count` CSS variable for layout math
- Progress width formula: `(currentStepIndex / steps.length) * 100%`

---

## [v0.0.12] - 2026-08-27

### Fixed
- **Progress Bar Positioning**: Fixed the step indicator progress line being mispositioned (absolute positioning missing a positioned ancestor placed it in the middle of the page)
  - Added `position: relative` to `.step-indicator` so the progress line anchors correctly
- **Step Indicator at Top**: Moved the step/progress indicator to a sticky bar at the top of the order page
  - Header ("Kembali ke Beranda") is sticky at top, step indicator sticks right below it
  - Progress indicator no longer ruins the page layout

### Added
- **Back to Previous Section buttons** in the item selection steps:
  - **Material step**: "Kembali" button to go back to Category
  - **Wash Type step**: "Kembali" button to go back to the previous step (Material for shoes, Category for sandals)
  - Fixes when a user mistakenly selects the wrong shoe type/wash type

---

## [v0.0.11] - 2026-08-27

### Added
- **Back to Home Button in Order Flow**: Users can now navigate back to the homepage from any step of the order flow
  - "Kembali ke Beranda" button with back arrow in a header bar at the top of the order page
  - WashPass logo also links back to the homepage
  - Visible across all order steps (category, material, wash type, photos, cart, customer, review)
  - Mobile-responsive (icon-only on small screens)

---

## [v0.0.10] - 2026-08-27

### Fixed
- **Port Conflict Error (EADDRINUSE)**: Added automatic port retry logic
  - Server automatically tries next port (3001, 3002, etc.) if default port 3000 is in use
  - No more crashes when port is occupied by previous dev server
  - Helpful warning message shows which port is being tried
- **Development Server**: Improved shutdown handling with graceful termination
- **New npm script**: `pnpm clean:ports` to quickly clear all used ports

### Added
- `pnpm clean:ports` script - Quick command to kill processes on ports 3000 and 5173

---

## [v0.0.9] - 2026-08-27

### Fixed
- **HTTPS Geolocation Error Handling (#3)**: Enhanced geolocation error handling for HTTP/HTTPS compatibility
  - Added HTTPS check in `getCurrentPosition()` before calling browser API
  - Added `LOCATION_ERRORS.HTTPS_REQUIRED` error code
  - Improved error message to guide users (localhost vs HTTPS)
  - Enhanced `LocationPicker` to show user-friendly HTTPS errors
  - Added localhost/127.0.0.1 exception for development

### Added
- Location error codes for better debugging
- User-friendly error messages for insecure context detection

---

## [v0.0.8] - 2026-08-27

### Fixed
- **Photo Upload UI Issue (#2)**: Fixed bug where wash type selection appeared in photo upload step
  - Modified `initPhotoUploader()` to accept container parameter
  - Changed from `document.getElementById()` to `container.querySelector()` for proper DOM scoping
  - Added DOM element validation and error logging
- **Step Navigation**: Enhanced error handling and logging for step transitions

---

## [v0.0.7] - 2026-08-27

### Fixed
- **Step Navigation Issue (#1)**: Fixed bug where page gets stuck after filling customer form
  - Cart items now properly serialized to JSON (excludes File objects)
  - Added photoCount field instead of full photos array
  - Added comprehensive console logging for debugging
  - Added validation for step navigation success
- **Step Manager**: Enhanced with error handling and logging

### Added
- Debug console logging for order flow navigation
- SessionStorage validation checks

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
