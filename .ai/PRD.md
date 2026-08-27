# WashPass — Product Requirements Document (PRD)

> **Versi:** 1.1  
> **Tanggal:** 27 Agustus 2026  
> **Status:** Draft — Revisi (tambah backend + admin order list)

---

## 1. Ringkasan Produk

**WashPass** adalah website jasa pencucian sepatu dan sandal dengan sistem **pick-up → cuci → antar kembali**. Website ini berfungsi sebagai platform pemesanan layanan di mana pelanggan dapat memilih jenis alas kaki, tipe pencucian, mengunggah foto, dan mengisi data pengambilan — semuanya dalam satu alur yang intuitif. Order dikirim via WhatsApp sekaligus **disimpan di server** (SQLite) agar pemilik bisa melihat daftar pesanan kapan saja melalui halaman admin.

### Target Pengguna
- Mahasiswa kos-kosan yang tidak punya waktu/alat cuci sepatu
- Pekerja kantoran yang butuh perawatan sepatu formal
- Pecinta sneakers yang butuh perawatan profesional
- Siapa saja yang ingin mencuci sandal/sepatu tanpa ribet

### Value Proposition
- **Pickup & Delivery** — Tidak perlu keluar rumah
- **Harga transparan** — Harga jelas per kategori bahan & tipe cuci
- **Minimal order 2 pasang** — Efisien untuk pickup
- **Upload foto** — Tim bisa menilai kondisi sepatu sebelum dikerjakan
- **Share Lokasi** — Pelanggan bisa share lokasi GPS langsung, admin lihat di peta
- **Tracking Status** — Status order real-time: belum diambil → diambil/dikerjakan → selesai

---

## 2. Alur Pengguna (User Flow)

```
┌─────────────┐
│  Landing     │
│  Page        │
└──────┬───────┘
       │
       ▼
┌─────────────────┐
│ Pilih Kategori   │
│ Sepatu / Sandal  │
└──────┬──────────┘
       │
       ├── Sepatu ──────────────────────┐
       │                                │
       │                    ┌───────────▼──────────┐
       │                    │ Step 1: Pilih Bahan   │
       │                    │ (Kanvas, Kulit, dll)  │
       │                    └───────────┬──────────┘
       │                                │
       │                    ┌───────────▼──────────┐
       │                    │ Step 2: Pilih Tipe    │
       │                    │ Cuci (Kering/Basah/   │
       │                    │ Deep Clean)           │
       │                    └───────────┬──────────┘
       │                                │
       ├── Sandal ──────────────────────┤
       │   (langsung pilih tipe cuci)   │
       │                                │
       │                    ┌───────────▼──────────┐
       │                    │ Step 3: Upload Foto   │
       │                    │ + Catatan Khusus      │
       │                    └───────────┬──────────┘
       │                                │
       │                    ┌───────────▼──────────┐
       │                    │ Step 4: Tambah Item   │
       │                    │ (min. 2 pasang)       │
       │                    │ → Keranjang/Summary   │
       │                    └───────────┬──────────┘
       │                                │
       │                    ┌───────────▼──────────┐
       │                    │ Step 5: Data Customer │
       │                    │ - Nama                │
       │                    │ - No. WA              │
       │                    │ - Alamat Pickup       │
       │                    └───────────┬──────────┘
       │                                │
       │                    ┌───────────▼──────────┐
       │                    │ Step 6: Review &      │
       │                    │ Konfirmasi Order      │
       │                    └───────────┬──────────┘
       │                                │
       │                    ┌───────────▼──────────┐
       │                    │ Step 7: Order         │
       │                    │ Submitted →           │
       │                    │ Redirect ke WA        │
       │                    └──────────────────────┘
```

### Detail Setiap Step

#### Landing Page
- Hero section dengan tagline menarik
- Penjelasan singkat layanan (Pick Up → Cuci → Antar)
- Tombol CTA utama: **"Pesan Sekarang"**
- Section: Kenapa WashPass? (keunggulan)
- Section: Daftar Harga ringkas
- Section: Cara Kerja (3 langkah ilustrasi)
- Section: Testimoni / Before-After (placeholder untuk MVP)
- Section: FAQ
- Footer dengan kontak & sosial media

#### Step 1 — Pilih Kategori (Sepatu / Sandal)
- Dua card besar yang visual: ikon sepatu & ikon sandal
- Setelah pilih, lanjut ke step berikutnya

#### Step 2 — Pilih Bahan Sepatu (khusus Sepatu)
- Card selection dengan gambar ilustrasi tiap bahan
- Sandal langsung skip step ini

#### Step 3 — Pilih Tipe Pencucian
- Tampilkan opsi cuci sesuai bahan yang dipilih
- Setiap opsi menampilkan: nama, deskripsi singkat, harga, estimasi waktu
- Harga berubah dinamis sesuai bahan + tipe cuci

#### Step 4 — Upload Foto & Catatan
- Upload 1–3 foto per item
- Text area untuk catatan khusus (opsional)
- Preview foto yang sudah di-upload

#### Step 5 — Keranjang / Order Summary
- Daftar semua item yang ditambahkan
- Validasi: minimal 2 pasang → jika kurang, tampilkan pesan + tombol "Tambah Item"
- Tombol "Tambah Item Lain" untuk kembali ke step 1
- Total harga terkalkulasi otomatis
- Tombol "Lanjut ke Data Diri"

#### Step 6 — Data Customer
- Form fields:
  - Nama Lengkap (required)
  - Nomor WhatsApp (required, validasi format 08xx)
  - Alamat Pickup (required, textarea)
  - **Share Lokasi GPS (opsional)** — Tombol "Gunakan Lokasi Saya" untuk mengambil koordinat GPS via browser Geolocation API
  - Catatan Alamat (opsional — contoh: "Kos warna biru, lantai 2")
- Tombol "Review Pesanan"

#### Step 7 — Review & Konfirmasi
- Summary lengkap: semua item + data customer
- Total harga final
- Tombol "Kirim Pesanan via WhatsApp"
- Setelah klik:
  1. **Kirim data order ke server** (POST `/api/orders`) — simpan ke SQLite + upload foto
  2. **Generate pesan WhatsApp** otomatis
  3. **Redirect ke `wa.me`**

---

## 3. Katalog Layanan & Harga

### 3.1 Kategori Bahan Sepatu

| ID | Nama Kategori | Contoh Sepatu | Ikon |
|----|---------------|---------------|------|
| `canvas` | Kanvas / Textile | Converse, Vans, sepatu sekolah kain | 🧵 |
| `mesh-knit` | Mesh / Knit | Nike Flyknit, Adidas Ultraboost, running shoes | 🕸️ |
| `leather` | Kulit Asli / Sintetis | Pantofel, loafers, boots kulit | 👞 |
| `suede-nubuck` | Suede / Nubuck | Puma Suede, sepatu suede casual | 🦌 |
| `rubber-eva` | Karet / EVA / Foam | Crocs-style, sepatu karet, sandal EVA | 🩴 |

### 3.2 Tipe Pencucian

| ID | Nama | Deskripsi | Estimasi |
|----|------|-----------|----------|
| `fast-clean` | Cuci Kering (Fast Clean) | Pembersihan permukaan tanpa merendam. Cocok untuk sepatu premium & sensitif air. | 1–2 hari |
| `deep-clean` | Cuci Basah (Deep Clean) | Pencucian menyeluruh: upper, midsole, outsole, insole, tali. Menggunakan air & deterjen khusus. | 3–5 hari |

### 3.3 Matriks Harga (per pasang)

| Bahan \ Tipe Cuci | Cuci Kering (Fast) | Cuci Basah (Deep) |
|--------------------|--------------------|--------------------|
| Kanvas / Textile | Rp 35.000 | Rp 50.000 |
| Mesh / Knit | Rp 40.000 | Rp 60.000 |
| Kulit Asli / Sintetis | Rp 50.000 | Rp 75.000 |
| Suede / Nubuck | Rp 55.000 | Rp 85.000 |
| **Sandal** (semua jenis) | Rp 20.000 | Rp 30.000 |

> **Catatan:** Harga di atas adalah placeholder dan bisa diubah dengan mudah via konfigurasi.

### 3.4 Aturan Bisnis
- **Minimal order:** 2 pasang (bisa kombinasi sepatu + sandal)
- **Layanan:** Pick-up → Cuci → Delivery (antar kembali)
- **Area layanan:** Diatur nanti (untuk MVP, belum ada batasan area)
- **Pembayaran:** Via transfer setelah konfirmasi order (di luar scope website untuk MVP)

---

## 4. Halaman & Komponen

### 4.1 Daftar Halaman

| # | Halaman | Route | Deskripsi |
|---|---------|-------|-----------|
| 1 | Landing Page | `/` | Homepage dengan informasi layanan |
| 2 | Order Flow | `/order` | Multi-step form pemesanan |

### 4.2 Komponen Utama

| Komponen | Deskripsi |
|----------|-----------|
| `Navbar` | Logo + navigasi (Beranda, Harga, Cara Kerja, Pesan) — sticky, transparan di hero |
| `HeroSection` | Background gradient/gambar, tagline, CTA button |
| `HowItWorks` | 3 langkah dengan ikon: Pesan → Kami Jemput → Kami Antar Bersih |
| `PriceTable` | Tabel harga ringkas per kategori |
| `WhyUs` | 3–4 keunggulan dalam card grid |
| `FAQ` | Accordion FAQ |
| `Footer` | Kontak, sosmed, copyright |
| `StepIndicator` | Progress bar multi-step di halaman order |
| `CategoryCard` | Card pilihan sepatu/sandal |
| `MaterialCard` | Card pilihan bahan sepatu |
| `WashTypeCard` | Card pilihan tipe cuci + harga |
| `PhotoUploader` | Drag & drop / click upload foto (1–3 foto) |
| `CartSummary` | Ringkasan item + total harga |
| `CustomerForm` | Form data diri customer |
| `OrderReview` | Review final sebelum submit |
| `WhatsAppRedirect` | Generate pesan WA + redirect |

---

## 5. Kebutuhan Non-Fungsional

### Responsivitas
- **Mobile-first design** (prioritas utama)
- Breakpoints:
  - Mobile: `< 768px`
  - Tablet: `768px – 1024px`  
  - Desktop: `> 1024px`
- Semua komponen harus nyaman di-tap dengan jari (min touch target 44px)

### Performa
- Lighthouse score target: > 90 (Performance, Accessibility, Best Practices)
- Lazy loading untuk gambar
- Kompresi foto upload di client-side sebelum preview

### Aksesibilitas
- Semua form field punya label
- Kontras warna memenuhi WCAG AA
- Navigasi keyboard-friendly
- Fokus state yang jelas

### SEO
- Meta tags yang proper di setiap halaman
- Semantic HTML (header, main, section, footer)
- Open Graph tags untuk sharing

---

## 6. Desain & Branding

### Nama Brand: **WashPass**
### Tagline: *"Sepatu Bersih, Tinggal Duduk Manis"*

### Palet Warna (Rencana)
| Peran | Warna | Hex |
|-------|-------|-----|
| Primary | Deep Teal / Biru Kehijauan | `#0D9488` |
| Primary Dark | Teal Gelap | `#0F766E` |
| Secondary / Accent | Amber / Kuning Hangat | `#F59E0B` |
| Background | Off-White Hangat | `#FAFAF9` |
| Surface / Card | Putih | `#FFFFFF` |
| Text Primary | Hampir Hitam | `#1C1917` |
| Text Secondary | Abu-abu | `#78716C` |
| Success | Hijau | `#22C55E` |
| Error | Merah | `#EF4444` |
| Gradient Hero | Teal ke Deep Blue | `#0D9488 → #1E3A5F` |

### Tipografi
- **Heading:** Plus Jakarta Sans (Google Fonts) — modern, clean, Indonesia-friendly
- **Body:** Inter (Google Fonts) — highly legible, premium feel

### Gaya Visual
- Modern, bersih, premium tapi approachable
- Glassmorphism untuk card overlay di hero
- Micro-animations pada hover dan transisi step
- Gradient halus pada hero dan CTA buttons
- Rounded corners (border-radius: 12–16px)
- Subtle shadows untuk depth
- Ikon-ikon custom atau dari Lucide/Heroicons

---

## 7. Fitur WhatsApp Integration

Setelah user mengkonfirmasi order, website akan:
1. **Kirim data order ke backend** (termasuk foto)
2. Generate pesan WhatsApp yang terformat rapi
3. Redirect ke `https://wa.me/62XXXXXXXXXX?text=...`

### Format Pesan WA (Template)

```
🧼 *PESANAN BARU — WashPass*

👤 *Nama:* {nama}
📱 *WhatsApp:* {no_wa}
📍 *Alamat Pickup:* {alamat}
📝 *Catatan:* {catatan_alamat}

━━━━━━━━━━━━━━━━━━

📦 *Detail Pesanan:*

{untuk setiap item}
  {nomor}. {kategori} — {bahan}
     🧹 Tipe: {tipe_cuci}
     💰 Harga: Rp {harga}
     📸 Foto: {jumlah} foto terlampir
     📝 Catatan: {catatan_item}

━━━━━━━━━━━━━━━━━━

💰 *Total: Rp {total_harga}*
📦 *Jumlah Item: {total_item} pasang*

Terima kasih telah memesan di WashPass! 🙏
```

> **Catatan:** Foto tidak bisa dikirim via URL `wa.me`. Namun foto sudah tersimpan di server dan bisa dilihat admin via halaman order list.

---

## 8. Backend & Server-Side Storage

### 8.1 Arsitektur
- **Runtime:** Node.js + Express.js
- **Database:** SQLite (via `better-sqlite3`) — file-based, zero-config, sangat ringan
- **File Storage:** Foto disimpan sebagai file di folder `uploads/` di server
- **Arsitektur:** Monorepo — frontend (Vite) dan backend (Express) dalam satu project

### 8.2 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/orders` | Submit order baru (multipart form data — termasuk foto + lokasi GPS) |
| `GET` | `/api/orders` | List semua order (untuk admin page) |
| `GET` | `/api/orders/:id` | Detail satu order (include latitude, longitude) |
| `PATCH` | `/api/orders/:id/status` | Update status order (pending | picked_up | in_progress | done) |
| `GET` | `/uploads/:filename` | Serve foto yang di-upload |

### 8.3 Database Schema

```sql
CREATE TABLE orders (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  whatsapp     TEXT NOT NULL,
  address      TEXT NOT NULL,
  address_note TEXT,
  latitude     REAL,                 -- GPS latitude dari share lokasi
  longitude    REAL,                 -- GPS longitude dari share lokasi
  total_price  INTEGER NOT NULL,
  total_items  INTEGER NOT NULL,
  status       TEXT DEFAULT 'pending',  -- pending | picked_up | in_progress | done
  created_at   TEXT DEFAULT (datetime('now', 'localtime')),
  updated_at   TEXT DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE order_items (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id     INTEGER NOT NULL REFERENCES orders(id),
  category     TEXT NOT NULL,   -- 'shoe' | 'sandal'
  material     TEXT,            -- 'canvas' | 'mesh-knit' | 'leather' | 'suede-nubuck' | null (sandal)
  wash_type    TEXT NOT NULL,   -- 'fast-clean' | 'deep-clean'
  price        INTEGER NOT NULL,
  notes        TEXT,
  created_at   TEXT DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE order_photos (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  order_item_id INTEGER NOT NULL REFERENCES order_items(id),
  filename     TEXT NOT NULL,    -- nama file di folder uploads/
  original_name TEXT NOT NULL,   -- nama file asli dari user
  size_bytes   INTEGER,
  created_at   TEXT DEFAULT (datetime('now', 'localtime'))
);
```

### 8.4 Order Submission Flow

```
┌──────────┐     POST /api/orders      ┌──────────────┐
│  Client  │ ────────────────────────► │   Express    │
│ (Browser)│   multipart/form-data     │   Server     │
│          │   - customer data         │              │
│          │   - items JSON            │  ┌─────────┐ │
│          │   - photo files           │  │ SQLite  │ │
│          │   - latitude, longitude   │  │   DB    │ │
│          │                           │  └─────────┘ │
│          │ ◄──── { orderId, status } │              │
│          │                           │  uploads/    │
│          │   redirect to wa.me       │  ├─ photo1   │
└──────────┘                           │  ├─ photo2   │
                                        └──────────────┘
```

### 8.5 Order Status Flow (Enhanced)

```
┌──────────────┐     Pickup Tim     ┌────────────────┐     Selesai Cuci     ┌────────┐
│   PENDING    │ ─────────────────► │  PICKED_UP /   │ ──────────────────► │  DONE  │
│  (belum di-  │    (tim ambil      │  IN_PROGRESS   │    (siap antar/      │ (selesai│
│   ambil)     │     sepatu)        │ (diambil/diker-│     sudah dikembal-  │         │
└──────────────┘                    │    jakan)      │     kan ke customer)  └────────┘
                                     └────────────────┘
```

### 8.6 Admin Order List Page (Enhanced)

- Route: `/admin` (atau `/admin.html`)
- **Tidak ada login untuk MVP** — halaman bisa diakses siapa saja yang tahu URL-nya
- Tampilan: Tabel/list semua order yang masuk
- Informasi yang ditampilkan per order:
  - ID order
  - Nama customer
  - Nomor WhatsApp (clickable → buka WA)
  - Jumlah item
  - Total harga
  - Tanggal & waktu order masuk
  - **Status** (pending=belum diambil / picked_up=diambil / in_progress=dikerjakan / done=selesai)
  - **Lokasi** — Badge/ikon peta jika ada koordinat GPS
- Bisa klik order untuk lihat detail:
  - Semua item dengan foto
  - Data customer lengkap
  - **Peta lokasi pickup** (menggunakan Leaflet + OpenStreetMap) jika customer share lokasi
  - Bisa update status order (dropdown: pending → picked_up → in_progress → done)
- Sortable by tanggal (terbaru dulu)
- Responsive (bisa diakses dari HP pemilik bisnis)

> **Catatan:** Untuk MVP, halaman admin tidak dilindungi password. Keamanan bisa ditambahkan di iterasi berikutnya (basic auth / session).

---

## 9. Batasan MVP (Minimum Viable Product)

Untuk versi pertama ini, berikut yang **TERMASUK** dan **TIDAK TERMASUK**:

### ✅ Termasuk (MVP)
- Landing page lengkap dengan semua section
- Multi-step order flow
- Katalog bahan sepatu & tipe cuci dengan harga
- Upload foto ke server (disimpan di folder `uploads/`)
- Validasi minimal order 2 pasang
- Form data customer (termasuk **share lokasi GPS**)
- Review order
- WhatsApp redirect dengan pesan terformat
- **Backend Express.js + SQLite** untuk menyimpan order
- **Admin order list page** (tanpa login) dengan **peta lokasi & status enhanced**
- Fully responsive (mobile, tablet, desktop)

### ❌ Tidak Termasuk (Future)
- Sistem login / akun user / auth admin
- Payment gateway
- Order tracking real-time (untuk customer)
- Notifikasi otomatis (email/push)
- Penjadwalan pickup
- Sistem review / rating
- Multi-bahasa
- Blog / konten edukasi

---

## 10. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| Foto tidak bisa dikirim via WA link | Admin tidak langsung lihat foto | Foto tersimpan di server, admin bisa lihat via halaman admin |
| User upload foto terlalu besar | Upload lambat / storage penuh | Kompresi client-side + limit ukuran file (5MB) + limit 3 foto/item |
| User tidak memenuhi minimal order | Frustrasi | UX yang jelas menginformasikan syarat minimal dari awal |
| Harga berubah | Ketidaksesuaian | Harga disimpan di 1 file konfigurasi, mudah diubah |
| Admin page tanpa auth | Siapa saja bisa lihat order | Untuk MVP acceptable; tambahkan basic auth di iterasi berikutnya |
| SQLite concurrency | Write lock saat banyak order | `better-sqlite3` synchronous, cukup untuk volume kecil |
| Server down | Order tidak tersimpan | WA redirect tetap jalan (client-side), order bisa di-input manual |
| User tolak izin lokasi / GPS tidak akurat | Admin tidak tahu lokasi pasti | Alamat tertulis tetap wajib, lokasi GPS opsional sebagai tambahan |
| Browser tidak support Geolocation API | Tidak bisa share lokasi | Fallback ke input manual alamat, graceful degradation |

---

## 11. Metrik Sukses (Future)

- Jumlah order per minggu (bisa diukur dari SQLite)
- Bounce rate di landing page
- Completion rate order flow (berapa % yang sampai submit)
- Waktu rata-rata menyelesaikan order flow
- Rasio order yang berhasil tersimpan di DB vs yang hanya via WA
