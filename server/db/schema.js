import { getDatabase, closeDatabase } from './database.js';

const schema = `
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  address TEXT NOT NULL,
  address_note TEXT,
  latitude REAL,
  longitude REAL,
  total_price INTEGER NOT NULL,
  total_items INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'picked_up', 'in_progress', 'done')),
  created_at TEXT DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('shoe', 'sandal')),
  material TEXT CHECK (material IN ('canvas', 'mesh-knit', 'leather', 'suede-nubuck', 'rubber-eva')),
  wash_type TEXT NOT NULL CHECK (wash_type IN ('fast-clean', 'deep-clean')),
  price INTEGER NOT NULL,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS order_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_item_id INTEGER NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  size_bytes INTEGER,
  created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_photos_order_item_id ON order_photos(order_item_id);
`;

export async function initDatabase() {
  const db = await getDatabase();
  await db.exec(schema);
  console.log('Database initialized successfully');
}

export { getDatabase, closeDatabase };