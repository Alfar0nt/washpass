import { Router } from 'express';
import db from '../db/database.js';
import { uploadMiddleware } from '../middleware/upload.js';

const router = Router();

const VALID_STATUSES = ['pending', 'picked_up', 'in_progress', 'done'];
const STATUS_TRANSITIONS = {
  pending: ['picked_up'],
  picked_up: ['in_progress'],
  in_progress: ['done'],
  done: [],
};

function validateStatusTransition(currentStatus, newStatus) {
  return STATUS_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}

router.post('/', uploadMiddleware, (req, res) => {
  try {
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

    if (!customer_name || !whatsapp || !address || !items) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const parsedItems = JSON.parse(items);
    if (!Array.isArray(parsedItems) || parsedItems.length < 2) {
      return res.status(400).json({ error: 'Minimum 2 items required' });
    }

    const orderStmt = db.prepare(`
      INSERT INTO orders (customer_name, whatsapp, address, address_note, latitude, longitude, total_price, total_items, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `);

    const result = orderStmt.run(
      customer_name,
      whatsapp,
      address,
      address_note || null,
      latitude ? parseFloat(latitude) : null,
      longitude ? parseFloat(longitude) : null,
      parseInt(total_price),
      parseInt(total_items)
    );

    const orderId = result.lastInsertRowid;

    const itemStmt = db.prepare(`
      INSERT INTO order_items (order_id, category, material, wash_type, price, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const photoStmt = db.prepare(`
      INSERT INTO order_photos (order_item_id, filename, original_name, size_bytes)
      VALUES (?, ?, ?, ?)
    `);

    const files = req.files || [];
    let fileIndex = 0;

    for (const item of parsedItems) {
      const itemResult = itemStmt.run(
        orderId,
        item.category,
        item.material || null,
        item.wash_type,
        item.price,
        item.notes || null
      );

      const itemId = itemResult.lastInsertRowid;

      const photoCount = item.photos?.length || 0;
      for (let i = 0; i < photoCount; i++) {
        if (fileIndex < files.length) {
          const file = files[fileIndex];
          photoStmt.run(itemId, file.filename, file.originalname, file.size);
          fileIndex++;
        }
      }
    }

    res.json({ orderId, status: 'success' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.get('/', (req, res) => {
  try {
    const { status } = req.query;
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

    const orders = db.prepare(query).all(...params);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(id);
    
    for (const item of items) {
      item.photos = db.prepare('SELECT * FROM order_photos WHERE order_item_id = ?').all(item.id);
    }

    res.json({ ...order, items });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

router.patch('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = db.prepare('SELECT status FROM orders WHERE id = ?').get(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (!validateStatusTransition(order.status, status)) {
      return res.status(400).json({ 
        error: `Invalid status transition from ${order.status} to ${status}` 
      });
    }

    db.prepare('UPDATE orders SET status = ?, updated_at = datetime("now", "localtime") WHERE id = ?')
      .run(status, id);

    res.json({ success: true, status });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

export default router;