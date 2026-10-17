# WashPass — Technical Requirements Document (TRD)

Spesifikasi teknis, arsitektur sistem, stack dependensi, skema basis data, dan antarmuka API.

## 1. System Architecture

```mermaid
graph LR
    subgraph Client ["Client Layer"]
        A["Vanilla JS (ES Modules)"]
        B["CSS Custom Properties"]
        C["Leaflet.js + OSM"]
    end

    subgraph Gateway ["Vite Dev Proxy / Express Static"]
        D["Vite (Port 5173 - Dev)"]
        E["Express (Port 3000 - API & Prod Static)"]
    end

    subgraph Backend ["Server Layer"]
        F["Express REST Router"]
        G["Multer Upload Middleware"]
        H["SQLite Database (sqlite3 + sqlite)"]
        I["Local Storage (/uploads)"]
    end

    A --> D
    D -- "/api & /uploads" --> E
    E --> F
    F --> G
    F --> H
    G --> I
```

## 2. Tech Stack Specification

| Komponen | Pilihan | Rasional & Deskripsi |
|---|---|---|
| **Frontend Framework** | Vanilla JS (ES2022+) | Multi-page aplikasi tanpa overhead runtime library besar. |
| **Bundler** | Vite 5 | Fast HMR dev server, optimal production rollup bundling. |
| **Styling** | Native CSS Variables + BEM Hybrid | Ringan, 0 dependency build, performa rendering instan. |
| **Typography** | Plus Jakarta Sans (Headings), Inter (Body) | Google Fonts web font standar readability tinggi. |
| **Icons** | Lucide Icons | Inline SVG icons. |
| **Maps & Lokasi** | Leaflet.js + Nominatim OSM | Open-source map tile tanpa biaya API key berbayar. |
| **Client Compression**| HTML5 Canvas API | Resize & convert JPEG di browser sebelum transmisi HTTP multipart. |
| **Runtime & Server** | Node.js (20+) + Express.js | Standardized JavaScript end-to-end. |
| **Database** | SQLite (`sqlite3` + `sqlite` wrapper) | File-based asynchronous SQLite engine yang kompatibel dengan modern Node runtime. |
| **Upload Handler** | Multer | Menangani streaming file multipart disk-storage lokal. |

## 3. Database Schema

### `orders`
| Kolom | Tipe | Constraint | Deskripsi |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Format: UUID v4 |
| `customer_name` | TEXT | NOT NULL | Nama pemesan |
| `whatsapp` | TEXT | NOT NULL | Nomor kontak WhatsApp |
| `address` | TEXT | NOT NULL | Alamat penjemputan |
| `notes` | TEXT | NULL | Catatan patokan/lokasi |
| `latitude` | REAL | NULL | Titik lintang GPS browser |
| `longitude` | REAL | NULL | Titik bujur GPS browser |
| `status` | TEXT | NOT NULL DEFAULT 'pending' | Enum: `pending`, `picked_up`, `in_progress`, `done` |
| `total_price` | INTEGER | NOT NULL | Total tagihan rupiah |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Waktu order dibuat |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Terakhir diupdate |

### `order_items`
| Kolom | Tipe | Constraint | Deskripsi |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID v4 |
| `order_id` | TEXT | NOT NULL, FK(`orders.id`) | Relasi pesanan induk |
| `category` | TEXT | NOT NULL | `sepatu` atau `sandal` |
| `material` | TEXT | NULL | Jenis bahan sepatu |
| `wash_type` | TEXT | NOT NULL | `fast-clean` atau `deep-clean` |
| `price` | INTEGER | NOT NULL | Harga per pasang |
| `notes` | TEXT | NULL | Catatan kondisi sepatu |

### `order_photos`
| Kolom | Tipe | Constraint | Deskripsi |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID v4 |
| `order_item_id` | TEXT | NOT NULL, FK(`order_items.id`)| Relasi item sepatu |
| `filename` | TEXT | NOT NULL | Nama file di folder `uploads/` |
| `original_name`| TEXT | NOT NULL | Nama file asli dari user |

## 4. API Endpoints Contract

### 4.1 Orders API
- `POST /api/orders`
  - Content-Type: `multipart/form-data`
  - Fields: `customer_name`, `whatsapp`, `address`, `notes`, `latitude`, `longitude`, `items` (JSON stringified), `photos` (binary files).
  - Response: `{ status: "success", orderId: "<UUID>" }`
- `GET /api/orders`
  - Query: `?status=<status>`
  - Response: Array ringkasan order urut tanggal terbaru.
- `GET /api/orders/:id`
  - Response: Detail pesanan lengkap termasuk array items dan tautan foto.
- `PATCH /api/orders/:id/status`
  - Body: `{ "status": "picked_up" | "in_progress" | "done" }`
  - Response: `{ status: "success", updated: true }`

### 4.2 Static Assets
- `GET /uploads/:filename` -> File gambar foto pesanan.
