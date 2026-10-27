import * as SQLite from 'expo-sqlite';

const DB_NAME = 'monthly_tracker.db';

const DEFAULT_CATEGORIES: { name: string; color: string }[] = [
  { name: 'Food', color: '#F97316' },
  { name: 'Transport', color: '#3B82F6' },
  { name: 'Shopping', color: '#A855F7' },
  { name: 'Bills', color: '#EF4444' },
  { name: 'Entertainment', color: '#EC4899' },
  { name: 'Health', color: '#10B981' },
  { name: 'Other', color: '#6B7280' },
];

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = openAndMigrate();
  }
  return dbPromise;
}

async function openAndMigrate(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DB_NAME);

  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL CHECK(amount > 0),
      category_id INTEGER NOT NULL,
      note TEXT,
      spent_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_expenses_spent_at ON expenses(spent_at);
  `);

  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    'currencyCode'
  );
  if (!row) {
    await db.runAsync('INSERT INTO settings (key, value) VALUES (?, ?)', 'currencyCode', 'INR');
  }

  const count = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM categories');
  if ((count?.n ?? 0) === 0) {
    for (const cat of DEFAULT_CATEGORIES) {
      await db.runAsync('INSERT INTO categories (name, color) VALUES (?, ?)', cat.name, cat.color);
    }
  }

  return db;
}
