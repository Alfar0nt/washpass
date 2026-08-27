import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'washpass.db');

let dbInstance = null;

export async function getDatabase() {
  if (dbInstance) return dbInstance;
  
  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  
  // Enable WAL mode for better concurrency
  await dbInstance.exec('PRAGMA journal_mode = WAL;');
  await dbInstance.exec('PRAGMA foreign_keys = ON;');
  
  return dbInstance;
}

export async function closeDatabase() {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
  }
}