import { NextResponse } from 'next/server';
import { getLiveSoftwareProducts } from '@/lib/data/live-software';

export async function GET() {
  const products = await getLiveSoftwareProducts();
  return NextResponse.json({ products });
}
