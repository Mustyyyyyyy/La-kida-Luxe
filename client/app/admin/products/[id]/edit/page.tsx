"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetchAuth } from "@/lib/adminApi";

type Product = {
  _id: string;
  title: string;
  price: number;
  category?: string;
  description?: string;
  inStock?: boolean;
  stockQty?: number;
  sizes?: string[];
  colors?: string[];
};

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

function toList(v: string) {
  return v
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function AdminEditProductPage() {
  const params = useParams();
  const rawId = (params as any)?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId; 

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [inStock, setInStock] = useState(true);
  const [stockQty, setStockQty] = useState<number>(0);

  const [sizesCsv, setSizesCsv] = useState("");
  const [colorsCsv, setColorsCsv] = useState("");

  const canSave = useMemo(() => {
    return title.trim().length >= 2 && Number(price) >= 0;
  }, [title, price]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!id) return;

      try {
        setLoading(true);
        setErr("");
        setOk("");

        const res = await fetch(`${API_URL}/api/products/${id}`, { cache: "no-store" });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data?.message || `Failed to load product (${res.status})`);
        }

        const p: Product = data;

        if (!mounted) return;

        setTitle(p.title || "");
        setPrice(Number(p.price) || 0);
        setCategory(p.category || "");
        setDescription(p.description || "");
        setInStock(p.inStock !== false);
        setStockQty(Number(p.stockQty) || 0);
        setSizesCsv((p.sizes || []).join(", "));
        setColorsCsv((p.colors || []).join(", "));
      } catch (e: any) {
        if (!mounted) return;
        setErr(e?.message || "Failed to load product");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  async function onSave() {
    if (!id) return;
    setErr("");
    setOk("");

    if (!canSave) {
      setErr("Please enter a valid title and price.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        price: Number(price) || 0,
        category: category.trim(),
        description: description.trim(),
        inStock: Boolean(inStock),
        stockQty: Number(stockQty) || 0,
        sizes: toList(sizesCsv),
        colors: toList(colorsCsv),
      };

      await apiFetchAuth<Product>(`/api/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      setOk("Saved ✅");
    } catch (e: any) {
      setErr(e?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif">Edit Product</h1>
          <p className="mt-2 text-sm muted">Update product details.</p>
        </div>

        <Link href="/admin/products" className="btn-outline px-4 py-2 text-xs hover:bg-white/10">
          Back
        </Link>
      </div>

      {loading ? (
        <div className="card p-8 text-sm muted">Loading...</div>
      ) : err ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
          {err}
          <div className="mt-2 text-xs text-white/60">
            Debug: id = <b>{String(id)}</b>
          </div>
        </div>
      ) : (
        <div className="card p-6 max-w-3xl">
          {ok ? (
            <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-200">
              {ok}
            </div>
          ) : null}

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Title" value={title} onChange={setTitle} placeholder="Kaftan..." />
            <Field
              label="Price (NGN)"
              type="number"
              value={String(price)}
              onChange={(v) => setPrice(Number(v))}
              placeholder="50000"
            />
            <Field label="Category" value={category} onChange={setCategory} placeholder="Kaftans" />
            <Field
              label="Stock Qty"
              type="number"
              value={String(stockQty)}
              onChange={(v) => setStockQty(Number(v))}
              placeholder="10"
            />
          </div>

          <div className="mt-4">
            <label className="text-xs font-bold uppercase tracking-widest text-[color:var(--accent)]">
              Description
            </label>
            <textarea
              className="input mt-2"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Premium finishing..."
            />
          </div>

          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <Field label="Sizes (comma separated)" value={sizesCsv} onChange={setSizesCsv} placeholder="S, M, L, XL" />
            <Field label="Colors (comma separated)" value={colorsCsv} onChange={setColorsCsv} placeholder="Black, Purple, White" />
          </div>

          <div className="mt-5 flex items-center gap-3">
            <input
              id="inStock"
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="inStock" className="text-sm text-white/80">
              In Stock
            </label>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={onSave}
              disabled={saving || !canSave}
              className="btn-primary px-6 py-3 text-sm hover:brightness-110 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <Link href="/admin/products" className="btn-outline px-6 py-3 text-sm hover:bg-white/10">
              Cancel
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-[color:var(--accent)]">
        {label}
      </label>
      <input
        type={type}
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}