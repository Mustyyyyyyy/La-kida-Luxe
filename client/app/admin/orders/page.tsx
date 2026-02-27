"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetchAuth } from "@/lib/adminApi";

type Order = {
  _id: string;
  orderCode: string;
  status:
    | "pending_whatsapp"
    | "confirmed"
    | "in_progress"
    | "ready"
    | "delivered"
    | "cancelled";
  total: number;
  createdAt: string;
  customer?: { fullName?: string; phone?: string; email?: string };
  delivery?: {
    address?: string;
    city?: string;
    state?: string;
    method?: string;
  };
};

const STATUSES: Order["status"][] = [
  "pending_whatsapp",
  "confirmed",
  "in_progress",
  "ready",
  "delivered",
  "cancelled",
];

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default function AdminOrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setErr("");
      const data = await apiFetchAuth<Order[]>("/api/orders", { method: "GET" });
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

  async function updateStatus(id: string, status: Order["status"]) {
    try {
      setBusyId(id);
      const updated = await apiFetchAuth<Order>(`/api/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setItems((prev) => prev.map((o) => (o._id === id ? updated : o)));
    } catch (e: any) {
      alert(e?.message || "Status update failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif">Orders</h1>
          <p className="mt-2 text-sm muted">
            Manage WhatsApp orders and delivery status.
          </p>
        </div>

        <div className="flex gap-2">
          <button onClick={load} className="btn-outline px-4 py-2 text-xs">
            Refresh
          </button>
          <Link href="/admin" className="btn-outline px-4 py-2 text-xs">
            Back
          </Link>
        </div>
      </div>

      {err ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
          {err}
        </div>
      ) : null}

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-sm">
            <thead className="muted">
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-5">Order</th>
                <th className="text-left py-3 px-5">Customer</th>
                <th className="text-left py-3 px-5">Delivery</th>
                <th className="text-left py-3 px-5">Total</th>
                <th className="text-left py-3 px-5">Status</th>
                <th className="text-left py-3 px-5">Update</th>
                <th className="text-left py-3 px-5">Date</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 px-5 muted">
                    Loading orders...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 px-5 muted">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                items.map((o) => (
                  <tr key={o._id} className="border-b border-white/10">
                    <td className="py-3 px-5 font-semibold">{o.orderCode}</td>

                    <td className="py-3 px-5">
                      <div className="font-semibold">
                        {o.customer?.fullName || "—"}
                      </div>
                      <div className="text-xs muted">{o.customer?.phone || ""}</div>
                    </td>

                    <td className="py-3 px-5">
                      <div className="text-xs muted">{o.delivery?.method || "—"}</div>
                      <div className="text-sm text-white/90">
                        {o.delivery?.address || "—"}
                      </div>
                    </td>

                    <td className="py-3 px-5 font-semibold">
                      {formatNaira(o.total)}
                    </td>

                    <td className="py-3 px-5">
                      <span className="badge">{o.status}</span>
                    </td>

                    <td className="py-3 px-5">
                      <select
                        value={o.status}
                        onChange={(e) =>
                          updateStatus(o._id, e.target.value as Order["status"])
                        }
                        disabled={busyId === o._id}
                        className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] rounded-lg px-3 py-2 text-white disabled:opacity-60"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s} className="bg-[#120018]">
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3 px-5 muted">
                      {new Date(o.createdAt).toLocaleDateString()}
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