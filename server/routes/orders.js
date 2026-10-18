import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getDatabase } from '../db/database.js';
import { uploadMiddleware } from '../middleware/upload.js';

const router = Router();

const VALID_STATUSES = ['pending', 'picked_up', 'in_progress', 'done'];
const STATUS_TRANSITIONS = {
  pending: ['picked_up'],
  picked_up: ['in_progress'],
  in_progress: ['done'],
  done: [],
};

const VALID_CATEGORIES = ['shoe', 'sandal'];
const VALID_MATERIALS = ['canvas', 'mesh-knit', 'leather', 'suede-nubuck', 'rubber-eva'];
const VALID_WASH_TYPES = ['fast-clean', 'deep-clean'];
const WHATSAPP_REGEX = /^(\+62|62|0)8[1-9]\d{7,10}$/;

function validateStatusTransition(currentStatus, newStatus) {
  return STATUS_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}

// Stricter limit for order creation (expensive: file upload + DB writes)
const createOrderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Terlalu banyak permintaan, coba lagi nanti' },
});

function validateOrderInput(body) {
  const {
    customer_name,
    whatsapp,
    address,
    address_note,
    latitude,
    longitude,
    items,
    total_price,
    total_items,
  } = body;

  if (!customer_name || !whatsapp || !address || !items) {
    return 'Missing required fields';
  }
  if (typeof customer_name !== 'string' || customer_name.trim().length < 2 || customer_name.trim().length > 100) {
    return 'Nama tidak valid (2-100 karakter)';
  }
  if (typeof whatsapp !== 'string' || !WHATSAPP_REGEX.test(whatsapp.replace(/\s+/g, ''))) {
    return 'Format nomor WhatsApp tidak valid';
  }
  if (typeof address !== 'string' || address.trim().length < 5 || address.trim().length > 500) {
    return 'Alamat tidak valid (5-500 karakter)';
  }
  if (address_note != null && address_note !== '' && String(address_note).length > 300) {
    return 'Catatan alamat terlalu panjang (maks 300 karakter)';
  }

  let lat = null;
  let lng = null;
  if (latitude != null && latitude !== '') {
    lat = parseFloat(latitude);
    if (Number.isNaN(lat) || lat < -90 || lat > 90) return 'Latitude tidak valid';
  }
  if (longitude != null && longitude !== '') {
    lng = parseFloat(longitude);
    if (Number.isNaN(lng) || lng < -180 || lng > 180) return 'Longitude tidak valid';
  }
  if ((lat == null) !== (lng == null)) return 'Latitude dan longitude harus diisi bersamaan';

  let parsedItems;
  try {
    parsedItems = JSON.parse(items);
  } catch {
    return 'Format items tidak valid';
  }
  if (!Array.isArray(parsedItems) || parsedItems.length < 2) {
    return 'Minimum 2 item required';
  }
  if (parsedItems.length > 6) {
    return 'Maksimum 6 item per pesanan';
  }
  for (const item of parsedItems) {
    if (!item || typeof item !== 'object') return 'Format item tidak valid';
    if (!VALID_CATEGORIES.includes(item.category)) return 'Kategori tidak valid';
    if (item.category === 'shoe' && !VALID_MATERIALS.includes(item.material)) return 'Material tidak valid';
    if (!VALID_WASH_TYPES.includes(item.wash_type)) return 'Tipe cuci tidak valid';
    const price = Number(item.price);
    if (!Number.isInteger(price) || price < 0) return 'Harga item tidak valid';
    if (item.notes != null && String(item.notes).length > 300) return 'Catatan item terlalu panjang';
    const photoCount = Array.isArray(item.photos)
      ? item.photos.length
      : (typeof item.photos === 'number' ? item.photos : 0);
    if (!Number.isInteger(photoCount) || photoCount < 0 || photoCount > 3) {
      return 'Jumlah foto per item tidak valid (0-3)';
    }
  }

  const parsedTotalPrice = Number(total_price);
  const parsedTotalItems = Number(total_items);
  if (!Number.isInteger(parsedTotalPrice) || parsedTotalPrice < 0) return 'Total harga tidak valid';
  if (!Number.isInteger(parsedTotalItems) || parsedTotalItems < 1) return 'Total item tidak valid';

  return null;
}

router.post('/', createOrderLimiter, uploadMiddleware, async (req, res) => {
  try {
    const inputError = validateOrderInput(req.body);
    if (inputError) {
      return res.status(400).json({ error: inputError });
    }

    const {
      customer_name,
      whatsapp,
      address,
      address_note,
      latitude,
      longitude,
      items,
      total_price,
      total_items,
    } = req.body;

    const parsedItems = JSON.parse(items);
    const lat = latitude != null && latitude !== '' ? parseFloat(latitude) : null;
    const lng = longitude != null && longitude !== '' ? parseFloat(longitude) : null;

    const db = await getDatabase();
    
    const result = await db.run(`
      INSERT INTO orders (customer_name, whatsapp, address, address_note, latitude, longitude, total_price, total_items, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `, [
      customer_name.trim(),
      whatsapp.replace(/\s+/g, ''),
      address.trim(),
      address_note || null,
      lat,
      lng,
      Number(total_price),
      Number(total_items)
    ]);

    const orderId = result.lastID;

    const itemStmt = await db.prepare(`
      INSERT INTO order_items (order_id, category, material, wash_type, price, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const photoStmt = await db.prepare(`
      INSERT INTO order_photos (order_item_id, filename, original_name, size_bytes)
      VALUES (?, ?, ?, ?)
    `);

    const files = req.files || [];
    let fileIndex = 0;

    for (const item of parsedItems) {
      const itemResult = await itemStmt.run(
        orderId,
        item.category,
        item.material || null,
        item.wash_type,
        item.price,
        item.notes || null
      );

      const itemId = itemResult.lastID;

      const photoCount = Array.isArray(item.photos)
        ? item.photos.length
        : (typeof item.photos === 'number' && item.photos > 0 ? item.photos : 0);
      for (let i = 0; i < photoCount; i++) {
        if (fileIndex < files.length) {
          const file = files[fileIndex];
          await photoStmt.run(itemId, file.filename, file.originalname, file.size);
          fileIndex++;
        }
      }
    }

    await itemStmt.finalize();
    await photoStmt.finalize();

    res.json({ orderId, status: 'success' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const db = await getDatabase();
    
    let query = `
      SELECT o.*, 
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
      FROM orders o
    `;
    const params = [];

    if (status && VALID_STATUSES.includes(status)) {
      query += ' WHERE o.status = ?';
      params.push(status);
    }

    query += ' ORDER BY o.created_at DESC';

    const orders = await db.all(query, ...params);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!/^\d+$/.test(id)) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const db = await getDatabase();
    
    const order = await db.get('SELECT * FROM orders WHERE id = ?', id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const items = await db.all('SELECT * FROM order_items WHERE order_id = ?', id);
    
    for (const item of items) {
      item.photos = await db.all('SELECT * FROM order_photos WHERE order_item_id = ?', item.id);
    }

    res.json({ ...order, items });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const db = await getDatabase();
    const order = await db.get('SELECT status FROM orders WHERE id = ?', id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (!validateStatusTransition(order.status, status)) {
      return res.status(400).json({ 
        error: `Invalid status transition from ${order.status} to ${status}` 
      });
    }

    await db.run('UPDATE orders SET status = ?, updated_at = datetime("now", "localtime") WHERE id = ?', [status, id]);

    res.json({ success: true, status });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

export default router;
