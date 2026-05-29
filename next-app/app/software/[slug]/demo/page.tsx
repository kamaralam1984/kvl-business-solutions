'use client';
import { useState } from 'react';
import { softwareProducts } from '@/lib/data/software';
import { DemoShell } from '@/components/software/demos/DemoShell';
import { DemoContent } from '@/components/software/demos/DemoContent';

export default function DemoPage({ params }: { params: { slug: string } }) {
  const product = softwareProducts.find(p => p.slug === params.slug);
  const [navIndex, setNavIndex] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-6xl mb-4">404</div>
          <div className="text-slate-400">Software not found</div>
        </div>
      </div>
    );
  }

  return (
    <DemoShell product={product} activeNav={navIndex} onNavChange={setNavIndex}>
      <DemoContent slug={product.slug} navIndex={navIndex} color={product.c1} />
    </DemoShell>
  );
}
