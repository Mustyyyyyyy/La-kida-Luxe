"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { apiFetchAuth } from "@/lib/adminApi";

type Product = {
  _id: string;
  title?: string;
  category?: string;
  price?: number;
  stockQty?: number;
  inStock?: boolean;
  images?: { url: string; publicId: string }[];
};

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string>("");

  async function load() {
    try {
      setLoading(true);
      setErr("");
      setMsg("");

      const data = await apiFetchAuth<Product[]>("/api/products", { method: "GET" });
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id: string) {
    const ok = window.confirm("Delete this product? This cannot be undone.");
    if (!ok) return;

    try {
      setBusyId(id);
      setErr("");
      setMsg("");

      await apiFetchAuth(`/api/products/${id}`, { method: "DELETE" });

      setItems((prev) => prev.filter((p) => p._id !== id));
      setMsg("Product deleted ✅");
    } catch (e: any) {
      setErr(e?.message || "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-serif text-white">
            Products
          </h1>
          <p className="mt-2 text-sm text-white/80 font-bold">
            Create, edit, and delete products.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={load}
            className="btn-outline px-4 py-2 text-xs hover:bg-white/10"
            type="button"
          >
            Refresh
          </button>

          <Link
            href="/admin/products/new"
            className="btn-primary px-4 py-2 text-xs hover:brightness-110"
          >
            Add Product
          </Link>
        </div>
      </div>

      {msg ? (
        <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm font-bold text-green-200">
          {msg}
        </div>
      ) : null}

      {err ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-200">
          {err}
        </div>
      ) : null}

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="text-white/80 font-bold">
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-5">Product</th>
                <th className="text-left py-3 px-5">Category</th>
                <th className="text-left py-3 px-5">Price</th>
                <th className="text-left py-3 px-5">Stock</th>
                <th className="text-left py-3 px-5">Status</th>
                <th className="text-right py-3 px-5">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 px-5 text-white/80 font-bold">
                    Loading products...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 px-5 text-white/80 font-bold">
                    No products yet. Click “Add Product”.
                  </td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr key={p._id} className="border-b border-white/10">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-black/20 border border-white/10">
                          <Image
                            src={p.images?.[0]?.url || "/placeholder-1.jpg"}
                            alt={p.title || "Product"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-white truncate">
                            {p.title || "Untitled Product"}
                          </div>
                          <div className="text-xs text-white/60 font-bold">
                            ID: {p._id.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-5 text-white font-bold">
                      {p.category || "General"}
                    </td>

                    <td className="py-3 px-5 text-white font-extrabold">
                      {formatNaira(Number(p.price) || 0)}
                    </td>

                    <td className="py-3 px-5 text-white font-bold">
                      {typeof p.stockQty === "number" ? p.stockQty : 0}
                    </td>

                    <td className="py-3 px-5">
                      <span className="badge">
                        {p.inStock === false ? "Out" : "In stock"}
                      </span>
                    </td>

                    <td className="py-3 px-5 text-right">
                      <div className="inline-flex gap-2">
                        <Link
                          href={`/admin/products/${p._id}/edit`}
                          className="btn-outline px-3 py-2 text-[10px] hover:bg-white/10"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => onDelete(p._id)}
                          disabled={busyId === p._id}
                          className="px-3 py-2 rounded-lg font-extrabold uppercase tracking-widest text-[10px] bg-red-600 text-white hover:brightness-110 disabled:opacity-60"
                          type="button"
                        >
                          {busyId === p._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}