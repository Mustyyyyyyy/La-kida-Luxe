"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CustomerHeader from "@/components/CustomerHeader";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

type Order = {
  _id: string;
  orderCode: string;
  status: "pending_whatsapp" | "confirmed" | "in_progress" | "ready" | "delivered" | "cancelled";
  total: number;
  createdAt: string;
};

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default function CustomerOrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    try {
      setLoading(true);
      setErr("");

      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await fetch(`${API_URL}/api/orders/my`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to load your orders");

      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="page">
      <CustomerHeader />

      <section className="px-6 lg:px-20 py-10">
        <div className="max-w-[1100px] mx-auto space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-serif">My Orders</h1>
              <p className="mt-2 text-sm muted">
                Only orders placed while logged in will show here.
              </p>
            </div>

            <button onClick={load} className="btn-outline px-4 py-2 text-xs">
              Refresh
            </button>
          </div>

          {err ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
              {err}
            </div>
          ) : null}

          {loading ? (
            <div className="card p-8 text-sm muted">Loading your orders...</div>
          ) : items.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="muted">No orders yet.</p>
              <Link href="/shop" className="btn-primary mt-5 inline-flex px-6 py-3 text-sm hover:brightness-110">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="card p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-[750px] w-full text-sm">
                  <thead className="muted">
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-5">Order</th>
                      <th className="text-left py-3 px-5">Status</th>
                      <th className="text-left py-3 px-5">Total</th>
                      <th className="text-left py-3 px-5">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((o) => (
                      <tr key={o._id} className="border-b border-white/10">
                        <td className="py-3 px-5 font-semibold">{o.orderCode}</td>
                        <td className="py-3 px-5">
                          <span className="badge">{o.status}</span>
                        </td>
                        <td className="py-3 px-5 font-semibold text-[color:var(--accent)]">
                          {formatNaira(o.total)}
                        </td>
                        <td className="py-3 px-5 muted">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>
          )}
   
        </div>
      </section>
    </main>
  );
}