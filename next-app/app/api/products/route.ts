import { NextResponse } from 'next/server';
import { softwareProducts } from '@/lib/data/software';

export async function GET() {
  return NextResponse.json({ products: softwareProducts });
}
