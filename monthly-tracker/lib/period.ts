import { endOfMonth, startOfMonth } from '@/lib/month';

export type OverviewPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

export const OVERVIEW_PERIODS: { id: OverviewPeriod; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'quarter', label: 'Quarter' },
  { id: 'year', label: 'Year' },
  { id: 'custom', label: 'Custom' },
];

export type DateRange = { start: number; end: number };

export type CustomDateRange = { start: Date; end: Date };

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

export function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

/** Noon local time — stable when filtering by calendar day. */
export function noonOnDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
}

export function defaultCustomRange(): CustomDateRange {
  const today = new Date();
  return {
    start: startOfMonth(today.getFullYear(), today.getMonth()),
    end: today,
  };
}

export function normalizeCustomRange(range: CustomDateRange): CustomDateRange {
  const a = startOfDay(range.start);
  const b = startOfDay(range.end);
  if (a.getTime() <= b.getTime()) {
    return { start: a, end: b };
  }
  return { start: b, end: a };
}

function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function endOfWeek(date: Date): Date {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return endOfDay(end);
}

function startOfQuarter(date: Date): Date {
  const q = Math.floor(date.getMonth() / 3);
  return startOfMonth(date.getFullYear(), q * 3);
}

function endOfQuarter(date: Date): Date {
  const start = startOfQuarter(date);
  return endOfMonth(start.getFullYear(), start.getMonth() + 2);
}

function startOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
}

function endOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
}

export function resolveOverviewRange(
  period: OverviewPeriod,
  anchor: Date,
  customRange: CustomDateRange
): DateRange {
  if (period === 'custom') {
    const { start, end } = normalizeCustomRange(customRange);
    return { start: startOfDay(start).getTime(), end: endOfDay(end).getTime() };
  }
  switch (period) {
    case 'today':
      return { start: startOfDay(anchor).getTime(), end: endOfDay(anchor).getTime() };
    case 'week':
      return { start: startOfWeek(anchor).getTime(), end: endOfWeek(anchor).getTime() };
    case 'month':
      return {
        start: startOfMonth(anchor.getFullYear(), anchor.getMonth()).getTime(),
        end: endOfMonth(anchor.getFullYear(), anchor.getMonth()).getTime(),
      };
    case 'quarter':
      return { start: startOfQuarter(anchor).getTime(), end: endOfQuarter(anchor).getTime() };
    case 'year':
      return { start: startOfYear(anchor).getTime(), end: endOfYear(anchor).getTime() };
  }
}

export function shiftAnchor(period: OverviewPeriod, anchor: Date, delta: number): Date {
  const d = new Date(anchor);
  switch (period) {
    case 'custom':
      return d;
    case 'today':
      d.setDate(d.getDate() + delta);
      break;
    case 'week':
      d.setDate(d.getDate() + delta * 7);
      break;
    case 'month':
      d.setMonth(d.getMonth() + delta);
      break;
    case 'quarter':
      d.setMonth(d.getMonth() + delta * 3);
      break;
    case 'year':
      d.setFullYear(d.getFullYear() + delta);
      break;
  }
  return d;
}

function formatDay(d: Date, withYear = true): string {
  return d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    ...(withYear ? { year: 'numeric' } : {}),
  });
}

export function formatPeriodLabel(
  period: OverviewPeriod,
  anchor: Date,
  customRange: CustomDateRange
): string {
  if (period === 'custom') {
    const { start, end } = normalizeCustomRange(customRange);
    const sameYear = start.getFullYear() === end.getFullYear();
    return `${formatDay(start, !sameYear)} – ${formatDay(end, true)}`;
  }

  const { start, end } = resolveOverviewRange(period, anchor, customRange);
  const s = new Date(start);
  const e = new Date(end);

  switch (period) {
    case 'today':
      return s.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    case 'week':
      return `${formatDay(s, false)} – ${formatDay(e, true)}`;
    case 'month':
      return s.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    case 'quarter': {
      const q = Math.floor(s.getMonth() / 3) + 1;
      return `Q${q} ${s.getFullYear()}`;
    }
    case 'year':
      return String(s.getFullYear());
    default:
      return '';
  }
}

export function periodTotalLabel(period: OverviewPeriod): string {
  switch (period) {
    case 'today':
      return 'Spent today';
    case 'week':
      return 'Spent this week';
    case 'month':
      return 'Spent this month';
    case 'quarter':
      return 'Spent this quarter';
    case 'year':
      return 'Spent this year';
    case 'custom':
      return 'Spent in range';
  }
}
