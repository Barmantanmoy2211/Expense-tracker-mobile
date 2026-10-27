import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  addExpense,
  deleteExpense,
  getSettings,
  listCategories,
  listExpensesInRange,
  monthTotal,
  setCurrencyCode,
  totalsByCategory,
  updateExpense,
} from '@/lib/repository';
import {
  defaultCustomRange,
  normalizeCustomRange,
  resolveOverviewRange,
  shiftAnchor,
  type CustomDateRange,
  type OverviewPeriod,
} from '@/lib/period';
import type { AppSettings, Category, CategoryTotal, ExpenseWithCategory } from '@/lib/types';

type TrackerContextValue = {
  ready: boolean;
  error: string | null;
  period: OverviewPeriod;
  setPeriod: (period: OverviewPeriod) => void;
  anchorDate: Date;
  customRange: CustomDateRange;
  setCustomRange: (range: CustomDateRange) => void;
  goPrevPeriod: () => void;
  goNextPeriod: () => void;
  categories: Category[];
  expenses: ExpenseWithCategory[];
  periodTotalAmount: number;
  categoryTotals: CategoryTotal[];
  settings: AppSettings;
  refresh: () => Promise<void>;
  createExpense: (input: {
    amount: number;
    categoryId: number;
    note?: string;
    spentAt: number;
  }) => Promise<void>;
  editExpense: (
    id: number,
    input: {
      amount: number;
      categoryId: number;
      note?: string;
      spentAt: number;
    }
  ) => Promise<void>;
  removeExpense: (id: number) => Promise<void>;
  updateCurrency: (code: string) => Promise<void>;
};

const TrackerContext = createContext<TrackerContextValue | null>(null);

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriodState] = useState<OverviewPeriod>('month');
  const [anchorDate, setAnchorDate] = useState(() => new Date());
  const [customRange, setCustomRangeState] = useState<CustomDateRange>(() => defaultCustomRange());
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([]);
  const [periodTotalAmount, setPeriodTotalAmount] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ currencyCode: 'INR' });

  const range = useMemo(
    () => resolveOverviewRange(period, anchorDate, customRange),
    [period, anchorDate, customRange]
  );

  const refresh = useCallback(async () => {
    try {
      const [cats, exps, total, byCat, appSettings] = await Promise.all([
        listCategories(),
        listExpensesInRange(range.start, range.end),
        monthTotal(range.start, range.end),
        totalsByCategory(range.start, range.end),
        getSettings(),
      ]);
      setCategories(cats);
      setExpenses(exps);
      setPeriodTotalAmount(total);
      setCategoryTotals(byCat);
      setSettings(appSettings);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    }
  }, [range.end, range.start]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await refresh();
        if (!cancelled) setReady(true);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to open database');
          setReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const setPeriod = useCallback((p: OverviewPeriod) => {
    setPeriodState(p);
    setAnchorDate(new Date());
    if (p === 'custom') {
      setCustomRangeState(defaultCustomRange());
    }
  }, []);

  const setCustomRange = useCallback((r: CustomDateRange) => {
    setCustomRangeState(normalizeCustomRange(r));
  }, []);

  const goPrevPeriod = useCallback(() => {
    if (period === 'custom') return;
    setAnchorDate((prev) => shiftAnchor(period, prev, -1));
  }, [period]);

  const goNextPeriod = useCallback(() => {
    if (period === 'custom') return;
    setAnchorDate((prev) => shiftAnchor(period, prev, 1));
  }, [period]);

  const createExpense = useCallback(
    async (input: {
      amount: number;
      categoryId: number;
      note?: string;
      spentAt: number;
    }) => {
      await addExpense(input);
      await refresh();
    },
    [refresh]
  );

  const editExpense = useCallback(
    async (
      id: number,
      input: {
        amount: number;
        categoryId: number;
        note?: string;
        spentAt: number;
      }
    ) => {
      await updateExpense(id, input);
      await refresh();
    },
    [refresh]
  );

  const removeExpense = useCallback(
    async (id: number) => {
      await deleteExpense(id);
      await refresh();
    },
    [refresh]
  );

  const updateCurrency = useCallback(
    async (code: string) => {
      await setCurrencyCode(code);
      await refresh();
    },
    [refresh]
  );

  const value = useMemo(
    () => ({
      ready,
      error,
      period,
      setPeriod,
      anchorDate,
      customRange,
      setCustomRange,
      goPrevPeriod,
      goNextPeriod,
      categories,
      expenses,
      periodTotalAmount,
      categoryTotals,
      settings,
      refresh,
      createExpense,
      editExpense,
      removeExpense,
      updateCurrency,
    }),
    [
      ready,
      error,
      period,
      setPeriod,
      anchorDate,
      customRange,
      setCustomRange,
      goPrevPeriod,
      goNextPeriod,
      categories,
      expenses,
      periodTotalAmount,
      categoryTotals,
      settings,
      refresh,
      createExpense,
      editExpense,
      removeExpense,
      updateCurrency,
    ]
  );

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>;
}

export function useTracker(): TrackerContextValue {
  const ctx = useContext(TrackerContext);
  if (!ctx) {
    throw new Error('useTracker must be used within TrackerProvider');
  }
  return ctx;
}
