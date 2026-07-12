'use client';
import { useRef, useState } from 'react';
import { Upload, X, Loader2, FileText, Image as ImageIcon } from 'lucide-react';

export type UploadedFile = { url: string; publicId: string; name: string; size: number; format?: string };

type Props = {
  folder?: 'kvl/tickets' | 'kvl/products' | 'kvl/users';
  multiple?: boolean;
  accept?: string;
  maxSizeMB?: number;
  value: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
};

export function FileUploader({ folder = 'kvl/tickets', multiple = true, accept = 'image/*,application/pdf', maxSizeMB = 10, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const upload = async (files: FileList) => {
    setErr('');
    const fileArr = Array.from(files);
    for (const f of fileArr) {
      if (f.size > maxSizeMB * 1024 * 1024) {
        setErr(`${f.name} is larger than ${maxSizeMB}MB`);
        return;
      }
    }
    setUploading(true);
    try {
      const sigRes = await fetch('/api/upload/sign', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder }),
      });
      const sig = await sigRes.json();
      if (!sig.ok) throw new Error(sig.error || 'Failed to get upload signature');

      const uploaded: UploadedFile[] = [];
      for (const file of fileArr) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('api_key', sig.apiKey);
        fd.append('timestamp', String(sig.timestamp));
        fd.append('signature', sig.signature);
        fd.append('folder', sig.folder);
        // Must match exactly what the server signed (lib/api/upload/sign) —
        // any mismatch here and Cloudinary rejects the signature outright.
        fd.append('transformation', sig.transformation);

        const up = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`, { method: 'POST', body: fd });
        const data = await up.json();
        if (data.error) throw new Error(data.error.message);
        uploaded.push({
          url: data.secure_url,
          publicId: data.public_id,
          name: file.name,
          size: data.bytes,
          format: data.format,
        });
      }
      onChange(multiple ? [...value, ...uploaded] : uploaded);
    } catch (e: any) { setErr(e.message); }
    finally { setUploading(false); if (inputRef.current) inputRef.current.value = ''; }
  };

  const remove = async (file: UploadedFile) => {
    onChange(value.filter(f => f.publicId !== file.publicId));
    fetch('/api/upload/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ publicId: file.publicId }) }).catch(() => {});
  };

  return (
    <div className="space-y-2">
      <input ref={inputRef} type="file" multiple={multiple} accept={accept} className="hidden" onChange={e => e.target.files && upload(e.target.files)} />
      <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="btn btn-ghost border border-dashed border-tint w-full justify-center">
        {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</> : <><Upload className="w-4 h-4" /> Choose {multiple ? 'files' : 'file'} (max {maxSizeMB}MB)</>}
      </button>
      {err && <p className="text-red-500 text-xs">{err}</p>}
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {value.map(f => {
            const isImg = f.format && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif', 'bmp', 'tiff', 'heic'].includes(f.format);
            return (
              <div key={f.publicId} className="surface-tint rounded-lg p-2 flex items-center gap-2 text-xs">
                {isImg
                  ? <img src={f.url} alt={f.name} className="w-10 h-10 rounded object-cover" />
                  : <div className="w-10 h-10 rounded bg-app2 grid place-items-center">{isImg ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}</div>}
                <div className="flex-1 min-w-0">
                  <div className="truncate font-semibold">{f.name}</div>
                  <div className="text-text2">{(f.size / 1024).toFixed(0)} KB</div>
                </div>
                <button type="button" onClick={() => remove(f)} className="text-text2 hover:text-red-500 p-1"><X className="w-4 h-4" /></button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
