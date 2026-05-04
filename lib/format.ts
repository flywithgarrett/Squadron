const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const MONTH_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function formatDayDate(iso: string): string {
  const dt = parseDate(iso);
  return `${DAY[dt.getUTCDay()]}, ${MONTH[dt.getUTCMonth()]} ${dt.getUTCDate()}`;
}

export function formatDayShort(iso: string): string {
  return DAY[parseDate(iso).getUTCDay()];
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
      const iso = cur.toISOString().slice(0, 10);
      row.push({ date: iso, inMonth: cur.getUTCMonth() === monthIndex });
    }
    weeks.push(row);
  }
  return weeks;
}
