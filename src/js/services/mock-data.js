import { PRICING } from '../config/pricing.js';

const MATERIAL_COLORS = {
  canvas: '#0EA5E9',
  'mesh-knit': '#8B5CF6',
  leather: '#B45309',
  'suede-nubuck': '#0D9488',
  'rubber-eva': '#F59E0B',
};

function placeholderPhoto(category, material, washType) {
  const color = MATERIAL_COLORS[material] || '#64748B';
  const icon = category === 'sandal' ? '🩴' : '👟';
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360">` +
    `<rect width="480" height="360" fill="#E2E8F0"/>` +
    `<rect x="16" y="16" width="448" height="328" rx="16" fill="#F8FAFC" stroke="${color}" stroke-width="4"/>` +
    `<text x="240" y="180" font-size="96" text-anchor="middle">${icon}</text>` +
    `<text x="240" y="260" font-size="28" text-anchor="middle" fill="${color}" font-family="sans-serif" font-weight="bold">Foto Demo</text>` +
    `<text x="240" y="300" font-size="20" text-anchor="middle" fill="#64748B" font-family="sans-serif">${washType === 'fast-clean' ? 'Fast Clean' : 'Deep Clean'}</text>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function datetime(daysAgo, hour, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function buildItem(spec, orderIndex, itemIndex) {
  const { category, material, wash_type, notes } = spec;
  const price = category === 'sandal' ? PRICING.sandal[wash_type] : PRICING.shoe[material][wash_type];
  const filename = `demo-${orderIndex}-${itemIndex}.svg`;
  return {
    category,
    material: category === 'sandal' ? null : material,
    wash_type,
    price,
    notes: notes || null,
    photos: [
      {
        filename,
        original_name: `${category}-${material || 'sandal'}.jpg`,
        size_bytes: 0,
        dataUrl: placeholderPhoto(category, material, wash_type),
      },
    ],
  };
}

const SEED_SPECS = [
  {
    daysAgo: 0,
    hour: 9,
    minute: 15,
    customer_name: 'Rina Amelia',
    whatsapp: '081234567801',
    address: 'Jl. Melati No. 12, RT 03/RW 05, Cibubur, Jakarta Timur',
    address_note: 'Rumah cat putih, pagar hijau, dekat warung kopi',
    latitude: -6.3271,
    longitude: 106.9877,
    status: 'pending',
    items: [
      { category: 'shoe', material: 'mesh-knit', wash_type: 'deep-clean', notes: 'Sol putih memudar' },
      { category: 'sandal', wash_type: 'fast-clean' },
    ],
  },
  {
    daysAgo: 0,
    hour: 11,
    minute: 40,
    customer_name: 'Budi Santoso',
    whatsapp: '081298765402',
    address: 'Perum Griya Asri Blok C-7, Depok, Jawa Barat',
    address_note: 'Patokan: masjid Al-Ikhlas',
    latitude: -6.4025,
    longitude: 106.7942,
    status: 'pending',
    items: [
      { category: 'shoe', material: 'canvas', wash_type: 'fast-clean' },
      { category: 'shoe', material: 'canvas', wash_type: 'fast-clean', notes: 'Pasangan, warna sama' },
    ],
  },
  {
    daysAgo: 0,
    hour: 14,
    minute: 5,
    customer_name: 'Citra Lestari',
    whatsapp: '081377788803',
    address: 'Jl. Kemang Raya No. 8, Jakarta Selatan',
    address_note: 'Apartemen lantai 5, unit B12',
    latitude: -6.2615,
    longitude: 106.8106,
    status: 'pending',
    items: [
      { category: 'shoe', material: 'suede-nubuck', wash_type: 'deep-clean', notes: 'Hati-hati, suede asli' },
      { category: 'sandal', wash_type: 'deep-clean' },
    ],
  },
  {
    daysAgo: 1,
    hour: 10,
    customer_name: 'Dewi Anggraini',
    whatsapp: '081455566604',
    address: 'Jl. Sudirman Kav. 52, Jakarta Selatan',
    address_note: 'Kantor, resepsionis lantai G',
    latitude: -6.2447,
    longitude: 106.8001,
    status: 'picked_up',
    items: [
      { category: 'shoe', material: 'leather', wash_type: 'deep-clean', notes: 'Pantofel kerja' },
      { category: 'shoe', material: 'leather', wash_type: 'fast-clean' },
      { category: 'sandal', wash_type: 'fast-clean' },
    ],
  },
  {
    daysAgo: 1,
    hour: 16,
    minute: 30,
    customer_name: 'Eko Prasetyo',
    whatsapp: '081511122205',
    address: 'Jl. Boulevard Raya Blok QA 3, Kelapa Gading, Jakarta Utara',
    address_note: 'Rumah 2 lantai, cat abu-abu',
    latitude: -6.1584,
    longitude: 106.9057,
    status: 'picked_up',
    items: [
      { category: 'shoe', material: 'rubber-eva', wash_type: 'deep-clean', notes: 'Crocs, kotor lumpur' },
    ],
  },
  {
    daysAgo: 2,
    hour: 9,
    customer_name: 'Fajar Nugroho',
    whatsapp: '081633344406',
    address: 'Jl. Kemang Selatan VIII No. 3, Jakarta Selatan',
    address_note: '',
    latitude: -6.2679,
    longitude: 106.8136,
    status: 'in_progress',
    items: [
      { category: 'shoe', material: 'canvas', wash_type: 'deep-clean', notes: 'Vans Old Skool' },
      { category: 'shoe', material: 'mesh-knit', wash_type: 'fast-clean' },
    ],
  },
  {
    daysAgo: 2,
    hour: 13,
    minute: 20,
    customer_name: 'Gita Permata',
    whatsapp: '081788899907',
    address: 'Jl. Tebet Raya No. 45, Jakarta Selatan',
    address_note: 'Masuk gang, rumah pojok',
    latitude: -6.2349,
    longitude: 106.8456,
    status: 'in_progress',
    items: [
      { category: 'shoe', material: 'suede-nubuck', wash_type: 'fast-clean' },
      { category: 'sandal', wash_type: 'fast-clean' },
      { category: 'sandal', wash_type: 'deep-clean' },
    ],
  },
  {
    daysAgo: 3,
    hour: 8,
    minute: 45,
    customer_name: 'Hendra Wijaya',
    whatsapp: '081822233308',
    address: 'Jl. Alam Sutera Boulevard No. 21, Tangerang',
    address_note: 'Cluster Melbourne, no 21',
    latitude: -6.2891,
    longitude: 106.6461,
    status: 'done',
    items: [
      { category: 'shoe', material: 'leather', wash_type: 'deep-clean', notes: 'Boots kulit, waterproofing' },
      { category: 'shoe', material: 'canvas', wash_type: 'fast-clean' },
    ],
  },
  {
    daysAgo: 4,
    hour: 15,
    customer_name: 'Indah Sari',
    whatsapp: '081944455509',
    address: 'Jl. Margonda Raya No. 100, Depok',
    address_note: 'Kost putri, lantai 2',
    latitude: -6.3837,
    longitude: 106.8236,
    status: 'done',
    items: [
      { category: 'sandal', wash_type: 'deep-clean' },
      { category: 'sandal', wash_type: 'fast-clean' },
    ],
  },
  {
    daysAgo: 5,
    hour: 12,
    customer_name: 'Joko Widarto',
    whatsapp: '082166677710',
    address: 'Jl. Raya Bekasi KM 20, Jakarta Timur',
    address_note: 'Toko elektronik, hubungi lewat belakang',
    latitude: -6.2896,
    longitude: 106.9077,
    status: 'cancelled',
    items: [
      { category: 'shoe', material: 'mesh-knit', wash_type: 'deep-clean', notes: 'Dibatal customer, urgent' },
    ],
  },
];

export function buildSeedOrders() {
  return SEED_SPECS.map((spec, orderIndex) => {
    const items = spec.items.map((item, itemIndex) => buildItem(item, orderIndex, itemIndex));
    const createdAt = datetime(spec.daysAgo, spec.hour, spec.minute);
    const updatedAt =
      spec.status === 'done'
        ? datetime(Math.max(0, spec.daysAgo - 1), 17)
        : createdAt;

    return {
      id: 1001 + orderIndex,
      customer_name: spec.customer_name,
      whatsapp: spec.whatsapp,
      address: spec.address,
      address_note: spec.address_note,
      latitude: spec.latitude,
      longitude: spec.longitude,
      status: spec.status,
      total_items: items.length,
      total_price: items.reduce((sum, item) => sum + item.price, 0),
      created_at: createdAt,
      updated_at: updatedAt,
      items,
    };
  });
}
