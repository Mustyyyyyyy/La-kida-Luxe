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
          <h1 className="text-3xl md:text-4xl font-bold font-serif">Products</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Create, update, and manage your catalogue.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="bg-[#f2d00d] text-[#221f10] px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:brightness-110"
        >
          Add Product
        </Link>
      </div>

      {err ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-500">
          {err}
        </div>
      ) : null}

      <div className="rounded-2xl border border-[#f2d00d]/15 bg-white/70 dark:bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="text-slate-600 dark:text-slate-300">
              <tr className="border-b border-[#f2d00d]/15">
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
                  <td colSpan={6} className="py-10 px-5 text-slate-600 dark:text-slate-300">
                    Loading products...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 px-5 text-slate-600 dark:text-slate-300">
                    No products yet. Click “Add Product”.
                  </td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr key={p._id} className="border-b border-[#f2d00d]/10">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800">
                          <Image
                            src={p.images?.[0]?.url || "/placeholder-1.jpg"}
                            alt={p.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold">{p.title}</div>
                          <div className="text-xs text-slate-500">
                            {p._id.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-5">{p.category || "General"}</td>
                    <td className="py-3 px-5 font-semibold">{formatNaira(p.price)}</td>
                    <td className="py-3 px-5">{p.stockQty ?? 0}</td>
                    <td className="py-3 px-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border border-[#f2d00d]/25 bg-[#f2d00d]/10 text-[#f2d00d]">
                        {p.inStock === false ? "Out" : "In stock"}
                      </span>
                    </td>

                    <td className="py-3 px-5 text-right">
                      <div className="inline-flex gap-2">
                        <Link
                          href={`/admin/products/${p._id}`}
                          className="border border-[#f2d00d]/35 text-[#f2d00d] px-3 py-2 rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-[#f2d00d]/10"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => onDelete(p._id)}
                          disabled={busyId === p._id}
                          className="border border-red-500/35 text-red-500 px-3 py-2 rounded-lg font-bold uppercase tracking-widest text-[10px] hover:bg-red-500/10 disabled:opacity-60"
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
        className="border border-[#f2d00d]/35 text-[#f2d00d] px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#f2d00d]/10"
      >
        Refresh
      </button>
    </div>
  );
}