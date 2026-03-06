"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { apiFetchAuth, getApiUrl, getToken } from "@/lib/adminApi";

type UploadedImage = {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
};

const CATEGORY_OPTIONS = [
  "Bridal wears",
  "Aso ebi",
  "Corporate fits",
  "Casual wears",
  "Birthday dress",
  "General",
];

export default function NewProductPage() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState("");
  const [stockQty, setStockQty] = useState<string>("");
  const [inStock, setInStock] = useState(true);

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  const canCreate = useMemo(() => true, []);

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
        headers: { Authorization: token ? `Bearer ${token}` : "" },
        body: fd,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Upload failed");

      const uploaded: UploadedImage[] = data?.images || [];

      setImages((prev) => {
        const map = new Map<string, UploadedImage>();
        [...prev, ...uploaded].forEach((img) => map.set(img.publicId, img));
        return Array.from(map.values());
      });

      setMsg({
        type: "ok",
        text: uploaded.length
          ? `Uploaded ${uploaded.length} image(s).`
          : "Upload done (no images returned).",
      });
    } catch (e: any) {
      setMsg({ type: "err", text: e?.message || "Upload error" });
    } finally {
      setUploading(false);

      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removeImage(publicId: string) {
    setImages((prev) => prev.filter((x) => x.publicId !== publicId));

    if (fileRef.current) fileRef.current.value = "";
  }

  async function onCreate() {
    if (!canCreate) return;

    setSaving(true);
    setMsg(null);

    try {
      const payload = {
        title: title.trim() || "Untitled Product",
        category: (category || "").trim() || "General",
        price: price === "" ? 0 : Number(price) || 0,
        description: description.trim() || "",
        images: images.map((i) => ({ url: i.url, publicId: i.publicId })),
        sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors: colors.split(",").map((c) => c.trim()).filter(Boolean),
        stockQty: stockQty === "" ? 0 : Number(stockQty) || 0,
        inStock: Boolean(inStock),
      };

      await apiFetchAuth("/api/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setMsg({ type: "ok", text: "Product created successfully ✅" });

      setTitle("");
      setCategory("General");
      setPrice("");
      setDescription("");
      setSizes("");
      setColors("");
      setStockQty("");
      setInStock(true);
      setImages([]);
      if (fileRef.current) fileRef.current.value = "";
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
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-white">
            Add Product
          </h1>
          <p className="mt-2 text-sm text-white/80 font-bold">
            Upload images first, then create the product.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="btn-outline px-4 py-2 text-xs hover:bg-white/10"
        >
          Back
        </Link>
      </div>

      {msg ? (
        <div
          className={`rounded-2xl border p-4 text-sm font-bold ${
            msg.type === "ok"
              ? "border-green-500/30 bg-green-500/10 text-green-200"
              : "border-red-500/30 bg-red-500/10 text-red-200"
          }`}
        >
          {msg.text}
        </div>
      ) : null}

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-serif text-white">Images</h2>

            <label className="cursor-pointer btn-primary px-4 py-2 text-xs">
              {uploading ? "Uploading..." : "Upload"}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => uploadFiles(e.target.files)}
                disabled={uploading}
              />
            </label>
          </div>

          <p className="mt-2 text-sm text-white/80 font-bold">
            You can select multiple images. You can also upload in batches.
          </p>

          <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img) => (
              <div
                key={img.publicId}
                className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 bg-black/20"
              >
                <Image
                  src={img.url}
                  alt="Product"
                  fill
                  className="object-cover pointer-events-none"
                />

                <button
                  type="button"
                  className="absolute top-2 right-2 z-20 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeImage(img.publicId);
                  }}
                  aria-label="Remove"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    close
                  </span>
                </button>
              </div>
            ))}

            {images.length === 0 ? (
              <div className="col-span-2 md:col-span-3 text-sm text-white/80 font-bold py-10">
                No images yet. Upload to start.
              </div>
            ) : null}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold font-serif text-white">Details</h2>

          <div className="mt-6 grid gap-5">
            <Field
              label="Title (optional)"
              value={title}
              onChange={setTitle}
              placeholder="Senator Kaftan"
            />

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[color:var(--accent)]">
                Category
              </label>

              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input font-bold"
                placeholder="Choose or type…"
                list="lakida-cats"
              />
              <datalist id="lakida-cats">
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>

              <p className="text-xs text-white/70 font-bold">
                Pick from suggestions or type a new category.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Price (optional)"
                value={price}
                onChange={setPrice}
                placeholder="50000"
              />
              <Field
                label="Stock Qty (optional)"
                value={stockQty}
                onChange={setStockQty}
                placeholder="10"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Sizes (comma, optional)"
                value={sizes}
                onChange={setSizes}
                placeholder="S, M, L"
              />
              <Field
                label="Colors (comma, optional)"
                value={colors}
                onChange={setColors}
                placeholder="Black, Wine"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[color:var(--accent)]">
                Description
              </label>
              <textarea
                className="input"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Premium finishing, clean silhouette..."
              />
            </div>

            <label className="inline-flex items-center gap-3 text-sm font-bold text-white">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
              />
              In stock
            </label>

            <button
              type="button"
              onClick={onCreate}
              disabled={saving}
              className="w-full btn-primary py-4 text-sm disabled:opacity-60"
            >
              {saving ? "Saving..." : "Create Product"}
            </button>

            <p className="text-xs text-white/70 font-bold">
              Note: if you don’t enter stock qty, it will save as 0.
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
      <label className="text-xs font-bold uppercase tracking-widest text-[color:var(--accent)]">
        {label}
      </label>
      <input
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}