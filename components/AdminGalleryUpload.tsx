"use client";

import { useState } from "react";

export default function AdminGalleryUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("CCTV Installation");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return alert("Image select karo");

    // 🔁 Convert image → base64
    const imageBase64 = await toBase64(file);

    // 🚀 Send to API
    const res = await fetch("/api/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        category,
        imageBase64, // ✅ YAHAN
      }),
    });

    const data = await res.json();
    alert(data.success ? "Upload successful" : "Upload failed");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        required
      />

      <button type="submit">Upload Image</button>
    </form>
  );
}

// 🔧 Helper function
function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
