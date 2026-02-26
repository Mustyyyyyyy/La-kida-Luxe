"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetchAuth } from "@/lib/adminApi";

type Order = {
  _id: string;
  orderCode: string;
  status: "pending_whatsapp" | "confirmed" | "in_progress" | "ready" | "delivered" | "cancelled";
  total: number;
  subtotal?: number;
  deliveryFee?: number;
  createdAt: string;
  customer?: { fullName?: string; phone?: string; email?: string };
  delivery?: { address?: string; city?: string; state?: string; method?: string };
  items?: { title: string; price: number; qty: number; size?: string; color?: string }[];
  isCustom?: boolean;
  custom?: {
    styleType?: string;
    fabric?: string;
    specialInstructions?: string;
    measurements?: Record<string, string>;
    referenceImages?: string[];
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

export default function AdminOrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    if (!id) return;
    try {
      setLoading(true);
      setErr("");
      const all = await apiFetchAuth<Order[]>("/api/orders", { method: "GET" });
      const found = all.find((o) => o._id === id) || null;
      setOrder(found);
      if (!found) setErr("Order not found.");
    } catch (e: any) {
      setErr(e?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function updateStatus(status: Order["status"]) {
    if (!order) return;
    try {
      setBusy(true);
      const updated = await apiFetchAuth<Order>(`/api/orders/${order._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setOrder(updated);
    } catch (e: any) {
      alert(e?.message || "Status update failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif">
            Order Details
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            View customer info, items and update status.
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="border border-[#f2d00d]/35 text-[#f2d00d] px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#f2d00d]/10"
        >
          Back
        </Link>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[#f2d00d]/15 bg-white/70 dark:bg-white/5 p-8 text-sm">
          Loading...
        </div>
      ) : err ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-500">
          {err}
        </div>
      ) : order ? (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-[#f2d00d]/15 bg-white/70 dark:bg-white/5 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Order
                </div>
                <div className="text-2xl font-bold font-serif">{order.orderCode}</div>
              </div>

              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border border-[#f2d00d]/25 bg-[#f2d00d]/10 text-[#f2d00d]">
                {order.status}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Info label="Customer" value={order.customer?.fullName || "—"} />
              <Info label="Phone" value={order.customer?.phone || "—"} />
              <Info label="Email" value={order.customer?.email || "—"} />
              <Info label="Date" value={new Date(order.createdAt).toLocaleString()} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Info label="Delivery Method" value={order.delivery?.method || "standard"} />
              <Info
                label="Address"
                value={
                  order.delivery?.address
                    ? `${order.delivery.address}${order.delivery.city ? `, ${order.delivery.city}` : ""}${order.delivery.state ? `, ${order.delivery.state}` : ""}`
                    : "—"
                }
              />
            </div>

            <div className="pt-2">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Update status
              </div>

              <select
                value={order.status}
                onChange={(e) => updateStatus(e.target.value as Order["status"])}
                disabled={busy}
                className="mt-2 w-full bg-white/60 dark:bg-white/5 border border-[#f2d00d]/20 rounded-lg px-3 py-3"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-[#f2d00d]/15 bg-white/70 dark:bg-white/5 p-6">
            <h2 className="text-xl font-bold font-serif">Items / Custom</h2>

            {order.isCustom ? (
              <div className="mt-4 space-y-3 text-sm">
                <Info label="Custom" value="Yes" />
                <Info label="Style Type" value={order.custom?.styleType || "—"} />
                <Info label="Fabric" value={order.custom?.fabric || "—"} />
                <Info
                  label="Instructions"
                  value={order.custom?.specialInstructions || "—"}
                />

                <div className="mt-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    Measurements
                  </div>
                  <div className="mt-2 rounded-xl border border-[#f2d00d]/15 p-4 text-sm">
                    {order.custom?.measurements
                      ? Object.entries(order.custom.measurements).map(([k, v]) => (
                          <div key={k} className="flex justify-between py-1">
                            <span className="text-slate-600 dark:text-slate-300">{k}</span>
                            <span className="font-semibold">{v}</span>
                          </div>
                        ))
                      : "—"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {(order.items || []).map((it, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#f2d00d]/15 bg-white/60 dark:bg-white/5 p-4"
                  >
                    <div className="font-semibold">{it.title}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Qty: {it.qty} • {it.size ? `Size: ${it.size}` : "Size: —"} •{" "}
                      {it.color ? `Color: ${it.color}` : "Color: —"}
                    </div>
                    <div className="mt-2 font-bold text-[#f2d00d]">
                      {formatNaira(it.price)}
                    </div>
                  </div>
                ))}

                {(order.items || []).length === 0 ? (
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    No items on this order.
                  </div>
                ) : null}
              </div>
            )}

            <div className="mt-6 rounded-xl border border-[#f2d00d]/15 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">Subtotal</span>
                <span className="font-semibold">{formatNaira(order.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-slate-600 dark:text-slate-300">Delivery</span>
                <span className="font-semibold">{formatNaira(order.deliveryFee || 0)}</span>
              </div>
              <div className="flex justify-between mt-3 text-base font-bold">
                <span>Total</span>
                <span className="text-[#f2d00d]">{formatNaira(order.total || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#f2d00d]/15 bg-white/60 dark:bg-white/5 p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}