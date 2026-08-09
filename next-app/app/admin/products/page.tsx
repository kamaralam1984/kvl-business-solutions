'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { FileUploader, UploadedFile } from '@/components/widgets/FileUploader';

type Product = { _id?: string; slug: string; name: string; description?: string; features: string[]; price: number; unit: string; active: boolean; tag?: string; image?: string; imagePublicId?: string };

const empty: Product = { slug: '', name: '', description: '', features: [], price: 0, unit: '/year', active: true, tag: '', image: '', imagePublicId: '' };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [msg, setMsg] = useState('');
  const [loadError, setLoadError] = useState(false);

  const load = () => {
    setLoadError(false);
    return fetch('/api/admin/products').then(r => r.json()).then(d => {
      if (d.ok) setProducts(d.products); else setLoadError(true);
    }).catch(() => setLoadError(true));
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const url = isNew ? '/api/admin/products' : `/api/admin/products/${editing._id}`;
    const method = isNew ? 'POST' : 'PUT';
    const body = isNew ? editing : { name: editing.name, description: editing.description, features: editing.features, price: editing.price, unit: editing.unit, active: editing.active, tag: editing.tag, image: editing.image, imagePublicId: editing.imagePublicId };
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const d = await r.json();
    if (d.ok) { setEditing(null); setIsNew(false); setMsg('✓ Saved'); load(); }
    else setMsg(`Error: ${d.error}`);
  };

  const del = async (id?: string) => {
    if (!id || !confirm('Delete this product?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-2xl font-extrabold">Products ({products.length})</h1>
        <button onClick={() => { setEditing(empty); setIsNew(true); }} className="btn btn-primary"><Plus className="w-4 h-4" /> Add Product</button>
      </div>
      {msg && <div className="text-xs mb-3">{msg}</div>}

      <div className="card-base overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-text2 text-xs uppercase border-b border-tint">
            <tr><th className="p-3">Name</th><th className="p-3">Slug</th><th className="p-3">Price</th><th className="p-3">Status</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-b border-tint">
                <td className="p-3 font-semibold">{p.name}</td>
                <td className="p-3 font-mono text-xs text-text2">{p.slug}</td>
                <td className="p-3">{formatINR(p.price)}{p.unit}</td>
                <td className="p-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.active ? 'bg-green-500/20 text-green-500' : 'bg-slate-500/20 text-slate-500'}`}>{p.active ? 'ACTIVE' : 'HIDDEN'}</span></td>
                <td className="p-3 text-right">
                  <button onClick={() => { setEditing(p); setIsNew(false); }} className="text-text2 hover:text-primary p-1"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => del(p._id)} className="text-text2 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-text2">
                {loadError ? 'Failed to load products — check your connection and try refreshing.' : <>No products yet. Click &quot;Add Product&quot; to create one.</>}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50 backdrop-blur" onClick={() => setEditing(null)}>
          <div className="card-base p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-extrabold">{isNew ? 'New Product' : 'Edit Product'}</h2>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {isNew && <input className="form-control" placeholder="slug (e.g., billing-pro)" value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value.toLowerCase() })} />}
              <input className="form-control" placeholder="Name" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
              <textarea className="form-control" rows={3} placeholder="Description" value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} />
              <textarea className="form-control" rows={4} placeholder="Features (one per line)" value={editing.features.join('\n')} onChange={e => setEditing({ ...editing, features: e.target.value.split('\n').filter(Boolean) })} />
              <div className="grid grid-cols-3 gap-2">
                <input className="form-control" type="number" placeholder="Price" value={editing.price || ''} onChange={e => setEditing({ ...editing, price: parseInt(e.target.value) || 0 })} />
                <input className="form-control" placeholder="Unit" value={editing.unit} onChange={e => setEditing({ ...editing, unit: e.target.value })} />
                <input className="form-control" placeholder="Tag" value={editing.tag || ''} onChange={e => setEditing({ ...editing, tag: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-text2 mb-2 block">Product Image</label>
                <FileUploader
                  folder="kvl/products"
                  multiple={false}
                  accept="image/*"
                  maxSizeMB={2}
                  value={editing.image ? [{ url: editing.image, publicId: editing.imagePublicId || '', name: 'Product image', size: 0, format: 'jpg' }] : []}
                  onChange={files => {
                    const f = files[0];
                    setEditing({ ...editing, image: f?.url || '', imagePublicId: f?.publicId || '' });
                  }}
                />
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active} onChange={e => setEditing({ ...editing, active: e.target.checked })} /> Active (visible to users)</label>
              <button onClick={save} className="btn btn-primary w-full justify-center"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
