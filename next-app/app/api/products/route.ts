import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';
import { getLiveSoftwareProducts } from '@/lib/data/live-software';

export async function GET() {
  try {
    const products = await getLiveSoftwareProducts();
    return NextResponse.json({ products });
  } catch (e) {
    return apiError(e);
  }
}
