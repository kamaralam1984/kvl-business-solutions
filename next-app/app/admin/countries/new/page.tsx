'use client';
import { CountryPageForm, emptyCountry } from '@/components/admin/CountryPageForm';

export default function NewCountryPage() {
  return <CountryPageForm initial={emptyCountry} isNew />;
}
