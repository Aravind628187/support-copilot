function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // Quote any cell containing a comma, quote, or newline; double up internal quotes.
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCsv<T extends Record<string, unknown>>(rows: T[], columns: (keyof T)[]): string {
  const header = columns.map((c) => escapeCsvCell(String(c))).join(',');
  const lines = rows.map((row) => columns.map((col) => escapeCsvCell(row[col])).join(','));
  return [header, ...lines].join('\n');
}
