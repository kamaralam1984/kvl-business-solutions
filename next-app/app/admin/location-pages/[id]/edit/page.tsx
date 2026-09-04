'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LocationPageForm, LocationFormData } from '@/components/admin/LocationPageForm';

export default function EditLocationPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<LocationFormData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/location-pages/${id}`).then(r => r.json())
      .then(d => { if (d.ok) setData(d.location); else setError(true); })
      .catch(() => setError(true));
  }, [id]);

  if (error) return <p style={{ color: 'rgba(var(--text) / 0.4)' }}>Failed to load this location page.</p>;
  if (!data) return <p style={{ color: 'rgba(var(--text) / 0.4)' }}>Loading…</p>;
  return <LocationPageForm initial={data} isNew={false} />;
}
