export type Category = {
  id: number;
  name: string;
  color: string;
};

export type Expense = {
  id: number;
  amount: number;
  categoryId: number;
  note: string | null;
  spentAt: number;
};

export type ExpenseWithCategory = Expense & {
  categoryName: string;
  categoryColor: string;
};

export type CategoryTotal = {
  categoryId: number;
  name: string;
  color: string;
  total: number;
};

export type AppSettings = {
  currencyCode: string;
};
