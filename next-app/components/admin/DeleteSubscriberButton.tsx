'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';

export function DeleteSubscriberButton({ id, email }: { id: string; email: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const del = async () => {
    if (!confirm(`Delete subscriber "${email}"?`)) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/subscribers/${id}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={del} disabled={loading} className="p-1 text-text2 hover:text-red-500 disabled:opacity-50" aria-label="Delete subscriber">
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
