function escape(v: any): string {
  if (v === null || v === undefined) return '';
  const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function toCSV(rows: Record<string, any>[], headers?: string[]): string {
  if (rows.length === 0) return (headers || []).join(',') + '\n';
  const cols = headers || Object.keys(rows[0]);
  const head = cols.join(',');
  const body = rows.map(r => cols.map(c => escape(r[c])).join(',')).join('\n');
  return `${head}\n${body}\n`;
}
