const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function formatDayDate(iso: string): string {
  const dt = parseDate(iso);
  return `${DAY[dt.getUTCDay()]}, ${MONTH_SHORT[dt.getUTCMonth()]} ${dt.getUTCDate()}`;
}

export function formatLongDate(iso: string): string {
  const dt = parseDate(iso);
  return `${DAY[dt.getUTCDay()]}, ${MONTH_LONG[dt.getUTCMonth()]} ${dt.getUTCDate()}`;
}

export function formatMonthYear(year: number, monthIndex: number): string {
  return `${MONTH_LONG[monthIndex]} ${year}`;
}

export function getMonthMatrix(
  year: number,
  monthIndex: number,
): Array<Array<{ date: string; inMonth: boolean }>> {
  const first = new Date(Date.UTC(year, monthIndex, 1));
  const startWeekday = first.getUTCDay();
  const start = new Date(first);
  start.setUTCDate(first.getUTCDate() - startWeekday);

  const weeks: Array<Array<{ date: string; inMonth: boolean }>> = [];
  for (let w = 0; w < 6; w++) {
    const row: Array<{ date: string; inMonth: boolean }> = [];
    for (let d = 0; d < 7; d++) {
      const cur = new Date(start);
      cur.setUTCDate(start.getUTCDate() + w * 7 + d);
      const iso = toIso(cur);
      row.push({ date: iso, inMonth: cur.getUTCMonth() === monthIndex });
    }
    weeks.push(row);
  }
  return weeks;
}

export function uniqueMonths(
  posts: Array<{ date: string }>,
): Array<{ key: string; year: number; monthIndex: number }> {
  const seen = new Set<string>();
  const out: Array<{ key: string; year: number; monthIndex: number }> = [];
  for (const p of posts) {
    const dt = parseDate(p.date);
    const key = `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push({
        key,
        year: dt.getUTCFullYear(),
        monthIndex: dt.getUTCMonth(),
      });
    }
  }
  return out.sort((a, b) => a.key.localeCompare(b.key));
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  const wk = Math.floor(day / 7);
  if (wk < 4) return `${wk}w ago`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(day / 365)}y ago`;
}
