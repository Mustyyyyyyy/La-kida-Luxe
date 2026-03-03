"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { apiFetchAuth } from "@/lib/adminApi";

type Product = {
  _id: string;
  title: string;
  category?: string;
  price: number;
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

  async function load() {
    try {
      setLoading(true);
      setErr("");
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
    if (!confirm("Delete this product?")) return;
    try {
      setBusyId(id);
      await apiFetchAuth(`/api/products/${id}`, { method: "DELETE" });
      setItems((p) => p.filter((x) => x._id !== id));
    } catch (e: any) {
      alert(e?.message || "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-[color:var(--accent)]">
            Products
          </h1>
          <p className="mt-2 text-sm font-bold text-[rgba(76,29,149,0.75)]">
            Create, update, and manage your catalogue.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="bg-[color:var(--accent)] text-white px-4 py-2 rounded-lg font-extrabold uppercase tracking-widest text-xs hover:bg-[color:var(--accent2)]"
        >
          Add Product
        </Link>
      </div>

      {err ? (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-5 text-sm font-bold text-red-600">
          {err}
        </div>
      ) : null}

      <div className="rounded-2xl border border-white/10 bg-[color:var(--accent)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="text-white/85 font-extrabold">
              <tr className="border-b border-white/15">
                <th className="text-left py-3 px-5">Product</th>
                <th className="text-left py-3 px-5">Category</th>
                <th className="text-left py-3 px-5">Price</th>
                <th className="text-left py-3 px-5">Stock</th>
                <th className="text-left py-3 px-5">Status</th>
                <th className="text-right py-3 px-5">Actions</th>
              </tr>
            </thead>

            <tbody className="text-white font-bold">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 px-5 text-white/80">
                    Loading products...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 px-5 text-white/80">
                    No products yet. Click “Add Product”.
                  </td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr key={p._id} className="border-b border-white/10">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-white/10 border border-white/10">
                          <Image
                            src={p.images?.[0]?.url || "/placeholder-1.jpg"}
                            alt={p.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold truncate">{p.title}</div>
                          <div className="text-xs text-white/70 font-bold">
                            {p._id.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-5">{p.category || "General"}</td>
                    <td className="py-3 px-5 font-extrabold">
                      {formatNaira(p.price)}
                    </td>
                    <td className="py-3 px-5">{p.stockQty ?? 0}</td>

                    <td className="py-3 px-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold border border-white/20 bg-white/10 text-white">
                        {p.inStock === false ? "Out" : "In stock"}
                      </span>
                    </td>

                    <td className="py-3 px-5 text-right">
                      <div className="inline-flex gap-2">
                        <Link
                          href={`/admin/products/${p._id}/edit`}
                          className="bg-white text-[color:var(--accent)] px-3 py-2 rounded-lg font-extrabold uppercase tracking-widest text-[10px] hover:bg-white/90"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => onDelete(p._id)}
                          disabled={busyId === p._id}
                          className="bg-red-600 text-white px-3 py-2 rounded-lg font-extrabold uppercase tracking-widest text-[10px] hover:bg-red-700 disabled:opacity-60"
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

      <button
        onClick={load}
        className="bg-[color:var(--accent)] text-white px-4 py-2 rounded-lg font-extrabold uppercase tracking-widest text-xs hover:bg-[color:var(--accent2)]"
      >
        Refresh
      </button>
    </div>
  );
}