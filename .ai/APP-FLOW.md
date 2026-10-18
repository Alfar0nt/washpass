# WashPass — Application Flow (APP-FLOW)

Dokumentasi arsitektur alur pengguna, peta situs, state navigasi, dan interaksi halaman WashPass.

## 1. Sitemap & Route Hierarchy

```mermaid
graph TD
    A["Landing Page (/)"] --> B["Order Flow (/order)"]
    A --> C["Admin Panel (/admin)"]
    A --> D["Privacy Policy (/privacy)"]
    A --> E["Terms & Conditions (/terms)"]

    A --> A1["#hero — Hero Section"]
    A --> A2["#cara-kerja — How It Works"]
    A --> A3["#keunggulan — Why Us"]
    A --> A4["#harga — Price Table"]
    A --> A5["#faq — FAQ"]
    A --> A6["Footer"]

    B --> S1["Step 1: Kategori (Sepatu / Sandal)"]
    S1 --> S2["Step 2: Bahan (Kanvas, Kulit, dsb - khusus Sepatu)"]
    S2 --> S3["Step 3: Layanan Cuci (Fast Clean / Deep Clean)"]
    S1 -- Sandal --> S3
    S3 --> S4["Step 4: Upload Foto Item (Opsional)"]
    S4 --> S5["Step 5: Keranjang (Min. 2 Pasang)"]
    S5 -- Tambah Lagi --> S1
    S5 -- Checkout --> S6["Step 6: Data Pelanggan & Lokasi GPS"]
    S6 --> S7["Step 7: Konfirmasi & Kirim Pesanan"]
    S7 --> S8["POST /api/orders -> Redirect WhatsApp"]
```

## 2. Order Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> Draft: User memilih item di /order
    Draft --> CartReady: Minimal 2 pasang terpenuhi
    CartReady --> CustomerDataSet: Isi data nama, WA, alamat, GPS
    CustomerDataSet --> OrderSubmitted: Submit Form (POST /api/orders)
    OrderSubmitted --> RedirectWhatsApp: API response 200 OK
    RedirectWhatsApp --> pending: Status awal tersimpan di DB
    pending --> picked_up: Kurir jemput sepatu
    picked_up --> in_progress: Sepatu sedang dicuci
    in_progress --> done: Sepatu selesai dan diantar
    done --> [*]
```

## 3. Wireframes & Layout Overview

### 3.1 Landing Page (`/` / `index.html`)
- **Navbar**: Sticky, transparent to solid on scroll, dynamic offset (`ResizeObserver`), menu hamburger mobile, logo, navigasi section, CTA "Pesan Sekarang".
- **Hero**: Catchy headline, CTA button link `/order`, badge trust `500+ Sepatu Dicuci` & `4.9 Rating`.
- **Cara Kerja (3 Langkah)**: Pesan Online → Kurir Jemput → Bersih & Antar Kembali.
- **Keunggulan**: Free Pickup & Delivery, Pembersih Profesional, Transparan, Garansi Kepuasan.
- **Tabel Harga**: Toggle tab Sepatu vs Sandal, matrix bahan vs jenis cuci, link langsung isi keranjang.
- **FAQ**: Accordion interaktif (1 open at a time).
- **Footer**: Brand info, jam operasional, link kebijakan (`/privacy`, `/terms`), kontak WhatsApp & media sosial.

### 3.2 Order Flow (`/order` / `order.html`)
Container dinamis single container dengan step progress indicator bar di bagian atas:
1. **Pilih Kategori**: 👟 Sepatu atau 🩴 Sandal.
2. **Pilih Bahan** (Bypass jika Sandal): Kanvas, Mesh/Knit, Kulit, Suede/Nubuck, Rubber/EVA.
3. **Pilih Tipe Cuci**: Fast Clean (kering, 1–2 hari) vs Deep Clean (basah, 3–5 hari).
4. **Upload Foto**: Multi-file dropzone dengan kompresi client-side (Canvas API) sebelum payload dikirim.
5. **Review Keranjang**: Validasi total item $\ge 2$. Kemampuan tambah pasang lain atau edit/hapus item.
6. **Form Data Diri**:
   - Nama lengkap
   - Nomor WhatsApp aktif
   - Alamat lengkap + catatan patokan
   - Tombol "Gunakan Lokasi Saat Ini" (Browser Geolocation API + reverse geocoding Nominatim OSM)
7. **Review & Konfirmasi**:
   - Rincian pesanan, biaya total, estimasi waktu
   - Tombol "Kirim Pesanan" (menjalankan AJAX POST multipart form ke server, lalu membuka template teks WhatsApp ke admin).

### 3.3 Admin Panel (`/admin` / `admin.html`)
- **Dashboard Summary**: Total order, status breakdown (`pending`, `picked_up`, `in_progress`, `done`).
- **Tabel Pesanan**: Kolom ID, tanggal, nama, WA (direct link WhatsApp), item count, total harga, status badge, action button.
- **Detail Modal**:
   - Data pelanggan lengkap
   - Titik koordinat via Leaflet.js interactive map view
   - Daftar item cuci beserta foto kondisi sepatu (thumbnail click to full preview)
   - Form transisi status pesanan (`PATCH /api/orders/:id/status`)

## 4. Interaction Rules & Edge Cases

| Skenario | Penanganan |
|---|---|
| User refresh halaman saat order | State keranjang tersimpan di `localStorage`, form state ter-hydrate |
| Total order kurang dari 2 pasang | Tombol submit disable + tampil warning alert |
| Ukuran foto > 5MB | Ditangkap client-side dan dikompres otomatis via Canvas API |
| Server API offline saat order | Fallback manual: generate teks order WhatsApp langsung ke `wa.me` |
| Geolocation ditolak pengguna | Form alamat tetap bisa diisi manual tanpa kendala |
| Status transisi tidak valid | Server menolak (`400 Bad Request`) memastikan siklus status urut |
