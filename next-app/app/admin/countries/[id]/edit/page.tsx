'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CountryPageForm, CountryFormData } from '@/components/admin/CountryPageForm';

export default function EditCountryPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<CountryFormData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/countries/${id}`).then(r => r.json())
      .then(d => { if (d.ok) setData(d.country); else setError(true); })
      .catch(() => setError(true));
  }, [id]);

  if (error) return <p style={{ color: 'rgba(var(--text) / 0.4)' }}>Failed to load this country page.</p>;
  if (!data) return <p style={{ color: 'rgba(var(--text) / 0.4)' }}>Loading…</p>;
  return <CountryPageForm initial={data} isNew={false} />;
}
