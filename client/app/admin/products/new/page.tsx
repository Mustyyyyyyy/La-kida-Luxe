"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { apiFetchAuth, getApiUrl, getToken } from "@/lib/adminApi";

type UploadedImage = { url: string; publicId: string; width?: number; height?: number };

export default function NewProductPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState(""); 
  const [colors, setColors] = useState("");
  const [stockQty, setStockQty] = useState<number>(0);
  const [inStock, setInStock] = useState(true);

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const canSave = useMemo(() => title.trim().length >= 2 && price >= 0, [title, price]);

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    setMsg(null);
    setUploading(true);

    try {
      const token = getToken();
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("images", f));

      const res = await fetch(`${getApiUrl()}/api/upload/product-images`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: fd,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Upload failed");

      const uploaded: UploadedImage[] = data?.images || [];
      setImages((prev) => [...prev, ...uploaded]);
      setMsg({ type: "ok", text: "Images uploaded." });
    } catch (e: any) {
      setMsg({ type: "err", text: e?.message || "Upload error" });
    } finally {
      setUploading(false);
    }
  }

  async function removeImage(publicId: string) {
    setImages((prev) => prev.filter((x) => x.publicId !== publicId));
  }

  async function onCreate() {
    if (!canSave) return;

    setSaving(true);
    setMsg(null);

    try {
      const payload = {
        title: title.trim(),
        category: category.trim() || "General",
        price: Number(price) || 0,
        description: description.trim(),
        images: images.map((i) => ({ url: i.url, publicId: i.publicId })),
        sizes: sizes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        colors: colors
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        stockQty: Number(stockQty) || 0,
        inStock: Boolean(inStock),
      };

      await apiFetchAuth("/api/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setMsg({ type: "ok", text: "Product created successfully." });

      setTitle("");
      setCategory("General");
      setPrice(0);
      setDescription("");
      setSizes("");
      setColors("");
      setStockQty(0);
      setInStock(true);
      setImages([]);
    } catch (e: any) {
      setMsg({ type: "err", text: e?.message || "Create failed" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif">Add Product</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Upload images, then save product details.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="border border-[#f2d00d]/35 text-[#f2d00d] px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#f2d00d]/10"
        >
          Back
        </Link>
      </div>

      {msg ? (
        <div
          className={`rounded-2xl border p-4 text-sm ${
            msg.type === "ok"
              ? "border-green-500/30 bg-green-500/10 text-green-500"
              : "border-red-500/30 bg-red-500/10 text-red-500"
          }`}
        >
          {msg.text}
        </div>
      ) : null}

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-[#f2d00d]/15 bg-white/70 dark:bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-serif">Images</h2>
            <label className="cursor-pointer bg-[#f2d00d] text-[#221f10] px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:brightness-110">
              {uploading ? "Uploading..." : "Upload"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => uploadFiles(e.target.files)}
                disabled={uploading}
              />
            </label>
          </div>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Upload up to 8 images at once (Cloudinary).
          </p>

          <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img) => (
              <div
                key={img.publicId}
                className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#f2d00d]/15 bg-slate-200 dark:bg-slate-800"
              >
                <Image src={img.url} alt="Product" fill className="object-cover" />
                <button
                  onClick={() => removeImage(img.publicId)}
                  className="absolute top-2 right-2 w-9 h-9 rounded-full bg-black/55 text-white flex items-center justify-center hover:bg-black/70"
                  type="button"
                  aria-label="Remove"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            ))}

            {images.length === 0 ? (
              <div className="col-span-2 md:col-span-3 text-sm text-slate-600 dark:text-slate-300 py-10">
                No images yet. Upload to start.
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-[#f2d00d]/15 bg-white/70 dark:bg-white/5 p-6">
          <h2 className="text-xl font-bold font-serif">Details</h2>

          <div className="mt-6 grid gap-5">
            <Field label="Title" value={title} onChange={setTitle} placeholder="Senator Kaftan" />
            <Field label="Category" value={category} onChange={setCategory} placeholder="Kaftans" />

            <div className="grid sm:grid-cols-2 gap-4">
              <NumberField label="Price (NGN)" value={price} onChange={setPrice} />
              <NumberField label="Stock Qty" value={stockQty} onChange={setStockQty} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Sizes (comma)" value={sizes} onChange={setSizes} placeholder="S, M, L" />
              <Field label="Colors (comma)" value={colors} onChange={setColors} placeholder="Black, Wine" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#f2d00d]">
                Description
              </label>
              <textarea
                className="w-full bg-white/60 dark:bg-white/5 border border-[#f2d00d]/20 rounded-lg focus:ring-[#f2d00d] focus:border-[#f2d00d] px-4 py-3"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Premium finishing, clean silhouette..."
              />
            </div>

            <label className="inline-flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
              />
              <span className="text-slate-700 dark:text-slate-200">
                In stock
              </span>
            </label>

            <button
              type="button"
              onClick={onCreate}
              disabled={!canSave || saving}
              className="w-full bg-[#f2d00d] text-[#221f10] py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:brightness-110 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Create Product"}
            </button>

            <p className="text-xs text-slate-500">
              Tip: upload images first, then create product.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-[#f2d00d]">
        {label}
      </label>
      <input
        className="w-full bg-white/60 dark:bg-white/5 border border-[#f2d00d]/20 rounded-lg focus:ring-[#f2d00d] focus:border-[#f2d00d] px-4 py-3"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-[#f2d00d]">
        {label}
      </label>
      <input
        type="number"
        className="w-full bg-white/60 dark:bg-white/5 border border-[#f2d00d]/20 rounded-lg focus:ring-[#f2d00d] focus:border-[#f2d00d] px-4 py-3"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}