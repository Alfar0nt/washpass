# WashPass

Website jasa cuci sepatu & sandal profesional dengan sistem pickup & delivery.

## Status

**Phase 1-6 & 8.2 Complete** | **Phase 7, 8.1, 9 Pending**

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
| `/admin` | Admin panel |
| `/privacy` | Privacy policy |
| `/terms` | Terms & conditions |

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
```

## Tech Stack

- **Frontend**: Vite + Vanilla JS (ES Modules)
- **Backend**: Express.js + SQLite
- **Maps**: Leaflet.js + OpenStreetMap
- **Location**: Browser Geolocation API + Nominatim reverse geocoding
- **CSS**: Vanilla CSS + Custom Properties (Design Tokens)
- **Fonts**: Plus Jakarta Sans + Inter (Google Fonts)

## Next Steps

1. **Phase 7**: Polish (accessibility, Lighthouse audit, cross-browser & responsive)
2. **Phase 8.1**: Assets (logo, illustrations, material & step iconography)
3. **Phase 9**: Payment Gateway — Midtrans Snap (QRIS, e-wallet, bank transfer) — *ditunda sampai MVP launch*
4. **Production deployment** — Build & deploy to Railway/Render/VPS

Lihat [`.ai/IMPLEMENTATION-PLAN.md`](./.ai/IMPLEMENTATION-PLAN.md) untuk prioritas terkini (P0–P7).
