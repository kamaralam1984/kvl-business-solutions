'use client';
import { LocationPageForm, emptyLocation } from '@/components/admin/LocationPageForm';

export default function NewLocationPage() {
  return <LocationPageForm initial={emptyLocation} isNew />;
}
