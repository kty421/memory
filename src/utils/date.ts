import { addDays, differenceInCalendarDays, format, isToday, isTomorrow, parseISO } from "date-fns";

export const nowIso = (): string => new Date().toISOString();

export const addDaysIso = (days: number): string => addDays(new Date(), days).toISOString();

export const parseIsoDate = (value: string): Date => parseISO(value);

export const formatDateLabel = (value: string): string => {
  const date = parseISO(value);
  if (isToday(date)) {
    return "今日";
  }
  if (isTomorrow(date)) {
    return "明日";
  }
  return format(date, "M/d");
};

export const formatDateTimeLabel = (value: string): string => format(parseISO(value), "M/d HH:mm");

export const getDueLabel = (value: string): string => {
  const date = parseISO(value);
  const diff = differenceInCalendarDays(date, new Date());
  if (diff < 0) {
    return `${Math.abs(diff)}日超過`;
  }
  if (diff === 0) {
    return "今日";
  }
  if (diff === 1) {
    return "明日";
  }
  return `${diff}日後`;
};

export const parseDateInputToIso = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const date = new Date(`${trimmed}T09:00:00`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
};

export const formatIsoForInput = (value?: string): string => {
  if (!value) {
    return "";
  }
  return format(parseISO(value), "yyyy-MM-dd");
};
