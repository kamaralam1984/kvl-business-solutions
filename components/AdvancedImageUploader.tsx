"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type UploadItemStatus = "queued" | "processing" | "uploading" | "done" | "error";

export type AdvancedUploaderCategoryOption = { label: string; value: string };

export type AdvancedUploaderSavedImage = {
  _id?: string;
  id?: number;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  uploadedAt?: string;
  uploadedBy?: string;
};

type UploadItem = {
  id: string;
  file: File;
  previewUrl: string;
  title: string;
  category: string;
  status: UploadItemStatus;
  progress: number; // 0..100 (best-effort)
  error?: string;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes)) return "";
  const units = ["B", "KB", "MB", "GB"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

async function compressToDataUrl(
  file: File,
  opts: { maxUploadBytes: number; targetBytes: number; maxWidth: number; maxHeight: number }
): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Only image files allowed");
  if (file.size > opts.maxUploadBytes) throw new Error(`Max file size is ${formatBytes(opts.maxUploadBytes)}`);

  const originalDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Invalid image"));
    el.src = originalDataUrl;
  });

  let { width, height } = img;
  if (width > opts.maxWidth || height > opts.maxHeight) {
    const ratio = Math.min(opts.maxWidth / width, opts.maxHeight / height);
    width = Math.max(1, Math.round(width * ratio));
    height = Math.max(1, Math.round(height * ratio));
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(img, 0, 0, width, height);

  // Encode to JPEG with quality loop aiming for <= targetBytes
  let quality = 0.82;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);
  const estimatedBytes = () => Math.floor(dataUrl.length * 0.75); // base64 overhead approx
  while (estimatedBytes() > opts.targetBytes && quality > 0.4) {
    quality -= 0.08;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }
  return dataUrl;
}

export default function AdvancedImageUploader(props: {
  categories: AdvancedUploaderCategoryOption[];
  defaultCategory: string;
  uploadedBy?: string;
  onUploaded?: (saved: AdvancedUploaderSavedImage[]) => void;
  onClose?: () => void;
}) {
  const maxUploadBytes = 10 * 1024 * 1024; // 10MB input
  const targetBytes = 1 * 1024 * 1024; // ~1MB output
  const maxWidth = 1600;
  const maxHeight = 1600;

  const [activeCategory, setActiveCategory] = useState(props.defaultCategory);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [dropActive, setDropActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const stats = useMemo(() => {
    const total = items.length;
    const done = items.filter((i) => i.status === "done").length;
    const error = items.filter((i) => i.status === "error").length;
    const queued = items.filter((i) => i.status === "queued").length;
    const uploading = items.filter((i) => i.status === "uploading" || i.status === "processing").length;
    return { total, done, error, queued, uploading };
  }, [items]);

  // cleanup previews
  useEffect(() => {
    return () => {
      for (const it of items) URL.revokeObjectURL(it.previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = useCallback(
    (files: File[]) => {
      const next: UploadItem[] = [];
      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;
        const id = uid();
        next.push({
          id,
          file,
          previewUrl: URL.createObjectURL(file),
          title: file.name.replace(/\.[^/.]+$/, ""),
          category: activeCategory,
          status: "queued",
          progress: 0,
        });
      }
      if (next.length === 0) return;
      setItems((prev) => [...next, ...prev]);
    },
    [activeCategory]
  );

  const onBrowse = () => inputRef.current?.click();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files ? Array.from(e.target.files) : [];
    if (f.length) addFiles(f);
    e.target.value = "";
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const it = prev.find((x) => x.id === id);
      if (it) URL.revokeObjectURL(it.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  const clearAll = () => {
    setItems((prev) => {
      for (const it of prev) URL.revokeObjectURL(it.previewUrl);
      return [];
    });
  };

  const setTitle = (id: string, title: string) => {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, title } : x)));
  };

  const setCategory = (id: string, category: string) => {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, category } : x)));
  };

  const uploadAll = async () => {
    if (busy) return;
    if (items.length === 0) return;

    setBusy(true);
    const saved: AdvancedUploaderSavedImage[] = [];

    // sequential upload (more stable vs. huge concurrent base64 payloads)
    for (const it of items) {
      if (!it.title?.trim()) {
        setItems((prev) =>
          prev.map((x) => (x.id === it.id ? { ...x, status: "error", error: "Title required", progress: 0 } : x))
        );
        continue;
      }

      setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, status: "processing", progress: 10 } : x)));

      try {
        const imageBase64 = await compressToDataUrl(it.file, {
          maxUploadBytes,
          targetBytes,
          maxWidth,
          maxHeight,
        });

        setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, status: "uploading", progress: 70 } : x)));

        const res = await fetch("/api/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: it.title,
            description: "",
            category: it.category,
            imageBase64,
            uploadedBy: props.uploadedBy || "admin",
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.success) {
          throw new Error(data?.error || `Upload failed (${res.status})`);
        }

        saved.push(data.image);
        setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, status: "done", progress: 100 } : x)));
      } catch (e: any) {
        setItems((prev) =>
          prev.map((x) =>
            x.id === it.id
              ? { ...x, status: "error", error: String(e?.message || e || "Upload failed"), progress: 0 }
              : x
          )
        );
      }
    }

    setBusy(false);
    if (saved.length && props.onUploaded) props.onUploaded(saved);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDropActive(false);
    const files = Array.from(e.dataTransfer.files || []);
    addFiles(files);
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
        <div>
          <div className="fw-semibold">Advanced Upload</div>
          <div className="text-muted small">
            Select up to 10MB images; we compress to ~1MB for fast website loading.
          </div>
        </div>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={props.onClose} disabled={busy}>
          Close
        </button>
      </div>

      <div className="d-flex gap-2 align-items-center flex-wrap mb-3">
        <div className="small text-muted">Default category:</div>
        <select
          className="form-select form-select-sm"
          style={{ width: 220 }}
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          disabled={busy}
        >
          {props.categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <div className="ms-auto small text-muted">
          {stats.total > 0 ? (
            <>
              Total: {stats.total} • Done: {stats.done} • Errors: {stats.error}
            </>
          ) : (
            "No files selected"
          )}
        </div>
      </div>

      <div
        className={`border rounded-3 p-3 ${dropActive ? "bg-light" : ""}`}
        style={{ borderStyle: "dashed" }}
        onDragEnter={(e) => {
          e.preventDefault();
          setDropActive(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => setDropActive(false)}
        onDrop={onDrop}
      >
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <div className="fw-semibold">Drag & drop images here</div>
            <div className="text-muted small">Or browse files. PNG/JPG/WebP supported.</div>
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-primary" onClick={onBrowse} disabled={busy}>
              Browse
            </button>
            <button type="button" className="btn btn-outline-danger" onClick={clearAll} disabled={busy || items.length === 0}>
              Clear
            </button>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="d-none"
          onChange={onInputChange}
        />
      </div>

      {items.length > 0 && (
        <div className="mt-3">
          <div className="d-flex gap-2 align-items-center mb-2">
            <button type="button" className="btn btn-success" onClick={uploadAll} disabled={busy || stats.uploading > 0}>
              {busy ? "Uploading..." : "Upload All"}
            </button>
            <div className="text-muted small">
              Tip: keep titles short; they won’t show on website, only for admin reference.
            </div>
          </div>

          <div className="row g-2">
            {items.map((it) => (
              <div className="col-12" key={it.id}>
                <div className="card">
                  <div className="card-body d-flex gap-3 align-items-start">
                    <img
                      src={it.previewUrl}
                      alt=""
                      style={{ width: 76, height: 76, objectFit: "cover", borderRadius: 10 }}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex gap-2 flex-wrap">
                        <input
                          className="form-control form-control-sm"
                          style={{ minWidth: 220 }}
                          value={it.title}
                          onChange={(e) => setTitle(it.id, e.target.value)}
                          disabled={busy}
                          placeholder="Title"
                        />
                        <select
                          className="form-select form-select-sm"
                          style={{ width: 220 }}
                          value={it.category}
                          onChange={(e) => setCategory(it.id, e.target.value)}
                          disabled={busy}
                        >
                          {props.categories.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                        <div className="ms-auto small text-muted">
                          {it.file.name} • {formatBytes(it.file.size)}
                        </div>
                      </div>

                      <div className="mt-2">
                        <div className="progress" style={{ height: 8 }}>
                          <div
                            className={`progress-bar ${
                              it.status === "error" ? "bg-danger" : it.status === "done" ? "bg-success" : "bg-primary"
                            }`}
                            style={{ width: `${it.status === "error" ? 100 : it.progress}%` }}
                          />
                        </div>
                        <div className="d-flex justify-content-between mt-1 small">
                          <div className="text-muted">
                            {it.status === "queued" && "Queued"}
                            {it.status === "processing" && "Compressing..."}
                            {it.status === "uploading" && "Uploading..."}
                            {it.status === "done" && "Uploaded"}
                            {it.status === "error" && <span className="text-danger">{it.error || "Failed"}</span>}
                          </div>
                          <button
                            type="button"
                            className="btn btn-link btn-sm p-0 text-danger"
                            onClick={() => removeItem(it.id)}
                            disabled={busy}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

