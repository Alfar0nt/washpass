// Mock API berbasis localStorage — branch demo (static, no backend).
// Kontrak ekspor sama dengan backend Express sehingga semua caller tidak berubah.

import { ORDER_STATUSES, canTransition } from '../utils/status.js';
import { buildSeedOrders } from './mock-data.js';

const STORAGE_KEY = 'washpass_demo_orders_v1';
const WHATSAPP_REGEX = /^(\+62|62|0)8[1-9]\d{7,10}$/;
const VALID_CATEGORIES = ['shoe', 'sandal'];
const VALID_WASH_TYPES = ['fast-clean', 'deep-clean'];
const VALID_MATERIALS = ['canvas', 'mesh-knit', 'leather', 'suede-nubuck', 'rubber-eva'];

function pad(n) {
  return String(n).padStart(2, '0');
}

function nowLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (error) {
    console.warn('Mock store corrupt, reseeding:', error);
  }
  const store = { nextId: 1001 + buildSeedOrders().length, orders: buildSeedOrders() };
  saveStore(store);
  return store;
}

function saveStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    // Quota exceeded — strip photos and retry once
    console.warn('localStorage quota exceeded, stripping photos:', error);
    store.orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        item.photos = [];
      });
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }
}

function findOrder(store, id) {
  return store.orders.find((order) => order.id === id) || null;
}

function sanitizeOrder(order) {
  // Same shape as backend GET /api/orders list row
  const { items, ...summary } = order;
  return { ...summary, item_count: items.reduce((sum, item) => sum + (item.quantity || 1), 0) };
}

function toDetail(order) {
  return {
    ...order,
    items: order.items.map((item) => ({
      ...item,
      photos: (item.photos || []).map((photo) => ({
        filename: photo.filename,
        original_name: photo.original_name,
        size_bytes: photo.size_bytes,
      })),
    })),
  };
}

function toTrack(order) {
  return {
    id: order.id,
    status: order.status,
    total_price: order.total_price,
    total_items: order.total_items,
    created_at: order.created_at,
    updated_at: order.updated_at,
    items: order.items.map(({ category, material, wash_type, price }) => ({
      category,
      material,
      wash_type,
      price,
    })),
  };
}

async function fileToDataUrl(file, maxDim = 640, quality = 0.6) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', quality);
}

function validateOrderInput(fields, items) {
  const name = (fields.customer_name || '').trim();
  if (name.length < 2 || name.length > 100) return 'Nama customer tidak valid';
  if (!WHATSAPP_REGEX.test((fields.whatsapp || '').replace(/\s/g, '')))
    return 'Nomor WhatsApp tidak valid';
  const address = (fields.address || '').trim();
  if (address.length < 5 || address.length > 500) return 'Alamat tidak valid';
  if ((fields.address_note || '').length > 300) return 'Catatan alamat terlalu panjang';

  const lat = fields.latitude !== undefined && fields.latitude !== '' ? Number(fields.latitude) : null;
  const lng = fields.longitude !== undefined && fields.longitude !== '' ? Number(fields.longitude) : null;
  if ((lat === null) !== (lng === null)) return 'Koordinat harus lengkap (lat + lng)';
  if (lat !== null && (Number.isNaN(lat) || lat < -90 || lat > 90)) return 'Latitude tidak valid';
  if (lng !== null && (Number.isNaN(lng) || lng < -180 || lng > 180)) return 'Longitude tidak valid';

  if (!Array.isArray(items) || items.length < 2 || items.length > 6)
    return 'Minimal 2 pasang, maksimal 6 pasang per order';
  for (const item of items) {
    if (!VALID_CATEGORIES.includes(item.category)) return 'Kategori tidak valid';
    if (item.category === 'shoe' && !VALID_MATERIALS.includes(item.material))
      return 'Material tidak valid';
    if (!VALID_WASH_TYPES.includes(item.wash_type)) return 'Tipe cuci tidak valid';
    if (!Number.isInteger(item.price) || item.price < 0) return 'Harga tidak valid';
    if ((item.notes || '').length > 300) return 'Catatan item terlalu panjang';
    const photoCount = Number(item.photos) || 0;
    if (photoCount < 0 || photoCount > 3) return 'Maksimal 3 foto per item';
  }

  const totalPrice = Number(fields.total_price);
  const totalItems = Number(fields.total_items);
  if (!Number.isInteger(totalPrice) || totalPrice < 0) return 'Total harga tidak valid';
  if (!Number.isInteger(totalItems) || totalItems < 1) return 'Jumlah item tidak valid';

  return null;
}

export async function submitOrder(formData) {
  await new Promise((resolve) => setTimeout(resolve, 400)); // simulasi latensi

  const fields = Object.fromEntries(
    ['customer_name', 'whatsapp', 'address', 'address_note', 'latitude', 'longitude', 'total_price', 'total_items'].map(
      (key) => [key, formData.get(key)]
    )
  );
  let items;
  try {
    items = JSON.parse(formData.get('items') || '[]');
  } catch {
    throw new Error('Format items tidak valid');
  }

  const error = validateOrderInput(fields, items);
  if (error) throw new Error(error);

  const photoFiles = formData.getAll('photos').filter((file) => file instanceof File && file.size > 0);
  let fileIndex = 0;
  const builtItems = [];
  for (const spec of items) {
    const photos = [];
    const photoCount = Number(spec.photos) || 0;
    for (let i = 0; i < photoCount && fileIndex < photoFiles.length; i++, fileIndex++) {
      const file = photoFiles[fileIndex];
      let dataUrl;
      try {
        dataUrl = await fileToDataUrl(file);
      } catch {
        dataUrl = '';
      }
      photos.push({
        filename: `demo-${crypto.randomUUID()}.jpg`,
        original_name: file.name || 'photo.jpg',
        size_bytes: file.size || 0,
        dataUrl,
      });
    }
    builtItems.push({
      category: spec.category,
      material: spec.category === 'sandal' ? null : spec.material,
      wash_type: spec.wash_type,
      price: spec.price,
      notes: spec.notes || null,
      photos,
    });
  }

  const store = loadStore();
  const now = nowLocal();
  const order = {
    id: store.nextId++,
    customer_name: fields.customer_name.trim(),
    whatsapp: fields.whatsapp.replace(/\s/g, ''),
    address: fields.address.trim(),
    address_note: fields.address_note || null,
    latitude: fields.latitude ? Number(fields.latitude) : null,
    longitude: fields.longitude ? Number(fields.longitude) : null,
    status: ORDER_STATUSES.PENDING,
    total_items: Number(fields.total_items),
    total_price: Number(fields.total_price),
    created_at: now,
    updated_at: now,
    items: builtItems,
  };
  store.orders.push(order);
  saveStore(store);

  return { orderId: order.id, status: 'success' };
}

export async function getOrders(status = null) {
  const store = loadStore();
  let orders = store.orders.map(sanitizeOrder);
  if (status && Object.values(ORDER_STATUSES).includes(status)) {
    orders = orders.filter((order) => order.status === status);
  }
  return orders.sort((a, b) => b.id - a.id);
}

export async function getOrderDetail(id) {
  const store = loadStore();
  const order = findOrder(store, Number(id));
  if (!order) throw new Error('Order not found');
  return toDetail(order);
}

export async function trackOrder(id) {
  if (!/^\d+$/.test(String(id))) {
    const err = new Error('Pesanan tidak ditemukan');
    err.status = 404;
    throw err;
  }
  const store = loadStore();
  const order = findOrder(store, Number(id));
  if (!order) {
    const err = new Error('Pesanan tidak ditemukan');
    err.status = 404;
    throw err;
  }
  return toTrack(order);
}

export async function getOrderStats() {
  const store = loadStore();
  const byStatus = Object.values(ORDER_STATUSES).reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
  const today = nowLocal().slice(0, 10);
  let todayOrders = 0;
  let todayRevenue = 0;

  for (const order of store.orders) {
    if (Object.prototype.hasOwnProperty.call(byStatus, order.status)) byStatus[order.status]++;
    if ((order.created_at || '').slice(0, 10) === today) {
      todayOrders++;
      todayRevenue += order.total_price;
    }
  }

  return { total: store.orders.length, byStatus, todayOrders, todayRevenue };
}

export async function updateOrderStatus(id, status) {
  if (!Object.values(ORDER_STATUSES).includes(status)) {
    throw new Error('Invalid status');
  }
  const store = loadStore();
  const order = findOrder(store, Number(id));
  if (!order) throw new Error('Order not found');
  if (!canTransition(order.status, status)) {
    throw new Error(`Invalid status transition from ${order.status} to ${status}`);
  }
  order.status = status;
  order.updated_at = nowLocal();
  saveStore(store);
  return { success: true, status };
}

const FALLBACK_PHOTO =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360"><rect width="480" height="360" fill="#E2E8F0"/><text x="240" y="180" font-size="24" text-anchor="middle" fill="#64748B" font-family="sans-serif">Foto tidak tersedia</text></svg>'
  );

export function getPhotoUrl(filename) {
  const store = loadStore();
  for (const order of store.orders) {
    for (const item of order.items || []) {
      for (const photo of item.photos || []) {
        if (photo.filename === filename && photo.dataUrl) return photo.dataUrl;
      }
    }
  }
  return FALLBACK_PHOTO;
}

export function resetDemoData() {
  localStorage.removeItem(STORAGE_KEY);
  return loadStore();
}
