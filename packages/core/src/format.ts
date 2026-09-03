import { storage } from './storage';

export function formatCurrency(amount: number): string {
  const symbol = storage.getItem('currencySymbol');
  const locale = typeof document !== 'undefined' ? document.documentElement.lang || undefined : undefined;
  const value = Number(amount);
  if (!Number.isFinite(value)) return `${symbol} 0`;
  return `${symbol} ${value.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatQty(qty: number | string): string {
  const locale = typeof document !== 'undefined' ? document.documentElement.lang || undefined : undefined;
  const value = Number(qty);
  if (!Number.isFinite(value)) return String(qty);
  return value.toLocaleString(locale, { maximumFractionDigits: 3 });
}

export const formatInvoiceTime = (timestamp: string | null) => {
    if (!timestamp) return 'No bill activity yet';

    const parsedDate = new Date(timestamp);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' });
    }

    const timeOnlyMatch = timestamp.match(/^(\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))?$/);
    if (timeOnlyMatch) {
      const [, hours, minutes, seconds] = timeOnlyMatch;
      const date = new Date();
      date.setHours(Number(hours), Number(minutes), Number(seconds), 0);
      const formatted = date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      if (/^\d{1,2}:\d{2}$/.test(formatted)) {
        return formatted;
      }
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    }

    return timestamp;
  };
