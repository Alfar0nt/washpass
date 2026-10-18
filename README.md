# WashPass

Website jasa cuci sepatu & sandal profesional dengan sistem pickup & delivery.

## Status

**MVP Ready** — audit remediasi P0–P5 selesai (tracking pesanan, admin ops, status batal, SEO, keamanan, tooling). Tersisa **P6 (Brand Assets)** & **P7 (Payment/Auth — ditunda pasca-launch)**.

See [`docs/CHANGELOG.md`](./docs/CHANGELOG.md) for version history and changelog.

See [`.ai/IMPLEMENTATION-PLAN.md`](./.ai/IMPLEMENTATION-PLAN.md) for detailed feature documentation, known issues, and action items.

Dokumentasi arsitektur dan spesifikasi teknis:
- [`.ai/APP-FLOW.md`](./.ai/APP-FLOW.md) — Alur pengguna, wireframe & sitemap
- [`.ai/TRD.md`](./.ai/TRD.md) — Technical requirements & API specification
- [`.ai/DESIGN.md`](./.ai/DESIGN.md) — Design system & UI tokens
- [`.ai/PRD.md`](./.ai/PRD.md) — Product requirement document
- [`AGENTS.md`](./AGENTS.md) — Panduan agen AI & standar testing Brave browser

## Screenshots

Click an image to view it in fullscreen.

<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="pics/landing_page.png"><img src="pics/landing_page.png" width="220" alt="Landing Page"></a><br>
        <strong>Landing Page</strong>
      </td>
      <td align="center">
        <a href="pics/order.png"><img src="pics/order.png" width="220" alt="Order Flow"></a><br>
        <strong>Order Flow</strong>
      </td>
      <td align="center">
        <a href="pics/admin.png"><img src="pics/admin.png" width="220" alt="Admin Panel"></a><br>
        <strong>Admin Panel</strong>
      </td>
    </tr>
  </table>
</div>

## Pages

| URL | Description |
|-----|-------------|
| `/` | Landing page |
| `/order` | Order flow |
| `/track` | Lacak status pesanan (input nomor pesanan) |
| `/admin` | Admin panel |
| `/privacy` | Privacy policy |
| `/terms` | Terms & conditions |
| `/404` | Halaman tidak ditemukan (fallback) |

## Development

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

# Quality checks
pnpm run lint          # ESLint
pnpm run format        # Prettier (write)
pnpm run format:check  # Prettier (check)
pnpm test              # Vitest
```

## Tech Stack

- **Frontend**: Vite + Vanilla JS (ES Modules)
- **Backend**: Express.js + SQLite (`sqlite3` + `sqlite`), helmet + rate limiting
- **Upload**: Multer 2.x (magic-byte validation) + Canvas API compression (client)
- **Maps**: Leaflet.js + OpenStreetMap
- **Location**: Browser Geolocation API + Nominatim reverse geocoding
- **CSS**: Vanilla CSS + Custom Properties (Design Tokens)
- **Fonts**: Plus Jakarta Sans + Inter (Google Fonts)
- **Tooling**: ESLint + Prettier + Vitest

## Next Steps

1. **P6 — Brand Assets**: logo SVG, ilustrasi hero, ikon material & step (skill `design`)
2. **P7 — Ditunda pasca-MVP**: Payment Gateway Midtrans Snap, auth admin, notifikasi, dll.
3. **Production deployment** — Build & deploy to Railway/Render/VPS (ganti domain placeholder di `sitemap.xml` & `robots.txt`)

Lihat [`.ai/IMPLEMENTATION-PLAN.md`](./.ai/IMPLEMENTATION-PLAN.md) untuk status terkini.
