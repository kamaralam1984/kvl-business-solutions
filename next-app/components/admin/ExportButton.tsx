'use client';
import { Download } from 'lucide-react';

export function ExportButton({ type, label }: { type: 'orders' | 'leads' | 'users' | 'tickets' | 'quotes' | 'subscribers'; label?: string }) {
  return (
    <a href={`/api/admin/export/${type}`} className="btn btn-ghost text-xs">
      <Download className="w-3.5 h-3.5" /> {label || 'Export CSV'}
    </a>
  );
}
