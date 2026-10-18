import { getDatabase, closeDatabase } from './database.js';

const SCHEMA_VERSION = 1;

const tables = `
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
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'picked_up', 'in_progress', 'done', 'cancelled')),
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
`;

const indexes = `
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_photos_order_item_id ON order_photos(order_item_id);
`;

// v0 -> v1: rebuild `orders` to allow the 'cancelled' status (SQLite cannot
// alter a CHECK constraint in place -> table rebuild required).
const REBUILD_ORDERS_V1 = `
CREATE TABLE orders_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  address TEXT NOT NULL,
  address_note TEXT,
  latitude REAL,
  longitude REAL,
  total_price INTEGER NOT NULL,
  total_items INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'picked_up', 'in_progress', 'done', 'cancelled')),
  created_at TEXT DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT DEFAULT (datetime('now', 'localtime'))
);

INSERT INTO orders_new
  (id, customer_name, whatsapp, address, address_note, latitude, longitude,
   total_price, total_items, status, created_at, updated_at)
SELECT
  id, customer_name, whatsapp, address, address_note, latitude, longitude,
  total_price, total_items, status, created_at, updated_at
FROM orders;

DROP TABLE orders;
ALTER TABLE orders_new RENAME TO orders;
`;

async function migrate(db) {
  const row = await db.get('PRAGMA user_version');
  const version = row?.user_version ?? 0;
  if (version >= SCHEMA_VERSION) return;

  if (version < 1) {
    await db.exec('PRAGMA foreign_keys = OFF;');
    await db.exec('BEGIN;');
    try {
      await db.exec(REBUILD_ORDERS_V1);
      await db.exec('COMMIT;');
    } catch (error) {
      await db.exec('ROLLBACK;');
      throw error;
    } finally {
      await db.exec('PRAGMA foreign_keys = ON;');
    }
    await db.exec(`PRAGMA user_version = ${SCHEMA_VERSION};`);
    console.log(`Database migrated to v${SCHEMA_VERSION}`);
  }
}

export async function initDatabase() {
  const db = await getDatabase();
  await db.exec(tables);
  await migrate(db);
  await db.exec(indexes);
  console.log('Database initialized successfully');
}

export { getDatabase, closeDatabase };
