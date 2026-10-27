import { getDatabase } from '@/lib/db';
import type { AppSettings, Category, CategoryTotal, ExpenseWithCategory } from '@/lib/types';

export async function getSettings(): Promise<AppSettings> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    'currencyCode'
  );
  return { currencyCode: row?.value ?? 'INR' };
}

export async function setCurrencyCode(code: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    'currencyCode',
    code
  );
}

export async function listCategories(): Promise<Category[]> {
  const db = await getDatabase();
  return db.getAllAsync<Category>('SELECT id, name, color FROM categories ORDER BY name ASC');
}

export async function addExpense(input: {
  amount: number;
  categoryId: number;
  note?: string;
  spentAt: number;
}): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO expenses (amount, category_id, note, spent_at, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    input.amount,
    input.categoryId,
    input.note?.trim() || null,
    input.spentAt,
    Date.now()
  );
}

export async function deleteExpense(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM expenses WHERE id = ?', id);
}

export async function getExpenseById(id: number): Promise<ExpenseWithCategory | null> {
  const db = await getDatabase();
  return db.getFirstAsync<ExpenseWithCategory>(
    `SELECT e.id, e.amount, e.category_id AS categoryId, e.note, e.spent_at AS spentAt,
            c.name AS categoryName, c.color AS categoryColor
     FROM expenses e
     INNER JOIN categories c ON c.id = e.category_id
     WHERE e.id = ?`,
    id
  );
}

export async function updateExpense(
  id: number,
  input: {
    amount: number;
    categoryId: number;
    note?: string;
    spentAt: number;
  }
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE expenses SET amount = ?, category_id = ?, note = ?, spent_at = ? WHERE id = ?`,
    input.amount,
    input.categoryId,
    input.note?.trim() || null,
    input.spentAt,
    id
  );
}

export async function listExpensesInRange(
  startMs: number,
  endMs: number
): Promise<ExpenseWithCategory[]> {
  const db = await getDatabase();
  return db.getAllAsync<ExpenseWithCategory>(
    `SELECT e.id, e.amount, e.category_id AS categoryId, e.note, e.spent_at AS spentAt,
            c.name AS categoryName, c.color AS categoryColor
     FROM expenses e
     INNER JOIN categories c ON c.id = e.category_id
     WHERE e.spent_at >= ? AND e.spent_at <= ?
     ORDER BY e.spent_at DESC, e.id DESC`,
    startMs,
    endMs
  );
}

export async function monthTotal(startMs: number, endMs: number): Promise<number> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ total: number | null }>(
    'SELECT SUM(amount) AS total FROM expenses WHERE spent_at >= ? AND spent_at <= ?',
    startMs,
    endMs
  );
  return row?.total ?? 0;
}

export async function totalsByCategory(
  startMs: number,
  endMs: number
): Promise<CategoryTotal[]> {
  const db = await getDatabase();
  return db.getAllAsync<CategoryTotal>(
    `SELECT c.id AS categoryId, c.name, c.color, COALESCE(SUM(e.amount), 0) AS total
     FROM categories c
     LEFT JOIN expenses e ON e.category_id = c.id AND e.spent_at >= ? AND e.spent_at <= ?
     GROUP BY c.id
     HAVING total > 0
     ORDER BY total DESC`,
    startMs,
    endMs
  );
}
